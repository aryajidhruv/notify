
import { defineConfig } from "vite";          
import react from "@vitejs/plugin-react";     
import tailwindcss from "@tailwindcss/vite";  

export default defineConfig({

  plugins: [react(), tailwindcss()],

 
  server: {
   
    proxy: {
     
      "/api": {
        // ... is forwarded to your real backend.
        // Example: your code calls /api/v1/auth/signin
        // and Vite sends it to https://notifyme.fastapicloud.dev/api/v1/auth/signin
       
        target: "https://notifyme.fastapicloud.dev",

        
        changeOrigin: true,


        secure: true,
      },
    },
  },
});