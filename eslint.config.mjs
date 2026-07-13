import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/*
 * eslint-config-next 16 ships native flat configs (each module default-
 * exports a flat config array), so we spread them directly. The old
 * FlatCompat.extends() path tried to load them as legacy shareable configs
 * and threw on the plugins' circular structure.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
