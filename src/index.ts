#!/usr/bin/env node

import path from 'path'
import { createDirectories, getFilesInDirectory, readAndReplace, toArray, writeToFile } from './helpers/file'

void generate()

function _throw (): never {
  throw new Error('First argument must be a string')
}

async function generate (): Promise<void> {
  const componentName = process.argv.slice(2)[0] ?? _throw()
  const templatePath = path.join(__dirname, '/components/Template')
  const templateFiles = (await toArray(getFilesInDirectory(templatePath))).filter(file => file.endsWith('.hbs'))
  const templateFolders = (await toArray(getFilesInDirectory(templatePath))).filter(file => !file.endsWith('.hbs'))

  const newFolder = templateFolders.map(folder => folder.replace(/Template/g, componentName))
  await createDirectories(newFolder)

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  templateFiles.forEach(async file => {
    const newFile = file.replace(/Template/g, componentName).replace(/template/g, componentName.toLowerCase()).replace('.hbs', '.ts')

    const data = await readAndReplace(file, componentName)
    await writeToFile(newFile, data)
  })
}
