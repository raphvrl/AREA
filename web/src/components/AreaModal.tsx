import React, { useState } from 'react';
import { Action, Reaction } from '../types/area';
import { motion } from 'framer-motion';
import { IoAdd, IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';

interface AreaModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  areaName: string;
  setAreaName: (name: string) => void;
  selectedAction: Action | null;
  setSelectedAction: (action: Action | null) => void;
  selectedReaction: Reaction | null;
  setSelectedReaction: (reaction: Reaction | null) => void;
  actionOption: string;
  setActionOption: (option: string) => void;
  reactionOption: string;
  setReactionOption: (option: string) => void;
  availableActions: Action[];
  availableReactions: Reaction[];
  isDarkMode: boolean;
}

export const AreaModal: React.FC<AreaModalProps> = ({
  show,
  onClose,
  onSubmit,
  areaName,
  setAreaName,
  selectedAction,
  setSelectedAction,
  selectedReaction,
  setSelectedReaction,
  actionOption,
  setActionOption,
  reactionOption,
  setReactionOption,
  availableActions,
  availableReactions,
  isDarkMode
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  if (!show) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`max-w-md w-full rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } p-6 space-y-6`}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>
              Create New AREA
            </h2>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <IoClose className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Give your AREA a name..."
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200'
              } focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            />
          </div>

          {/* Actions Selection */}
          <div className="space-y-2">
            <motion.button
              onClick={() => setShowActions(!showActions)}
              className={`w-full p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              } flex items-center justify-between group transition-all duration-200`}
            >
              <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                {selectedAction ? selectedAction.description : 'Select an action'}
              </span>
              <motion.div
                animate={{ rotate: showActions ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IoChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </motion.div>
            </motion.button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`grid grid-cols-2 gap-2 p-2 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                {availableActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedAction(action);
                      setShowActions(false);
                    }}
                    className={`p-3 rounded-lg ${
                      selectedAction?.id === action.id
                        ? 'bg-blue-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } transition-all duration-200 text-sm font-medium`}
                  >
                    {action.description}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Action Option Input */}
          {selectedAction?.hasOptions && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter action option..."
                value={actionOption}
                onChange={(e) => setActionOption(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200'
                } focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
            </div>
          )}

          {/* Reactions Selection */}
          <div className="space-y-2">
            <motion.button
              onClick={() => setShowReactions(!showReactions)}
              className={`w-full p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              } flex items-center justify-between group transition-all duration-200`}
            >
              <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                {selectedReaction ? selectedReaction.description : 'Select a reaction'}
              </span>
              <motion.div
                animate={{ rotate: showReactions ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IoChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </motion.div>
            </motion.button>

            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`grid grid-cols-2 gap-2 p-2 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                {availableReactions.map((reaction) => (
                  <motion.button
                    key={reaction.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedReaction(reaction);
                      setShowReactions(false);
                    }}
                    className={`p-3 rounded-lg ${
                      selectedReaction?.id === reaction.id
                        ? 'bg-blue-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } transition-all duration-200 text-sm font-medium`}
                  >
                    {reaction.description}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Reaction Option Input */}
          {selectedReaction?.hasOptions && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter reaction option..."
                value={reactionOption}
                onChange={(e) => setReactionOption(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200'
                } focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            disabled={!selectedAction || !selectedReaction || !areaName}
            className={`w-full py-4 rounded-xl font-medium text-white
              bg-gradient-to-r from-blue-500 to-purple-600 
              hover:from-blue-600 hover:to-purple-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-lg hover:shadow-xl
            `}
          >
            Create AREA
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
