import { axiod } from 'https://deno.land/x/axiod/mod.ts';
import { GithubRes } from './schema/githubRes.ts';

/**
Получает конфигурацию из репозитория GitHub с использованием предоставленного API-ключа, владельца репозитория, названия репозитория и пути к файлу.
@param apiKey - API-ключ для аутентификации при доступе к репозиторию GitHub.
@param owner - Владелец репозитория GitHub.
@param repo - Название репозитория GitHub.
@param filePath - Путь к файлу в репозитории GitHub.
@returns Полученная конфигурация в формате текста.
@throws Ошибка при возникновении проблем при получении файла из репозитория GitHub.
*/
export async function getGitHubConfig(
  apiKey: string,
  owner: string,
  repo: string,
  filePath: string,
) {
  try {
    const response = (await axiod.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )) as unknown as GithubRes;
    return atob(response.data.content);
  } catch (error) {
    console.error(
      'Error occurred while fetching file from GitHub:',
      error,
    );
    throw error;
  }
}
