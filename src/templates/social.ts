import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { wrapWithContainer } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const socialTemplate: TemplateDefinition = {
  id: 'social',
  name: 'Social',
  description: 'Optimized for Twitter/LinkedIn cards with author avatar area',
  fields: [
    { name: 'title', type: 'string', required: true, maxLength: 100 },
    { name: 'subtitle', type: 'string', required: false, maxLength: 200 },
    { name: 'author', type: 'string', required: false },
    { name: 'avatar_url', type: 'string', required: false, description: 'URL to author avatar image' },
    { name: 'handle', type: 'string', required: false, description: 'Social media handle (e.g., @username)' }
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
          justifyContent: 'space-between',
          padding: '60px',
          height: '100%',
          width: '100%'
        },
        children: [
          // Top section: Author info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              },
              children: [
                // Avatar
                ...(params.avatar_url
                  ? [
                      {
                        type: 'img',
                        props: {
                          src: params.avatar_url,
                          style: {
                            width: '64px',
                            height: '64px',
                            borderRadius: '32px',
                            border: '3px solid rgba(255,255,255,0.3)'
                          }
                        }
                      } as SatoriNode
                    ]
                  : params.author
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '64px',
                            height: '64px',
                            borderRadius: '32px',
                            background: theme.accent || 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 700,
                            color: theme.foreground
                          },
                          children: params.author.charAt(0).toUpperCase()
                        }
                      } as SatoriNode
                    ]
                  : []),
                // Name and handle
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column'
                    },
                    children: [
                      ...(params.author
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '22px',
                                  fontWeight: 700,
                                  color: theme.foreground
                                },
                                children: params.author
                              }
                            } as SatoriNode
                          ]
                        : []),
                      ...(params.handle
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  color: theme.foreground,
                                  opacity: 0.7
                                },
                                children: params.handle.startsWith('@')
                                  ? params.handle
                                  : `@${params.handle}`
                              }
                            } as SatoriNode
                          ]
                        : [])
                    ]
                  }
                }
              ]
            }
          },
          // Middle section: Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center'
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '56px',
                      fontWeight: 800,
                      color: theme.foreground,
                      margin: '0',
                      lineHeight: 1.15
                    },
                    children: params.title
                  }
                },
                ...(params.subtitle
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '24px',
                            fontWeight: 400,
                            color: theme.foreground,
                            opacity: 0.8,
                            margin: '20px 0 0 0'
                          },
                          children: params.subtitle
                        }
                      } as SatoriNode
                    ]
                  : [])
              ]
            }
          },
          // Bottom section: Decorative accent line
          {
            type: 'div',
            props: {
              style: {
                height: '6px',
                width: '120px',
                background: theme.accent || 'rgba(255,255,255,0.5)',
                borderRadius: '3px'
              },
              children: ''
            }
          }
        ]
      }
    };

    return wrapWithContainer(content, theme, dimensions);
  }
};
