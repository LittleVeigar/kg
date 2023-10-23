import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            less: {}
        }
    },
    optimizeDeps: {
        include: [
            'vue',
            'vue-router',
            '@vueuse/core',
            'element-plus',
            'jwt-decode',
        ]
    }
})