import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { wrapWithContainer } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const statsTemplate: TemplateDefinition = {
  id: 'stats',
  name: 'Stats',
  description: 'Dashboard-style with big numbers',
  fields: [
    { name: 'title', type: 'string', required: true, maxLength: 80 },
    {
      name: 'stats',
      type: 'array',
      required: true,
      description: 'Array of {label, value} objects'
    }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const stats = params.stats || [
      { label: 'Users', value: '10K+' },
      { label: 'Revenue', value: '$50K' },
      { label: 'Growth', value: '127%' }
    ];

    const content: SatoriNode = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          height: '100%',
          width: '100%'
        },
        children: [
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '48px',
                fontWeight: 800,
                color: theme.foreground,
                margin: '0 0 48px 0'
              },
              children: params.title
            }
          },
          // Stats grid
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                gap: '32px',
                alignItems: 'center',
                justifyContent: 'center'
              },
              children: stats.slice(0, 4).map((stat, index) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    padding: '32px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    ...(index === 0 && {
                      borderLeft: `4px solid ${theme.accent || '#fbbf24'}`
                    })
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '64px',
                          fontWeight: 800,
                          color: index === 0 ? (theme.accent || '#fbbf24') : theme.foreground,
                          lineHeight: 1
                        },
                        children: stat.value
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 600,
                          color: theme.foreground,
                          opacity: 0.7,
                          marginTop: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        },
                        children: stat.label
                      }
                    }
                  ]
                }
              }))
            }
          }
        ]
      }
    };

    return wrapWithContainer(content, theme, dimensions);
  }
};
