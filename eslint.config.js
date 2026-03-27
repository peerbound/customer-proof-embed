import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import preact from "eslint-config-preact";

export default defineConfig([
  globalIgnores(["dist"]),
  ...preact,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
  },
]);
