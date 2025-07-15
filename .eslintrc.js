
module.exports = {
  rules: {
    'vue/multi-word-component-names': 'off',
    "vue/no-mutating-props": ["error", {
      "shallowOnly": false
    }],
    "@typescript-eslint/no-explicit-any": ["off"]
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  }
}
