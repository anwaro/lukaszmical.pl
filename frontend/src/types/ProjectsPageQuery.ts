/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_COMPONENTBLOCKSGROUP_TYPE, ENUM_PROJECTS_TYPE } from "./globalTypes";

// ====================================================
// GraphQL query operation: ProjectsPageQuery
// ====================================================

export interface ProjectsPageQuery_projectsPage_blocks_projects_cover {
  __typename: "UploadFile";
  url: string;
}

export interface ProjectsPageQuery_projectsPage_blocks_projects {
  __typename: "Projects";
  id: string;
  name: string | null;
  description: string | null;
  type: ENUM_PROJECTS_TYPE | null;
  url: string;
  createdAt: any | null;
  cover: ProjectsPageQuery_projectsPage_blocks_projects_cover | null;
}

export interface ProjectsPageQuery_projectsPage_blocks {
  __typename: "ComponentBlocksGroup";
  id: string;
  type: ENUM_COMPONENTBLOCKSGROUP_TYPE | null;
  title: string | null;
  projects: (ProjectsPageQuery_projectsPage_blocks_projects | null)[] | null;
}

export interface ProjectsPageQuery_projectsPage {
  __typename: "ProjectsPage";
  id: string;
  blocks: (ProjectsPageQuery_projectsPage_blocks | null)[] | null;
}

export interface ProjectsPageQuery {
  projectsPage: ProjectsPageQuery_projectsPage | null;
}
