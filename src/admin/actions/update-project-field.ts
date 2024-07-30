'use server';

import {SupabaseProject} from '@/services/supabase/SupabaseProject';
import {ProjectRow} from '@/types/supabase/projects';

type Data = Partial<ProjectRow>;
type State = {id: number} & Data;

export const updateProjectField = async (
    _prevState: State,
    form: FormData,
): Promise<State> => {
    const project = new SupabaseProject();
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
