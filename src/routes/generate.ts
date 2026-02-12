import type { Request, Response } from 'express';
import { getTemplate, getTemplateIds } from '../templates/index.js';
import { renderImage } from '../lib/renderer.js';
import { validateRequest, parseQueryParams } from '../utils/validation.js';
import { sendError } from '../utils/response.js';
import {
  DEFAULT_THEME,
  DEFAULT_DIMENSIONS,
  CREDITS_PER_REQUEST,
  type GenerateRequest
} from '../utils/types.js';

export async function handleGenerate(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();

  try {
    // Parse params from body (POST) or query (GET)
    const params: Partial<GenerateRequest> =
      req.method === 'GET' ? parseQueryParams(req.query) : req.body;

    // Validate template
    const templateId = params.template || 'gradient';
    const template = getTemplate(templateId);

    if (!template) {
      sendError(res, 400, 'INVALID_TEMPLATE', `Invalid template "${templateId}". Valid templates: ${getTemplateIds().join(', ')}`);
      return;
    }

    // Validate required fields
    const validation = validateRequest(params, template);

    if (!validation.valid) {
      sendError(res, 400, 'INVALID_INPUT', `Missing required fields: ${validation.errors.join(', ')}`);
      return;
    }

    const sanitizedParams = validation.sanitized;

    // Build theme with defaults
    const theme = {
      ...DEFAULT_THEME,
      ...sanitizedParams.theme
    };

    // Build dimensions with defaults
    const dimensions = {
      ...DEFAULT_DIMENSIONS,
      ...sanitizedParams.dimensions
    };

    // Render the template
    const node = template.render(sanitizedParams, theme);
    const format = sanitizedParams.format || 'png';

    const result = await renderImage(node, dimensions, format);
    const processingMs = Date.now() - startTime;

    // Check if JSON metadata response is requested
    const returnMeta = req.query.meta === 'true';

    if (returnMeta) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Credits-Used', String(CREDITS_PER_REQUEST));
      res.json({
        success: true,
        data: {
          image: Buffer.isBuffer(result.data)
            ? result.data.toString('base64')
            : result.data,
          format: result.format,
          width: result.width,
          height: result.height,
          sizeBytes: result.sizeBytes,
          template: templateId
        },
        meta: {
          credits: CREDITS_PER_REQUEST,
          processingMs
        }
      });
      return;
    }

    // Return image directly
    const contentType = format === 'svg' ? 'image/svg+xml' : 'image/png';
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Credits-Used', String(CREDITS_PER_REQUEST));
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(result.data);
  } catch (error) {
    console.error('Generate error:', error);
    sendError(res, 500, 'RENDER_ERROR', 'Failed to generate image');
  }
}
