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
  fileName: string,
  formats: string[],
  resolutions: string[],
): string[] => {
  if (!formats.length || !resolutions.length) return [];

  let result: string[] = [];

  formats.forEach(format =>
    resolutions.forEach(res =>
      result.push(
        `${fileName
          .split('.')
          .slice(0, -1)
          .join('')
          .toLocaleLowerCase()
          .replace(/[^a-zA-Z0-9]/g, '_')}.${res}.${format}`,
      ),
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

  if (!formats.length) result.push('Выберите форматы для конвертации!');
  if (!resolutions.length) result.push('Выберите разрешения для конвертации!');
  if (!files.length) result.push('Выберите файл для конвертации!');

  return result;
};
