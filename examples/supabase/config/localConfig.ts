import { SupabaseConfig } from './supabaseConfigSchema.ts';
import { envTypes } from '../../../src/manager.ts';
const localSupabase: SupabaseConfig = {
  name: 'local',
  env: {
    NOTION_API_KEY: {
      type: envTypes.string, //enum
    },

    GITHIUB_API_KEY: {
      type: envTypes.number, //enum
    },
  },
  timeoutToUpdate: 1200,
  mainTable: 'Wallets',
  isSubscribtionOn: false,
};

export default localSupabase;
