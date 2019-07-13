import { IFileResult } from './types';
import { getAsset_assets_one_asset_files } from './apollo/types/getAsset';
import { AssetsFileState } from './types/graphql-global-types';
import { path, find, last } from 'ramda';

export const updateSource = (
  nextValue: string,
  source: string[],
  setter: Function,
) => {
  if (source.includes(nextValue)) {
    setter(source.filter(item => item !== nextValue));
  } else {
    setter([...source, nextValue]);
  }
};

export const generateFileNames = (
  formats: string[],
  resolutions: string[],
): string[] => {
  if (!formats.length || !resolutions.length) return [];

  let result: string[] = [];

  formats.forEach(format =>
    resolutions.forEach(res =>
      result.push(`${res.toLowerCase()}.${format.toLowerCase()}`),
    ),
  );
  return result;
};

export const getDropStatusMessage = (
  isDragActive: boolean,
  isDragReject: boolean,
  isDragAccept: boolean,
): string => {
  switch (true) {
    case isDragReject && !isDragAccept:
      return 'Вы можете конвертировать только видео-файлы';
    case !isDragActive:
      return 'Перенесите файл сюда, либо кликните для выбора';
    case isDragAccept && !isDragReject:
      return 'Опустите файл в эту зону';
    default:
      return 'Вы можете конвертировать только один файл одновременно';
  }
};

export const getValidationErrors = (
  formats: string[],
  resolutions: string[],
  files: File[],
): string[] => {
  let result: string[] = [];

  if (!formats.length) result.push('Выберите форматы для конвертации');
  if (!resolutions.length) result.push('Выберите разрешения для конвертации');
  if (!files.length) result.push('Выберите файл для конвертации');

  return result;
};

export const generateResult = (fileNames: string[]): IFileResult[] =>
  fileNames.map(name => ({
    name,
  }));

export const updateResult = (
  current: IFileResult[],
  asset?: any,
): IFileResult[] | undefined => {
  if (!asset) return;

  const files: getAsset_assets_one_asset_files[] | undefined = path(
    ['assets', 'one', 'asset', 'files'],
    asset,
  );

  if (!files) return;

  return current.map(currentFile => {
    let progress: number | undefined = currentFile.progress;
    const found = find(
      (file: any) =>
        typeof file.downloadUrl === 'string' &&
        currentFile.name === last(file.downloadUrl.split('/')),
    )(files);
    if (found && found.meta) {
      const progressMeta = find(
        (metaDatum: any) => metaDatum.key === 'video-converting-progress',
      )(found.meta);

      if (progressMeta && progressMeta.value) progress = +progressMeta.value;
    }

    return {
      ...currentFile,
      downloadUrl:
        found && found.state === AssetsFileState.READY
          ? found.downloadUrl
          : undefined,
      progress,
    };
  });
};

export const getAreas = (size: string) =>
  size === 'small'
    ? [
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [1, 1] },
        { name: 'result', start: [0, 2], end: [1, 2] },
        { name: 'footer', start: [0, 3], end: [1, 3] },
      ]
    : [
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [1, 1] },
        { name: 'result', start: [1, 1], end: [1, 1] },
        { name: 'footer', start: [0, 2], end: [1, 2] },
      ];
