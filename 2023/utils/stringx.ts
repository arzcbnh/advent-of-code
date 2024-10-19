export function splitLines(multiline: string) {
    // Consistent splitting, regardless of carriage return or trailing newline
    return multiline.match(/[^\r\n]+/g);
}
