import React from 'react';

const EditorActions = ({ onRun, onSubmit, runLoading, submitLoading, runButtonText }) => {
  return (
    <div className="p-2 flex justify-end gap-4 bg-base-200 border-t border-base-300">
      <button
        className={`btn btn-sm btn-outline ${runLoading ? 'loading' : ''}`}
        onClick={onRun}
        disabled={runLoading || submitLoading}
      >
        {runButtonText}
      </button>
      <button
        className={`btn btn-sm btn-success ${submitLoading ? 'loading' : ''}`}
        onClick={onSubmit}
        disabled={runLoading || submitLoading}
      >
        Submit
      </button>
    </div>
  );
};

export default EditorActions;