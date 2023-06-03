export function firstLetterCapitalize(str: string) {
  return str.charAt(0).toUpperCase() +
    str.slice(1);
}

export function pseudoVersion(url: string) {
  return `${url}?version=${Math.random()}`;
}
