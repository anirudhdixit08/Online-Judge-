import React from 'react';

const SolutionsTab = ({ solutions }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Official Solutions</h2>
      <div className="space-y-6">
        {solutions && solutions.length > 0 ? (
          solutions.map((solution, index) => (
            <div key={index} className="border border-base-300 rounded-lg">
              <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold uppercase">{solution.language} Solution</h3>
              </div>
              <div className="p-4">
                <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
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