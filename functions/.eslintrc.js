module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    },
  },
  "root": true,
  "env": {
    "es6": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    quotes: ["error", "double"],
  },
};
