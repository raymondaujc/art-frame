import { useRef, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { processImageFile, isValidImageType } from '../utils/imageProcessor';

export function ImageUploader() {
  const { state, updatePainting } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Validate file type
      if (!isValidImageType(file)) {
        throw new Error('Please select a JPG or PNG image file');
      }

      // Process the image
      const imageUrl = await processImageFile(file);
      
      // Update the project state
      updatePainting({
        imageUrl,
        widthMm: 0, // Will be set by DimensionInput
        heightMm: 0, // Will be set by DimensionInput
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      if (!isValidImageType(file)) {
        throw new Error('Please select a JPG or PNG image file');
      }

      const imageUrl = await processImageFile(file);
      
      updatePainting({
        imageUrl,
        widthMm: 0,
        heightMm: 0,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Upload Painting</h3>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${state.painting ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : state.painting ? (
          <div className="space-y-2">
            <div className="text-green-600 text-4xl">✓</div>
            <p className="text-green-700 font-medium">Image uploaded successfully</p>
            <p className="text-sm text-gray-600">Click to upload a different image</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400 text-4xl">📷</div>
            <p className="text-gray-700 font-medium">Drop your image here or click to browse</p>
            <p className="text-sm text-gray-500">Supports JPG and PNG files up to 6MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {state.painting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-700 text-sm">
            Next: Enter the actual dimensions of your painting below
          </p>
        </div>
      )}
    </div>
  );
}
