import { defineConfig } from 'astro/config';
import { cpSync } from 'fs';

const repo = process.env.GITHUB_REPOSITORY;
const [owner, name] = repo ? repo.split('/') : [null, null];

export default defineConfig({
  site: owner ? `https://${owner}.github.io` : 'http://localhost:4321',
  base: name ? `/${name}` : undefined,
  vite: {
    plugins: [{
      name: 'copy-themes',
      configResolved() {
        cpSync('src/styles/themes', 'public/themes', { recursive: true });
      }
    }]
  }
});