import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { toMm, fromMm, validateDimension } from '../utils/unitConverter';

export function MatBoardConfig() {
  const { state, updateMat } = useProject();
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');
  const [uniformMargin, setUniformMargin] = useState<string>('');
  const [individualMargins, setIndividualMargins] = useState({
    top: '',
    right: '',
    bottom: '',
    left: '',
  });
  const [useUniform, setUseUniform] = useState(true);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Initialize values from state
  React.useEffect(() => {
    if (state.mat.enabled) {
      const margin = state.mat.marginMm.top;
      setUniformMargin(fromMm(margin, unit).toString());
      setIndividualMargins({
        top: fromMm(state.mat.marginMm.top, unit).toString(),
        right: fromMm(state.mat.marginMm.right, unit).toString(),
        bottom: fromMm(state.mat.marginMm.bottom, unit).toString(),
        left: fromMm(state.mat.marginMm.left, unit).toString(),
      });
    }
  }, [state.mat, unit]);

  const handleMatToggle = (enabled: boolean) => {
    updateMat({
      ...state.mat,
      enabled,
    });
  };

  const handleUniformMarginChange = (value: string) => {
    setUniformMargin(value);
    const numValue = parseFloat(value);
    
    if (value === '') {
      setErrors(prev => ({ ...prev, uniform: undefined }));
      return;
    }

    if (!validateDimension(numValue)) {
      setErrors(prev => ({ ...prev, uniform: 'Please enter a valid positive number' }));
      return;
    }

    setErrors(prev => ({ ...prev, uniform: undefined }));
    
    const marginMm = toMm(numValue, unit);
    updateMat({
      ...state.mat,
      marginMm: {
        top: marginMm,
        right: marginMm,
        bottom: marginMm,
        left: marginMm,
      },
    });
  };

  const handleIndividualMarginChange = (side: keyof typeof individualMargins, value: string) => {
    setIndividualMargins(prev => ({ ...prev, [side]: value }));
    const numValue = parseFloat(value);
    
    if (value === '') {
      setErrors(prev => ({ ...prev, [side]: undefined }));
      return;
    }

    if (!validateDimension(numValue)) {
      setErrors(prev => ({ ...prev, [side]: 'Please enter a valid positive number' }));
      return;
    }

    setErrors(prev => ({ ...prev, [side]: undefined }));
    
    const marginMm = toMm(numValue, unit);
    updateMat({
      ...state.mat,
      marginMm: {
        ...state.mat.marginMm,
        [side]: marginMm,
      },
    });
  };

  const handleUnitChange = (newUnit: 'cm' | 'inches') => {
    setUnit(newUnit);
    
    // Convert existing values
    if (uniformMargin) {
      const currentMm = toMm(parseFloat(uniformMargin), unit);
      setUniformMargin(fromMm(currentMm, newUnit).toString());
    }
    
    Object.keys(individualMargins).forEach(side => {
      const value = individualMargins[side as keyof typeof individualMargins];
      if (value) {
        const currentMm = toMm(parseFloat(value), unit);
        setIndividualMargins(prev => ({
          ...prev,
          [side]: fromMm(currentMm, newUnit).toString(),
        }));
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Mat Board</h3>
      
      {/* Mat Toggle */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="mat-enabled"
          checked={state.mat.enabled}
          onChange={(e) => handleMatToggle(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="mat-enabled" className="text-sm font-medium text-gray-700">
          Use mat board
        </label>
      </div>

      {state.mat.enabled && (
        <div className="space-y-4 pl-7">
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

          {/* Margin Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin Configuration
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={useUniform}
                  onChange={() => setUseUniform(true)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Uniform</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!useUniform}
                  onChange={() => setUseUniform(false)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Individual sides</span>
              </label>
            </div>
          </div>

          {/* Uniform Margin Input */}
          {useUniform && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margin ({unit})
              </label>
              <input
                type="number"
                value={uniformMargin}
                onChange={(e) => handleUniformMarginChange(e.target.value)}
                placeholder={`Enter margin in ${unit}`}
                step="0.1"
                min="0"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.uniform ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
              />
              {errors.uniform && (
                <p className="text-red-600 text-xs mt-1">{errors.uniform}</p>
              )}
            </div>
          )}

          {/* Individual Margin Inputs */}
          {!useUniform && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Top ({unit})
                </label>
                <input
                  type="number"
                  value={individualMargins.top}
                  onChange={(e) => handleIndividualMarginChange('top', e.target.value)}
                  step="0.1"
                  min="0"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.top ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                {errors.top && (
                  <p className="text-red-600 text-xs mt-1">{errors.top}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Right ({unit})
                </label>
                <input
                  type="number"
                  value={individualMargins.right}
                  onChange={(e) => handleIndividualMarginChange('right', e.target.value)}
                  step="0.1"
                  min="0"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.right ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                {errors.right && (
                  <p className="text-red-600 text-xs mt-1">{errors.right}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bottom ({unit})
                </label>
                <input
                  type="number"
                  value={individualMargins.bottom}
                  onChange={(e) => handleIndividualMarginChange('bottom', e.target.value)}
                  step="0.1"
                  min="0"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.bottom ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                {errors.bottom && (
                  <p className="text-red-600 text-xs mt-1">{errors.bottom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Left ({unit})
                </label>
                <input
                  type="number"
                  value={individualMargins.left}
                  onChange={(e) => handleIndividualMarginChange('left', e.target.value)}
                  step="0.1"
                  min="0"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.left ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                {errors.left && (
                  <p className="text-red-600 text-xs mt-1">{errors.left}</p>
                )}
              </div>
            </div>
          )}

          {/* Current Values Display */}
          {state.mat.enabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm font-medium">Current margins:</p>
              <p className="text-blue-600 text-sm">
                T: {state.mat.marginMm.top.toFixed(1)}mm | 
                R: {state.mat.marginMm.right.toFixed(1)}mm | 
                B: {state.mat.marginMm.bottom.toFixed(1)}mm | 
                L: {state.mat.marginMm.left.toFixed(1)}mm
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
