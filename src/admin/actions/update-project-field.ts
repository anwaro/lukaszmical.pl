'use server';

import {DrizzleProject} from '@/services/drizzle/drizzle-project';
import {ProjectRow} from '@/types/project';
import {auth} from '@/utils/auth/auth';

type Data = Partial<ProjectRow>;
type State = {id: number} & Data;

export const updateProjectField = async (
    _prevState: State,
    form: FormData,
): Promise<State> => {
    await auth();
    const project = new DrizzleProject();
    const id = parseInt(form.get('id') as string);
    const name = form.get('name') as string;
    const value = form.get('value');
    const data = {[name]: value} as Data;

    await project.update(id, data);

    return {
        id,
        ...data,
    };
};
