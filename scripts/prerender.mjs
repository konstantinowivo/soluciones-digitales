/**
 * Pre-renderiza la home dentro de dist/index.html.
 * Así Google y las vistas previas de redes ven el contenido completo sin ejecutar JS,
 * y el visitante ve la página antes de que cargue React (luego se hidrata).
 *
 * Además, para la primera pintura en celulares:
 * - incrusta el CSS en el HTML (evita una petición que bloquea el render);
 * - precarga la tipografía latina, que es la única que usa el sitio.
 */
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const distDir = resolve(root, 'dist')
const indexPath = resolve(distDir, 'index.html')
const ssrEntry = resolve(root, 'dist-ssr/entry-server.js')

const { render } = await import(pathToFileURL(ssrEntry).href)
let html = await readFile(indexPath, 'utf8')
const marker = '<div id="root"></div>'

if (!html.includes(marker)) {
  throw new Error('prerender: no se encontró <div id="root"></div> en dist/index.html')
}
html = html.replace(marker, `<div id="root">${render()}</div>`)

// CSS incrustado: <link rel="stylesheet" href="/assets/index-xxx.css"> → <style>…</style>
const cssLink = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(resolve(distDir, `.${cssLink[1]}`), 'utf8')
  html = html.replace(cssLink[0], () => `<style>${css}</style>`)
}

// Precarga de la fuente latina (las demás variantes solo se bajan si hacen falta).
const assets = await readdir(resolve(distDir, 'assets'))
const latinFont = assets.find((file) => /^onest-latin-wght-normal-.*\.woff2$/.test(file))
if (latinFont) {
  html = html.replace(
    '</title>',
    `</title>\n    <link rel="preload" href="/assets/${latinFont}" as="font" type="font/woff2" crossorigin />`,
  )
}

await writeFile(indexPath, html)
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('✓ prerender: dist/index.html generado con contenido estático, CSS incrustado y fuente precargada')
