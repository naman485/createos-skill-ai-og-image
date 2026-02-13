# AI OG Image Generator Skill

## Skill Metadata

| Property | Value |
|----------|-------|
| **Skill ID** | `ai-og-image` |
| **Version** | `1.0.0` |
| **Category** | Image Generation |
| **Runtime** | Node.js 20 |
| **Author** | naman485 |

## Description

Generate beautiful Open Graph images from text using customizable templates. Perfect for blog posts, social media cards, product announcements, and documentation previews. Supports 9 professional templates with full theme customization.

## Capabilities

- Generate PNG or SVG images from text
- 9 built-in professional templates
- Custom color themes and gradients
- Custom dimensions (200-2400px width, 200-1600px height)
- Custom brand template with user-provided background images
- Direct URL generation for `<meta>` tags
- MCP-compatible for AI agent integration

## Templates

| Template | Description | Best For |
|----------|-------------|----------|
| `gradient` | Bold text on gradient background | Blog posts, announcements |
| `split` | Two-column layout with tag | Tutorials, documentation |
| `minimal` | Clean, minimalist design | Landing pages, products |
| `code` | Code snippet with syntax styling | Dev tools, code content |
| `social` | Author-focused with avatar | Personal blogs, thought leadership |
| `stats` | Statistics showcase | Reports, case studies |
| `versus` | Side-by-side comparison | Comparison content |
| `announcement` | Large emoji with CTA | Launches, updates |
| `custom` | Your own background image | Brand-specific content |

## API Endpoints

### POST /api/generate

Generate an OG image with full configuration options.

**Request Body:**
```json
{
  "template": "gradient",
  "title": "Your Title Here",
  "subtitle": "Optional subtitle",
  "author": "Author Name",
  "theme": {
    "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "foreground": "#ffffff",
    "accent": "#fbbf24"
  },
  "dimensions": {
    "width": 1200,
    "height": 630
  },
  "format": "png"
}
```

**Response:** Binary image data (PNG or SVG)

### GET /api/generate

Generate an image via query parameters. Ideal for direct use in HTML meta tags.

**Example:**
```
/api/generate?template=gradient&title=Hello+World&subtitle=My+subtitle
```

### GET /api/templates

List all available templates with their fields and preview URLs.

### GET /docs

Interactive HTML documentation page.

### GET /showcase

Interactive image generator with live preview.

### GET /mcp-tool.json

MCP tool definition for AI agent discovery.

### GET /health

Health check endpoint returning service status.

## Input Parameters

### Common Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `template` | string | No | Template ID (default: `gradient`) |
| `title` | string | Yes | Main title text (max 100 chars) |
| `subtitle` | string | No | Secondary text (max 200 chars) |
| `format` | string | No | Output format: `png` or `svg` |

### Theme Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `background` | string | Background color or CSS gradient |
| `foreground` | string | Text color (hex) |
| `accent` | string | Accent color (hex) |

### Dimension Parameters

| Parameter | Type | Range | Default |
|-----------|------|-------|---------|
| `width` | integer | 200-2400 | 1200 |
| `height` | integer | 200-1600 | 630 |

### Template-Specific Parameters

#### gradient, split
- `author` - Author name
- `logo` - URL to logo image
- `tag` - Category tag (split only)

#### code
- `code` - Code snippet to display
- `language` - Programming language label

#### social
- `avatar_url` - URL to author avatar
- `handle` - Social media handle

#### stats
- `stats` - Array of `{label, value}` objects

#### versus
- `left_title` - Left side title
- `right_title` - Right side title
- `left_items` - Array of left side features
- `right_items` - Array of right side features
- `winner` - Which side wins: `left`, `right`, or `none`

#### announcement
- `emoji` - Large emoji or icon character
- `cta_text` - Call-to-action button text

#### custom
- `background_image` - URL to your background image (required)
- `position` - Text position: `top-left`, `top-center`, `top-right`, `center-left`, `center`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right`
- `text_align` - Text alignment: `left`, `center`, `right`
- `overlay_opacity` - Dark overlay opacity 0-100 (default: 40)
- `padding` - Text padding in pixels

## Usage Examples

### Basic Usage

```bash
curl -X POST https://production-ai-og-image.tyzo.nodeops.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"template": "gradient", "title": "My Blog Post"}' \
  --output og-image.png
```

### In HTML Meta Tags

```html
<meta property="og:image" content="https://production-ai-og-image.tyzo.nodeops.app/api/generate?template=gradient&title=My+Blog+Post" />
```

### Custom Branding

```bash
curl -X POST https://production-ai-og-image.tyzo.nodeops.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "template": "custom",
    "title": "Product Launch",
    "subtitle": "Coming Soon",
    "background_image": "https://example.com/brand-bg.jpg",
    "position": "center",
    "overlay_opacity": "50"
  }' --output branded.png
```

## MCP Integration

This skill is discoverable by AI agents via MCP. Fetch the tool definition:

```bash
curl https://production-ai-og-image.tyzo.nodeops.app/mcp-tool.json
```

AI agents can use this skill to generate social media preview images programmatically without any design tools.

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TEMPLATE` | 400 | Unknown template ID |
| `INVALID_INPUT` | 400 | Missing required fields |
| `RENDER_ERROR` | 500 | Internal rendering failure |

## Resource Requirements

| Resource | Value |
|----------|-------|
| CPU | 200 millicores |
| Memory | 500MB |
| Replicas | 1 |

## Dependencies

- Express (HTTP server)
- Satori (HTML/CSS to SVG)
- @resvg/resvg-js (SVG to PNG)
- Inter font (bundled)

## License

MIT
