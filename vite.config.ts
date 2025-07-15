import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver, ArcoResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    AutoImport({
      imports: [
        'vue',
      ],
      resolvers: [ArcoResolver()]
    }),
    Components({
      resolvers: [NaiveUiResolver(), ArcoResolver()]
    }),
    viteCompression({
      algorithm: 'gzip', // 压缩算法，可选 'gzip' 或 'brotliCompress'
      ext: '.gz',        // 生成的压缩包后缀
      threshold: 102400,  // 只有大于此值的文件才会被压缩（单位：字节）
      deleteOriginFile: false, // 压缩后是否删除源文件
      verbose: true,     // 是否在控制台显示压缩结果
      disable: false,    // 是否禁用
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '--arcoblue-6': '#646CFF',
        },
        javascriptEnabled: true,
      }
    },
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ]
    },

  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              test: /node_modules\/vue/,
              name: 'vue',
            },
            {
              test: /node_modules\/@arco-deigin/,
              name: 'arco-deigin',
            },
            {
              test: /node_modules\/echarts/,
              name: 'echarts',
            },
            {
              test: /node_modules\/echarts/,
              name: 'echarts',
            },
          ],
        },
      },
      plugins: [visualizer()]
    },
  },
})
