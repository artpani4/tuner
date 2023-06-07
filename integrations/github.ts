import { axiod } from 'https://deno.land/x/axiod/mod.ts';
import { GithubRes } from './schema/githubRes.ts';

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
