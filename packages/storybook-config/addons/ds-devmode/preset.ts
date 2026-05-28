import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Resolve absolute filesystem paths via import.meta.url(ESM equivalent of __dirname)。
// 不能用 `require.resolve('./preview')`— consumer side(Vite/webpack)走 package
// `exports` map 嚴格驗,raw dist file path 不在 exports → block。
// fileURLToPath + resolve 給 absolute fs path,bundler 走 file:// 直接 load,不過 exports gate。
// Anchor:beta.27/.28/.29/.30 4 連敗,beta.30 ship 後 Netlify 仍 fail
// 「Missing './dist/addons/ds-devmode/preview.js' specifier」— 改 absolute path 修。
const __dirname = dirname(fileURLToPath(import.meta.url))

export const managerEntries = (entry: string[] = []) => [...entry, resolve(__dirname, 'manager.js')]
export const previewAnnotations = (entry: string[] = []) => [...entry, resolve(__dirname, 'preview.js')]
