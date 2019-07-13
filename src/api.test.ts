import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createAsset, uploadFile, pollConversionStatus } from './api';

describe('api', () => {
  describe('createAsset', () => {
    it('should work', async () => {
      const request = jest.fn(resolveValue => () => {
        return new Promise(resolve => {
          resolve(resolveValue);
        });
      });
      try {
        await createAsset(request(null), {});
      } catch (error) {
        expect(error.message).toBe('Возникла ошибка в процессе загрузки видео');
      }

      try {
        await createAsset(request({ one: 1 }), {});
      } catch (error) {
        expect(error.message).toBe('Возникла ошибка в процессе загрузки видео');
      }

      const data = await createAsset(
        request({
          data: {
            assets: {
              createVideo: { id: 999, uploadUrl: 'https://test.com' },
            },
          },
        }),
        {},
      );
      expect(data).toEqual({ id: 999, uploadUrl: 'https://test.com' });
      expect(request).toHaveBeenCalledTimes(3);
    });
  });

  describe('uploadFile', () => {
    const mock = new MockAdapter(axios);
    const uploadUrl = '/api/file';
    const file = new File([''], 'testFile');

    mock.onPost(uploadUrl).reply(500);

    it('should work', async () => {
      try {
        await uploadFile(file, uploadUrl, () => {});
      } catch (error) {
        expect(error.response.status).toBe(500);
      }

      mock.onPost(uploadUrl).reply(200);

      const response = await uploadFile(file, uploadUrl, () => {});
      expect(response.status).toBe(200);
      mock.reset();
    });
  });

  describe('pollConversionStatus', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    let resolved: any = 1;
    const pollFn = jest.fn(() => {
      return new Promise(resolve => {
        resolve(resolved);
      });
    });
    const cbFn = jest.fn();

    it('should return timeout error when the server did not send the data', async () => {
      await pollConversionStatus(pollFn, cbFn, 3);
      for (let i = 0; i < 3; i++) {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      }

      expect(pollFn).toBeCalledTimes(4);
      expect(cbFn).toHaveBeenLastCalledWith(
        null,
        null,
        'Сервер не справился за отведенное время, попробуйте позже :(',
      );
    });

    it('should call cbFn with server data', async () => {
      resolved = { data: { assets: { one: { status: 'OK' } } } };

      await pollConversionStatus(pollFn, cbFn, 1);
      for (let i = 0; i < 2; i++) {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      }
      expect(pollFn).toBeCalledTimes(7);
      expect(cbFn.mock.calls[2][0]).toEqual(resolved.data);
      expect(cbFn).toHaveBeenLastCalledWith(
        null,
        null,
        'Сервер не справился за отведенное время, попробуйте позже :(',
      );
    });

    it('should call cbFn with server data when ready', async () => {
      resolved = {
        data: { assets: { one: { status: 'OK', asset: { state: 'READY' } } } },
      };

      await pollConversionStatus(pollFn, cbFn, 1);
      for (let i = 0; i < 2; i++) {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      }
      expect(pollFn).toBeCalledTimes(10);
      expect(cbFn).toHaveBeenLastCalledWith(resolved.data, null, true);
    });
  });
});
