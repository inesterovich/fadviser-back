module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-unused-expressions': 'off',
    'no-useless-constructor': 'off',
    'max-classes-per-file': ['error', 6],
    'no-return-assign': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-return-await': 'off',
  },
};
