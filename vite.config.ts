import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
  },
  define: {
    // Set NODE_ENV based on Vite mode
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
  plugins: [
    remix({
      future: {
        v3_singleFetch: true,
      },
    }),
    netlifyPlugin(),
    tsconfigPaths(),
  ],
}));