import { z, ZodTypeAny } from 'https://deno.land/x/zod/mod.ts';
import { ConfigMatcher } from './localLoader.ts';

export class ConfigManager<T, U extends ZodTypeAny = ZodTypeAny> {
  private config: T | null = null;
  private remoteConfigUrls: string[] = [];
  private localConfigPaths: string[] = [];
  private configSchema: U;

  constructor(configSchema: U) {
    this.configSchema = configSchema;
  }

  addRemoteConfigUrl(url: string) {
    this.remoteConfigUrls.push(url);
  }

  addRemoteConfigUrls(urls: string[]) {
    this.remoteConfigUrls.push(...urls);
  }

  addLocalConfigUrl(url: string) {
    this.localConfigPaths.push(url);
  }

  addLocalConfigUrls(urls: string[]) {
    this.localConfigPaths.push(...urls);
  }

  async remoteLoadConfig(
    matcher: ConfigMatcher<T>,
  ): Promise<T | null> {
    if (this.config !== null && matcher(this.config)) {
      return this.config;
    }

    for (const url of this.remoteConfigUrls) {
      const { default: configModule } = await import(url);
      const validatedConfig = this.configSchema.safeParse(
        configModule as T,
      );
      if (validatedConfig.success && matcher(validatedConfig.data)) {
        this.config = validatedConfig.data as T;
        return this.config;
      }
    }

    throw new Error('No config found');
  }
  async localLoadConfig<T>(
    matcher: ConfigMatcher<T>,
  ): Promise<T | null> {
    for await (const path of this.localConfigPaths) {
      if (path.includes('Config')) {
        const { default: configModule } = await import(path);
        const validatedConfig = this.configSchema.safeParse(
          configModule,
        );
        if (
          validatedConfig.success && matcher(validatedConfig.data)
        ) {
          return validatedConfig.data;
        }
      }
    }
    return null;
  }
}
