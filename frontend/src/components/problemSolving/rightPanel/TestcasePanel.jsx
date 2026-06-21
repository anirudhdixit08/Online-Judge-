import React from 'react';

const TestcasePanel = ({ customInput, onCustomInputChange }) => {
  return (
    <div className="h-full bg-base-100 p-4 flex flex-col">
      <label className="label">
        <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">Your Input</span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full h-full grow resize-none rounded-md border-base-300 bg-base-200/35 font-mono text-sm leading-6"
        placeholder="Enter your custom input here..."
        value={customInput}
        onChange={(e) => onCustomInputChange(e.target.value)}
      />
    </div>
  );
};

export default TestcasePanel;
