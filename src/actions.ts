import { ActionTypes } from './constants';
import { IAction, IFileResult } from './types';

class SetError implements IAction {
  readonly type = ActionTypes.SET_ERROR;
  constructor(public payload: string) {}
}

class SetPending implements IAction {
  readonly type = ActionTypes.SET_PENDING;
  constructor(public payload: boolean) {}
}

class SetFiles implements IAction {
  readonly type = ActionTypes.SET_FILES;
  constructor(public payload: File[]) {}
}

class SetFormats implements IAction {
  readonly type = ActionTypes.SET_FORMATS;
  constructor(public payload: string[]) {}
}

class SetResolutions implements IAction {
  readonly type = ActionTypes.SET_RESOLUTIONS;
  constructor(public payload: string[]) {}
}

class SetResult implements IAction {
  readonly type = ActionTypes.SET_RESULT;
  constructor(public payload: IFileResult[] | undefined) {}
}

class SetUploadingProgress implements IAction {
  readonly type = ActionTypes.SET_UPLOADING_PROGRESS;
  constructor(public payload: number) {}
}

class SetConverting implements IAction {
  readonly type = ActionTypes.SET_CONVERTING;
}

class SetDone implements IAction {
  readonly type = ActionTypes.SET_DONE;
}

export type Actions =
  | SetError
  | SetPending
  | SetFiles
  | SetFormats
  | SetResolutions
  | SetResult
  | SetUploadingProgress
  | SetConverting
  | SetDone;
