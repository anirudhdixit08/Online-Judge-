import React from 'react';

const EditorActions = ({ onRun, onSubmit, runLoading, submitLoading, runButtonText }) => {
  return (
    <div className="flex shrink-0 justify-end gap-2 border-t border-base-300 bg-base-200/70 px-3 py-2">
      <button
        className={`btn btn-sm btn-outline min-w-20 ${runLoading ? 'loading' : ''}`}
        onClick={onRun}
        disabled={runLoading || submitLoading}
      >
        {runButtonText}
      </button>
      <button
        className={`btn btn-sm btn-success min-w-24 ${submitLoading ? 'loading' : ''}`}
        onClick={onSubmit}
        disabled={runLoading || submitLoading}
      >
        Submit
      </button>
    </div>
  );
};

export default EditorActions;
