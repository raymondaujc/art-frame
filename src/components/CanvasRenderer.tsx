import { useRef, useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { renderFramedPainting } from '../utils/canvasRenderer';

export function CanvasRenderer() {
  const { state } = useProject();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderCanvas = async () => {
    if (!canvasRef.current || !state.painting || !state.frame) {
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      // Load the image
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = state.painting!.imageUrl;
      });

      // Render the framed painting
      await renderFramedPainting(canvasRef.current, state, image);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render image');
    } finally {
      setIsRendering(false);
    }
  };

  // Re-render when state changes
  useEffect(() => {
    if (state.painting && state.frame) {
      renderCanvas();
    }
  }, [state.painting, state.mat, state.frame, state.glass]);

  const canRender = state.painting && state.frame && state.painting.widthMm > 0 && state.painting.heightMm > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        {canRender ? (
          <div className="space-y-3">
            {/* Canvas Container */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 rounded-lg shadow-sm"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                {isRendering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Rendering...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dimensions Info */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Total size: {state.painting?.widthMm.toFixed(1)}mm × {state.painting?.heightMm.toFixed(1)}mm
                {state.mat.enabled && (
                  <span className="block">
                    + {state.mat.marginMm.top.toFixed(1)}mm mat margins
                  </span>
                )}
                <span className="block">
                  + {state.frame?.profileWidthMm}mm frame profile
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🖼️</div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              {!state.painting ? 'Upload an image to get started' :
               !state.frame ? 'Select a frame to see preview' :
               state.painting.widthMm === 0 || state.painting.heightMm === 0 ? 'Enter painting dimensions' :
               'Ready to render'}
            </h4>
            <p className="text-sm text-gray-500">
              Complete the setup steps to see your framed painting preview
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Render Status */}
      {canRender && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-700 text-sm font-medium">Ready to render</p>
          <p className="text-green-600 text-sm">
            All components configured - preview is live
          </p>
        </div>
      )}
    </div>
  );
}
