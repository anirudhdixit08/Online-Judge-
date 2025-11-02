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
    <div className="h-full flex flex-col">
      <div className="p-2 bg-base-200 flex justify-between items-center">
        <select 
          className="select select-bordered select-sm"
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
          className="btn btn-ghost btn-sm"
          onClick={() => onCodeChange(boilerplate)}
          title="Reset to default code"
        >
          <ResetIcon />
        </button>
      </div>
      <div className="grow min-h-0">
        <Editor
          height="100%"
          language={language === 'c++' ? 'cpp' : language}
          value={code}
          onChange={(val) => onCodeChange(val || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;