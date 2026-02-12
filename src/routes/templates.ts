import type { Request, Response } from 'express';
import { getAllTemplates } from '../templates/index.js';
import { sendSuccess } from '../utils/response.js';

export function handleTemplates(_req: Request, res: Response): void {
  const templates = getAllTemplates().map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    fields: template.fields,
    preview: `/api/generate?template=${template.id}&title=Preview&subtitle=This+is+the+${template.id}+template`
  }));

  sendSuccess(res, { templates });
}
