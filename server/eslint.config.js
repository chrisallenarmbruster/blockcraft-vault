import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Add your rules here
    },
  },
];
