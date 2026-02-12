import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { wrapWithContainer } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const gradientTemplate: TemplateDefinition = {
  id: 'gradient',
  name: 'Gradient',
  description: 'Bold text on gradient background',
  fields: [
    { name: 'title', type: 'string', required: true, maxLength: 100 },
    { name: 'subtitle', type: 'string', required: false, maxLength: 200 },
    { name: 'author', type: 'string', required: false },
    { name: 'logo', type: 'string', required: false, description: 'URL to logo image' }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const content: SatoriNode = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          height: '100%',
          width: '100%'
        },
        children: [
          // Logo (if provided)
          ...(params.logo
            ? [
                {
                  type: 'img',
                  props: {
                    src: params.logo,
                    style: {
                      width: '80px',
                      height: '80px',
                      marginBottom: '24px',
                      borderRadius: '12px'
                    }
                  }
                } as SatoriNode
              ]
            : []),
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '64px',
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
                      opacity: 0.8,
                      margin: '20px 0 0 0',
                      maxWidth: '80%'
                    },
                    children: params.subtitle
                  }
                } as SatoriNode
              ]
            : []),
          // Author
          ...(params.author
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '40px',
                      gap: '8px'
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '4px',
                            height: '24px',
                            background: theme.accent || theme.foreground,
                            borderRadius: '2px'
                          },
                          children: ''
                        }
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: theme.foreground
                          },
                          children: params.author
                        }
                      }
                    ]
                  }
                } as SatoriNode
              ]
            : [])
        ]
      }
    };

    return wrapWithContainer(content, theme, dimensions);
  }
};
