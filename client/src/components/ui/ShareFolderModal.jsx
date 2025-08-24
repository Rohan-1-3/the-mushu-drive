
import React, { useState } from 'react';
import { unitSeconds } from '../../lib/fileAndFolderHelper';

function ShareFolderModal({ isOpen, onClose, onShare }) {
  const [shareDuration, setShareDuration] = useState(3600);
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState('hour');
  const [isCustom, setIsCustom] = useState(false);

  const predefinedOptions = [
    { label: '1 hour', value: 3600 },
    { label: '1 day', value: 86400 },
    { label: '1 week', value: 604800 },
    { label: '1 month', value: 2592000 },
    { label: '1 year', value: 31536000 }
  ];

  const handleOptionChange = (e) => {
    setShareDuration(Number(e.target.value));
    setIsCustom(false);
    setCustomValue('');
  };

  const handleCustomValueChange = (e) => {
    setCustomValue(e.target.value);
    setIsCustom(true);
  };

  const handleCustomUnitChange = (e) => {
    setCustomUnit(e.target.value);
    setIsCustom(true);
  };

  const handleCustomRadio = () => {
    setIsCustom(true);
    setShareDuration(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let duration = shareDuration;
    if (isCustom && customValue && customUnit) {
      duration = Number(customValue) * unitSeconds[customUnit];
    }
    if (duration > 0) {
      onShare(duration);
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 shadow-2xl max-w-md w-full">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-2xl">📤</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
              Share Folder
            </h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light/80 dark:text-text-dark/80 mb-2">
              Select sharing duration
            </label>
            <div className="space-y-2">
              {predefinedOptions.map(opt => (
                <label key={opt.value} className="flex items-center text-text-light dark:text-text-dark">
                  <input
                    type="radio"
                    name="shareDuration"
                    value={opt.value}
                    checked={shareDuration === opt.value && !isCustom}
                    onChange={handleOptionChange}
                    className="mr-2 accent-blue-600 dark:accent-blue-400"
                  />
                  {opt.label}
                </label>
              ))}
              <label className="flex items-center text-text-light dark:text-text-dark">
                <input
                  type="radio"
                  name="shareDuration"
                  value="custom"
                  checked={isCustom}
                  onChange={handleCustomRadio}
                  className="mr-2 accent-blue-600 dark:accent-blue-400"
                />
                Custom:
                <input
                  type="number"
                  min="1"
                  value={customValue}
                  onChange={handleCustomValueChange}
                  className="ml-2 border rounded-lg px-2 py-1 w-20 bg-white/20 dark:bg-black/20 text-text-light dark:text-text-dark border-white/30 dark:border-white/20 placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
                  placeholder="Value"
                  style={{ MozAppearance: 'textfield' }}
                />
                <select
                  value={customUnit}
                  onChange={handleCustomUnitChange}
                  className="ml-2 border rounded-lg px-2 py-1 bg-white/95 dark:bg-gray-900/95 text-text-light dark:text-text-dark border-white/30 dark:border-white/20"
                >
                  <option value="hour">Hour(s)</option>
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!isCustom && shareDuration <= 0) || (isCustom && (!customValue || Number(customValue) <= 0))}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShareFolderModal;
