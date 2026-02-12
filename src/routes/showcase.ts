import type { Request, Response } from 'express';
import { getAllTemplates } from '../templates/index.js';

export function handleShowcase(_req: Request, res: Response): void {
  const templates = getAllTemplates();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI OG Image Generator - Showcase</title>
  <meta name="description" content="Generate beautiful Open Graph images from text — try it live!">
  <meta property="og:title" content="AI OG Image Generator">
  <meta property="og:description" content="Generate beautiful Open Graph images from text — one API call, zero design skills.">
  <meta property="og:image" content="/api/generate?template=gradient&title=AI+OG+Image+Generator&subtitle=One+API+call,+zero+design+skills">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
      color: #c9d1d9;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    header { text-align: center; margin-bottom: 48px; }
    h1 {
      font-size: 3rem;
      color: #f0f6fc;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tagline { font-size: 1.25rem; color: #8b949e; margin-bottom: 24px; }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: #238636;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 48px;
    }
    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
      h1 { font-size: 2rem; }
    }
    .panel {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 24px;
    }
    .panel h2 { color: #f0f6fc; margin-bottom: 20px; font-size: 1.25rem; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 6px; color: #8b949e; font-size: 0.9rem; }
    input, select, textarea {
      width: 100%;
      padding: 10px 14px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #c9d1d9;
      font-size: 1rem;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #58a6ff;
    }
    textarea { resize: vertical; min-height: 80px; }
    .color-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .color-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-input input[type="color"] {
      width: 40px;
      height: 40px;
      padding: 2px;
      cursor: pointer;
    }
    .color-input input[type="text"] {
      flex: 1;
    }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .preview-container {
      position: relative;
      background: #0d1117;
      border-radius: 8px;
      overflow: hidden;
      min-height: 315px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .preview-container img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .loading {
      position: absolute;
      inset: 0;
      background: rgba(13, 17, 23, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #58a6ff;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #30363d;
      border-top-color: #58a6ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .actions a, .actions button {
      flex: 1;
      text-align: center;
      text-decoration: none;
      padding: 12px;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    .actions .secondary {
      background: #21262d;
      border: 1px solid #30363d;
    }
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .template-btn {
      padding: 12px;
      background: #21262d;
      border: 2px solid transparent;
      border-radius: 8px;
      color: #c9d1d9;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    .template-btn:hover { border-color: #30363d; }
    .template-btn.active { border-color: #58a6ff; background: #388bfd22; }
    .template-btn .name { font-weight: 600; color: #f0f6fc; }
    .template-btn .desc { font-size: 0.75rem; color: #8b949e; margin-top: 4px; }
    .code-block {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;
      overflow-x: auto;
    }
    .code-block code {
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 0.85rem;
      color: #c9d1d9;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .copy-btn {
      float: right;
      padding: 4px 12px;
      background: #21262d;
      border: 1px solid #30363d;
      font-size: 0.8rem;
      width: auto;
    }
    footer {
      text-align: center;
      padding: 40px 20px;
      border-top: 1px solid #21262d;
      color: #8b949e;
    }
    footer a { color: #58a6ff; text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>⚡ AI OG Image Generator</h1>
      <p class="tagline">Generate beautiful Open Graph images from text — one API call, zero design skills.</p>
      <span class="badge">10 credits per request ($0.10)</span>
    </header>

    <div class="grid">
      <div class="panel">
        <h2>Configure Your Image</h2>

        <div class="form-group">
          <label>Template</label>
          <div class="templates-grid" id="templates">
            ${templates.map(t => `
              <button type="button" class="template-btn${t.id === 'gradient' ? ' active' : ''}" data-template="${t.id}">
                <div class="name">${t.name}</div>
                <div class="desc">${t.description.split(' ').slice(0, 4).join(' ')}...</div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label for="title">Title *</label>
          <input type="text" id="title" value="My Awesome Blog Post" maxlength="100">
        </div>

        <div class="form-group">
          <label for="subtitle">Subtitle</label>
          <input type="text" id="subtitle" value="How I built something amazing" maxlength="200">
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input type="text" id="author" placeholder="Your name">
        </div>

        <div class="form-group">
          <label>Theme Colors</label>
          <div class="color-row">
            <div class="color-input">
              <input type="color" id="bgColor" value="#667eea">
              <input type="text" id="bgColorText" value="#667eea" placeholder="Background">
            </div>
            <div class="color-input">
              <input type="color" id="fgColor" value="#ffffff">
              <input type="text" id="fgColorText" value="#ffffff" placeholder="Text">
            </div>
            <div class="color-input">
              <input type="color" id="accentColor" value="#fbbf24">
              <input type="text" id="accentColorText" value="#fbbf24" placeholder="Accent">
            </div>
          </div>
        </div>

        <button onclick="generateImage()" id="generateBtn">Generate Image</button>
      </div>

      <div class="panel">
        <h2>Preview</h2>
        <div class="preview-container" id="previewContainer">
          <div class="loading" id="loading" style="display: none;">
            <div class="spinner"></div>
          </div>
          <img id="preview" src="/api/generate?template=gradient&title=My+Awesome+Blog+Post&subtitle=How+I+built+something+amazing" alt="OG Image Preview">
        </div>
        <div class="actions">
          <a href="#" id="downloadBtn" class="secondary" download="og-image.png">Download PNG</a>
          <button onclick="copyUrl()" class="secondary">Copy URL</button>
        </div>

        <div class="code-block">
          <button onclick="copyCode()" class="copy-btn">Copy</button>
          <code id="codeSnippet">&lt;meta property="og:image" content="${getBaseUrl()}/api/generate?template=gradient&amp;title=My+Awesome+Blog+Post&amp;subtitle=How+I+built+something+amazing" /&gt;</code>
        </div>
      </div>
    </div>

    <footer>
      <p>⚡ Powered by <a href="https://createos.nodeops.network">CreateOS</a> | <a href="/docs">API Docs</a> | <a href="/mcp-tool.json">MCP Tool</a></p>
    </footer>
  </div>

  <script>
    let currentTemplate = 'gradient';
    const baseUrl = window.location.origin;

    // Sync color inputs
    document.querySelectorAll('input[type="color"]').forEach(picker => {
      const textInput = document.getElementById(picker.id + 'Text');
      picker.addEventListener('input', () => textInput.value = picker.value);
      textInput.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
          picker.value = textInput.value;
        }
      });
    });

    // Template selection
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTemplate = btn.dataset.template;
        generateImage();
      });
    });

    function buildUrl() {
      const params = new URLSearchParams();
      params.set('template', currentTemplate);
      params.set('title', document.getElementById('title').value || 'Untitled');

      const subtitle = document.getElementById('subtitle').value;
      if (subtitle) params.set('subtitle', subtitle);

      const author = document.getElementById('author').value;
      if (author) params.set('author', author);

      params.set('background', document.getElementById('bgColorText').value);
      params.set('foreground', document.getElementById('fgColorText').value);
      params.set('accent', document.getElementById('accentColorText').value);

      return baseUrl + '/api/generate?' + params.toString();
    }

    function generateImage() {
      const url = buildUrl();
      const preview = document.getElementById('preview');
      const loading = document.getElementById('loading');
      const downloadBtn = document.getElementById('downloadBtn');
      const codeSnippet = document.getElementById('codeSnippet');

      loading.style.display = 'flex';

      const img = new Image();
      img.onload = () => {
        preview.src = url;
        loading.style.display = 'none';
        downloadBtn.href = url;
        codeSnippet.textContent = '<meta property="og:image" content="' + url.replace(/&/g, '&amp;') + '" />';
      };
      img.onerror = () => {
        loading.style.display = 'none';
        alert('Failed to generate image. Please try again.');
      };
      img.src = url;
    }

    function copyUrl() {
      navigator.clipboard.writeText(buildUrl()).then(() => {
        alert('URL copied to clipboard!');
      });
    }

    function copyCode() {
      const code = document.getElementById('codeSnippet').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
      });
    }

    // Auto-generate on input change (debounced)
    let timeout;
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(generateImage, 500);
      });
    });
  </script>
</body>
</html>`;

  function getBaseUrl(): string {
    return ''; // Will use relative URL
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
