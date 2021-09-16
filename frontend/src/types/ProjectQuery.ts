/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_PROJECTS_TYPE } from "./globalTypes";

// ====================================================
// GraphQL query operation: ProjectQuery
// ====================================================

export interface ProjectQuery_projects_cover {
  __typename: "UploadFile";
  url: string;
}

export interface ProjectQuery_projects {
  __typename: "Projects";
  id: string;
  name: string;
  description: string;
  type: ENUM_PROJECTS_TYPE | null;
  url: string;
  createdAt: any;
  cover: ProjectQuery_projects_cover | null;
}

export interface ProjectQuery {
  projects: (ProjectQuery_projects | null)[] | null;
}

export interface ProjectQueryVariables {
  url: string;
}
