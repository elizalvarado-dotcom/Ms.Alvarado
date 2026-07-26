// Firebase Hosting always serves a physically-existing index.html for "/"
// before it ever evaluates rewrites. Since both hosting sites (Algebra
// World and Money Matters) build from the same Vite output, Money Matters
// needs its own copy of dist/ where financial-literacy.html has been
// promoted to index.html, so its root URL actually serves that page
// instead of falling through to the Algebra World shell.
import { cpSync, copyFileSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(rootDir, 'dist')
const mmDir = path.join(rootDir, 'dist-moneymatters')

if (!existsSync(distDir)) {
  console.error('dist/ not found — run `vite build` first.')
  process.exit(1)
}

rmSync(mmDir, { recursive: true, force: true })
cpSync(distDir, mmDir, { recursive: true })
copyFileSync(path.join(mmDir, 'financial-literacy.html'), path.join(mmDir, 'index.html'))

console.log('Built dist-moneymatters/ (financial-literacy.html -> index.html)')
