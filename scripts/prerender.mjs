import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '../dist-ssr/entry-server.js';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(projectRoot, 'dist');
const template = await readFile(join(distDir, 'index.html'), 'utf8');

const routes = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/pricing',
  '/blog',
  '/blog/checklist-to-chuc-su-kien',
  '/blog/chi-phi-to-chuc-hoi-nghi',
  '/blog/cach-chon-man-hinh-led',
  '/blog/quy-trinh-livestream-su-kien',
  '/blog/loi-thuong-gap-khi-tu-to-chuc-su-kien',
  '/blog/lam-viec-voi-agency-su-kien',
  '/contact',
  '/privacy',
  '/404'
];

for (const route of routes) {
  const { html, head } = render(route);
  const document = template
    .replace(/<!--seo-fallback-start-->[\s\S]*?<!--seo-fallback-end-->/, () => head)
    .replace(
      /<div id="root">[\s\S]*?<\/div>\s*<div class="bg-tech-grid"><\/div>/,
      () => `<div id="root" data-prerendered="true">${html}</div>`
    );
  const outputPath = route === '/'
    ? join(distDir, 'index.html')
    : join(distDir, `${route.slice(1)}.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, document, 'utf8');
}

console.log(`Prerendered ${routes.length} routes.`);
