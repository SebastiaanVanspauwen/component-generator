import fs from 'fs'
import path from 'path'

export async function * getFilesInDirectory (directory: string): AsyncGenerator<string> {
  yield directory
  for (const dirent of await fs.promises.readdir(directory, { withFileTypes: true })) {
    if (dirent.isDirectory()) yield * getFilesInDirectory(path.join(directory, dirent.name))
    else yield path.join(directory, dirent.name)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
async function * empty (): AsyncGenerator<string> {}

export async function readAndReplace (path: string, componentName: string): Promise<string> {
  let data
  await fs.promises.readFile(path, 'utf8').then(async (_data) => {
    data = _data
      .replace(/(Template)/g, componentName)
      .replace(/(template)/g, componentName.toLowerCase())
  })

  return data
}

export async function toArray (iter = empty()): Promise<string[]> {
  const r = []
  for await (const x of iter) r.push(x as never)
  return r
}

export async function createDirectories (paths: string[]): Promise<void> {
  for (const path of paths) await fs.promises.mkdir(path, { recursive: true })
}

export async function writeToFile (path: string, data: string): Promise<void> {
  return await fs.promises.writeFile(path, data)
}
