import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qswhxcfgtooxxutarcan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzd2h4Y2ZndG9veHh1dGFyY2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTc4NDAsImV4cCI6MjA4OTU5Mzg0MH0.GjrDlQUhI_m6O4E26rErJxhLC0GiFgAk-2wKtycDQDg';

export const supabase = createClient(supabaseUrl, supabaseKey);
