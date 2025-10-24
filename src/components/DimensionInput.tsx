import { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { toMm, fromMm, validateDimension } from '../utils/unitConverter';

export function DimensionInput() {
  const { state, updatePainting } = useProject();
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [errors, setErrors] = useState<{ width?: string; height?: string }>({});

  // Update local state when painting changes
  useEffect(() => {
    if (state.painting && (state.painting.widthMm > 0 || state.painting.heightMm > 0)) {
      setWidth(fromMm(state.painting.widthMm, unit).toString());
      setHeight(fromMm(state.painting.heightMm, unit).toString());
    }
  }, [state.painting, unit]);

  const handleWidthChange = (value: string) => {
    setWidth(value);
    const numValue = parseFloat(value);
    
    if (value === '') {
      setErrors(prev => ({ ...prev, width: undefined }));
      return;
    }

    if (!validateDimension(numValue)) {
      setErrors(prev => ({ ...prev, width: 'Please enter a valid positive number' }));
      return;
    }

    setErrors(prev => ({ ...prev, width: undefined }));
    
    if (state.painting) {
      const widthMm = toMm(numValue, unit);
      updatePainting({
        ...state.painting,
        widthMm,
      });
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    const numValue = parseFloat(value);
    
    if (value === '') {
      setErrors(prev => ({ ...prev, height: undefined }));
      return;
    }

    if (!validateDimension(numValue)) {
      setErrors(prev => ({ ...prev, height: 'Please enter a valid positive number' }));
      return;
    }

    setErrors(prev => ({ ...prev, height: undefined }));
    
    if (state.painting) {
      const heightMm = toMm(numValue, unit);
      updatePainting({
        ...state.painting,
        heightMm,
      });
    }
  };

  const handleUnitChange = (newUnit: 'cm' | 'inches') => {
    setUnit(newUnit);
    
    // Convert existing values to new unit
    if (state.painting && state.painting.widthMm > 0) {
      setWidth(fromMm(state.painting.widthMm, newUnit).toString());
    }
    if (state.painting && state.painting.heightMm > 0) {
      setHeight(fromMm(state.painting.heightMm, newUnit).toString());
    }
  };

  if (!state.painting) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Painting Dimensions</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Please upload an image first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Painting Dimensions</h3>
      
      <div className="space-y-4">
        {/* Unit Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="cm"
                checked={unit === 'cm'}
                onChange={() => handleUnitChange('cm')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Centimeters</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="inches"
                checked={unit === 'inches'}
                onChange={() => handleUnitChange('inches')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Inches</span>
            </label>
          </div>
        </div>

        {/* Width Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width ({unit})
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            placeholder={`Enter width in ${unit}`}
            step="0.1"
            min="0"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.width ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            `}
          />
          {errors.width && (
            <p className="text-red-600 text-xs mt-1">{errors.width}</p>
          )}
        </div>

        {/* Height Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height ({unit})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            placeholder={`Enter height in ${unit}`}
            step="0.1"
            min="0"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.height ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            `}
          />
          {errors.height && (
            <p className="text-red-600 text-xs mt-1">{errors.height}</p>
          )}
        </div>

        {/* Current Values Display */}
        {(state.painting.widthMm > 0 || state.painting.heightMm > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm font-medium">Current dimensions:</p>
            <p className="text-blue-600 text-sm">
              {state.painting.widthMm > 0 && `${state.painting.widthMm.toFixed(1)}mm × `}
              {state.painting.heightMm > 0 && `${state.painting.heightMm.toFixed(1)}mm`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
