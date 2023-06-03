import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import { ZodTypeAny } from 'https://deno.land/x/zod/mod.ts';
import { resolve } from 'https://deno.land/std@0.159.0/path/posix.ts';
import { pseudoVersion } from '../helpers/stringUtils.ts';
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
  private mainConfig: T | null = null;

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

  async setMainConfig(path: string, source: 'local' | 'remote') {
    if (source === 'local') {
      this.mainConfig = await this.getLocal(path);
      return;
    }
    if (source === 'remote') {
      this.mainConfig = await this.getRemote(path);
      return;
    }
    throw new Error('Couldn\'t set main config');
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

  validateConfig(config: T) {
    const validatedConfig = this.configSchema.safeParse(
      config,
    );
    if (validatedConfig.success) {
      this.config = this.fillSecrets(validatedConfig.data);
      return this.config;
    }
    throw new Error('Couldn\'t load  config');
  }

  async getLocal(path: string) {
    const { default: configModule } = await import(
      'file://' + resolve(Deno.cwd(), pseudoVersion(path))
    );
    return this.validateConfig(configModule);
  }

  async getRemote(path: string) {
    const { default: configModule } = await import(
      pseudoVersion(path)
    );
    return this.validateConfig(configModule);
  }

  async localLoadConfig(
    matcher: ConfigMatcher<T>,
  ): Promise<T | null> {
    for await (const path of this.localConfigPaths) {
      const config = await this.getLocal(path);
      if (matcher(config)) {
        return config;
      }
    }
    if (this.mainConfig == null) {
      throw new Error('No config found');
    }
    return this.mainConfig;
  }

  async remoteLoadConfig(
    matcher: ConfigMatcher<T>,
  ): Promise<T | null> {
    for (const url of this.remoteConfigUrls) {
      const config = await this.getRemote(url);
      if (matcher(config)) {
        return config;
      }
    }
    return null;
  }

  async loadConfig(matcher: ConfigMatcher<T>): Promise<T | null> {
    const remoteConfig = await this.remoteLoadConfig(matcher);
    if (remoteConfig) {
      return remoteConfig;
    }
    return this.localLoadConfig(matcher);
  }
}
