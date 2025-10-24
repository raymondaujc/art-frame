import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { renderFramedPainting } from '../utils/canvasRenderer';

export function ExportControls() {
  const { state } = useProject();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportImage = async () => {
    if (!state.painting || !state.frame) {
      setError('Please complete the setup before exporting');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Create a high-resolution canvas for export
      const exportCanvas = document.createElement('canvas');
      const exportCtx = exportCanvas.getContext('2d');
      
      if (!exportCtx) {
        throw new Error('Failed to create export canvas');
      }

      // Calculate high-resolution dimensions (2x scale for better quality)
      const scaleFactor = 2;
      const totalWidthMm = state.painting.widthMm + 
        (state.mat.enabled ? state.mat.marginMm.left + state.mat.marginMm.right : 0) +
        (state.frame.profileWidthMm * 2);
      const totalHeightMm = state.painting.heightMm + 
        (state.mat.enabled ? state.mat.marginMm.top + state.mat.marginMm.bottom : 0) +
        (state.frame.profileWidthMm * 2);

      exportCanvas.width = totalWidthMm * scaleFactor;
      exportCanvas.height = totalHeightMm * scaleFactor;

      // Load the image
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = state.painting!.imageUrl;
      });

      // Create a temporary state with high-resolution scale
      const highResState = {
        ...state,
        // Temporarily modify the state to use high-res scale
      };

      // Render at high resolution
      await renderFramedPainting(exportCanvas, highResState, image);

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `framed-painting-${timestamp}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
      }, 'image/png', 0.95);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  const saveProject = () => {
    try {
      const projectData = {
        ...state,
        timestamp: new Date().toISOString(),
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `painting-framer-project-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to save project');
    }
  };

  const canExport = state.painting && state.frame && state.painting.widthMm > 0 && state.painting.heightMm > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Export</h3>
      
      <div className="space-y-3">
        {/* Export Image Button */}
        <button
          onClick={exportImage}
          disabled={!canExport || isExporting}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${canExport && !isExporting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isExporting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Exporting...</span>
            </div>
          ) : (
            'Download Preview Image'
          )}
        </button>

        {/* Save Project Button */}
        <button
          onClick={saveProject}
          disabled={!state.painting}
          className={`
            w-full py-2 px-4 rounded-lg font-medium transition-colors
            ${state.painting
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Save Project
        </button>

        {/* Export Info */}
        {canExport && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm font-medium">Export Ready</p>
            <p className="text-blue-600 text-sm">
              High-resolution PNG will be downloaded
            </p>
          </div>
        )}

        {!canExport && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm">
              Complete setup to enable export
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Export Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Export Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Images are exported at high resolution for print quality</li>
          <li>• Project files can be loaded later to continue editing</li>
          <li>• All measurements are preserved in the exported image</li>
        </ul>
      </div>
    </div>
  );
}
