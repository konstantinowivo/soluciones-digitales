/**
 * Pre-renderiza la home dentro de dist/index.html.
 * Así Google y las vistas previas de redes ven el contenido completo sin ejecutar JS,
 * y el visitante ve la página antes de que cargue React (luego se hidrata).
 */
import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const indexPath = resolve(root, 'dist/index.html')
const ssrEntry = resolve(root, 'dist-ssr/entry-server.js')

const { render } = await import(pathToFileURL(ssrEntry).href)
const template = await readFile(indexPath, 'utf8')
const marker = '<div id="root"></div>'

if (!template.includes(marker)) {
  throw new Error('prerender: no se encontró <div id="root"></div> en dist/index.html')
}

await writeFile(indexPath, template.replace(marker, `<div id="root">${render()}</div>`))
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('✓ prerender: dist/index.html generado con contenido estático')
