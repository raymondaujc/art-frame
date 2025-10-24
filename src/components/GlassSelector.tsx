import { useProject } from '../context/ProjectContext';
import type { GlassType } from '../types';

export function GlassSelector() {
  const { state, updateGlass } = useProject();

  const glassOptions: { value: GlassType; label: string; description: string; icon: string }[] = [
    {
      value: 'none',
      label: 'No Glass',
      description: 'No glass protection',
      icon: '🚫',
    },
    {
      value: 'clear',
      label: 'Clear Glass',
      description: 'Standard clear glass',
      icon: '✨',
    },
    {
      value: 'frosted',
      label: 'Frosted Glass',
      description: 'Frosted glass effect',
      icon: '❄️',
    },
  ];

  const handleGlassChange = (glassType: GlassType) => {
    updateGlass(glassType);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Glass Type</h3>
      
      <div className="space-y-3">
        {glassOptions.map((option) => (
          <div
            key={option.value}
            className={`
              border-2 rounded-lg p-3 cursor-pointer transition-all
              ${state.glass === option.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => handleGlassChange(option.value)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{option.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{option.label}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={state.glass === option.value}
                  onChange={() => handleGlassChange(option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Glass Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-700 text-sm font-medium">Selected Glass:</p>
        <p className="text-blue-600 text-sm">
          {glassOptions.find(opt => opt.value === state.glass)?.label}
        </p>
      </div>
    </div>
  );
}
