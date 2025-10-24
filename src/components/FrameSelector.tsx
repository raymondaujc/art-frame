import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import type { Frame } from '../types';
import framesData from '../data/frames.json';

export function FrameSelector() {
  const { state, updateFrame } = useProject();
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<'cm' | 'inches'>('cm');
  const [errors, setErrors] = useState<{ custom?: string }>({});

  const frames: Frame[] = framesData as Frame[];

  const handleFrameSelect = (frame: Frame) => {
    if (frame.custom) {
      // Handle custom frame
      const widthValue = parseFloat(customWidth);
      if (!widthValue || widthValue <= 0) {
        setErrors({ custom: 'Please enter a valid frame width' });
        return;
      }

      const widthMm = customUnit === 'cm' ? widthValue * 10 : widthValue * 25.4;
      
      updateFrame({
        ...frame,
        profileWidthMm: widthMm,
      });
    } else {
      updateFrame(frame);
    }
    setErrors({});
  };

  const handleCustomWidthChange = (value: string) => {
    setCustomWidth(value);
    setErrors({});
  };

  const handleCustomUnitChange = (unit: 'cm' | 'inches') => {
    setCustomUnit(unit);
    setErrors({});
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Frame Selection</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className={`
              border-2 rounded-lg p-3 cursor-pointer transition-all
              ${state.frame?.id === frame.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => handleFrameSelect(frame)}
          >
            <div className="space-y-2">
              {/* Frame Preview */}
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 border-4 rounded"
                  style={{
                    borderColor: frame.color || '#666666',
                    borderWidth: `${Math.min(frame.profileWidthMm / 5, 8)}px`,
                  }}
                />
              </div>
              
              {/* Frame Info */}
              <div className="text-center">
                <h4 className="font-medium text-sm text-gray-800">
                  {frame.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {frame.profileWidthMm}mm profile
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Frame Input */}
      {state.frame?.custom && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-800">Custom Frame Width</h4>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="number"
                value={customWidth}
                onChange={(e) => handleCustomWidthChange(e.target.value)}
                placeholder="Enter width"
                step="0.1"
                min="0"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.custom ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
              />
              {errors.custom && (
                <p className="text-red-600 text-xs mt-1">{errors.custom}</p>
              )}
            </div>
            
            <select
              value={customUnit}
              onChange={(e) => handleCustomUnitChange(e.target.value as 'cm' | 'inches')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cm">cm</option>
              <option value="inches">inches</option>
            </select>
          </div>
          
          <button
            onClick={() => handleFrameSelect(state.frame!)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Custom Frame
          </button>
        </div>
      )}

      {/* Selected Frame Display */}
      {state.frame && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-700 text-sm font-medium">Selected Frame:</p>
          <p className="text-green-600 text-sm">
            {state.frame.name} ({state.frame.profileWidthMm}mm profile)
          </p>
        </div>
      )}

      {/* No Frame Selected */}
      {!state.frame && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-700 text-sm">
            Please select a frame to see the preview
          </p>
        </div>
      )}
    </div>
  );
}
