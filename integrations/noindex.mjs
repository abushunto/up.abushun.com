import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

async function injectNoindex(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await injectNoindex(fullPath);
    } else if (entry.name.endsWith('.html')) {
      let content = await readFile(fullPath, 'utf-8');
      if (content.includes('name="robots"')) continue;
      const meta = '<meta name="robots" content="noindex">';
      if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>\n    ${meta}`);
      } else if (content.includes('<HEAD>')) {
        content = content.replace('<HEAD>', `<HEAD>\n    ${meta}`);
      } else if (/<html[^>]*>/i.test(content)) {
        content = content.replace(/(<html[^>]*>)/i, `$1\n<head>\n    ${meta}\n</head>`);
      } else {
        content = `${meta}\n${content}`;
      }
      await writeFile(fullPath, content);
    }
  }
}

export default function noindexIntegration() {
  return {
    name: 'astro-noindex',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distPath = fileURLToPath(dir);
        await injectNoindex(distPath);
        console.log('[astro-noindex] Injected noindex meta tag into all HTML files.');
      },
    },
  };
}
