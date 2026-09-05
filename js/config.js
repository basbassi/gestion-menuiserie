const SUPABASE_URL =
    "https://lsbrotyibveebrtqpubp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_NspkwRlbWuygxsYFZA6uhw_CrpSSYuM";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );