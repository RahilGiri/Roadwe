const { defineConfig } = await import('vite');
const react = (await import('@vitejs/plugin-react')).default;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
});
