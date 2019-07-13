import {
  updateSource,
  generateFileNames,
  getDropStatusMessage,
  getValidationErrors,
  generateResult,
  updateResult,
  getAreas,
} from './helpers';

describe('helpers', () => {
  describe('updateSource', () => {
    it('should work', () => {
      const setter = jest.fn();

      updateSource('one', ['one', 'two'], setter);
      expect(setter.mock.calls[0][0]).toEqual(['two']);
      updateSource('one', ['two'], setter);
      expect(setter.mock.calls[1][0]).toEqual(['two', 'one']);
      expect(setter.mock.calls.length).toBe(2);
    });
  });

  describe('generateFileNames', () => {
    it('should work', () => {
      expect(generateFileNames(['mp4'], ['r360p'])).toEqual(['r360p.mp4']);

      expect(generateFileNames(['mp4', 'webp'], ['r360p'])).toEqual([
        'r360p.mp4',
        'r360p.webp',
      ]);

      expect(
        generateFileNames(
          ['mp4', 'webp'],
          ['r360p', 'r480p', 'r720p', 'r1080p'],
        ),
      ).toEqual([
        'r360p.mp4',
        'r480p.mp4',
        'r720p.mp4',
        'r1080p.mp4',
        'r360p.webp',
        'r480p.webp',
        'r720p.webp',
        'r1080p.webp',
      ]);
    });
  });

  describe('getDropStatusMessage', () => {
    it('should work', () => {
      expect(getDropStatusMessage(false, false, true)).toBe(
        'Перенесите файл сюда, либо кликните для выбора',
      );
      expect(getDropStatusMessage(true, false, true)).toBe(
        'Опустите файл в эту зону',
      );
      expect(getDropStatusMessage(true, false, false)).toBe(
        'Вы можете конвертировать только один файл одновременно',
      );
      expect(getDropStatusMessage(true, true, true)).toBe(
        'Вы можете конвертировать только один файл одновременно',
      );
      expect(getDropStatusMessage(true, true, false)).toBe(
        'Вы можете конвертировать только видео-файлы',
      );
    });
  });

  describe('getValidationErrors', () => {
    it('should work', () => {
      expect(getValidationErrors([], [], [])).toEqual([
        'Выберите форматы для конвертации',
        'Выберите разрешения для конвертации',
        'Выберите файл для конвертации',
      ]);
      expect(getValidationErrors(['one'], [], [])).toEqual([
        'Выберите разрешения для конвертации',
        'Выберите файл для конвертации',
      ]);
      expect(getValidationErrors(['one'], ['two'], [])).toEqual([
        'Выберите файл для конвертации',
      ]);
      expect(
        getValidationErrors(['one'], ['two'], [new File([''], 'file')]),
      ).toEqual([]);
      expect(
        getValidationErrors(['one'], [], [new File([''], 'file')]),
      ).toEqual(['Выберите разрешения для конвертации']);
    });
  });

  describe('generateResult', () => {
    it('should work', () => {
      expect(generateResult(['one', 'two', 'three'])).toEqual([
        { name: 'one' },
        { name: 'two' },
        { name: 'three' },
      ]);
    });
  });

  describe('updateResult', () => {
    interface ICurrent {
      name: string;
      progress?: number;
      donwloadUrl?: string;
    }
    let current: ICurrent[] = [
      { name: 'one' },
      { name: 'two' },
      { name: 'three' },
    ];
    let next = {};
    it('should work', () => {
      expect(updateResult(current)).toBe(undefined);
      expect(updateResult(current, next)).toBe(undefined);

      next = { assets: { one: 'one' } };
      expect(updateResult(current, next)).toBe(undefined);

      next = { assets: { one: { asset: { files: [{}, {}, {}] } } } };
      expect(updateResult(current, next)).toEqual(current);

      next = {
        assets: {
          one: { asset: { files: [{ downloadUrl: 'one/two' }, {}, {}] } },
        },
      };
      expect(updateResult(current, next)).toEqual(current);

      next = {
        assets: {
          one: {
            asset: {
              files: [{ state: 'READY', downloadUrl: 'one/two' }, {}, {}],
            },
          },
        },
      };
      expect(updateResult(current, next)).toEqual([
        { name: 'one' },
        { name: 'two', downloadUrl: 'one/two' },
        { name: 'three' },
      ]);

      next = {
        assets: {
          one: {
            asset: {
              files: [
                {
                  downloadUrl: 'one/two',
                  meta: [{ key: 'video-converting-progress', value: '47' }],
                },
                {},
                {},
              ],
            },
          },
        },
      };
      expect(updateResult(current, next)).toEqual([
        { name: 'one' },
        { name: 'two', progress: 47 },
        { name: 'three' },
      ]);

      next = {
        assets: {
          one: {
            asset: {
              files: [
                {
                  state: 'READY',
                  downloadUrl: 'one/two',
                  meta: [{ key: 'video-converting-progress', value: '47' }],
                },
                {
                  state: 'READY',
                  downloadUrl: 'one/one',
                  meta: [{ key: 'video-converting-progress', value: '82' }],
                },
                {},
              ],
            },
          },
        },
      };
      expect(updateResult(current, next)).toEqual([
        { name: 'one', downloadUrl: 'one/one', progress: 82 },
        { name: 'two', downloadUrl: 'one/two', progress: 47 },
        { name: 'three' },
      ]);

      current = [
        { name: 'one', progress: 17 },
        { name: 'two' },
        { name: 'three' },
      ];
      next = {
        assets: {
          one: {
            asset: {
              files: [
                {
                  state: 'READY',
                  downloadUrl: 'one/two',
                  meta: [{ key: 'video-converting-progress', value: '47' }],
                },
                {
                  state: 'READY',
                  downloadUrl: 'one/one',
                  meta: [],
                },
                {
                  downloadUrl: 'one/three',
                  meta: [{ key: 'video-converting-progress', value: '9' }],
                },
              ],
            },
          },
        },
      };
      expect(updateResult(current, next)).toEqual([
        { name: 'one', downloadUrl: 'one/one', progress: 17 },
        { name: 'two', downloadUrl: 'one/two', progress: 47 },
        { name: 'three', progress: 9 },
      ]);
    });
  });

  describe('getAreas', () => {
    it('should work', () => {
      expect(getAreas('small')).toEqual([
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [1, 1] },
        { name: 'result', start: [0, 2], end: [1, 2] },
        { name: 'footer', start: [0, 3], end: [1, 3] },
      ]);

      expect(getAreas('one')).toEqual([
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [1, 1] },
        { name: 'result', start: [1, 1], end: [1, 1] },
        { name: 'footer', start: [0, 2], end: [1, 2] },
      ]);
    });
  });
});
