import axios from 'axios';
import { path } from 'ramda';
import { ICreateAssetResponse } from './types';
import {
  AssetsOneOutStatus,
  AssetsFileState,
} from './types/graphql-global-types';

export const createAsset = async (
  createAssetMutation: Function,
  variables: object,
) => {
  const data = await createAssetMutation({
    variables,
  });

  if (!data) throw new Error('Возникла ошибка в процессе загрузки видео');

  const createAssetResponse: ICreateAssetResponse | undefined = path(
    ['data', 'assets', 'createVideo'],
    data,
  );

  if (!createAssetResponse) {
    throw new Error('Возникла ошибка в процессе загрузки видео');
  }

  const { id, uploadUrl } = createAssetResponse;

  return { id, uploadUrl };
};

export const uploadFile = async (
  file: File,
  uploadUrl: string,
  progressCb: Function,
) => {
  const formData = new FormData();

  formData.append('file', file);

  return axios.post(uploadUrl, formData, {
    onUploadProgress: progressEvent =>
      progressCb(
        Math.round((progressEvent.loaded / progressEvent.total) * 100),
      ),
  });
};

export const pollConversionStatus = async (
  pollFn: Function,
  cbFn: Function,
  timeout: number,
) => {
  let counts: number = timeout;

  const poll = async () => {
    if (counts === 0) {
      await cbFn(
        null,
        null,
        'Сервер не справился за отведенное время, попробуйте позже :(',
      );
    }
    counts--;

    const { data } = await pollFn();
    const status: string | undefined = path(['assets', 'one', 'status'], data);

    if (status === AssetsOneOutStatus.OK) {
      await cbFn(data);
    }

    const assetState: string | undefined = path(
      ['assets', 'one', 'asset', 'state'],
      data,
    );

    return assetState === AssetsFileState.READY
      ? await cbFn(data, null, true)
      : setTimeout(poll, 1000);
  };

  poll();
};
