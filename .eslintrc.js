module.exports = {
  "extends": "standard",
  "parser": "babel-eslint",
  "globals": {
    "browser": false,
    "i18n": false,
    "describe": true,
    "test": true,
    "expect": true,
    "HTMLSelectElement": true,
    "HTMLInputElement": true,
    "HTMLButtonElement": true,
    "MouseEvent": true,
    "HTMLElement": true,
    "Event": true,
    "asmCrypto": true,
    "jest": true,
  },
  "rules": {
    "comma-dangle": ["error", "always-multiline"],
    "indent": ["error", 2, {
      "MemberExpression": "off",
      "SwitchCase": 1,
    }]
  }
};
