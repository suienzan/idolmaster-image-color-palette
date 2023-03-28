module.exports = {
  extends: ['xo', 'xo-typescript/space', 'plugin:vue/vue3-recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['vue', '@typescript-eslint'],
  ignorePatterns: ['*.cjs'],
  root: true,
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    'arrow-parens': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
  },
};
