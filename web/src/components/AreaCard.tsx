import React from 'react';
import { Area } from '../types/area';
import { motion } from 'framer-motion';
import { availableActions, availableReactions } from '../constants/actions';

interface AreaCardProps {
  area: Area;
  onToggle: (area: Area) => void;
  onDelete: (id: string) => void;
  isDarkMode: boolean;
}

export const AreaCard: React.FC<AreaCardProps> = ({
  area,
  onToggle,
  onDelete,
  isDarkMode,
}) => {
  return (
    <div
      className={`p-4 rounded-lg shadow ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{area.name}</h3>
          <div className="flex space-x-3">
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={area.isActive}
                onChange={async () => {
                  try {
                    await onToggle({
                      ...area,
                      isActive: !area.isActive, // Invert current state
                    });
                    // The parent component should handle the API call and state update
                  } catch (error) {
                    console.error('Failed to toggle area:', error);
                    // Optionally add error handling UI feedback here
                  }
                }}
              />
              <div
                className={`w-12 h-6 bg-gray-200 rounded-full peer 
              peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
              ${area.isActive ? 'peer-checked:bg-blue-600' : 'dark:bg-gray-700'} 
              transition-all duration-200 
              after:content-[''] after:absolute after:top-2 after:left-[2px] 
              after:bg-white after:rounded-full after:h-5 after:w-5 
              after:shadow-sm after:transition-all
              peer-checked:after:translate-x-6 peer-checked:after:border-white
              dark:border-gray-600`}
              ></div>
            </label>

            {/* Delete button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(area.id)}
              className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 
                hover:from-red-600 hover:to-red-700 text-white shadow-lg
                transition-all duration-200 transform hover:shadow-red-500/50
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Delete AREA"
            >
              <svg
                className="w-5 h-5 transform transition-transform duration-200 hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.button>
          </div>
        </div>
        <div className="flex-1 text-sm">
          <p className="mb-1">
            <span className="font-medium">Action:</span>{' '}
            {availableActions.find((a) => a.id === area.action.type)
              ?.description || area.action.type}
          </p>
          <p>
            <span className="font-medium">Reaction:</span>{' '}
            {availableReactions.find((r) => r.id === area.reaction.type)
              ?.description || area.reaction.type}
          </p>
          <>{console.log('Area:', area)}</>
        </div>
      </div>
    </div>
  );
};
