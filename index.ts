import { declare } from '@babel/helper-plugin-utils'
import { type PluginObj, type PluginPass, types } from '@babel/core'
import { readdirSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { type VisitNode } from '@babel/traverse'

const { importDeclaration, stringLiteral } = types

const updateImport = ({
  extensions = ['js', 'ts', 'jsx', 'tsx', 'd.ts']
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

    const fullPath = resolve(dirname(filename), module)
    const dirPath = dirname(fullPath)
    const modulePrefix = basename(module)

    // List all files that match exactly
    const possibleFiles = readdirSync(dirPath).filter(name =>
      name === modulePrefix || name.startsWith(`${modulePrefix}.`))

    // Exact match always wins
    if (possibleFiles.includes(modulePrefix)) {
      return
    }

    let winner: string | null
    if (possibleFiles.length === 1) {
      winner = `${dirname(module)}/${possibleFiles[0]}`
    } else {
      winner = extensions.filter(ext =>
        possibleFiles.includes(`${modulePrefix}.${ext}`)
      )?.[0]
      winner = winner !== undefined ? `${module}.${winner}` : null
    }

    // If we found a valid file, update the path
    if (winner !== null) {
      path.replaceWith(
        importDeclaration(
          ...[specifiers],
          stringLiteral(`${winner}`)
        )
      )
    } else {
      console.warn(`Failed to find a good match for prefix ${fullPath}`)
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
