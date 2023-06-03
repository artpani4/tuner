import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import { ZodTypeAny } from 'https://deno.land/x/zod/mod.ts';
import { resolve } from 'https://deno.land/std@0.159.0/path/posix.ts';
import { pseudoVersion } from '../helpers/stringUtils.ts';

/**
 * ConfigMatcher - функция, используемая для сопоставления конфигурации с заданными критериями.
 */
export type ConfigMatcher<T> = (config: T) => boolean;

interface baseConfig {
  secrets?: {
    name: string;
    value?: string | undefined;
  }[];
}

/**
 * Класс ConfigManager обрабатывает управление конфигурацией.
 *
 * @template T - тип конфигурации.
 * @template U - тип схемы конфигурации.
 */
export class ConfigManager<
  T extends baseConfig,
  U extends ZodTypeAny = ZodTypeAny,
> {
  private config: T | null = null;
  private remoteConfigUrls: string[] = [];
  private localConfigPaths: string[] = [];
  private configSchema: U;
  private mainConfig: T | null = null;

  /**
   * Создает экземпляр ConfigManager с заданной схемой конфигурации.
   * @param configSchema - схема конфигурации.
   */

  constructor(configSchema: U) {
    this.configSchema = configSchema;
  }

  /**
   * Добавляет URL-адрес удаленной конфигурации.
   * @param url - URL-адрес удаленной конфигурации.
   */
  addRemoteConfigUrl(url: string) {
    this.remoteConfigUrls.push(url);
  }

  /**
   * Добавляет массив URL-адресов удаленной конфигурации.
   *
   * @param urls - массив URL-адресов удаленной конфигурации.
   */
  addRemoteConfigUrls(urls: string[]) {
    this.remoteConfigUrls.push(...urls);
  }

  /**
   * Добавляет путь к локальному файлу конфигурации.
   *
   * @param path - путь к локальному файлу конфигурации.
   */
  addLocalConfigPath(url: string) {
    this.localConfigPaths.push(url);
  }

  /**
   * Добавляет массив путей к локальным файлам конфигурации.
   *
   * @param urls - массив путей к локальным файлам конфигурации.
   */
  addLocalConfigPaths(urls: string[]) {
    this.localConfigPaths.push(...urls);
  }

  /**
   * Возвращает значение секрета по его имени.
   *
   * @param name - имя секрета.
   * @returns значение секрета.
   * @throws Error, если секрет не найден.
   */
  getSecret(name: string) {
    const secret = this.config?.secrets?.find((s) => s.name === name);
    if (!secret) {
      throw new Error(`Secret ${name} not found`);
    }

    return secret.value;
  }

  /**
   * Устанавливает основную конфигурацию из локального или удаленного источника.
   *
   * @param path - путь к файлу конфигурации.
   * @param source - источник конфигурации ('local' - локальный, 'remote' - удаленный).
   * @throws Error, если не удается установить основную конфигурацию.
   */
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

  /**
   * Заполняет секреты в конфигурации, используя значения из среды выполнения.
   *
   * @param config - конфигурация.
   * @returns конфигурация с заполненными секретами.
   * @throws Error, если секрет не найден.
   */
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

  /**
   * Проверяет валидность конфигурации с использованием заданной схемы.
   *
   * @param config - конфигурация для проверки.
   * @returns проверенная конфигурация.
   * @throws Error, если не удается загрузить конфигурацию.
   */
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

  /**
   * Получает локальный файл конфигурации и выполняет его проверку.
   *
   * @param path - путь к локальному файлу конфигурации.
   * @returns проверенная конфигурация.
   */
  async getLocal(path: string) {
    const { default: configModule } = await import(
      'file://' + resolve(Deno.cwd(), pseudoVersion(path))
    );
    return this.validateConfig(configModule);
  }

  /**
   * Получает удаленный файл конфигурации и выполняет его проверку.
   *
   * @param path - путь к удаленному файлу конфигурации.
   * @returns проверенная конфигурация.
   */
  async getRemote(path: string) {
    const { default: configModule } = await import(
      pseudoVersion(path)
    );
    return this.validateConfig(configModule);
  }

  /**
   * Загружает локальные файлы конфигурации и возвращает конфигурацию, соответствующую заданным критериям.
   *
   * @param matcher - функция для сопоставления конфигурации.
   * @returns конфигурация, соответствующая критериям, или null, если конфигурация не найдена.
   * @throws Error, если не найдена основная конфигурация.
   */
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

  /**
   * Загружает удаленные файлы конфигурации и возвращает конфигурацию, соответствующую заданным критериям.
   *
   * @param matcher - функция для сопоставления конфигурации.
   * @returns конфигурация, соответствующая критериям, или null, если конфигурация не найдена.
   */
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

  /**
   * Загружает конфигурацию, соответствующую заданным критериям.
   *
   * @param matcher - функция для сопоставления конфигурации.
   * @returns конфигурация, соответствующая критериям, или null, если конфигурация не найдена.
   */
  async loadConfig(matcher: ConfigMatcher<T>): Promise<T | null> {
    const remoteConfig = await this.remoteLoadConfig(matcher);
    if (remoteConfig) {
      return remoteConfig;
    }
    return this.localLoadConfig(matcher);
  }
}
