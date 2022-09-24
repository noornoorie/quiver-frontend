/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prefer-promise-reject-errors': 'off',
    'vue/multi-word-component-names':'off',
    'vue/no-reserved-component-names': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always'],
    'object-curly-spacing': ['error', 'always']
  }
};
