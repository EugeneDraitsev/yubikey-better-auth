import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [sveltekit(), tailwindcss()],
    server: {
      allowedHosts: [env.BETTER_BASE_URL?.split('//')?.at(-1) || '']
    }
  };
});
