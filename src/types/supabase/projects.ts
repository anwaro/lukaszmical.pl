import {Database} from './database';

export type ProjectTable = Database['public']['Tables']['projects'];

export type ProjectInsert = ProjectTable['Insert'];
export type ProjectRow = ProjectTable['Row'];
