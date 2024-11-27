export const parse = Symbol();

declare global {
    interface String {
        [parse]: (regexp: RegExp) => string[];
    }
}

/**
 * Returns an array (rather than an iterator) of all results matching matching
 * this string against a regular expression.
 * @param regexp - The regular expression
 */
String.prototype[parse] = function (regexp) {
    const matches = Array.from(this.matchAll(regexp)).map(match => match[0]);
    return matches;
};
