const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    files: ['src/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: js.configs.recommended.rules
  }
];