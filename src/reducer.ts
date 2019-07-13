import { Actions } from './actions';
import { ActionTypes, ConversionState } from './constants';
import { IFileResult } from './types';

export interface IState
  extends Readonly<{
    error: string;
    statusMessage: string;
    pending: boolean;
    files: File[];
    formats: string[];
    resolutions: string[];
    conversionState: ConversionState;
    result: IFileResult[];
  }> {}

const reducer = (state: IState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        pending: false,
        statusMessage: '',
      };
    }
    case ActionTypes.SET_PENDING:
      return {
        ...state,
        pending: action.payload,
        error: '',
        statusMessage: '',
        result: [
          ...state.result.map(file => ({ ...file, progress: undefined })),
        ],
      };
    case ActionTypes.SET_FILES:
      return {
        ...state,
        files: action.payload,
        conversionState: ConversionState.IDLE,
        statusMessage: '',
      };
    case ActionTypes.SET_FORMATS:
      return {
        ...state,
        formats: action.payload,
        conversionState: ConversionState.IDLE,
        statusMessage: '',
      };
    case ActionTypes.SET_RESOLUTIONS:
      return {
        ...state,
        resolutions: action.payload,
        conversionState: ConversionState.IDLE,
        statusMessage: '',
      };
    case ActionTypes.SET_RESULT:
      return {
        ...state,
        result: action.payload ? action.payload : state.result,
      };
    case ActionTypes.SET_UPLOADING_PROGRESS:
      return {
        ...state,
        conversionState: ConversionState.UPLOADING,
        statusMessage: `Загрузка файла: ${action.payload}%`,
      };
    case ActionTypes.SET_CONVERTING:
      return {
        ...state,
        conversionState: ConversionState.CONVERTING,
        statusMessage: 'Конвертация...',
      };
    case ActionTypes.SET_DONE:
      return {
        ...state,
        pending: false,
        error: '',
        statusMessage: 'Готово',
        conversionState: ConversionState.DONE,
      };
    default:
      return state;
  }
};

export default reducer;
