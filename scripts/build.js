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

  const renderPage = (title, contentHtml, opts = {}) => {
    const showHeader = opts.showHeader !== false;
    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: dark;
      color: #0f172a;
      background: #f8fafc;
      font-family: Inter, "Noto Sans SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 16px;
      line-height: 1.72;
      text-rendering: optimizeLegibility;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      background: radial-gradient(circle at top, rgba(59,130,246,.12), transparent 36%), #f8fafc;
    }

    body {
      color: #0f172a;
      padding: 1.5rem;
    }

    .page-shell {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem 1.5rem 2rem;
      background: #ffffff;
      border: 1px solid rgba(15,23,42,.06);
      border-radius: 28px;
      box-shadow: 0 28px 80px rgba(15,23,42,.08);
    }

    .site-header {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(15,23,42,.08);
    }

    .site-header .eyebrow {
      margin: 0 0 .25rem;
      font-size: .9rem;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: #2563eb;
    }

    .site-header h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.05;
    }

    .site-description {
      margin: .75rem 0 0;
      max-width: 45rem;
      color: #475569;
      font-size: 1rem;
    }

    main {
      margin-top: 1rem;
    }

    h1, h2, h3, h4 {
      color: #0f172a;
      scroll-margin-top: 1rem;
    }

    h1 {
      font-size: clamp(2.1rem, 4vw, 3rem);
      margin-top: 1.5rem;
    }

    h2 {
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      margin-top: 2rem;
    }

    p {
      color: #334155;
      margin: 1rem 0 1.25rem;
    }

    ul, ol {
      margin: 1rem 0 1.5rem;
      padding-left: 1.5rem;
      color: #334155;
    }

    ul li, ol li {
      margin: .55rem 0;
    }

    ul.index-list {
      display: grid;
      gap: 1rem;
      list-style: none;
      margin: 1rem 0 1.5rem;
      padding: 0;
    }

    ul.index-list > li {
      padding: 1rem 1.25rem;
      background: #f8fafc;
      border: 1px solid rgba(15,23,42,.08);
      border-radius: 18px;
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    }

    ul.index-list > li:hover {
      transform: translateY(-2px);
      border-color: rgba(37,99,235,.25);
      box-shadow: 0 20px 35px rgba(15,23,42,.08);
    }

    a {
      color: #1d4ed8;
      text-decoration: none;
      transition: color .2s ease;
    }

    a:hover,
    a:focus-visible {
      color: #2563eb;
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1.5rem auto;
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(15,23,42,.08);
    }

    pre {
      background: #111827;
      color: #f8fafc;
      padding: 1.15rem 1rem;
      border-radius: 16px;
      overflow-x: auto;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
      margin: 1.5rem 0;
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: #0f172a;
      background: rgba(15,23,42,.06);
      padding: .25rem .45rem;
      border-radius: .5rem;
    }

    blockquote {
      margin: 1.5rem 0;
      border-left: 4px solid rgba(37,99,235,.35);
      padding: 1rem 1.25rem;
      color: #475569;
      background: #f8fafc;
      border-radius: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      box-shadow: 0 0 0 1px rgba(15,23,42,.08);
    }

    th, td {
      padding: .85rem 1rem;
      border-bottom: 1px solid rgba(15,23,42,.08);
      text-align: left;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
    }

    .site-footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(15,23,42,.08);
      color: #6b7280;
      font-size: .95rem;
      display: flex;
      flex-wrap: wrap;
      gap: .75rem;
      justify-content: space-between;
    }

    .site-footer a {
      color: #475569;
    }

    @media (max-width: 720px) {
      body {
        padding: 1rem;
      }

      .page-shell {
        padding: 1.25rem;
      }

      .site-footer {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="page-shell">
    ${showHeader ? `<header class="site-header">
      <div>
        <p class="eyebrow">Evil Huawei</p>
        <h1>华为作过的恶</h1>
        <p class="site-description">收集并记录华为负面事件，保持对关键历史的关注。</p>
      </div>
    </header>` : ''}
    <main>${contentHtml}</main>
    <footer class="site-footer">
      <span>本网站由社区维护，旨在记录华为相关负面事件。</span>
      <a href="https://github.com/evil-huawei/evil-huawei">查看项目仓库</a>
    </footer>
  </div>
</body>
</html>`;
  };

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
        await fsPromises.writeFile(path.join(outEventDir, 'index.html'), renderPage(title, rendered, { showHeader: false }), 'utf8');
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
