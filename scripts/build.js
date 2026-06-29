const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const MarkdownIt = require('markdown-it');

const build = async () => {
  const root = path.join(__dirname, '../');
  const readmePath = path.join(root, 'README.md');
  const outDir = path.join(root, 'public');
  const outPath = path.join(outDir, 'index.html');

  await fsPromises.mkdir(outDir, { recursive: true });

  const md = new MarkdownIt({ html: true });

  const renderPage = (title, contentHtml) => `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 2rem; max-width: 900px; margin: auto; line-height: 1.75; }
    pre { background: #f6f8fa; padding: 1rem; overflow: auto; }
    code { font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${contentHtml}
</body>
</html>`;

  // Build root README
  const markdown = await fsPromises.readFile(readmePath, 'utf8');
  const html = md.render(markdown);
  await fsPromises.writeFile(outPath, renderPage('Evil Huawei - 华为作过的恶', html), 'utf8');
  console.log(`Built public/index.html from README.md`);

  // Helper: copy directory recursively
  const copyDir = async (src, dest) => {
    await fsPromises.mkdir(dest, { recursive: true });
    const entries = await fsPromises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (entry.isFile()) {
        await fsPromises.copyFile(srcPath, destPath);
      }
    }
  };

  // Generate pages for each event directory
  const eventsDir = path.join(root, 'events');
  try {
    const entries = await fsPromises.readdir(eventsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dirName = entry.name;
      const eventDirPath = path.join(eventsDir, dirName);
      // Support README.md or readme.md
      const candidates = [
        path.join(eventDirPath, 'README.md'),
        path.join(eventDirPath, 'readme.md')
      ];
      let content = null;
      for (const c of candidates) {
        try {
          content = await fsPromises.readFile(c, 'utf8');
          break;
        } catch (e) {
          // continue
        }
      }
      const outEventDir = path.join(outDir, 'events', dirName);
      await fsPromises.mkdir(outEventDir, { recursive: true });
      if (content) {
        const rendered = md.render(content);
        const title = `Evil Huawei — ${dirName}`;
        await fsPromises.writeFile(path.join(outEventDir, 'index.html'), renderPage(title, rendered), 'utf8');
        console.log(`Built public/events/${dirName}/index.html`);
      }

      // Copy images/ if present
      const imagesSrc = path.join(eventDirPath, 'images');
      try {
        const stats = await fsPromises.stat(imagesSrc);
        if (stats.isDirectory()) {
          await copyDir(imagesSrc, path.join(outEventDir, 'images'));
          console.log(`Copied images for ${dirName}`);
        }
      } catch (e) {
        // no images
      }
    }
  } catch (e) {
    // events directory not found or empty
  }
};

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
