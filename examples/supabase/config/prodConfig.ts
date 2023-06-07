import {SupabaseConfig} from './supabaseConfigSchema.ts';
const prodSupabase: SupabaseConfig = {
  name: 'prod',
  secrets: [
    {
      name: 'API_KEY',
    },
    {
      name: 'URL',
    },
  ],
  timeoutToUpdate: 100,
  mainTable: 'Invoices',
  isSubscribtionOn: false,
};

export default prodSupabase;
