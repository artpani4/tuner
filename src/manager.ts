import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import { ZodTypeAny } from 'https://deno.land/x/zod/mod.ts';
import { resolve } from 'https://deno.land/std@0.159.0/path/posix.ts';
import { deepCopy, replacePair } from '../helpers/objTools.ts';
export type ConfigMatcher<T> = (config: T) => boolean;

interface baseConfig {
  secrets?: {
    name: string;
    value?: string | undefined;
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

  getSecret(name: string) {
    const secret = this.config?.secrets?.find((s) => s.name === name);
    if (!secret) {
      throw new Error(`Secret ${name} not found`);
    }

    return secret.value;
  }

  fillSecrets(config: T): T {
    if (!config.secrets || config.secrets.length === 0) {
      return config;
    }

    const filledSecrets = config.secrets.map((secret) => {
      secret;
      const secretValue = Deno.env.get(secret.name) ||
        dotenvConfig()[secret.name];
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
        this.config = this.fillSecrets(validatedConfig.data);
        return this.config;
      }
    }
    return null;
  }

  async localLoadConfig(
    matcher: ConfigMatcher<T>,
  ): Promise<T | null> {
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
          this.config = this.fillSecrets(validatedConfig.data);
          // this.insertEnvValues();
          return this.config;
        }
      }
    }
    return null;
  }
}
