import { resolve } from 'https://deno.land/std/path/mod.ts';
import { generateSchema } from '../schema/generator.ts';
import { firstLetterCapitalize } from '../helpers/stringUtils.ts';

export type ConfigFilePaths = {
  filePaths: string[];
  configType: string;
};

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

async function updateSchemaForConfigFile(
  filePath: string,
  configType: string,
) {
  try {
    const modulePath = 'file://' + resolve(Deno.cwd(), filePath);
    const versionedModulePath =
      `${modulePath}?version=${Math.random()}`;
    const configModule = await import(modulePath);
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
    await Deno.writeTextFile(schemaFilePath, '');
    // console.log(`Cleared ${schemaFilePath}`);
    // console.log(`Start to write into ${schemaFilePath} file`);
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
