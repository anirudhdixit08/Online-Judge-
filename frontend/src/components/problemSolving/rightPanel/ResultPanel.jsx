import React from 'react';

const RunResultDisplay = ({ result }) => {
  const allPassed = result.every(r => r.status_id === 3);
  return (
    <div className={`p-4 rounded-lg ${allPassed ? 'bg-success/10' : 'bg-error/10'}`}>
      <h3 className={`font-bold text-lg ${allPassed ? 'text-success' : 'text-error'}`}>
        {allPassed ? '✓ All Test Cases Passed' : '✗ Test Cases Failed'}
      </h3>
      <div className="mt-4 space-y-3">
        {result.map((tc, i) => (
          <div key={i} className="bg-base-300 p-3 rounded text-xs">
            <h4 className="font-semibold mb-2">Case {i + 1}</h4>
            <div className="font-mono space-y-1">
              <div><strong>Input:</strong> <pre>{tc.stdin}</pre></div>
              <div><strong>Expected:</strong> <pre>{tc.expected_output}</pre></div>
              <div><strong>Output:</strong> <pre>{tc.stdout || 'N/A'}</pre></div>
              <div className={`font-bold ${tc.status_id === 3 ? 'text-success' : 'text-error'}`}>
                {tc.status_id === 3 ? '✓ Passed' : `✗ ${tc.status.description}`}
              </div>
              {tc.stderr && (
                <div className="text-error mt-2"><strong>Error:</strong> <pre>{Buffer.from(tc.stderr, 'base64').toString('utf-8')}</pre></div>
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
    <div className={`p-4 rounded-lg ${isAccepted ? 'bg-success/10' : 'bg-error/10'}`}>
      <h3 className={`font-bold text-lg ${isAccepted ? 'text-success' : 'text-error'}`}>
        {isAccepted ? '✓ Passed' : `✗ ${result.status}`}
      </h3>
      <div className="mt-4 space-y-3 font-mono text-xs">
        <div><strong>Your Input:</strong> <pre>{input}</pre></div>
        <div><strong>Expected:</strong> <pre>{result.expectedOutput}</pre></div>
        <div><strong>Your Output:</strong> <pre>{result.output || 'N/A'}</pre></div>
        {result.error && (
            <div className="text-error mt-2"><strong>Error:</strong> <pre>{result.error}</pre></div>
        )}
      </div>
    </div>
  );
};

const SubmitResultDisplay = ({ result }) => (
  <div className={`p-4 rounded-lg ${result.accepted ? 'bg-success/10' : 'bg-error/10'}`}>
    <h3 className={`font-bold text-lg ${result.accepted ? 'text-success' : 'text-error'}`}>
      {result.accepted ? '🎉 Accepted' : `❌ ${result.error || 'Submission Failed'}`}
    </h3>
    <div className="mt-4 space-y-2">
      <p>Test Cases Passed: {result.testCasesPassed} / {result.totalTestCases}</p>
      <p>Runtime: {result.runtime.toFixed(3)} sec</p>
      <p>Memory: {result.memory} KB</p>
    </div>
  </div>
);

const ResultPanel = ({ runResult, submitResult }) => {
  return (
    <div className="h-full overflow-y-auto p-4 bg-base-100">
      {!runResult && !submitResult && (
        <p className="text-base-content/70">Click "Run" or "Submit" to see your results.</p>
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