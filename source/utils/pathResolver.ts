// source/utils/pathResolver.ts

import { resolve } from '../deps.ts';



/**
 * Функция для получения полного пути, учитывая абсолютный префикс.
 * @param path Путь к файлу
 * @param absolutePathPrefix Префикс абсолютного пути
 * @returns Полный путь в формате строки
 */
export function resolvePath(path: string, absolutePathPrefix?: string): string {
  if (absolutePathPrefix) {
    if (absolutePathPrefix.startsWith('http://') || absolutePathPrefix.startsWith('https://')) {
      return `${absolutePathPrefix}/${path}`;
    } else if (absolutePathPrefix.startsWith('file:///')) {
      return `${absolutePathPrefix.replace(/\/+$/, '')}/${path}`;
    } else {
      return `file:///${resolve(absolutePathPrefix, path)}`;
    }
  }
  return resolve(path);
}
