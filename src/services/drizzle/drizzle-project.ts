import {and, asc, eq, inArray, ne, not} from 'drizzle-orm';

import {
    LocalizedProjectEntity,
    LocalizedProjectStringsEntity,
    ProjectEntity,
    ProjectInsert,
    ProjectListItem,
    ProjectLocale,
    ProjectRow,
    ProjectStringsListItem,
    ProjectStringTypeList,
} from '@/types/project';

import {db} from './drizzle-client';
import {DrizzleProjectString} from './drizzle-project-string';
import {
    Project,
    ProjectInsert as SchemaProjectInsert,
    projects,
    projectsStrings,
} from './schema';

// A stored cover may point at a host that is not allowed by `next/image`
// (e.g. a decommissioned `*.r2.dev` bucket URL from before the R2 migration).
// `next/image` throws synchronously at render for an unconfigured host, which
// would crash the whole page. Keep only same-origin paths and URLs on the
// configured public domain; drop everything else so the UI falls back to the
// local placeholder instead.
function normalizeCover(cover: string | null): string | null {
    if (!cover) {
        return null;
    }
    if (cover.startsWith('/')) {
        return cover;
    }
    const publicUrl = process.env.R2_BUCKET_PUBLIC_URL;
    try {
        if (publicUrl && new URL(cover).host === new URL(publicUrl).host) {
            return cover;
        }
    } catch {
        // Not a valid absolute URL — treat as absent.
    }
    return null;
}

// Bundled interactive projects ship their cover in `public/`, so they need no
// stored one.
function listCover(row: Pick<ProjectRow, 'cover' | 'type' | 'url'>): string | null {
    const cover = normalizeCover(row.cover);
    if (cover || row.type !== 'project') {
        return cover;
    }
    return `/projects/${row.url}/image/cover.jpg`;
}

export type ProjectListFilter = {
    // Case studies and projects share a table but are listed separately.
    caseStudies?: boolean;
    featured?: boolean;
};

export class DrizzleProject {
    private async getProject(
        key: 'id' | 'url',
        value: number | string,
    ): Promise<ProjectEntity | null> {
        const where =
            key === 'id'
                ? eq(projects.id, Number(value))
                : eq(projects.url, String(value));

        const [project] = await db.select().from(projects).where(where).limit(1);

        if (!project) {
            return null;
        }

        const strings = await new DrizzleProjectString().getProjectStrings(
            project.id,
        );

        return {...project, ...strings} as ProjectEntity;
    }

    async getLocalizedProjectBySlug(
        slug: string,
        locale: ProjectLocale,
    ): Promise<LocalizedProjectEntity | null> {
        const project = await this.getProject('url', slug);

        if (!project) {
            return null;
        }

        return {
            ...project,
            cover: normalizeCover(project.cover),
            ...(Object.fromEntries(
                ProjectStringTypeList.map((field) => [
                    field,
                    project[field][locale],
                ]),
            ) as LocalizedProjectStringsEntity),
        };
    }

    async getProjectById(id: number | string) {
        return this.getProject('id', parseInt(`${id}`));
    }

    async getProjects(caseStudies = false): Promise<ProjectRow[]> {
        const caseStudy = eq(projects.type, 'case-study');
        const rows = await db
            .select()
            .from(projects)
            .where(caseStudies ? caseStudy : not(caseStudy))
            .orderBy(asc(projects.order), asc(projects.id));

        return rows.map((row) => ({
            ...row,
            cover: normalizeCover(row.cover),
        })) as ProjectRow[];
    }

    async getProjectList(
        locale: ProjectLocale,
        filter: ProjectListFilter = {},
    ): Promise<ProjectListItem[]> {
        const caseStudy = eq(projects.type, 'case-study');
        const rows = await db
            .select({
                id: projects.id,
                url: projects.url,
                type: projects.type,
                createdAt: projects.createdAt,
                cover: projects.cover,
                stack: projects.stack,
                period: projects.period,
                siteUrl: projects.siteUrl,
                repoUrl: projects.repoUrl,
                featured: projects.featured,
            })
            .from(projects)
            .where(
                and(
                    eq(projects.published, true),
                    filter.caseStudies ? caseStudy : not(caseStudy),
                    filter.featured ? eq(projects.featured, true) : undefined,
                ),
            )
            .orderBy(asc(projects.order), asc(projects.id));

        if (!rows.length) {
            return [];
        }

        const strings = await db
            .select({
                projectId: projectsStrings.projectId,
                type: projectsStrings.type,
                value: projectsStrings.value,
            })
            .from(projectsStrings)
            .where(
                and(
                    inArray(
                        projectsStrings.projectId,
                        rows.map((row) => row.id),
                    ),
                    eq(projectsStrings.locale, locale),
                    ne(projectsStrings.type, 'content'),
                ),
            );

        const emptyStrings = (): ProjectStringsListItem =>
            Object.fromEntries(
                ProjectStringTypeList.filter((type) => type !== 'content').map(
                    (type) => [type, ''],
                ),
            ) as ProjectStringsListItem;

        const byId = new Map<number, ProjectStringsListItem>();
        for (const record of strings) {
            if (record.projectId == null || record.type === 'content') {
                continue;
            }
            const entry = byId.get(record.projectId) ?? emptyStrings();
            entry[record.type] = record.value ?? '';
            byId.set(record.projectId, entry);
        }

        return rows.map((row) => ({
            ...row,
            cover: listCover(row),
            ...(byId.get(row.id) ?? emptyStrings()),
        }));
    }

    async create(data: ProjectInsert): Promise<Project> {
        const [project] = await db
            .insert(projects)
            .values(data as SchemaProjectInsert)
            .returning();

        return project;
    }

    async update(
        id: number | string,
        data: Partial<ProjectRow>,
    ): Promise<void> {
        await db
            .update(projects)
            .set(data as Partial<SchemaProjectInsert>)
            .where(eq(projects.id, Number(id)));
    }
}
