import { walk } from '../deps.ts';

/**
 * Поиск директории с указанным именем в заданном пути.
 * @param directoryPath Путь к директории, в которой будет выполняться поиск.
 * @param targetName Имя искомой директории.
 * @returns {Promise<string | null>} Возвращает путь к найденной директории или null, если директория не найдена.
 */
export async function findDirectory(
  directoryPath: string,
  targetName: string,
): Promise<string | null> {
  const directories = [];
  for await (const entry of walk(directoryPath)) {
    if (entry.isDirectory && entry.name === targetName) {
      directories.push(entry.path);
    }
  }

  return directories[0] || null;
}

/**
 * Поиск директории с указанным именем в текущей рабочей директории.
 * @param name Имя искомой директории.
 * @param directoryPath Путь к директории, в которой будет выполняться поиск.
 * @returns {Promise<string | null>} Возвращает путь к найденной директории или null, если директория не найдена.
 */
export async function findDirectoryInCWD(
  name: string,
  directoryPath: string = './',
): Promise<string | null> {
  return findDirectory(directoryPath, name);
}

export function generateRandomString(length: number = 20): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return result;
}
