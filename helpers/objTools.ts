export function replacePair<T extends object>(
  obj: T,
  keyToFind: string,
  valueToReplace: string,
): T {
  let count = 0;

  function replacer(obj: any) {
    for (let [key, value] of Object.entries(obj)) {
      if (key === keyToFind) {
        if (++count > 1) {
          throw new Error(
            `Multiple keys with name ${keyToFind} found`,
          );
        }
        obj[key] = valueToReplace;
      } else if (value !== null && typeof value === 'object') {
        replacer(value);
      }
    }
  }
  const objCopy = JSON.parse(JSON.stringify(obj));
  replacer(objCopy);

  if (count === 0) {
    throw new Error(`Key ${keyToFind} not found`);
  } else if (count > 1) {
    throw new Error(`Multiple keys with name ${keyToFind} found`);
  }
  return objCopy;
}

export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const newObj: any = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    newObj[key] = deepCopy(obj[key]);
  }

  return newObj;
}
