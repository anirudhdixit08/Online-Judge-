import React from 'react';

const SolutionsTab = ({ solutions }) => {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Official Solutions</h2>
      <div className="space-y-4">
        {solutions && solutions.length > 0 ? (
          solutions.map((solution, index) => (
            <div key={index} className="overflow-hidden rounded-md border border-base-300 bg-base-100">
              <div className="border-b border-base-300 bg-base-200/50 px-4 py-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/65">{solution.language} Solution</h3>
              </div>
              <div className="p-3">
                <pre className="overflow-x-auto rounded bg-base-200/50 p-3 text-sm leading-6">
                  <code>{solution.solutionCode}</code>
                </pre>
              </div>
            </div>
          ))
        ) : (
          <p className="text-base-content/70">No official solutions are available for this problem.</p>
        )}
      </div>
    </div>
  );
};

export default SolutionsTab;
