import type { ProjectState, CanvasDimensions, RenderLayers } from '../types';

/**
 * Calculate total dimensions including frame, mat, and painting
 */
export const calculateTotalDimensions = (state: ProjectState): CanvasDimensions => {
  if (!state.painting || !state.frame) {
    return {
      totalWidthMm: 0,
      totalHeightMm: 0,
      scaleFactor: 1,
      canvasWidth: 0,
      canvasHeight: 0,
    };
  }

  const paintingWidth = state.painting.widthMm;
  const paintingHeight = state.painting.heightMm;

  // Calculate mat dimensions
  const matWidth = state.mat.enabled 
    ? paintingWidth + state.mat.marginMm.left + state.mat.marginMm.right
    : paintingWidth;
  const matHeight = state.mat.enabled 
    ? paintingHeight + state.mat.marginMm.top + state.mat.marginMm.bottom
    : paintingHeight;

  // Calculate total dimensions with frame
  const frameProfileWidth = state.frame.profileWidthMm;
  const totalWidthMm = matWidth + (frameProfileWidth * 2);
  const totalHeightMm = matHeight + (frameProfileWidth * 2);

  // Calculate scale factor to fit in viewport (max 800px width, 600px height)
  const maxCanvasWidth = 800;
  const maxCanvasHeight = 600;
  
  const scaleX = maxCanvasWidth / totalWidthMm;
  const scaleY = maxCanvasHeight / totalHeightMm;
  const scaleFactor = Math.min(scaleX, scaleY, 1); // Don't scale up

  const canvasWidth = totalWidthMm * scaleFactor;
  const canvasHeight = totalHeightMm * scaleFactor;

  return {
    totalWidthMm,
    totalHeightMm,
    scaleFactor,
    canvasWidth,
    canvasHeight,
  };
};

/**
 * Calculate render layer positions and dimensions
 */
export const calculateRenderLayers = (
  state: ProjectState,
  dimensions: CanvasDimensions
): RenderLayers => {
  if (!state.painting || !state.frame) {
    return {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      mat: { x: 0, y: 0, width: 0, height: 0 },
      painting: { x: 0, y: 0, width: 0, height: 0 },
    };
  }

  const { scaleFactor } = dimensions;
  const frameProfileWidth = state.frame.profileWidthMm * scaleFactor;

  // Frame layer (outermost)
  const frameLayer = {
    x: 0,
    y: 0,
    width: dimensions.canvasWidth,
    height: dimensions.canvasHeight,
  };

  // Mat layer (inside frame)
  const matWidth = state.mat.enabled 
    ? state.painting.widthMm + state.mat.marginMm.left + state.mat.marginMm.right
    : state.painting.widthMm;
  const matHeight = state.mat.enabled 
    ? state.painting.heightMm + state.mat.marginMm.top + state.mat.marginMm.bottom
    : state.painting.heightMm;

  const matLayer = {
    x: frameProfileWidth,
    y: frameProfileWidth,
    width: matWidth * scaleFactor,
    height: matHeight * scaleFactor,
  };

  // Painting layer (inside mat)
  const paintingLayer = {
    x: frameProfileWidth + (state.mat.enabled ? state.mat.marginMm.left * scaleFactor : 0),
    y: frameProfileWidth + (state.mat.enabled ? state.mat.marginMm.top * scaleFactor : 0),
    width: state.painting.widthMm * scaleFactor,
    height: state.painting.heightMm * scaleFactor,
  };

  return {
    frame: frameLayer,
    mat: matLayer,
    painting: paintingLayer,
  };
};

/**
 * Render the complete framed painting on canvas
 */
export const renderFramedPainting = async (
  canvas: HTMLCanvasElement,
  state: ProjectState,
  image: HTMLImageElement
): Promise<void> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate dimensions and layers
  const dimensions = calculateTotalDimensions(state);
  const layers = calculateRenderLayers(state, dimensions);

  // Set canvas size
  canvas.width = dimensions.canvasWidth;
  canvas.height = dimensions.canvasHeight;

  // Set background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render frame (outermost layer)
  if (state.frame) {
    ctx.fillStyle = state.frame.color || '#666666';
    ctx.fillRect(
      layers.frame.x,
      layers.frame.y,
      layers.frame.width,
      layers.frame.height
    );

    // Add frame texture effect (simple gradient)
    const gradient = ctx.createLinearGradient(
      layers.frame.x,
      layers.frame.y,
      layers.frame.x + layers.frame.width,
      layers.frame.y + layers.frame.height
    );
    
    const baseColor = state.frame.color || '#666666';
    gradient.addColorStop(0, lightenColor(baseColor, 20));
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, darkenColor(baseColor, 20));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      layers.frame.x,
      layers.frame.y,
      layers.frame.width,
      layers.frame.height
    );
  }

  // Render mat board (middle layer)
  if (state.mat.enabled) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      layers.mat.x,
      layers.mat.y,
      layers.mat.width,
      layers.mat.height
    );

    // Add subtle mat texture
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(
      layers.mat.x + 1,
      layers.mat.y + 1,
      layers.mat.width - 2,
      layers.mat.height - 2
    );
  }

  // Render painting (innermost layer)
  ctx.drawImage(
    image,
    layers.painting.x,
    layers.painting.y,
    layers.painting.width,
    layers.painting.height
  );

  // Apply glass effect overlay
  if (state.glass !== 'none') {
    const overlayCanvas = document.createElement('canvas');
    const overlayCtx = overlayCanvas.getContext('2d');
    
    if (overlayCtx) {
      overlayCanvas.width = canvas.width;
      overlayCanvas.height = canvas.height;

      if (state.glass === 'clear') {
        // Clear glass effect - subtle shine/reflection
        const shineGradient = overlayCtx.createLinearGradient(
          0, 0, canvas.width, canvas.height
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        shineGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
        shineGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        overlayCtx.fillStyle = shineGradient;
        overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (state.glass === 'frosted') {
        // Frosted glass effect - blur overlay
        overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply blur effect using CSS filter
        canvas.style.filter = 'blur(0.5px)';
      }

      // Composite the overlay
      ctx.drawImage(overlayCanvas, 0, 0);
    }
  } else {
    canvas.style.filter = 'none';
  }
};

/**
 * Lighten a color by a percentage
 */
const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

/**
 * Darken a color by a percentage
 */
const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
};
