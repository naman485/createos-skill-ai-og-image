import type { TemplateDefinition } from '../utils/types.js';
import { gradientTemplate } from './gradient.js';
import { splitTemplate } from './split.js';
import { minimalTemplate } from './minimal.js';
import { codeTemplate } from './code.js';
import { socialTemplate } from './social.js';
import { statsTemplate } from './stats.js';
import { versusTemplate } from './versus.js';
import { announcementTemplate } from './announcement.js';
import { customTemplate } from './custom.js';

export const templates: Map<string, TemplateDefinition> = new Map([
  ['gradient', gradientTemplate],
  ['split', splitTemplate],
  ['minimal', minimalTemplate],
  ['code', codeTemplate],
  ['social', socialTemplate],
  ['stats', statsTemplate],
  ['versus', versusTemplate],
  ['announcement', announcementTemplate],
  ['custom', customTemplate]
]);

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.get(id);
}

export function getAllTemplates(): TemplateDefinition[] {
  return Array.from(templates.values());
}

export function getTemplateIds(): string[] {
  return Array.from(templates.keys());
}
