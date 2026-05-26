const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const jest = require("eslint-plugin-jest");
const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    files: ["**/*.js", "**/*.ts"],

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:eslint-plugin-jest/recommended",
        "eslint-config-prettier",
    ),

    languageOptions: {
        parser: tsParser,

        globals: {
            ...globals.node,
            ...jest.environments.globals.globals,
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
        jest,
    },

    rules: {
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",

        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-ignore": "allow-with-description",
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_",
        }],

        "no-console": "error",
        yoda: "error",

        "prefer-const": ["error", {
            destructuring: "all",
        }],

        "no-control-regex": "off",

        "no-constant-condition": ["error", {
            checkLoops: false,
        }],
    },
}, globalIgnores([".github/*", ".vscode/*", "coverage/*", "dist/*", "node_modules/*"]), {
    files: ["**/*{test,spec}.ts"],

    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "jest/no-standalone-expect": "off",
        "jest/no-conditional-expect": "off",
        "no-console": "off",
    },
}]);
