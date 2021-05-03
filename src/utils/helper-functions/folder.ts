import path from 'path'
import fs from 'fs'

export function* traverseFolder(
  folder: string,
  extension = '.ts',
): Generator<{ folder: string; file: string; path: string }> {
  const folders = fs.readdirSync(folder, { withFileTypes: true }) as fs.Dirent[]
  for (const folderEntry of folders) {
    if (folderEntry.name.includes('node_modules')) {
      // ignore folder
      continue
    }
    const entryPath = path.resolve(folder, folderEntry.name)
    if (folderEntry.isDirectory()) {
      yield* traverseFolder(entryPath, extension)
    } else if (path.extname(entryPath) === extension) {
      yield { folder, file: path.parse(folderEntry.name).name, path: entryPath }
    }
  }
}
