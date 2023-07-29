import { jsonTree } from 'https://deno.land/x/json_tree/mod.ts';
type ObjectType = { [key: string]: any };

function createSchema(obj: ObjectType): string {
  const schemaFields: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fieldSchema = createFieldSchema(key, value);
    if (key.includes(' ') || key.includes('-')) {
      schemaFields.push(`"${key}": ${fieldSchema}`);
    } else schemaFields.push(`${key}: ${fieldSchema}`);
  }

  const schema = `z.object({\n  ${schemaFields.join(',\n  ')}\n})`;

  return schema;
}

function createFieldSchema(key: string, value: any): string {
  if (value === null || value === undefined) {
    return 'z.literal(null)';
  }
  if (typeof value === 'string') {
    return 'z.string()';
  }

  if (typeof value === 'number') {
    return 'z.number()';
  }

  if (typeof value === 'boolean') {
    return 'z.boolean()';
  }

  if (Array.isArray(value)) {
    if (value.length == 0) {
      return 'z.array(z.any())';
    }
    const arrayItemSchemas = Array.from(
      new Set(value.map((item) => createFieldSchema(`${key}`, item))),
    );

    return arrayItemSchemas.length > 1
      ? `z.array(z.union([${arrayItemSchemas.join(',')}]))`
      : `z.array(${arrayItemSchemas[0]})`;
  }

  if (typeof value === 'object') {
    const objectSchema = createSchema(value);
    return `${objectSchema}`;
  }

  throw new Error(`Type of field '${key}' is not supported`);
}

export async function generateSchema(
  obj: ObjectType,
  variableName: string,
  filePath: string,
): Promise<void> {
  const schema = createSchema(obj);

  const code =
    `export const ${variableName}Schema = ${schema}\n\nexport type ${
      variableName.charAt(0).toUpperCase() + variableName.slice(1)
    } = z.infer<typeof ${variableName}Schema>;`;

  let fileData = '';
  try {
    fileData = await Deno.readTextFile(filePath);
  } catch (error) {
    // file does not exist, create it and add import statement
    await Deno.writeTextFile(
      filePath,
      `import { z } from 'https://deno.land/x/zod/mod.ts';\n\n${code}\n\n${
        jsonTree(obj, false).replace(/^/gm, '//')
      }`,
    );
    return;
  }

  if (fileData.length > 0) {
    if (
      !fileData.includes(
        'import { z } from \'https://deno.land/x/zod/mod.ts\';',
      )
    ) {
      await Deno.writeTextFile(
        filePath,
        `import { z } from 'https://deno.land/x/zod/mod.ts';\n\n${fileData}\n\n${code}\n\n${
          jsonTree(obj, false).replace(/^/gm, '//')
        }`,
      );
    } else {
      await Deno.writeTextFile(
        filePath,
        `${fileData}\n\n${code}\n\n${
          jsonTree(obj, false).replace(/^/gm, '//')
        }`,
      );
    }
  } else {
    await Deno.writeTextFile(filePath, code);
  }
}
