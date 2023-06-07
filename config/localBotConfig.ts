import { BotConfig } from './botConfigSchema.ts';
const localBotConfig: BotConfig = {
  name: 'local',
  secrets: [
    {
      name: 'API_KEY',
    },
  ],
  pageNotion: '6f798814a1b74f0c95b190962a506f98',
  codeBlockId: '9a4e81da0d324cd9b9e5ebb2b92c4f71',
};
export default localBotConfig;
