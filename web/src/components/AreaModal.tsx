import React from 'react';
import { Action, Reaction } from '../types/area';

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
  availableActions,
  availableReactions,
  isDarkMode
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`max-w-md w-full rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Create New AREA
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="AREA Name"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <select
            value={selectedAction?.id || ''}
            onChange={(e) => setSelectedAction(availableActions.find(a => a.id === e.target.value) || null)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select an Action</option>
            {availableActions.map(action => (
              <option key={action.id} value={action.id}>
                {action.description}
              </option>
            ))}
          </select>
          <select
            value={selectedReaction?.id || ''}
            onChange={(e) => setSelectedReaction(availableReactions.find(r => r.id === e.target.value) || null)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a Reaction</option>
            {availableReactions.map(reaction => (
              <option key={reaction.id} value={reaction.id}>
                {reaction.description}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={!selectedAction || !selectedReaction || !areaName}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};