import { z, ZodTypeAny } from 'https://deno.land/x/zod/mod.ts';
import { resolve } from 'https://deno.land/std@0.159.0/path/posix.ts';
export type ConfigMatcher<T> = (config: T) => boolean;

interface baseConfig {
  secrets?: {
    name: string;
    value: string;
  }[];
}

export class ConfigManager<
  T extends baseConfig,
  U extends ZodTypeAny = ZodTypeAny,
> {
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

  fillSecrets(config: T): T {
    if (!config.secrets || config.secrets.length === 0) {
      return config;
    }

    const filledSecrets = config.secrets.map((secret) => {
      const secretValue = Deno.env.get(secret.name);
      if (secretValue === undefined) {
        throw new Error(`Secret ${secret.name} not found`);
      }
      return { ...secret, value: secretValue };
    });

    return { ...config, secrets: filledSecrets };
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
        return this.fillSecrets(validatedConfig.data as T);
      }
    }

    throw new Error('No config found');
  }
  async localLoadConfig(
    matcher: ConfigMatcher<T>,
  ): Promise<T | null> {
    console.log(this.localConfigPaths, Deno.cwd());
    for await (const path of this.localConfigPaths) {
      if (path.includes('Config')) {
        const { default: configModule } = await import(
          'file://' + resolve(Deno.cwd(), path)
        );

        const validatedConfig = this.configSchema.safeParse(
          configModule,
        );
        if (
          validatedConfig.success && matcher(validatedConfig.data)
        ) {
          return this.fillSecrets(validatedConfig.data as T);
        }
      }
    }
    return null;
  }
}
