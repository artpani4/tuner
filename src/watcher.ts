import { resolve } from 'https://deno.land/std/path/mod.ts';
import { generateSchema } from '../schema/generator.ts';

export async function watchConfigFiles(
  configs: { filePath: string; configType: string }[],
) {
  let timer: number | null = null;

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
        const config = configs.find((c) =>
          resolve(Deno.cwd(), c.filePath) === fP
        );
        if (config) {
          await updateSchemaForConfigFile(
            fP,
            config.configType,
          );
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
  console.log(
    `Updating schema for ${filePath} file with config type ${configType}`,
  );

  const modulePath = 'file://' + resolve(Deno.cwd(), filePath);
  const versionedModulePath =
    `${modulePath}?version=${Math.random()}.ts`;
  let configModule = await import(versionedModulePath);

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
  console.log(`Cleared ${schemaFilePath}`);
  console.log(`Start to write into ${schemaFilePath} file`);
  await generateSchema(
    configObject,
    configType,
    schemaFilePath,
  );
  console.log('Done!');
}
