import {and, eq} from 'drizzle-orm';

import {
    ProjectLocale,
    ProjectStringInsert,
    ProjectStringsEntity,
    ProjectStringType,
    ProjectStringTypeList,
} from '@/types/project';

import {db} from './drizzle-client';
import {
    projectsStrings,
    ProjectStringInsert as SchemaProjectStringInsert,
} from './schema';

function emptyStrings(): ProjectStringsEntity {
    return Object.fromEntries(
        ProjectStringTypeList.map((type) => [type, {pl: '', en: ''}]),
    ) as ProjectStringsEntity;
}

export class DrizzleProjectString {
    async getProjectStrings(id: number): Promise<ProjectStringsEntity> {
        const rows = await db
            .select({
                type: projectsStrings.type,
                locale: projectsStrings.locale,
                value: projectsStrings.value,
            })
            .from(projectsStrings)
            .where(eq(projectsStrings.projectId, id));

        return rows.reduce((acc, record) => {
            acc[record.type][record.locale] = record.value ?? '';
            return acc;
        }, emptyStrings());
    }

    async createProjectStrings(rows: ProjectStringInsert[]): Promise<void> {
        if (!rows.length) {
            return;
        }
        await db.insert(projectsStrings).values(rows as SchemaProjectStringInsert[]);
    }

    async updateValue(
        projectId: number | string,
        type: ProjectStringType,
        locale: ProjectLocale,
        value: string,
    ): Promise<void> {
        const updated = await db
            .update(projectsStrings)
            .set({value})
            .where(
                and(
                    eq(projectsStrings.projectId, Number(projectId)),
                    eq(projectsStrings.type, type),
                    eq(projectsStrings.locale, locale),
                ),
            )
            .returning({id: projectsStrings.id});

        // Projects created before a string type existed have no row for it.
        if (!updated.length) {
            await db
                .insert(projectsStrings)
                .values({projectId: Number(projectId), type, locale, value});
        }
    }
}
