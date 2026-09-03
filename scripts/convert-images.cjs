const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const IMAGES = [
  {
    name: 'logo.webp',
    url: 'https://i.postimg.cc/nck9qgG5/481456887-122109905270769501-305987371640573178-n.jpg'
  },
  {
    name: 'hero-1.webp',
    url: 'https://i.postimg.cc/hvSh7Y9d/a1.jpg'
  },
  {
    name: 'hero-2.webp',
    url: 'https://i.postimg.cc/zvJ3RQnW/a2.jpg'
  },
  {
    name: 'hero-3.webp',
    url: 'https://i.postimg.cc/6q9TGPdG/a3.jpg'
  },
  {
    name: 'service-d.webp',
    url: 'https://i.postimg.cc/PJtN87m1/a4.webp'
  },
  {
    name: 'service-e.webp',
    url: 'https://i.postimg.cc/cCjXXLfb/profile.jpg'
  },
  {
    name: 'project-1.webp',
    url: 'https://i.postimg.cc/3JxhTmGp/5.jpg'
  },
  {
    name: 'project-2.webp',
    url: 'https://i.postimg.cc/7YZ4k0z5/4.jpg'
  },
  {
    name: 'project-3.webp',
    url: 'https://i.postimg.cc/FsHv43Sk/1.jpg'
  },
  {
    name: 'project-4.webp',
    url: 'https://i.postimg.cc/RVZmBKtH/6.jpg'
  },
  {
    name: 'project-5.webp',
    url: 'https://i.postimg.cc/7YZ4k0zf/2.jpg'
  },
  {
    name: 'project-7.webp',
    url: 'https://i.postimg.cc/qMvrTyKt/3.jpg'
  },
  {
    name: 'project-8.webp',
    url: 'https://i.postimg.cc/PJg34qjs/z7663426044776-98bf6a02c1a18fcfcf09e8d2fc318823.jpg'
  },
  {
    name: 'testimonial-1.webp',
    url: 'https://i.postimg.cc/jdDjYvFH/z7250626038588-9609156227994e32d1287f4c993be365.jpg'
  },
  {
    name: 'testimonial-2.webp',
    url: 'https://i.postimg.cc/cC4r3ST4/z7250619915601-1472cd80a1fa1350a741ccdf037f80e9.jpg'
  },
  {
    name: 'testimonial-3.webp',
    url: 'https://i.postimg.cc/jSJCPv6b/z7250621981768-1c1edfce4e0eb14645a91f2493b25893.jpg'
  },
  {
    name: 'about-1.webp',
    url: 'https://i.postimg.cc/Wb8YrJPS/ava.jpg'
  },
  {
    name: 'about-2.webp',
    url: 'https://i.postimg.cc/J4xYJBWP/ava2.jpg'
  }
];

const targetDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} (status: ${res.statusCode})`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading and converting images to WebP...');
  let totalOrig = 0;
  let totalWebp = 0;

  for (const item of IMAGES) {
    try {
      const origBuffer = await fetchBuffer(item.url);
      totalOrig += origBuffer.length;

      const webpBuffer = await sharp(origBuffer)
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      totalWebp += webpBuffer.length;

      const outPath = path.join(targetDir, item.name);
      fs.writeFileSync(outPath, webpBuffer);

      console.log(`✓ ${item.name}: ${(origBuffer.length / 1024).toFixed(1)} KB -> ${(webpBuffer.length / 1024).toFixed(1)} KB (-${((1 - webpBuffer.length / origBuffer.length) * 100).toFixed(1)}%)`);
    } catch (err) {
      console.error(`✗ Error converting ${item.name} (${item.url}):`, err.message);
    }
  }

  console.log(`\nAll done! Total: ${(totalOrig / 1024).toFixed(1)} KB -> ${(totalWebp / 1024).toFixed(1)} KB (Saved ${((1 - totalWebp / totalOrig) * 100).toFixed(1)}%)`);
}

run();
