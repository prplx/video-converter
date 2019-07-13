export interface IAction {
  type: number;
}

export interface IFileResult {
  name: string;
  progress?: number;
  downloadUrl?: string;
}

export interface ICreateAssetResponse {
  id: number;
  uploadUrl: string;
  status: string;
}
