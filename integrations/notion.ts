import Client from 'https://deno.land/x/notion_sdk@v2.2.3/src/Client.ts';
import { Block } from './schema/block.ts';

import { jsonify } from '../helpers/stringUtils.ts';

/**
 * Получает конфигурацию из блока Notion с использованием предоставленного ключа и идентификатора блока.
 *
 * @param key - Ключ аутентификации для доступа к API Notion.
 * @param blockId - Идентификатор блока Notion, содержащего конфигурацию.
 * @returns Полученная конфигурация в формате JSON.
 * @throws Ошибка при возникновении проблем при получении файла из Notion.
 */
export async function getNotionConfig(key: string, blockId: string) {
  try {
    const notion = new Client({
      auth: key,
    });
    const response = await notion.blocks.retrieve({
      block_id: blockId,
    }) as Block;
    const strConfig = response.code.rich_text[0].plain_text;
    const convertedText = jsonify(strConfig);
    return convertedText;
  } catch (error) {
    console.error(
      'Error occurred while fetching file from Notion:',
      error,
    );
    throw error;
  }
}
