/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SeoEntity
// ====================================================

export interface SeoEntity_image {
  __typename: "UploadFile";
  url: string;
}

export interface SeoEntity {
  __typename: "ComponentBlocksSeo";
  id: string;
  pageTitle: string;
  pageDescription: string;
  image: SeoEntity_image | null;
}
