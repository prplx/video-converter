/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AssetsTransformVideo, MetaDataIn, AssetsCreateVideoOutStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: createAsset
// ====================================================

export interface createAsset_assets_createVideo {
  __typename: "AssetsCreateVideoOut";
  id: string;
  status: AssetsCreateVideoOutStatus;
  uploadUrl: string;
}

export interface createAsset_assets {
  __typename: "AssetsMutation";
  createVideo: createAsset_assets_createVideo;
}

export interface createAsset {
  assets: createAsset_assets | null;
}

export interface createAssetVariables {
  title: string;
  tags: string[];
  transform?: AssetsTransformVideo | null;
  meta?: MetaDataIn[] | null;
}
