import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { createWatermark } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const customTemplate: TemplateDefinition = {
  id: 'custom',
  name: 'Custom Brand',
  description: 'Your own background image with text overlay',
  fields: [
    { name: 'background_image', type: 'string', required: true, description: 'URL to your background image' },
    { name: 'title', type: 'string', required: true, maxLength: 100 },
    { name: 'subtitle', type: 'string', required: false, maxLength: 200 },
    { name: 'position', type: 'string', required: false, description: 'Text position: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right' },
    { name: 'text_align', type: 'string', required: false, description: 'Text alignment: left, center, right' },
    { name: 'overlay_opacity', type: 'string', required: false, description: 'Dark overlay opacity 0-100 for better text readability' },
    { name: 'padding', type: 'string', required: false, description: 'Padding in pixels (default: 60)' }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const position = (params as any).position || 'center';
    const textAlign = (params as any).text_align || 'center';
    const overlayOpacity = parseInt((params as any).overlay_opacity || '40', 10) / 100;
    const padding = parseInt((params as any).padding || '60', 10);
    const backgroundImage = (params as any).background_image || '';

    // Calculate positioning based on position parameter
    const getFlexPosition = (pos: string): { justifyContent: string; alignItems: string } => {
      const [vertical, horizontal] = pos.includes('-')
        ? pos.split('-')
        : ['center', pos];

      const justifyMap: Record<string, string> = {
        'top': 'flex-start',
        'center': 'center',
        'bottom': 'flex-end'
      };

      const alignMap: Record<string, string> = {
        'left': 'flex-start',
        'center': 'center',
        'right': 'flex-end'
      };

      return {
        justifyContent: justifyMap[vertical] || 'center',
        alignItems: alignMap[horizontal] || 'center'
      };
    };

    const flexPosition = getFlexPosition(position);
    const watermark = createWatermark();

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          fontFamily: theme.font || 'Inter'
        },
        children: [
          // Background image
          {
            type: 'img',
            props: {
              src: backgroundImage,
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }
            }
          },
          // Dark overlay for text readability
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `rgba(0, 0, 0, ${overlayOpacity})`
              },
              children: ''
            }
          },
          // Text content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                width: '100%',
                height: '100%',
                padding: `${padding}px`,
                justifyContent: flexPosition.justifyContent,
                alignItems: flexPosition.alignItems,
                textAlign: textAlign
              },
              children: [
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
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
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
                            opacity: 0.9,
                            margin: '20px 0 0 0',
                            textShadow: '0 1px 5px rgba(0,0,0,0.5)',
                            maxWidth: '80%'
                          },
                          children: params.subtitle
                        }
                      } as SatoriNode
                    ]
                  : [])
              ]
            }
          },
          watermark
        ]
      }
    };
  }
};
