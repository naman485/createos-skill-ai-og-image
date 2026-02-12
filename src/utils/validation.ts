import type { GenerateRequest, TemplateDefinition } from './types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: GenerateRequest;
}

export function validateRequest(
  params: Partial<GenerateRequest>,
  template: TemplateDefinition
): ValidationResult {
  const errors: string[] = [];
  const sanitized: Partial<GenerateRequest> = { ...params };

  // Validate template-specific required fields
  for (const field of template.fields) {
    const value = params[field.name as keyof GenerateRequest];

    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`Missing required field: ${field.name}`);
      continue;
    }

    if (value !== undefined && field.type === 'string' && typeof value === 'string') {
      if (field.maxLength && value.length > field.maxLength) {
        // Truncate with ellipsis
        (sanitized as Record<string, unknown>)[field.name] = value.slice(0, field.maxLength - 3) + '...';
      }
    }
  }

  // Validate dimensions
  if (sanitized.dimensions) {
    if (sanitized.dimensions.width) {
      sanitized.dimensions.width = Math.min(Math.max(sanitized.dimensions.width, 200), 2400);
    }
    if (sanitized.dimensions.height) {
      sanitized.dimensions.height = Math.min(Math.max(sanitized.dimensions.height, 200), 1600);
    }
  }

  // Validate format
  if (sanitized.format && !['png', 'svg'].includes(sanitized.format)) {
    sanitized.format = 'png';
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitized as GenerateRequest
  };
}

export function parseQueryParams(query: Record<string, unknown>): Partial<GenerateRequest> {
  const params: Partial<GenerateRequest> = {};

  // Simple string fields
  const stringFields = [
    'template', 'title', 'subtitle', 'author', 'logo', 'tag',
    'code', 'language', 'avatar_url', 'handle', 'left_title',
    'right_title', 'winner', 'emoji', 'cta_text', 'format'
  ];

  for (const field of stringFields) {
    if (typeof query[field] === 'string') {
      (params as Record<string, unknown>)[field] = query[field];
    }
  }

  // Parse theme
  if (query.background || query.foreground || query.accent) {
    params.theme = {
      background: typeof query.background === 'string' ? query.background : undefined,
      foreground: typeof query.foreground === 'string' ? query.foreground : undefined,
      accent: typeof query.accent === 'string' ? query.accent : undefined
    };
  }

  // Parse dimensions
  if (query.width || query.height) {
    params.dimensions = {
      width: query.width ? parseInt(String(query.width), 10) : undefined,
      height: query.height ? parseInt(String(query.height), 10) : undefined
    };
  }

  // Parse arrays (comma-separated in query params)
  if (typeof query.left_items === 'string') {
    params.left_items = query.left_items.split(',').map(s => s.trim());
  }
  if (typeof query.right_items === 'string') {
    params.right_items = query.right_items.split(',').map(s => s.trim());
  }

  // Parse stats (format: label1:value1,label2:value2)
  if (typeof query.stats === 'string') {
    params.stats = query.stats.split(',').map(s => {
      const [label, value] = s.split(':').map(p => p.trim());
      return { label: label || '', value: value || '' };
    });
  }

  return params;
}
