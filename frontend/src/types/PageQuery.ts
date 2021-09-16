/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_COMPONENTBLOCKSBANNER_TYPE, ENUM_COMPONENTBLOCKSGROUP_TYPE, ENUM_PROJECTS_TYPE } from "./globalTypes";

// ====================================================
// GraphQL query operation: PageQuery
// ====================================================

export interface PageQuery_pages_seo_image {
  __typename: "UploadFile";
  url: string;
}

export interface PageQuery_pages_seo {
  __typename: "ComponentBlocksSeo";
  id: string;
  pageTitle: string;
  pageDescription: string;
  image: PageQuery_pages_seo_image | null;
}

export interface PageQuery_pages_sections_ComponentBlocksEditor {
  __typename: "ComponentBlocksEditor" | "ComponentBlocksGallery" | "ComponentBlocksSeo" | "ComponentBlocksVideo";
}

export interface PageQuery_pages_sections_ComponentBlocksBanner_image {
  __typename: "UploadFile";
  url: string;
}

export interface PageQuery_pages_sections_ComponentBlocksBanner_mobileImage {
  __typename: "UploadFile";
  url: string;
}

export interface PageQuery_pages_sections_ComponentBlocksBanner {
  __typename: "ComponentBlocksBanner";
  id: string;
  text: string | null;
  urlType: ENUM_COMPONENTBLOCKSBANNER_TYPE;
  url: string;
  image: PageQuery_pages_sections_ComponentBlocksBanner_image | null;
  mobileImage: PageQuery_pages_sections_ComponentBlocksBanner_mobileImage | null;
}

export interface PageQuery_pages_sections_ComponentBlocksGroup_projects_cover {
  __typename: "UploadFile";
  url: string;
}

export interface PageQuery_pages_sections_ComponentBlocksGroup_projects {
  __typename: "Projects";
  id: string;
  name: string;
  description: string;
  type: ENUM_PROJECTS_TYPE | null;
  url: string;
  createdAt: any;
  cover: PageQuery_pages_sections_ComponentBlocksGroup_projects_cover | null;
}

export interface PageQuery_pages_sections_ComponentBlocksGroup {
  __typename: "ComponentBlocksGroup";
  id: string;
  type: ENUM_COMPONENTBLOCKSGROUP_TYPE;
  title: string;
  projects: (PageQuery_pages_sections_ComponentBlocksGroup_projects | null)[] | null;
}

export type PageQuery_pages_sections = PageQuery_pages_sections_ComponentBlocksEditor | PageQuery_pages_sections_ComponentBlocksBanner | PageQuery_pages_sections_ComponentBlocksGroup;

export interface PageQuery_pages {
  __typename: "Pages";
  id: string;
  title: string;
  slug: string;
  seo: PageQuery_pages_seo | null;
  sections: (PageQuery_pages_sections | null)[];
}

export interface PageQuery {
  pages: (PageQuery_pages | null)[] | null;
}

export interface PageQueryVariables {
  slug: string;
}
