# AI OG Image Generator ⚡

> Generate beautiful Open Graph images from text — one API call, zero design skills.

## 🚀 Try It

```bash
curl -X POST https://production-ai-og-image.tyzo.nodeops.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "template": "gradient",
    "title": "How I Built a $2,400/mo Passive Income API",
    "subtitle": "From zero to deployed in 15 minutes"
  }' --output og-image.png
```

**Response:**
Returns a PNG image directly (or SVG if `format: "svg"`).

![Example OG Image](https://production-ai-og-image.tyzo.nodeops.app/api/generate?template=gradient&title=Hello+World&subtitle=Generated+with+CreateOS)

## API Reference

### `POST /api/generate`

Generate an OG image from a template + text parameters.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| template | string | No | Template ID (default: `gradient`) |
| title | string | Yes | Main title text (max 100 chars) |
| subtitle | string | No | Secondary text (max 200 chars) |
| author | string | No | Author name |
| logo | string | No | URL to logo image |
| theme | object | No | Custom colors (see below) |
| dimensions | object | No | `{width, height}` (default: 1200x630) |
| format | string | No | `png` or `svg` (default: `png`) |

**Theme Options:**

```json
{
  "theme": {
    "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "foreground": "#ffffff",
    "accent": "#fbbf24"
  }
}
```

**Response:**

Returns the image directly with `Content-Type: image/png` (or `image/svg+xml`).

Add `?meta=true` to get JSON metadata instead:

```json
{
  "success": true,
  "data": {
    "image": "base64-encoded-image-data",
    "format": "png",
    "width": 1200,
    "height": 630,
    "sizeBytes": 45230,
    "template": "gradient"
  },
  "meta": { "credits": 10, "processingMs": 340 }
}
```

### `GET /api/generate`

Same as POST but via query params — perfect for direct use in `<meta>` tags:

```html
<meta property="og:image" content="https://production-ai-og-image.tyzo.nodeops.app/api/generate?template=gradient&title=My+Blog+Post" />
```

### `GET /api/templates`

List all available templates with their required fields.

```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "gradient",
        "name": "Gradient",
        "description": "Bold text on gradient background",
        "fields": [...],
        "preview": "/api/generate?template=gradient&title=Preview"
      }
    ]
  }
}
```

## Templates

| Template | Best For | Key Fields |
|----------|----------|------------|
| **gradient** | Blog posts, announcements | title, subtitle, author, logo |
| **split** | Tutorials, documentation | title, subtitle, tag, author |
| **minimal** | Landing pages, products | title, subtitle |
| **code** | Dev tools, code content | title (filename), code, language |
| **social** | Personal blogs, thought leadership | title, author, avatar_url, handle |
| **stats** | Reports, case studies | title, stats[] |
| **versus** | Comparison content | left_title, right_title, left_items[], right_items[], winner |
| **announcement** | Launches, updates | emoji, title, subtitle, cta_text |

### Template Examples

**Gradient:**
```bash
curl "https://production-ai-og-image.tyzo.nodeops.app/api/generate?template=gradient&title=My+Awesome+Post&subtitle=A+great+subtitle&author=NK"
```

**Code:**
```bash
curl -X POST https://production-ai-og-image.tyzo.nodeops.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "template": "code",
    "title": "app.ts",
    "code": "const app = express();\napp.get(\"/\", (req, res) => {\n  res.json({ hello: \"world\" });\n});",
    "language": "TypeScript"
  }' --output code-preview.png
```

**Stats:**
```bash
curl -X POST https://production-ai-og-image.tyzo.nodeops.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "template": "stats",
    "title": "Q4 Results",
    "stats": [
      {"label": "Revenue", "value": "$1.2M"},
      {"label": "Users", "value": "50K"},
      {"label": "Growth", "value": "+127%"}
    ]
  }' --output stats.png
```

### Error Codes

| Code | Description |
|------|-------------|
| INVALID_TEMPLATE | Unknown template ID |
| INVALID_INPUT | Missing required fields |
| RENDER_ERROR | Internal rendering failure |

## Pricing

| Tier | Credits | USD |
|------|---------|-----|
| Per request | 10 | $0.10 |

> At 100 requests/day, this Skill earns **$240/month** for the publisher.

## MCP Integration (AI Agents)

This Skill is auto-discoverable by AI agents via MCP:

```bash
# Fetch tool definition
curl https://production-ai-og-image.tyzo.nodeops.app/mcp-tool.json
```

AI agents can use this tool to generate social media preview images programmatically.

## Deploy Your Own

```bash
git clone https://github.com/naman485/createos-skill-ai-og-image
cd createos-skill-ai-og-image
npm install
npm run setup:fonts  # Download Inter font files
npm run build
npm start
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

### Deploy to CreateOS

```bash
npx createos deploy
```

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express
- **Rendering:** Satori (HTML/CSS to SVG) + Resvg (SVG to PNG)
- **Font:** Inter (bundled)
- **Platform:** [CreateOS](https://createos.nodeops.network)

## Local Development

```bash
npm install
npm run setup:fonts
npm run dev  # Start with hot reload
```

Open http://localhost:3000/docs to see interactive documentation.

## License

MIT
