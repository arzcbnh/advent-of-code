import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
        },
    },
    { languageOptions: { globals: { ...globals.node } } },
    { ignores: ["build"] },
];
