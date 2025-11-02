import React from 'react';

const TestCases = ({ cases }) => (
  <div className="space-y-4">
    {cases.map((example, index) => (
      <div key={index} className="bg-base-300 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
        <div className="space-y-2 text-sm font-mono bg-base-100 p-3 rounded">
          <div><strong>Input:</strong> <pre>{example.input}</pre></div>
          <div><strong>Output:</strong> <pre>{example.output}</pre></div>
          {example.explanation && (
            <div><strong>Explanation:</strong> <pre>{example.explanation}</pre></div>
          )}
        </div>
      </div>
    ))}
  </div>
);

const getDifficultyColor = (diff) => {
  if (diff === 'Easy') return 'text-success';
  if (diff === 'Medium') return 'text-warning';
  if (diff === 'Hard') return 'text-error';
  return 'text-base-content';
};

const DescriptionTab = ({ problem }) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <div className={`badge ${getDifficultyColor(problem.difficulty)} badge-outline`}>
          {problem.difficulty}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {problem.tags.map(tag => (
          <span key={tag} className="badge badge-secondary badge-outline">{tag}</span>
        ))}
      </div>

      <div 
        className="prose max-w-none text-base-content/90"
        dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br />') }}
      />

      <div className="mt-8">
        <TestCases cases={problem.visibleTestCases} />
      </div>
    </div>
  );
};

export default DescriptionTab;