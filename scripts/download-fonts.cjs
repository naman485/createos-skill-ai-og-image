const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'src', 'fonts');

// Using OTF files from fontsource which are supported by Satori's opentype.js
const FONTS = [
  {
    name: 'Inter-Regular.otf',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff'
  },
  {
    name: 'Inter-Bold.otf',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff'
  },
  {
    name: 'Inter-ExtraBold.otf',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-800-normal.woff'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = (reqUrl) => {
      const protocol = reqUrl.startsWith('https') ? https : require('http');
      protocol.get(reqUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          request(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode} from ${reqUrl}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

async function main() {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  console.log('Downloading Inter fonts...\n');

  // Clean up any existing font files
  const existingFiles = fs.readdirSync(FONTS_DIR).filter(f => f.startsWith('Inter-'));
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(FONTS_DIR, file));
    console.log(`✗ Removed old ${file}`);
  }

  for (const font of FONTS) {
    const dest = path.join(FONTS_DIR, font.name);

    console.log(`↓ Downloading ${font.name}...`);
    try {
      await downloadFile(font.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ ${font.name} downloaded (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Failed to download ${font.name}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n✓ All fonts ready!');
}

main();
