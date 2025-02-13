import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";

export default [
    {
      ignores: ["node_modules/", "dist/"],
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
      },
      plugins: {
        "@typescript-eslint": tsPlugin,
        react: reactPlugin,
      },
      rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
      },
    },
  ];