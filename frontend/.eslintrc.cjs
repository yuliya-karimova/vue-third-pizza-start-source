/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript",   // Vue + TS связка
    "@vue/eslint-config-prettier"      // гасит конфликтующие правила форматирования
  ],
  parser: "vue-eslint-parser",         // главный парсер .vue
  parserOptions: {
    parser: "@typescript-eslint/parser", // внутренний парсер для <script lang="ts">
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
    // project: ["./tsconfig.json"],     // включай, если нужен type-aware lint
  },
  overrides: [
    { files: ["*.ts", "*.tsx"], parser: "@typescript-eslint/parser" },
  ],
  env: {
    browser: true,
    node: true,
    es2023: true,
    "vue/setup-compiler-macros": true, // defineProps/defineEmits и т.п.
  },
};
