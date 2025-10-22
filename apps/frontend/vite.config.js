import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (moduleId) => {
                    if (moduleId.includes('node_modules')) {
                        return moduleId.includes('react') ? 'react' : 'vendor';
                    }
                    return null;
                },
            },
        },
    },
});
