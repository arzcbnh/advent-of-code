export function convertToEnum<E extends Record<string, string | number>>(enumObj: E, value: string): E[keyof E] {
    const key = Object.keys(enumObj).find(key => enumObj[key as keyof E] === value);

    if (key == null) {
        throw new Error(`Value '${value}' cannot be found in enum`);
    }

    return enumObj[key as keyof E];
}
