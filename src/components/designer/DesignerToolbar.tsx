
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { KitchenSidePanelProps } from '../../data/interface';

// Kitchen Side Panel Component

export const KitchenSidePanel: React.FC<KitchenSidePanelProps> = ({
  isVisible,
  kitchenItems,
  expandedCategories,
  onToggleCategory,
  onAddKitchenItem
}) => {
  const categories = {
    appliances: 'Kitchen Appliances',
    fixtures: 'Kitchen Fixtures',
    cabinets: 'Cabinets & Storage',
    furniture: 'Kitchen Furniture'
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-300 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Kitchen Items</h2>
        <p className="text-sm text-gray-600 mt-1">Click items to add to your design</p>
      </div>
      
      <div className="p-2">
        {Object.entries(categories).map(([categoryKey, categoryName]) => (
          <div key={categoryKey} className="mb-2">
            <button
              onClick={() => onToggleCategory(categoryKey)}
              className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded transition-colors"
            >
              <span className="font-medium text-gray-700">{categoryName}</span>
              {expandedCategories[categoryKey] ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
            
            {expandedCategories[categoryKey] && (
              <div className="ml-4 space-y-1">
                {Object.entries(kitchenItems)
                  .filter(([, config]) => config.category === categoryKey)
                  .map(([itemKey, config]) => (
                    <button
                      key={itemKey}
                      onClick={() => onAddKitchenItem(itemKey)}
                      className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 rounded text-sm transition-colors"
                      title={`Add ${config.name} to your kitchen design`}
                    >
                      <span className="text-lg">{config.icon}</span>
                      <span className="text-gray-700">{config.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Tip:</strong> Use Select tool to move items</p>
          <p>📏 Select items to adjust dimensions</p>
          <p>🔄 Rotate items in 45° increments</p>
        </div>
      </div>
    </div>
  );
};