import nextConfig from "eslint-config-next";

const eslintConfig = [
  // Ignorar componentes generados (shadcn/ui) y hooks legacy antes del resto
  {
    ignores: [
      "frontend/shared/components/ui/**",
      "components/ui/**",
      "hooks/**",
      "coverage/**",
      "coverage-integration/**",
    ],
  },
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    rules: {
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "no-console": "off",
      "prefer-const": "warn",
    },
  },
];

export default eslintConfig;
