import { WoodType, WoodTypeSelectorProps } from '@/types';
import { getWoodTypeInfo, cn } from '@/utils';

/**
 * Component for selecting wood type (domestic, exotic, plywood)
 */
export function WoodTypeSelector({ 
  selectedType, 
  onTypeSelect, 
  disabled = false 
}: WoodTypeSelectorProps) {
  const woodTypes: WoodType[] = ['domestic', 'exotic', 'plywood'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Select Wood Type
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {woodTypes.map((type) => {
          const info = getWoodTypeInfo(type);
          const isSelected = selectedType === type;
          
          return (
            <button
              key={type}
              onClick={() => onTypeSelect(type)}
              disabled={disabled}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
              aria-pressed={isSelected}
              aria-label={`Select ${info.label} wood type`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-3xl mb-2" role="img" aria-label={info.label}>
                  {info.icon}
                </div>
                
                <h3 className={cn(
                  'font-semibold text-lg mb-1',
                  isSelected ? 'text-primary-900' : 'text-gray-900'
                )}>
                  {info.label}
                </h3>
                
                <p className={cn(
                  'text-sm',
                  isSelected ? 'text-primary-700' : 'text-gray-600'
                )}>
                  {info.description}
                </p>
              </div>
              
              {/* Hover effect */}
              <div className={cn(
                'absolute inset-0 rounded-lg transition-opacity duration-200',
                'bg-gradient-to-br from-primary-500/5 to-primary-600/5',
                isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'
              )} />
            </button>
          );
        })}
      </div>
      
      {selectedType && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Selected:</span> {getWoodTypeInfo(selectedType).label}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for mobile or sidebar use
 */
export function WoodTypeSelectorCompact({ 
  selectedType, 
  onTypeSelect, 
  disabled = false 
}: WoodTypeSelectorProps) {
  const woodTypes: WoodType[] = ['domestic', 'exotic', 'plywood'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Wood Type</h3>
      
      <div className="flex flex-col space-y-2">
        {woodTypes.map((type) => {
          const info = getWoodTypeInfo(type);
          const isSelected = selectedType === type;
          
          return (
            <label
              key={type}
              className={cn(
                'flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200',
                'hover:bg-gray-50',
                disabled && 'opacity-50 cursor-not-allowed',
                isSelected && 'bg-primary-50'
              )}
            >
              <input
                type="radio"
                name="wood-type"
                value={type}
                checked={isSelected}
                onChange={() => onTypeSelect(type)}
                disabled={disabled}
                className="sr-only"
              />
              
              <div className={cn(
                'w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center',
                isSelected
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              )}>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              
              <span className="text-lg mr-2">{info.icon}</span>
              
              <div className="flex-1">
                <div className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-primary-900' : 'text-gray-900'
                )}>
                  {info.label}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Tab-style selector
 */
export function WoodTypeTabs({ 
  selectedType, 
  onTypeSelect, 
  disabled = false 
}: WoodTypeSelectorProps) {
  const woodTypes: WoodType[] = ['domestic', 'exotic', 'plywood'];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Wood Types">
        {woodTypes.map((type) => {
          const info = getWoodTypeInfo(type);
          const isSelected = selectedType === type;
          
          return (
            <button
              key={type}
              onClick={() => onTypeSelect(type)}
              disabled={disabled}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
              aria-current={isSelected ? 'page' : undefined}
            >
              <span className="mr-2">{info.icon}</span>
              {info.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}