import { resolve } from 'https://deno.land/std/path/mod.ts';
import { generateSchema } from '../schema/generator.ts';
import {
  firstLetterCapitalize,
  pseudoVersion,
} from '../helpers/stringUtils.ts';
import { envTypes } from './manager.ts';

export type ConfigFilePaths = {
  filePaths: string[];
  configType: string;
};

const enumTypes: envTypes = {};
/**
 * Наблюдает за изменениями файлов конфигурации и выполняет необходимые операции при изменении.
 * @param configFilePaths - Объект, содержащий пути к файлам конфигурации и тип конфигурации.
 * @returns void.
 */
export async function watchConfigFiles(
  configFilePaths: ConfigFilePaths,
) {
  const { filePaths, configType } = configFilePaths;

  let timer: number | null = null;

  const configs = filePaths.map((filePath) => ({
    filePath,
    configType,
  }));

  for await (
    const event of Deno.watchFs(
      configs.map((config) => resolve(Deno.cwd(), config.filePath)),
    )
  ) {
    if (event.kind === 'modify') {
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        const fP = event.paths[0];
        console.log(fP);
        const config = configs.find(
          (c) => resolve(Deno.cwd(), c.filePath) === fP,
        );
        if (config) {
          await updateSchemaForConfigFile(fP, config.configType);
        }

        timer = null;
      }, 500);
    }
  }
}

/**
 * Обновляет схему для файла конфигурации.
 * @param filePath - Путь к файлу конфигурации.
 * @param configType - Тип конфигурации.
 * @throws {Error} - Если возникла ошибка при обновлении схемы.
 * @returns void.
 */
async function updateSchemaForConfigFile(
  filePath: string,
  configType: string,
) {
  try {
    const modulePath = 'file://' + resolve(Deno.cwd(), filePath);
    const versionedModulePath = pseudoVersion(modulePath);
    const configModule = await import(versionedModulePath);
    // console.log('Модуль успешно загружается с помощью import');
    const fileContent = new TextDecoder().decode(
      await Deno.readFile(filePath),
    );
    // console.log('Фаил успел прочитаться');
    const regex = /\/([^/]+)\.ts$/;
    const match = filePath.match(regex);

    if (match === null) {
      throw new Error(`File name ${filePath} is invalid`);
    }
    const variableName = match[1];
    const schemaFilePath = resolve(
      filePath,
      `../${configType}Schema.ts`,
    );
    const configObject = configModule.default;
    console.log(configObject);
    await Deno.writeTextFile(schemaFilePath, '');
    await generateSchema(
      configObject,
      configType,
      schemaFilePath,
    );
    console.log(
      `Schema for ${configType} is generated, based on ${filePath}`,
    );

    const [anyChanges, newCode] = typeAdd(
      fileContent,
      configType,
    );
    if (anyChanges) {
      await Deno.writeFile(
        filePath,
        new TextEncoder().encode(newCode),
      );
    }
    console.log(`Done!\n${'-'.repeat(20)}`);
  } catch (e) {
    throw new Error((e as { message: string }).message);
  }
}

/**
 * Добавляет тип и импорт схемы в файл конфигурации.
 * @param code - Код файла конфигурации.
 * @param type - Тип конфигурации.
 * @throws {Error} - Если возникла ошибка при добавлении типа и импорта схемы
 * @returns - Массив, содержащий булевое значение, указывающее на наличие изменений, и модифицированный код файла конфигурации.
 */
function typeAdd(code: string, type: string): [boolean, string] {
  const regType = /const\s+(\w+)\s*(:\s*\w+)?\s*=\s*{[\s\S]*?};/;
  const matchType = code.match(regType);
  if (matchType === null) {
    throw new Error(
      `Expression "const ... = {}" expected, but "${
        code.slice(0, 30)
      }" found`,
    );
  }

  const variableName = matchType[1];
  const hasType = !!matchType[2];

  let modifiedStr = code;
  let anyChanges = false;

  if (!hasType) {
    const modifiedDeclaration = `const ${variableName}: ${
      firstLetterCapitalize(type)
    } =`;
    modifiedStr = modifiedStr.replace(
      matchType[0],
      `${modifiedDeclaration}${
        matchType[0].substring(matchType[0].indexOf('=') + 1)
      }`,
    );
    anyChanges = true;
  }

  const regImport =
    /import\s*{\s*([A-Za-z_]\w*)\s*}\s*from\s*['"][^'"]+['"]/;
  const matchImport = code.match(regImport);

  if (
    matchImport === null ||
    matchImport[1] !== firstLetterCapitalize(type)
  ) {
    modifiedStr = `import {${
      firstLetterCapitalize(type)
    }} from './${type}Schema.ts';\n${modifiedStr}`;
    anyChanges = true;
  }

  return [anyChanges, modifiedStr];
}
