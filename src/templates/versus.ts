import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { createWatermark } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const versusTemplate: TemplateDefinition = {
  id: 'versus',
  name: 'Versus',
  description: 'Side-by-side comparison',
  fields: [
    { name: 'left_title', type: 'string', required: true, maxLength: 40 },
    { name: 'right_title', type: 'string', required: true, maxLength: 40 },
    { name: 'left_items', type: 'array', required: false, description: 'Array of feature strings' },
    { name: 'right_items', type: 'array', required: false, description: 'Array of feature strings' },
    { name: 'winner', type: 'string', required: false, description: 'left, right, or none' }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const leftItems = params.left_items || [];
    const rightItems = params.right_items || [];
    const winner = params.winner || 'none';

    const watermark = createWatermark();

    const renderSide = (
      title: string,
      items: string[],
      isWinner: boolean,
      bgColor: string,
      textColor: string
    ): SatoriNode => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '48px',
          background: bgColor,
          ...(isWinner && {
            border: '4px solid #22c55e'
          })
        },
        children: [
          // Winner badge
          ...(isWinner
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      padding: '6px 12px',
                      background: '#22c55e',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      textTransform: 'uppercase'
                    },
                    children: 'Winner'
                  }
                } as SatoriNode
              ]
            : []),
          // Title
          {
            type: 'h2',
            props: {
              style: {
                fontSize: '40px',
                fontWeight: 800,
                color: textColor,
                margin: '0 0 32px 0'
              },
              children: title
            }
          },
          // Items list
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              },
              children: items.slice(0, 5).map(item => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          color: '#22c55e'
                        },
                        children: '✓'
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          color: textColor,
                          opacity: 0.9
                        },
                        children: item
                      }
                    }
                  ]
                }
              }))
            }
          }
        ]
      }
    });

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
          // Left side
          renderSide(
            params.left_title || 'Option A',
            leftItems,
            winner === 'left',
            '#1a1a2e',
            '#ffffff'
          ),
          // VS divider
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                borderRadius: '40px',
                background: theme.accent || '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 800,
                color: '#1a1a2e',
                zIndex: 10,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
              },
              children: 'VS'
            }
          },
          // Right side
          renderSide(
            params.right_title || 'Option B',
            rightItems,
            winner === 'right',
            '#ffffff',
            '#1a1a2e'
          ),
          watermark
        ]
      }
    };
  }
};
