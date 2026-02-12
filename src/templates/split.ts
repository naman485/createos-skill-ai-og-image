import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { createWatermark } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const splitTemplate: TemplateDefinition = {
  id: 'split',
  name: 'Split',
  description: 'Left side text, right side solid/gradient color block',
  fields: [
    { name: 'title', type: 'string', required: true, maxLength: 100 },
    { name: 'subtitle', type: 'string', required: false, maxLength: 200 },
    { name: 'tag', type: 'string', required: false, description: 'Category or tag label' },
    { name: 'author', type: 'string', required: false }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const watermark = createWatermark();

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          fontFamily: theme.font || 'Inter',
          position: 'relative'
        },
        children: [
          // Left side (content)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '60%',
                padding: '60px',
                background: '#ffffff'
              },
              children: [
                // Tag
                ...(params.tag
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 700,
                            color: theme.accent || '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '16px'
                          },
                          children: params.tag
                        }
                      } as SatoriNode
                    ]
                  : []),
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '52px',
                      fontWeight: 800,
                      color: '#1a1a2e',
                      margin: '0',
                      lineHeight: 1.15
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
                            fontSize: '22px',
                            fontWeight: 400,
                            color: '#4a4a68',
                            margin: '20px 0 0 0',
                            lineHeight: 1.4
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
                            marginTop: '32px'
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '20px',
                                  background: theme.accent || '#667eea',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#ffffff',
                                  fontSize: '16px',
                                  fontWeight: 700
                                },
                                children: params.author.charAt(0).toUpperCase()
                              }
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  marginLeft: '12px',
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: '#1a1a2e'
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
          },
          // Right side (color block)
          {
            type: 'div',
            props: {
              style: {
                width: '40%',
                background: theme.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              children: ''
            }
          },
          watermark
        ]
      }
    };
  }
};
