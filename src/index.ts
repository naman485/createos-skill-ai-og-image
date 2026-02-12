import express from 'express';
import { loadFonts } from './lib/fonts.js';
import { handleGenerate } from './routes/generate.js';
import { handleTemplates } from './routes/templates.js';
import { handleHealth } from './routes/health.js';
import { handleDocs } from './routes/docs.js';
import { setCorsHeaders, sendSuccess } from './utils/response.js';
import { CREDITS_PER_REQUEST } from './utils/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const VERSION = '1.0.0';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use((_req, res, next) => {
  setCorsHeaders(res);
  next();
});

// Handle OPTIONS preflight
app.options('*', (_req, res) => {
  res.status(204).end();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Routes
app.get('/', (_req, res) => {
  sendSuccess(res, {
    name: 'ai-og-image',
    version: VERSION,
    description: 'Generate beautiful Open Graph images from text — one API call, zero design skills.',
    pricing: {
      credits: CREDITS_PER_REQUEST,
      usd: `$${(CREDITS_PER_REQUEST / 100).toFixed(2)}`
    },
    endpoints: [
      { method: 'POST', path: '/api/generate', description: 'Generate an OG image from template + text' },
      { method: 'GET', path: '/api/generate', description: 'Generate via query params (for direct meta tag use)' },
      { method: 'GET', path: '/api/templates', description: 'List all available templates' }
    ],
    docs: '/docs',
    health: '/health',
    mcp: '/mcp-tool.json'
  });
});

app.get('/health', handleHealth);
app.get('/docs', handleDocs);

// MCP tool definition
app.get('/mcp-tool.json', (_req, res) => {
  const mcpPath = path.join(__dirname, '..', 'mcp-tool.json');
  if (fs.existsSync(mcpPath)) {
    const mcpTool = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    res.json(mcpTool);
  } else {
    res.json({
      name: 'generate_og_image',
      description: 'Generate Open Graph / social media preview images from text. Returns a PNG image.',
      inputSchema: {
        type: 'object',
        properties: {
          template: {
            type: 'string',
            enum: ['gradient', 'split', 'minimal', 'code', 'social', 'stats', 'versus', 'announcement'],
            description: 'Template style to use'
          },
          title: {
            type: 'string',
            description: 'Main title text (required)',
            maxLength: 100
          },
          subtitle: {
            type: 'string',
            description: 'Subtitle or description text'
          }
        },
        required: ['template', 'title']
      },
      endpoint: 'POST /api/generate',
      pricing: { credits: CREDITS_PER_REQUEST, usd: CREDITS_PER_REQUEST / 100 }
    });
  }
});

// API routes
app.post('/api/generate', handleGenerate);
app.get('/api/generate', handleGenerate);
app.get('/api/templates', handleTemplates);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
  });
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
async function start() {
  try {
    console.log('Loading fonts...');
    await loadFonts();

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Docs available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
