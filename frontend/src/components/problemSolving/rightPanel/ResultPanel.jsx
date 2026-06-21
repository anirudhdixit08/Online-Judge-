import React from 'react';

const RunResultDisplay = ({ result }) => {
  const allPassed = result.every(r => r.status_id === 3);
  return (
    <div className="rounded-md border border-base-300 bg-base-100">
      <div className="border-b border-base-300 px-4 py-3">
      <h3 className={`font-bold text-base ${allPassed ? 'text-success' : 'text-error'}`}>
        {allPassed ? '✓ All Test Cases Passed' : '✗ Test Cases Failed'}
      </h3>
      </div>
      <div className="space-y-3 p-3">
        {result.map((tc, i) => (
          <div key={i} className="rounded-md border border-base-300 bg-base-200/35 p-3 text-xs">
            <h4 className="mb-2 font-semibold text-base-content/85">Case {i + 1}</h4>
            <div className="space-y-2 font-mono">
              <div><strong>Input:</strong> <pre className="mt-1 whitespace-pre-wrap">{tc.stdin}</pre></div>
              <div><strong>Expected:</strong> <pre className="mt-1 whitespace-pre-wrap">{tc.expected_output}</pre></div>
              <div><strong>Output:</strong> <pre className="mt-1 whitespace-pre-wrap">{tc.stdout || 'N/A'}</pre></div>
              <div className={`font-bold ${tc.status_id === 3 ? 'text-success' : 'text-error'}`}>
                {tc.status_id === 3 ? '✓ Passed' : `✗ ${tc.status?.description || 'Failed'}`}
              </div>
              {tc.stderr && (
                <div className="text-error mt-2"><strong>Error:</strong> <pre className="mt-1 whitespace-pre-wrap">{tc.stderr}</pre></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomRunResultDisplay = ({ result, input }) => {
  const isAccepted = result.status === 'Accepted';
  return (
    <div className="rounded-md border border-base-300 bg-base-100">
      <div className="border-b border-base-300 px-4 py-3">
      <h3 className={`font-bold text-base ${isAccepted ? 'text-success' : 'text-error'}`}>
        {isAccepted ? '✓ Passed' : `✗ ${result.status}`}
      </h3>
      </div>
      <div className="space-y-3 p-4 font-mono text-xs">
        <div><strong>Your Input:</strong> <pre className="mt-1 whitespace-pre-wrap rounded bg-base-200/50 p-2">{input}</pre></div>
        <div><strong>Expected:</strong> <pre className="mt-1 whitespace-pre-wrap rounded bg-base-200/50 p-2">{result.expectedOutput}</pre></div>
        <div><strong>Your Output:</strong> <pre className="mt-1 whitespace-pre-wrap rounded bg-base-200/50 p-2">{result.output || 'N/A'}</pre></div>
        {result.error && (
            <div className="text-error mt-2"><strong>Error:</strong> <pre className="mt-1 whitespace-pre-wrap rounded bg-base-200/50 p-2">{result.error}</pre></div>
        )}
      </div>
    </div>
  );
};

const SubmitResultDisplay = ({ result }) => (
  <div className="rounded-md border border-base-300 bg-base-100">
    <div className="border-b border-base-300 px-4 py-3">
    <h3 className={`font-bold text-base ${result.accepted ? 'text-success' : 'text-error'}`}>
      {result.accepted ? '🎉 Accepted' : `❌ ${result.error || 'Submission Failed'}`}
    </h3>
    </div>
    <div className="grid gap-2 p-4 text-sm sm:grid-cols-3">
      <p>Test Cases Passed: {result.testCasesPassed} / {result.totalTestCases}</p>
      <p>Runtime: {result.runtime.toFixed(3)} sec</p>
      <p>Memory: {result.memory} KB</p>
    </div>
  </div>
);

const ResultPanel = ({ runResult, submitResult }) => {
  return (
    <div className="h-full overflow-y-auto bg-base-100 p-4">
      {!runResult && !submitResult && (
        <p className="rounded-md border border-base-300 bg-base-200/35 p-4 text-sm text-base-content/70">Click "Run" or "Submit" to see your results.</p>
      )}
      
      {submitResult && <SubmitResultDisplay result={submitResult} />}

      {!submitResult && runResult && (
        runResult.type === 'custom' ? (
          <CustomRunResultDisplay result={runResult.data} input={runResult.input} />
        ) : (
          <RunResultDisplay result={runResult.data} />
        )
      )}
    </div>
  );
};

export default ResultPanel;
