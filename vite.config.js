import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src', // Asosiy papka `src`
  build: {
    outDir: '../dist', // Qurilish natijalari `dist` papkasiga chiqariladi
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'), // Asosiy fayl
        login: path.resolve(__dirname, 'src/login.html'), // Login sahifasi
        signIn:path.resolve(__dirname,'src/sign-in.html'),
        profile:path.resolve(__dirname,'src/profile.html')
      }
    },
    emptyOutDir: true, // `dist` papkasini bo'sh qilish
  },
});
