import { fileURLToPath, URL } from 'node:url'

import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

import { defineConfig, loadEnv } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
const path = require('path')

const env = loadEnv('', process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      ...Object.keys(env).reduce((prev, next) => {
        prev[`${next}`] = JSON.stringify(env[next])
        return prev
      }, {})
    }
  },
  plugins: [
    vue2(),
    Components({
      resolvers: [VuetifyResolver()]
    }),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    {
      name: 'sass',
      transform: (code, id) => {
        if (!/\.scss$/.test(id)) return;
        const result = sass.renderSync({ data: code });
        return {
          code: result?.css?.toString() || code,
          map: result?.map?.toString() || '',
        };
      },
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
