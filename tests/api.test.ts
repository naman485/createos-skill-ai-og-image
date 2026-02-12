import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('AI OG Image API', () => {
  describe('GET /', () => {
    it('should return service info', async () => {
      const response = await fetch(`${BASE_URL}/`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('ai-og-image');
      expect(data.data.version).toBe('1.0.0');
      expect(data.data.pricing.credits).toBe(10);
      expect(data.data.endpoints).toHaveLength(3);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await fetch(`${BASE_URL}/health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(typeof data.uptime).toBe('number');
      expect(data.version).toBe('1.0.0');
    });
  });

  describe('GET /docs', () => {
    it('should return HTML documentation', async () => {
      const response = await fetch(`${BASE_URL}/docs`);

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');

      const html = await response.text();
      expect(html).toContain('AI OG Image Generator');
      expect(html).toContain('/api/generate');
    });
  });

  describe('GET /mcp-tool.json', () => {
    it('should return MCP tool definition', async () => {
      const response = await fetch(`${BASE_URL}/mcp-tool.json`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('generate_og_image');
      expect(data.inputSchema).toBeDefined();
      expect(data.inputSchema.properties.template).toBeDefined();
      expect(data.inputSchema.properties.title).toBeDefined();
      expect(data.pricing.credits).toBe(10);
    });
  });

  describe('GET /api/templates', () => {
    it('should return all templates', async () => {
      const response = await fetch(`${BASE_URL}/api/templates`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.templates).toHaveLength(8);

      const templateIds = data.data.templates.map((t: { id: string }) => t.id);
      expect(templateIds).toContain('gradient');
      expect(templateIds).toContain('split');
      expect(templateIds).toContain('minimal');
      expect(templateIds).toContain('code');
      expect(templateIds).toContain('social');
      expect(templateIds).toContain('stats');
      expect(templateIds).toContain('versus');
      expect(templateIds).toContain('announcement');
    });

    it('should include fields and preview URL for each template', async () => {
      const response = await fetch(`${BASE_URL}/api/templates`);
      const data = await response.json();

      for (const template of data.data.templates) {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(Array.isArray(template.fields)).toBe(true);
        expect(template.preview).toContain('/api/generate?template=');
      }
    });
  });

  describe('POST /api/generate', () => {
    it('should generate an image with gradient template', async () => {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'gradient',
          title: 'Test Title',
          subtitle: 'Test Subtitle'
        })
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('image/png');
      expect(response.headers.get('x-credits-used')).toBe('10');

      const buffer = await response.arrayBuffer();
      expect(buffer.byteLength).toBeGreaterThan(0);

      // Check PNG signature
      const uint8 = new Uint8Array(buffer);
      expect(uint8[0]).toBe(0x89);
      expect(uint8[1]).toBe(0x50); // P
      expect(uint8[2]).toBe(0x4e); // N
      expect(uint8[3]).toBe(0x47); // G
    });

    it('should return SVG when format is svg', async () => {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'minimal',
          title: 'SVG Test',
          format: 'svg'
        })
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('image/svg+xml');

      const svg = await response.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('SVG Test');
    });

    it('should return JSON metadata when meta=true', async () => {
      const response = await fetch(`${BASE_URL}/api/generate?meta=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'gradient',
          title: 'Meta Test'
        })
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.image).toBeDefined();
      expect(data.data.format).toBe('png');
      expect(data.data.width).toBe(1200);
      expect(data.data.height).toBe(630);
      expect(data.data.sizeBytes).toBeGreaterThan(0);
      expect(data.meta.credits).toBe(10);
      expect(data.meta.processingMs).toBeGreaterThan(0);
    });

    it('should return error for invalid template', async () => {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'nonexistent',
          title: 'Test'
        })
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_TEMPLATE');
    });

    it('should return error for missing required fields', async () => {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'gradient'
          // missing title
        })
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_INPUT');
    });

    it('should use custom dimensions', async () => {
      const response = await fetch(`${BASE_URL}/api/generate?meta=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'minimal',
          title: 'Custom Size',
          dimensions: { width: 800, height: 400 }
        })
      });

      const data = await response.json();
      expect(data.data.width).toBe(800);
      expect(data.data.height).toBe(400);
    });
  });

  describe('GET /api/generate', () => {
    it('should generate image via query params', async () => {
      const response = await fetch(
        `${BASE_URL}/api/generate?template=gradient&title=Query+Test&subtitle=Via+GET`
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('image/png');
    });

    it('should default to gradient template', async () => {
      const response = await fetch(
        `${BASE_URL}/api/generate?title=Default+Template`
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('image/png');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await fetch(`${BASE_URL}/api/templates`);

      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });

    it('should handle OPTIONS preflight', async () => {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'OPTIONS'
      });

      expect(response.status).toBe(204);
      expect(response.headers.get('access-control-allow-methods')).toContain('POST');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await fetch(`${BASE_URL}/unknown/endpoint`);

      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });
});
