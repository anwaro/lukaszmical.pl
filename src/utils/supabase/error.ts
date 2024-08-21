import {PostgrestError} from '@supabase/supabase-js';

export const errorString = (error: PostgrestError) => {
    return [error?.message, error?.details, error?.hint, error?.code].join('\n');
};
