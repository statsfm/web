export function splitStringAtLength(
  str: string | undefined,
  length: number,
  maxLines: number,
): string[] {
  if (!str || !str.length) return [];

  const words = str.split(' ');
  const lines = [];
  let currentLine = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (currentLine.length + word.length + 1 >= length) {
      lines.push(currentLine);
      currentLine = '';
      if (maxLines <= lines.length) {
        break;
      }
    }

    if (word.indexOf('\n') > 0) {
      const splittedWord = word.split('\n');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < splittedWord.length - 1; i++) {
        currentLine += ` ${splittedWord[i]!}`;
        lines.push(currentLine);
        currentLine = splittedWord[i + 1]!;
      }
    } else currentLine += ` ${word}`;
  }

  if (maxLines <= lines.length) lines.push('...');
  else lines.push(currentLine);

  return lines;
}
