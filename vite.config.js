import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import glsl from 'vite-plugin-glsl'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// GitHub Pages has no SPA rewrite, so reloading a client-side route 404s.
// Emitting a copy of index.html as 404.html makes Pages fall back to the app,
// which then renders the correct route from the URL.
function githubPagesSpaFallback() {
    let outDir
    return {
        name: 'github-pages-spa-fallback',
        apply: 'build',
        configResolved(config) {
            outDir = config.build.outDir
        },
        closeBundle() {
            copyFileSync(
                resolve(outDir, 'index.html'),
                resolve(outDir, '404.html')
            )
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    base: '/terrarium/',
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        glsl(),
        githubPagesSpaFallback(),
    ],
    server: {
        host: true, // Open to local network and display URL
        open: !(
            // eslint-disable-next-line no-undef
            'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env
        ), // Open if it's not a CodeSandbox
    },
})
