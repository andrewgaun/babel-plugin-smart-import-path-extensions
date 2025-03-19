import { declare } from '@babel/helper-plugin-utils'
import { type PluginObj, type PluginPass, types } from '@babel/core'
import { existsSync } from 'fs'
import { resolve, extname, dirname } from 'path'
import { type VisitNode } from '@babel/traverse'

const { importDeclaration, stringLiteral } = types

const updateImport = ({
  extensions = ['js', 'ts', 'jsx', 'tsx']
}): VisitNode<PluginPass, types.ImportDeclaration> => {
  return (
    path, { file: { opts: { filename } } }
  ) => {
    const {
      node: {
        source: { value: module },
        specifiers
      }
    } = path

    // if the source isn't relative we don't mess with it
    if (filename === null || filename === undefined || !module.startsWith('.')) {
      return
    }

    const dirPath = resolve(dirname(filename), module)

    // If we see an extension we are expecting, skip our tests
    const hasModuleExt =
      extname(module).length !== 0 && extensions.includes(extname(module))
    if (hasModuleExt) {
      return
    }

    // Can we literally find it?
    const isLiteral = existsSync(dirPath)
    if (isLiteral) {
      return
    }

    const extension = extensions.find(extension =>
      existsSync(`${dirPath}.${extension}`)
    )

    // If we found a valid file, update the path
    if (extension) {
      path.replaceWith(
        importDeclaration(
          ...[specifiers],
          stringLiteral(`${module}.${extension}`)
        )
      )
    }
  }
}

module.exports = declare((api, options): PluginObj => {
  api.assertVersion(7)
  return {
    name: 'smart-import-path-extensions',
    visitor: {
      ImportDeclaration: updateImport(options)
    }
  }
})
