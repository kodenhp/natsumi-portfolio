import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()

const htmlFiles = [
  ...readdirSync(root)
    .filter((file) => file.endsWith('.html'))
    .map((file) => resolve(root, file)),

  ...readdirSync(resolve(root, 'lower'))
    .filter((file) => file.endsWith('.html'))
    .map((file) => resolve(root, 'lower', file)),
]

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
})