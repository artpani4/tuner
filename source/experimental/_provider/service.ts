// import axiod from 'https://deno.land/x/axiod/mod.ts';
// import { GithubRes } from './scheme/githubRes.ts';
// import { ITunerConfig } from '../type.ts';
// import { importFromString } from '../loaders.ts';
// import Notion from 'https://deno.land/x/integrations@v0.0.6/notion/mod.ts';

// import { urlToId } from 'https://deno.land/x/integrations@v0.0.6/notion/src/helpers.ts';
// /**
// Получает конфигурацию из репозитория GitHub с использованием предоставленного API-ключа, владельца репозитория, названия репозитория и пути к файлу.
// @param apiKey - API-ключ для аутентификации при доступе к репозиторию GitHub.
// @param owner - Владелец репозитория GitHub.
// @param repo - Название репозитория GitHub.
// @param filePath - Путь к файлу в репозитории GitHub.
// @returns Полученная конфигурация в формате текста.
// @throws Ошибка при возникновении проблем при получении файла из репозитория GitHub.
// */
// export async function getGitHubConfig(
//   apiKey: string,
//   owner: string,
//   repo: string,
//   filePath: string,
// ) {
//   try {
//     const response = (await axiod.get(
//       `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//         },
//       },
//     )) as unknown as GithubRes;
//     const convertedText = await importFromString(
//       atob(response.data.content),
//     ) as { default: ITunerConfig };
//     return convertedText.default as ITunerConfig;
//   } catch (error) {
//     console.error(
//       'Error occurred while fetching file from GitHub:',
//       error,
//     );
//     throw error;
//   }
// }

// /**
//  * Получает конфигурацию из блока Notion с использованием предоставленного ключа и идентификатора блока.
//  *
//  * @param key - Ключ аутентификации для доступа к API Notion.
//  * @param blockURl - URL блока Notion, содержащего конфигурацию.
//  * @returns Промис с ITunerConfig
//  * @throws Ошибка при возникновении проблем при получении файла из Notion.
//  */
// export async function getNotionConfig(key: string, blockUrl: string) {
//   try {
//     const notion = new Notion({ key });
//     const blockOfCode = await notion.getter.getBlockById(
//       urlToId.block(blockUrl),
//     );
//     const strConfig = await notion.extractor.extractTextFromBlock(
//       blockOfCode,
//     );
//     const convertedText = await importFromString(
//       strConfig,
//     ) as { default: ITunerConfig };
//     return convertedText.default as ITunerConfig;
//   } catch (error) {
//     console.error(
//       'Error occurred while fetching file from Notion:',
//       error,
//     );
//     throw error;
//   }
// }

// function getBlockIdByURL(url: string): string | null {
//   const match = url.match(/#([\w-]+)$/);
//   if (match && match[1]) {
//     return match[1];
//   } else {
//     return null;
//   }
// }
