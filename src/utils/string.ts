export function splitStringAtLength(
  str: string | undefined,
  length: number,
  maxLines: number,
): string[] {
  if (!str || !str.length) return [];

  const words = str.split(' ');
  const lines = [];
  let currentLine = words[0]!;

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < words.length; i++) {
    const word = words[i]!;
    if (currentLine.length + word.length + 1 <= length) {
      currentLine += ` ${words[i]}`;
    } else {
      if (maxLines <= lines.length) {
        break;
      }
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (maxLines <= lines.length) lines.push('...');
  else lines.push(currentLine);

  return lines;
}
