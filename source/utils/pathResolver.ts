// source/utils/pathResolver.ts

import { resolve } from '../deps.ts';
import { generateRandomString } from './pathHelper.ts';

/**
 * Функция для получения полного пути, учитывая абсолютный префикс.
 * @param path Путь к файлу
 * @param absolutePathPrefix Префикс абсолютного пути
 * @returns Полный путь в формате строки
 */
export function resolvePath(
  path: string,
  absolutePathPrefix?: string,
  addSalt?: boolean,
): string {
  const salt = addSalt ? `?cache_bust=${generateRandomString()}` : '';
  if (absolutePathPrefix) {
    if (
      absolutePathPrefix.startsWith('http://') ||
      absolutePathPrefix.startsWith('https://')
    ) {
      return `${absolutePathPrefix}/${path}${salt}`;
    } else if (absolutePathPrefix.startsWith('file:///')) {
      return `${
        absolutePathPrefix.replace(/\/+$/, '')
      }/${path}${salt}`;
    } else {
      return `file:///${resolve(absolutePathPrefix, path)}${salt}`;
    }
  }
  return `file:///${resolve('./', path)}${salt}`;
}
