/** @type {import("prettier").Config} */
export default {
  semi: false,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'none',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/global.css',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}
