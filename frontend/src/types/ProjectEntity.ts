/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_PROJECTS_TYPE } from "./globalTypes";

// ====================================================
// GraphQL fragment: ProjectEntity
// ====================================================

export interface ProjectEntity_cover {
  __typename: "UploadFile";
  url: string;
}

export interface ProjectEntity {
  __typename: "Projects";
  id: string;
  name: string;
  description: string;
  type: ENUM_PROJECTS_TYPE | null;
  url: string;
  createdAt: any;
  cover: ProjectEntity_cover | null;
}
