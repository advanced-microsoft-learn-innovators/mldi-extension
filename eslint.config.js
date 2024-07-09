import pluginSecurity from "eslint-plugin-security";
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import typescriptEslintParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";

const config = [
  {
    files: ["**/*.ts"],
    plugins: {
      namespace: pluginSecurity,
    },
  },
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        sourceType: "module",
      },
    },
  },
  eslintConfigPrettier,
];
export default config;
