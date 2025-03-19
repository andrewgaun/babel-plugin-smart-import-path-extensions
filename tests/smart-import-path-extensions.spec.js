const pluginTester = require('babel-plugin-tester')

const plugin = require('../index.ts')

pluginTester({
  plugin,
  tests: {
    'should convert relative paths if file exists': {
      code: 'import foo from "./smart-import-path-extensions.spec";',
      output: 'import foo from "./smart-import-path-extensions.spec.js";'
    },
    'should not convert non-relative paths': {
      code: 'import foo from "smart-import-path-extensions.spec";',
      output: 'import foo from "smart-import-path-extensions.spec";'
    },
    'should not convert relative paths if file does not exist': {
      code: 'import foo from "./no-found";',
      output: 'import foo from "./no-found";'
    }
  }
})

pluginTester({
  plugin,
  pluginOptions: { extensions: ['ts', 'json'] },
  tests: {
    'should convert if existing file is in the extensions list': {
      code: 'import foo from "../package";',
      output: 'import foo from "../package.json";'
    },
    'should not convert if existing file is not in the extensions list': {
      code: 'import foo from "./smart-import-path-extensions.spec";',
      output: 'import foo from "./smart-import-path-extensions.spec";'
    }
  }
})
