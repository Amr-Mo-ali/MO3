module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  ignorePatterns: [".next/", "out/", "build/", "next-env.d.ts", "__tests__/"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-unescaped-entities": "off",
    "prefer-const": "off",
  },
};
