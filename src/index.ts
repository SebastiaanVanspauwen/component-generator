#!/usr/bin/env node

import * as fs from 'fs'
// import * as yargs from 'yargs'

function createFolderStructure (name: string): any {
  name = name.toLowerCase()
  const folders = {
    dto: {},
    models: {},
    services: {},
    transformers: {}
  } as unknown as any

  folders.dto = [`create-${name}.dto.ts`, `update-${name}.dto.ts`]
  folders.models = [`${name}.model.ts`]
  folders.services = [`${name}.service.ts`]
  folders.transformers = [`${name}.transformer.ts`]

  return folders
}

function readAndReplace (path: string, componentName: string): string {
  return fs.readFileSync(path, 'utf8')
    .replace(/(Template)/g, componentName)
    .replace(/(template)/g, componentName.toLowerCase())
}

void generate()

function _throw (): never {
  throw new Error('First argument must be a string')
}

async function generate (): Promise<void> {
  const currentDir = process.cwd()
  const componentName = process.argv.slice(2)[0] ?? _throw()
  const lowercase = componentName.toLowerCase()

  const template = `${currentDir}/src/templates`
  const folderPath = `${currentDir}/src/components/${componentName}`

  const structure = createFolderStructure(componentName)

  // Create folders
  for (const key in structure) {
    const folder = structure[key]
    for (const file of folder) {
      fs.mkdirSync(`${folderPath}/${key}`, { recursive: true });


      const filePath = `${folderPath}/${key}/${file}`
      const text = readAndReplace(`${template}/${key}.template.hbs`, componentName)

      fs.writeFileSync(filePath, text)
    }
  }

  const singleFiles = ['controller', 'router', 'middleware']
  for (const file of singleFiles) {
    const filePath = `${folderPath}/${lowercase}.${file}.ts`
    const text = readAndReplace(`${template}/${file}.template.hbs`, componentName)

    fs.writeFileSync(filePath, text)
  }
}
