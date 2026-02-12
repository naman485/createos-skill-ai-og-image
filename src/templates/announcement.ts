import type { TemplateDefinition, GenerateRequest, Theme, SatoriNode } from '../utils/types.js';
import { wrapWithContainer } from '../lib/renderer.js';
import { DEFAULT_DIMENSIONS } from '../utils/types.js';

export const announcementTemplate: TemplateDefinition = {
  id: 'announcement',
  name: 'Announcement',
  description: 'Large emoji/icon + bold text',
  fields: [
    { name: 'emoji', type: 'string', required: false, maxLength: 10, description: 'Emoji or icon character' },
    { name: 'title', type: 'string', required: true, maxLength: 80 },
    { name: 'subtitle', type: 'string', required: false, maxLength: 150 },
    { name: 'cta_text', type: 'string', required: false, maxLength: 30, description: 'Call-to-action button text' }
  ],
  render: (params: GenerateRequest, theme: Theme): SatoriNode => {
    const dimensions = {
      width: params.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: params.dimensions?.height || DEFAULT_DIMENSIONS.height
    };

    const emoji = params.emoji || '🚀';

    const content: SatoriNode = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px',
          height: '100%',
          width: '100%'
        },
        children: [
          // Emoji container with glow effect
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '140px',
                borderRadius: '70px',
                background: 'rgba(255,255,255,0.15)',
                marginBottom: '32px'
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '72px'
                    },
                    children: emoji
                  }
                }
              ]
            }
          },
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
                      fontSize: '26px',
                      fontWeight: 400,
                      color: theme.foreground,
                      opacity: 0.85,
                      margin: '24px 0 0 0',
                      maxWidth: '75%'
                    },
                    children: params.subtitle
                  }
                } as SatoriNode
              ]
            : []),
          // CTA Button
          ...(params.cta_text
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '40px',
                      padding: '16px 40px',
                      background: theme.accent || '#fbbf24',
                      borderRadius: '12px',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#1a1a2e'
                    },
                    children: params.cta_text
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
