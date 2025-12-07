/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-strongly-recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-non-null-assertion": "warn",
      },
    },
    {
      files: ["*.vue"],
      rules: {
        "vue/multi-word-component-names": "off",
        "vue/no-v-html": "warn",
        "vue/require-default-prop": "off",
        "vue/require-explicit-emits": "error",
        "vue/html-self-closing": [
          "error",
          {
            html: {
              void: "always",
              normal: "always",
              component: "always",
            },
            svg: "always",
            math: "always",
          },
        ],
        "vue/max-attributes-per-line": "off",
        "vue/first-attribute-linebreak": "off",
      },
    },
  ],
  env: {
    browser: true,
    node: true,
    es2023: true,
    "vue/setup-compiler-macros": true,
  },
  rules: {
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-debugger": "error",
    "no-unused-vars": "off", // Используем TypeScript правило вместо этого
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",
  },
};
