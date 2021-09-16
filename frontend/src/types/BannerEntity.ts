/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_COMPONENTBLOCKSBANNER_TYPE } from "./globalTypes";

// ====================================================
// GraphQL fragment: BannerEntity
// ====================================================

export interface BannerEntity_image {
  __typename: "UploadFile";
  url: string;
}

export interface BannerEntity_mobileImage {
  __typename: "UploadFile";
  url: string;
}

export interface BannerEntity {
  __typename: "ComponentBlocksBanner";
  id: string;
  text: string | null;
  urlType: ENUM_COMPONENTBLOCKSBANNER_TYPE;
  url: string;
  image: BannerEntity_image | null;
  mobileImage: BannerEntity_mobileImage | null;
}
