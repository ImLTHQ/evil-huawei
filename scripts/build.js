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

  const markdown = await fsPromises.readFile(readmePath, 'utf8');
  const md = new MarkdownIt({ html: true });
  const html = md.render(markdown);

  const template = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Evil Huawei - 华为作过的恶</title>
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
${html}
</body>
</html>`;

  await fsPromises.writeFile(outPath, template, 'utf8');
  console.log(`Built public/index.html from README.md`);
};

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
