// @ts-check
import { defineConfig } from 'astro/config';
import noindex from './integrations/noindex.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://up.abushun.com',
  integrations: [noindex()],
});
