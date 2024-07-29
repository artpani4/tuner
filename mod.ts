import Env from './source/utils/envFuns.ts';
import tune from './source/tuner.ts';
import { loadConfig } from './source/tuner.ts';
import { Load } from './source/loaders.ts';

/**
 * Основной экспортируемый объект для работы с настройками конфигурации.
 *
 * @module Tuner
 */

export default {
  /**
   * Функция для настройки конфигурации.
   * @function
   * @param {T} cfg - Объект конфигурации.
   * @returns {DeepExpand<CombinedConfigType<T>>} Расширенный объект конфигурации.
   */
  tune,

  /**
   * Утилиты для работы с переменными окружения.
   * @namespace
   */
  Env,

  /**
   * Загрузчики конфигурации из различных источников.
   * @namespace
   */
  Load,

  use: {
    /**
     * Загружает и объединяет конфигурации из нескольких источников, указанных в порядке наследования.
     * @function
     * @param {LoadConfigOptions} [options] - Опции для загрузки конфигурации.
     * @returns {Promise<T>} Объединенная и заполненная конфигурация.
     */
    loadConfig,
  },
};
