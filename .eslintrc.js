module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["vue", "ava"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "no-mixed-operators": ["off"],
    "no-console": ["off"],
    "import/no-named-as-default-member": ["off"],
    "import/named": ["off"],
    "import/order": ["off"],
    "import/no-extraneous-dependencies": ["off"],
    "import/no-named-as-default": ["off"],
    "flowtype/require-return-type": ["off"],
    camelcase: [
      1,
      {
        properties: "always"
      }
    ],
    complexity: ["warn", 5],
    "max-nested-callbacks": ["warn", 8],
    "no-unused-vars": "warn",
    "max-statements": [
      "warn",
      {
        max: 4
      }
    ],
    "max-statements-per-line": [
      "warn",
      {
        max: 1
      }
    ],
    "getter-return": "warn",
    "jsx-quotes": ["warn", "prefer-double"]
  },
  extends: ["prettier", "eslint:recommended"],
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React", // Pragma to use, default to "React"
      version: "detect" // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", object: "Object" },
      { property: "myFavoriteWrapper" }
    ]
  }
};
