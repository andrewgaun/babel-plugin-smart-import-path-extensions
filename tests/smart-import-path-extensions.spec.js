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
    },
    'should prefer exact paths over extensions': {
      code: 'import foo from "./exact-test/empty";',
      output: 'import foo from "./exact-test/empty";'
    },
    'should keep extension if included': {
      code: 'import foo from "./exact-test/empty.js";',
      output: 'import foo from "./exact-test/empty.js";'
    }
  }
})

pluginTester({
  plugin,
  pluginOptions: { extensions: ['b', 'a'] },
  tests: {
    'should convert if only a single match exist': {
      code: 'import foo from "../package";',
      output: 'import foo from "../package.json";'
    },
    'should prioritize based on extensions order': {
      code: 'import foo from "./priority-test/empty";',
      output: 'import foo from "./priority-test/empty.b";'
    }
  }
})
