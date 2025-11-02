import React from 'react';

const TestcasePanel = ({ customInput, onCustomInputChange }) => {
  return (
    <div className="h-full p-4 bg-base-100 flex flex-col">
      <label className="label">
        <span className="label-text font-semibold">Your Input:</span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full h-full font-mono resize-none grow"
        placeholder="Enter your custom input here..."
        value={customInput}
        onChange={(e) => onCustomInputChange(e.target.value)}
      />
    </div>
  );
};

export default TestcasePanel;