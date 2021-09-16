/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_COMPONENTBLOCKSGROUP_TYPE, ENUM_PROJECTS_TYPE } from "./globalTypes";

// ====================================================
// GraphQL fragment: ProjectGroupEntity
// ====================================================

export interface ProjectGroupEntity_projects_cover {
  __typename: "UploadFile";
  url: string;
}

export interface ProjectGroupEntity_projects {
  __typename: "Projects";
  id: string;
  name: string;
  description: string;
  type: ENUM_PROJECTS_TYPE | null;
  url: string;
  createdAt: any;
  cover: ProjectGroupEntity_projects_cover | null;
}

export interface ProjectGroupEntity {
  __typename: "ComponentBlocksGroup";
  id: string;
  type: ENUM_COMPONENTBLOCKSGROUP_TYPE;
  title: string;
  projects: (ProjectGroupEntity_projects | null)[] | null;
}
