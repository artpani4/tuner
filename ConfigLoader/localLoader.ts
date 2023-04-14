import { z, ZodTypeAny } from 'https://deno.land/x/zod/mod.ts';

type ConfigMatcher<T> = (config: T) => boolean;

async function findConfigFile<T>(
  configDir: string,
  configSchema: ZodTypeAny,
  matcher: ConfigMatcher<T>,
): Promise<T | null> {
  const dir = configDir;
  const files = await Deno.readDir(configDir);
  for await (const file of files) {
    if (file.name.includes('Config.ts')) {
      const { default: configModule } = await import(
        `${configDir}/${file.name}`
      );
      const validatedConfig = configSchema.safeParse(configModule);
      if (validatedConfig.success && matcher(validatedConfig.data)) {
        return validatedConfig.data;
      }
    }
  }
  return null;
}

export async function loadConfig<T>(
  configSchema: ZodTypeAny,
  matcher: ConfigMatcher<T>,
): Promise<T | null> {
  const config = await findConfigFile<T>(
    await findConfigDir('.') as string,
    configSchema,
    matcher,
  );
  return config;
}
async function findConfigDir(
  startDir: string,
): Promise<string | null> {
  const dir = await Deno.realPath(startDir);
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory) {
      if (entry.name === 'config') {
        return `${dir}/config`;
      } else {
        const subDir = await findConfigDir(`${dir}/${entry.name}`);
        if (subDir !== null) {
          return subDir;
        }
      }
    }
  }
  return null;
}
