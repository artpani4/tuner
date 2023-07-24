import { walk } from 'https://deno.land/std@0.164.0/fs/walk.ts';

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

export async function findDirectoryInCWD(
  name: string,
): Promise<string | null> {
  return findDirectory(Deno.cwd(), name);
}
