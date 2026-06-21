import React from 'react';
import Editor from '@monaco-editor/react';

// Icon for Reset
const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2m0 0H15" />
  </svg>
);

const CodeEditorPanel = ({ code, onCodeChange, language, onLanguageChange, boilerplate }) => {
  return (
    <div className="h-full flex flex-col bg-base-100">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-base-300 bg-base-200/45 px-3">
        <select 
          className="select select-bordered select-sm min-h-8 h-8 text-xs font-semibold"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="c">C</option>
        </select>
        <button 
          className="btn btn-ghost btn-sm min-h-8 h-8 px-2 text-base-content/70 hover:text-base-content"
          onClick={() => onCodeChange(boilerplate)}
          title="Reset to default code"
        >
          <ResetIcon />
        </button>
      </div>
      <div className="grow min-h-0 bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={language === 'c++' ? 'cpp' : language}
          value={code}
          onChange={(val) => onCodeChange(val || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineHeight: 21,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'line',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
