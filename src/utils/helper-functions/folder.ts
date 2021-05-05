import path from 'path'
import fs from 'fs'

export function* traverseFolder(
  folder: string,
  extensions = ['.ts', '.js'],
): Generator<{ folder: string; file: string; path: string }> {
  const folders = fs.readdirSync(folder, { withFileTypes: true }) as fs.Dirent[]
  for (const folderEntry of folders) {
    const entryPath = path.resolve(folder, folderEntry.name)
    if (folderEntry.isDirectory()) {
      yield* traverseFolder(entryPath, extensions)
    } else if (extensions.includes(path.extname(entryPath))) {
      yield { folder, file: path.parse(folderEntry.name).name, path: entryPath }
    }
  }
}
