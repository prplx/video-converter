/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AssetsOneOutStatus, AssetsEntityStatus, AssetsFileState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: getAsset
// ====================================================

export interface getAsset_assets_one_asset_files_checksum {
  __typename: "AssetsFileChecksum";
  md5: string;
  sha1: string;
  sha3: string;
}

export interface getAsset_assets_one_asset_files_meta {
  __typename: "MetaData";
  key: string | null;
  value: string | null;
}

export interface getAsset_assets_one_asset_files {
  __typename: "AssetsFile";
  id: string;
  downloadUrl: string;
  size: number;
  mimeType: string;
  checksum: getAsset_assets_one_asset_files_checksum;
  state: AssetsFileState;
  meta: getAsset_assets_one_asset_files_meta[] | null;
  systemTags: string[];
  createdAt: any;
  updatedAt: any;
}

export interface getAsset_assets_one_asset {
  __typename: "AssetsEntity";
  state: AssetsEntityStatus;
  service: string;
  title: string;
  attacheName: string;
  files: getAsset_assets_one_asset_files[];
}

export interface getAsset_assets_one {
  __typename: "AssetsOneOut";
  status: AssetsOneOutStatus;
  asset: getAsset_assets_one_asset;
}

export interface getAsset_assets {
  __typename: "AssetsQuery";
  one: getAsset_assets_one;
}

export interface getAsset {
  assets: getAsset_assets | null;
}

export interface getAssetVariables {
  id: string;
}
