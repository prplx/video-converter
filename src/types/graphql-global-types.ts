/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AssetsCreateVideoOutStatus {
  BAD_REQUEST = "BAD_REQUEST",
  FORBIDDEN = "FORBIDDEN",
  OK = "OK",
  SERVER_INTERNAL_ERROR = "SERVER_INTERNAL_ERROR",
}

export enum AssetsEntityStatus {
  CONVERTING = "CONVERTING",
  INITIAL = "INITIAL",
  READY = "READY",
}

export enum AssetsFileState {
  CONVERTING = "CONVERTING",
  INITIAL = "INITIAL",
  READY = "READY",
}

export enum AssetsOneOutStatus {
  BAD_REQUEST = "BAD_REQUEST",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  OK = "OK",
  SERVER_INTERNAL_ERROR = "SERVER_INTERNAL_ERROR",
}

export enum AssetsTransformVideoFormat {
  MP4 = "MP4",
  WEBM = "WEBM",
}

export enum AssetsTransformVideoResolution {
  R1080P = "R1080P",
  R360P = "R360P",
  R480P = "R480P",
  R720P = "R720P",
}

export interface AssetsTransformVideo {
  resolution: AssetsTransformVideoResolution[];
  format: AssetsTransformVideoFormat[];
}

export interface MetaDataIn {
  key?: string | null;
  value?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
