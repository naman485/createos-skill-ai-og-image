export interface Theme {
  background: string;
  foreground: string;
  accent?: string;
  font?: string;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface GenerateRequest {
  template: string;
  title: string;
  subtitle?: string;
  author?: string;
  logo?: string;
  theme?: Partial<Theme>;
  dimensions?: Partial<Dimensions>;
  format?: 'png' | 'svg';
  // Template-specific fields
  tag?: string;
  code?: string;
  language?: string;
  avatar_url?: string;
  handle?: string;
  stats?: Array<{ label: string; value: string }>;
  left_title?: string;
  right_title?: string;
  left_items?: string[];
  right_items?: string[];
  winner?: 'left' | 'right' | 'none';
  emoji?: string;
  cta_text?: string;
}

export interface TemplateField {
  name: string;
  type: 'string' | 'array' | 'object';
  required: boolean;
  maxLength?: number;
  description?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  render: (params: GenerateRequest, theme: Theme) => SatoriNode;
}

export interface SatoriNode {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: string | SatoriNode | (string | SatoriNode)[];
    [key: string]: unknown;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    credits: number;
    processingMs: number;
  };
}

export interface ServiceInfo {
  name: string;
  version: string;
  description: string;
  pricing: {
    credits: number;
    usd: string;
  };
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
  }>;
  docs: string;
  health: string;
  mcp: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  uptime: number;
  version: string;
}

export const DEFAULT_THEME: Theme = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  foreground: '#ffffff',
  accent: '#fbbf24',
  font: 'Inter'
};

export const DEFAULT_DIMENSIONS: Dimensions = {
  width: 1200,
  height: 630
};

export const CREDITS_PER_REQUEST = 10;
