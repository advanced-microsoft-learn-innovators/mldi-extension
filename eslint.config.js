import pluginSecurity from "eslint-plugin-security";
import babelParser from "@babel/eslint-parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const config = [
  {
    files: ["**/*.ts"],
    plugins: {
      namespace: pluginSecurity,
    },
  },
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                legacy: true,
              },
            ],
            "@babel/plugin-transform-typescript",
          ],
        },
      },
    },
  },
];
export default config;
