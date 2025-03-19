# babel-plugin-smart-import-path-extensions
Babel plugin to correctly add missing file extensions to import statements

## Example
Assume we have these three files: `./foo.tsx`, `./foobar.js`, and 
```ts
// bar.ts
import foo from './foo'
import { foobar } from './foobar'
import React from 'react'
import { no } from './does-not-exist' // This files does not exist
```

Using the default configuration of this plugin, the imports in `bar.ts` will be converted to:
```ts
// bar.ts
import foo from './foo.tsx'
import { foobar } from './foobar.js'
import React from 'react'
import { no } from './does-not-exist' // This files does not exist
```

## Installation

### Basic Usage
For cases where you only need to check for the file extentions `['js', 'ts', 'jsx', 'tsx']`, you can simply add `smart-import-path-extensions` to your `.babelrc` file:

```json
{
    "plugins": ["smart-import-path-extensions"]
}
```

### With Extensions option
Passing the  `['js', 'ts', 'jsx', 'tsx']`, you can simply add `smart-import-path-extensions` to your `.babelrc` file:

```json
{
    "plugins": ["smart-import-path-extensions", {"extensions": ["js","jsx","json"]}]
}
```

## Testing

`npm test`