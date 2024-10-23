export const parse = Symbol();

declare global {
    interface String {
        [parse]: (regexp: RegExp) => RegExpExecArray[];
    }
}

/**
 * Returns an array (rather than an iterator) of all results matching matching
 * this string against a regular expression.
 * @param regexp - The regular expression
 */
String.prototype[parse] = function (regexp: RegExp) {
    return this.matchAll(regexp).toArray();
};
