export const parse = Symbol();

declare global {
    interface String {
        [parse]: (regexp: RegExp) => RegExpExecArray[];
    }
}

String.prototype[parse] = function (regexp: RegExp) {
    return this.matchAll(regexp).toArray();
};
