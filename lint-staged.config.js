export default {
  "*": "prettier --ignore-unknown --write",
  "*.{ts,tsx}": [
    "eslint --report-unused-disable-directives --max-warnings=0",
    () => "tsc -p tsconfig.json --noEmit",
  ],
};
