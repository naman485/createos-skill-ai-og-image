import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getFonts } from './fonts.js';
import type { SatoriNode, Theme, Dimensions } from '../utils/types.js';

export interface RenderResult {
  data: Buffer | string;
  format: 'png' | 'svg';
  width: number;
  height: number;
  sizeBytes: number;
}

export async function renderImage(
  node: SatoriNode,
  dimensions: Dimensions,
  format: 'png' | 'svg' = 'png'
): Promise<RenderResult> {
  const fonts = getFonts();

  // Render to SVG using Satori
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(node as any, {
    width: dimensions.width,
    height: dimensions.height,
    fonts: fonts.map(f => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style
    }))
  });

  if (format === 'svg') {
    return {
      data: svg,
      format: 'svg',
      width: dimensions.width,
      height: dimensions.height,
      sizeBytes: Buffer.byteLength(svg, 'utf-8')
    };
  }

  // Convert SVG to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: dimensions.width
    }
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return {
    data: pngBuffer,
    format: 'png',
    width: dimensions.width,
    height: dimensions.height,
    sizeBytes: pngBuffer.length
  };
}

export function createWatermark(): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        bottom: '16px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.5)'
      },
      children: [
        {
          type: 'span',
          props: {
            children: '⚡'
          }
        },
        {
          type: 'span',
          props: {
            children: 'createos.nodeops.network'
          }
        }
      ]
    }
  };
}

export function wrapWithContainer(
  content: SatoriNode | SatoriNode[],
  theme: Theme,
  dimensions: Dimensions
): SatoriNode {
  const watermark = createWatermark();
  const children = Array.isArray(content) ? [...content, watermark] : [content, watermark];

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: theme.background,
        fontFamily: theme.font || 'Inter',
        position: 'relative'
      },
      children
    }
  };
}
