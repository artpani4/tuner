import { walk } from 'https://deno.land/std@0.164.0/fs/walk.ts';

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
  for await (const entry of walk(directoryPath)) {
    if (entry.isDirectory && entry.name === targetName) {
      return entry.path;
    }
  }
  return null;
}

/**
 * Поиск директории с указанным именем в текущей рабочей директории.
 * @param name Имя искомой директории.
 * @returns {Promise<string | null>} Возвращает путь к найденной директории или null, если директория не найдена.
 */
export async function findDirectoryInCWD(
  name: string,
): Promise<string | null> {
  return findDirectory(Deno.cwd(), name);
}
