export const ASSET_TAG = process.env.REACT_APP_ASSET_TAG;
export const CONVERSION_TIMEOUT = 100000;

export enum AvailableFormats {
  MP4 = 'MP4',
  WEBM = 'WEBM',
}

export enum AvailableResolutions {
  R360P = 'R360P',
  R480P = 'R480P',
  R720P = 'R720P',
  R1080P = 'R1080P',
}

export enum ActionTypes {
  SET_ERROR,
  SET_PENDING,
  SET_FILES,
  SET_FORMATS,
  SET_RESOLUTIONS,
  SET_RESULT,
  SET_UPLOADING_PROGRESS,
  SET_CONVERTING,
  SET_DONE,
}

export enum ConversionState {
  IDLE,
  UPLOADING,
  CONVERTING,
  ERROR,
  DONE,
}
