import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { wrapWithContainer } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const minimalTemplate: TemplateDefinition = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean, centered text on solid background',
  fields: [
    { name: 'title', type: 'string', required: true, maxLength: 100 },
    { name: 'subtitle', type: 'string', required: false, maxLength: 200 }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    // Use a solid color for minimal template by default
    const bgColor = theme.background.includes('gradient')
      ? '#1a1a2e'
      : theme.background;

    const minimalTheme = { ...theme, background: bgColor };

    const content: SatoriNode = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px',
          height: '100%',
          width: '100%'
        },
        children: [
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: 800,
                color: theme.foreground,
                margin: '0',
                lineHeight: 1.1,
                maxWidth: '90%'
              },
              children: params.title
            }
          },
          // Subtitle
          ...(params.subtitle
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '28px',
                      fontWeight: 400,
                      color: theme.foreground,
                      opacity: 0.7,
                      margin: '24px 0 0 0',
                      maxWidth: '70%'
                    },
                    children: params.subtitle
                  }
                } as SatoriNode
              ]
            : [])
        ]
      }
    };

    return wrapWithContainer(content, minimalTheme, dimensions);
  }
};
