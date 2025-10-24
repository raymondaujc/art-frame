export interface Painting {
  imageUrl: string;
  widthMm: number;
  heightMm: number;
}

export interface Mat {
  enabled: boolean;
  marginMm: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Frame {
  id: string;
  name: string;
  profileWidthMm: number;
  custom: boolean;
  textureUrl?: string;
  color?: string;
}

export type GlassType = 'none' | 'clear' | 'frosted';

export interface ProjectState {
  painting: Painting | null;
  mat: Mat;
  frame: Frame | null;
  glass: GlassType;
}

export interface UnitConversion {
  value: number;
  unit: 'cm' | 'inches';
}

export interface CanvasDimensions {
  totalWidthMm: number;
  totalHeightMm: number;
  scaleFactor: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface RenderLayers {
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  mat: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  painting: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
