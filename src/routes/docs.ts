import type { Request, Response } from 'express';
import { getAllTemplates } from '../templates/index.js';

export function handleDocs(_req: Request, res: Response): void {
  const templates = getAllTemplates();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI OG Image Generator - API Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      line-height: 1.6;
      padding: 40px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #f0f6fc; margin-bottom: 8px; font-size: 2.5rem; }
    .tagline { color: #8b949e; font-size: 1.2rem; margin-bottom: 40px; }
    h2 { color: #f0f6fc; margin: 40px 0 20px; border-bottom: 1px solid #21262d; padding-bottom: 8px; }
    h3 { color: #58a6ff; margin: 24px 0 12px; }
    p { margin-bottom: 16px; }
    code {
      background: #161b22;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 0.9em;
    }
    pre {
      background: #161b22;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
      border: 1px solid #30363d;
    }
    pre code { padding: 0; background: none; }
    .endpoint {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .method {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.85rem;
      margin-right: 12px;
    }
    .method.post { background: #238636; color: #fff; }
    .method.get { background: #1f6feb; color: #fff; }
    .path { font-family: 'SF Mono', Monaco, monospace; color: #f0f6fc; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #21262d;
    }
    th { color: #8b949e; font-weight: 600; }
    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }
    .template-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
    }
    .template-card h4 { color: #58a6ff; margin-bottom: 8px; }
    .template-card p { font-size: 0.9rem; color: #8b949e; margin: 0; }
    .try-it {
      display: inline-block;
      margin-top: 12px;
      color: #58a6ff;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .try-it:hover { text-decoration: underline; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      background: #388bfd33;
      color: #58a6ff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ AI OG Image Generator</h1>
    <p class="tagline">Generate beautiful Open Graph images from text — one API call, zero design skills.</p>

    <h2>Quick Start</h2>
    <pre><code>curl -X POST https://production-ai-og-image.tyzo.nodeops.app/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "template": "gradient",
    "title": "My Awesome Blog Post",
    "subtitle": "How I built something cool"
  }' --output og-image.png</code></pre>

    <h2>Endpoints</h2>

    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/generate</span>
      <p style="margin-top: 12px;">Generate an OG image from a template + text parameters.</p>

      <h4 style="color: #8b949e; margin-top: 16px;">Request Body</h4>
      <table>
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td><code>template</code></td><td>string</td><td>No</td><td>Template ID (default: gradient)</td></tr>
        <tr><td><code>title</code></td><td>string</td><td>Yes</td><td>Main title text</td></tr>
        <tr><td><code>subtitle</code></td><td>string</td><td>No</td><td>Secondary text</td></tr>
        <tr><td><code>theme</code></td><td>object</td><td>No</td><td>Custom colors</td></tr>
        <tr><td><code>dimensions</code></td><td>object</td><td>No</td><td>Custom size (default: 1200x630)</td></tr>
        <tr><td><code>format</code></td><td>string</td><td>No</td><td>png or svg (default: png)</td></tr>
      </table>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/generate</span>
      <p style="margin-top: 12px;">Same as POST but with query parameters. Perfect for direct use in <code>&lt;meta&gt;</code> tags.</p>
      <pre><code>/api/generate?template=gradient&title=Hello+World&subtitle=My+first+OG+image</code></pre>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/templates</span>
      <p style="margin-top: 12px;">List all available templates with their required fields.</p>
    </div>

    <h2>Templates</h2>
    <div class="template-grid">
      ${templates
        .map(
          t => `
        <div class="template-card">
          <h4>${t.name}</h4>
          <span class="badge">${t.id}</span>
          <p>${t.description}</p>
          <a href="/api/generate?template=${t.id}&title=Preview&subtitle=This+is+the+${t.id}+template" class="try-it" target="_blank">Preview →</a>
        </div>
      `
        )
        .join('')}
    </div>

    <h2>Theme Options</h2>
    <table>
      <tr><th>Property</th><th>Type</th><th>Default</th></tr>
      <tr><td><code>background</code></td><td>string</td><td>linear-gradient(135deg, #667eea 0%, #764ba2 100%)</td></tr>
      <tr><td><code>foreground</code></td><td>string</td><td>#ffffff</td></tr>
      <tr><td><code>accent</code></td><td>string</td><td>#fbbf24</td></tr>
    </table>

    <h2>MCP Integration</h2>
    <p>This API is auto-discoverable by AI agents via MCP:</p>
    <pre><code>GET /mcp-tool.json</code></pre>

    <h2>Error Codes</h2>
    <table>
      <tr><th>Code</th><th>Description</th></tr>
      <tr><td><code>INVALID_TEMPLATE</code></td><td>Unknown template ID</td></tr>
      <tr><td><code>INVALID_INPUT</code></td><td>Missing required fields</td></tr>
      <tr><td><code>RENDER_ERROR</code></td><td>Internal rendering failure</td></tr>
    </table>

    <footer style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #21262d; color: #8b949e; font-size: 0.9rem;">
      <p>⚡ Deployed on <a href="https://createos.nodeops.network" style="color: #58a6ff;">CreateOS</a></p>
    </footer>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
