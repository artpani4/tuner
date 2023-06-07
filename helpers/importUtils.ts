import { jsonify } from './stringUtils.ts';
// async function importFromStringHard(str: string) {
//   try {
//     const tempDir = Deno.makeTempDirSync();
//     const tempFilePath = join(tempDir, 'tempModule.ts');

//     await Deno.writeTextFile(tempFilePath, str);

//     if (await exists(tempFilePath)) {
//       const importedModule = await import(`file://${tempFilePath}`);

//       await Deno.remove(tempDir, { recursive: true });

//       return importedModule;
//     } else {
//       throw new Error(
//         `Failed to write the string to the temporary file: ${tempFilePath}`,
//       );
//     }
//   } catch (error) {
//     console.error('Ошибка при обработке строки:', error);
//     throw error;
//   }
// }

export function importFromString(str: string) {
  return JSON.parse(jsonify(str));
}
