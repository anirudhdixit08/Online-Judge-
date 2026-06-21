import React from 'react';

const TestCases = ({ cases }) => (
  <div className="space-y-3">
    {cases.map((example, index) => (
      <div key={index} className="rounded-md border border-base-300 bg-base-200/40">
        <div className="border-b border-base-300 px-3 py-2">
          <h4 className="text-sm font-semibold text-base-content/85">Example {index + 1}</h4>
        </div>
        <div className="space-y-2 px-3 py-3 text-sm">
          <div>
            <span className="text-xs font-semibold uppercase text-base-content/55">Input</span>
            <pre className="mt-1 overflow-x-auto rounded bg-base-100 px-3 py-2 font-mono text-xs leading-5">{example.input}</pre>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-base-content/55">Output</span>
            <pre className="mt-1 overflow-x-auto rounded bg-base-100 px-3 py-2 font-mono text-xs leading-5">{example.output}</pre>
          </div>
          {example.explanation && (
            <div>
              <span className="text-xs font-semibold uppercase text-base-content/55">Explanation</span>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-base-100 px-3 py-2 font-mono text-xs leading-5">{example.explanation}</pre>
            </div>
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
    <div className="max-w-3xl">
      <div className="mb-4 border-b border-base-300 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold leading-tight text-base-content">{problem.title}</h1>
          <div className={`badge badge-outline px-3 py-3 text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {problem.tags.map(tag => (
            <span key={tag} className="badge badge-secondary badge-outline px-3 text-xs font-medium">{tag}</span>
          ))}
        </div>
      </div>

      <div 
        className="prose prose-sm max-w-none leading-7 text-base-content/85"
        dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br />') }}
      />

      <div className="mt-7">
        <TestCases cases={problem.visibleTestCases} />
      </div>
    </div>
  );
};

export default DescriptionTab;
