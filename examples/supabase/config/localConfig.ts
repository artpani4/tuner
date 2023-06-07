import {SupabaseConfig} from './supabaseConfigSchema.ts';
const localSupabase: SupabaseConfig = {
  name: 'local',
  secrets: [
    {
      name: 'API_KEY',
    },
    {
      name: 'URL',
    },
  ],
  timeoutToUpdate: 1200,
  mainTable: 'Wallets',
  isSubscribtionOn: false,
};

export default localSupabase;
