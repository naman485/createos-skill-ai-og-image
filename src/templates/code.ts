import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { createWatermark } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const codeTemplate: TemplateDefinition = {
  id: 'code',
  name: 'Code',
  description: 'Looks like a code editor/terminal with syntax highlighting',
  fields: [
    { name: 'title', type: 'string', required: true, maxLength: 60, description: 'Filename to display in tab' },
    { name: 'code', type: 'string', required: true, maxLength: 500, description: 'Code to display' },
    { name: 'language', type: 'string', required: false, description: 'Programming language label' }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const watermark = createWatermark();
    const codeLines = (params.code || '// Your code here').split('\n').slice(0, 12);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0d1117',
          padding: '40px',
          fontFamily: theme.font || 'Inter',
          position: 'relative'
        },
        children: [
          // Editor window
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                background: '#161b22',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #30363d'
              },
              children: [
                // Title bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#21262d',
                      borderBottom: '1px solid #30363d',
                      gap: '8px'
                    },
                    children: [
                      // Traffic lights
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            gap: '8px'
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '6px',
                                  background: '#ff5f56'
                                },
                                children: ''
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '6px',
                                  background: '#ffbd2e'
                                },
                                children: ''
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '6px',
                                  background: '#27ca3f'
                                },
                                children: ''
                              }
                            }
                          ]
                        }
                      },
                      // Filename tab
                      {
                        type: 'div',
                        props: {
                          style: {
                            marginLeft: '20px',
                            padding: '6px 16px',
                            background: '#161b22',
                            borderRadius: '6px 6px 0 0',
                            fontSize: '14px',
                            color: '#c9d1d9'
                          },
                          children: params.title
                        }
                      },
                      // Language badge
                      ...(params.language
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  marginLeft: 'auto',
                                  padding: '4px 12px',
                                  background: '#238636',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#ffffff'
                                },
                                children: params.language
                              }
                            } as SatoriNode
                          ]
                        : [])
                    ]
                  }
                },
                // Code content
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: 1,
                      padding: '24px'
                    },
                    children: [
                      // Line numbers
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            paddingRight: '24px',
                            borderRight: '1px solid #30363d',
                            marginRight: '24px'
                          },
                          children: codeLines.map((_, i) => ({
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '18px',
                                lineHeight: '28px',
                                color: '#484f58',
                                fontFamily: 'monospace'
                              },
                              children: String(i + 1)
                            }
                          }))
                        }
                      },
                      // Code lines
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1
                          },
                          children: codeLines.map(line => ({
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '18px',
                                lineHeight: '28px',
                                color: '#c9d1d9',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre'
                              },
                              children: line || ' '
                            }
                          }))
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          watermark
        ]
      }
    };
  }
};
