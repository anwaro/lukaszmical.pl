import {
    createClient,
    SupabaseClient as _SupabaseClient,
} from '@supabase/supabase-js';
import {Database} from '@/types/supabase/database';

export class SupabaseClient {
    protected client: _SupabaseClient<Database>;

    constructor() {
        this.client = createClient(
            `${process.env.SUPABASE_URL}`,
            `${process.env.SUPABASE_KEY}`,
        );
    }
}
