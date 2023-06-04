import { BotConfig } from '../config/botConfigSchema.ts';
import { generateSchema } from '../schema/generator.ts';
import manager from '../src/config.ts';
import Client from 'https://deno.land/x/notion_sdk@v2.2.3/src/Client.ts';
import { Block } from './schema/block.ts';
import { importFromString } from '../helpers/importUtils.ts';
import { jsonify } from '../helpers/stringUtils.ts';
// try {
//   const config = await manager.loadConfig(
//     (config: BotConfig) => config.name === 'local',
//   );
// } catch (e) {
//   console.log(e);
// }

export async function getNotionConfig(key: string, blockId: string) {
  const notion = new Client({
    auth: key,
  });
  const response = await notion.blocks.retrieve({
    block_id: blockId,
  }) as Block;
  const strConfig = response.code.rich_text[0].plain_text;
  const convertedText = jsonify(strConfig);
  return convertedText;
}
