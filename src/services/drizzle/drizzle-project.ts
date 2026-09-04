import {and, asc, eq, inArray} from 'drizzle-orm';

import {
    LocalizedProjectEntity,
    LocalizedProjectStringsEntity,
    ProjectEntity,
    ProjectInsert,
    ProjectListItem,
    ProjectLocale,
    ProjectRow,
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

    async getProjects(): Promise<ProjectRow[]> {
        const rows = await db
            .select()
            .from(projects)
            .orderBy(asc(projects.order));

        return rows.map((row) => ({
            ...row,
            cover: normalizeCover(row.cover),
        })) as ProjectRow[];
    }

    async getProjectList(locale: ProjectLocale): Promise<ProjectListItem[]> {
        const rows = await db
            .select({
                id: projects.id,
                url: projects.url,
                type: projects.type,
                createdAt: projects.createdAt,
                cover: projects.cover,
            })
            .from(projects)
            .where(eq(projects.published, true))
            .orderBy(asc(projects.order));

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
                    inArray(projectsStrings.type, ['name', 'description']),
                ),
            );

        const byId = new Map<number, {description: string; name: string}>();
        for (const record of strings) {
            if (record.projectId == null) {
                continue;
            }
            const entry = byId.get(record.projectId) ?? {name: '', description: ''};
            if (record.type === 'name' || record.type === 'description') {
                entry[record.type] = record.value ?? '';
            }
            byId.set(record.projectId, entry);
        }

        return rows.map((row) => ({
            ...row,
            cover: normalizeCover(row.cover),
            name: byId.get(row.id)?.name ?? '',
            description: byId.get(row.id)?.description ?? '',
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
