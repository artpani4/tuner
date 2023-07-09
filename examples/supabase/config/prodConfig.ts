import { SupabaseConfig } from './supabaseConfigSchema.ts';
import { envTypes } from '../../../src/manager.ts';
const prodSupabase: SupabaseConfig = {
  name: 'local',
  env: {
    NOTION_API_KEY: {
      type: envTypes.string,
    },

    GITHIUB_API_KEY: {
      type: envTypes.string,
    },
  },
  timeoutToUpdate: 1200,
  mainTable: 'Wallets',
  isSubscribtionOn: false,
};

export default prodSupabase;
