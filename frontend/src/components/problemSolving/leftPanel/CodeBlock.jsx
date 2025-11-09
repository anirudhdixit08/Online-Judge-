import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // A nice VS Code theme
import { FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';


const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text'; // Default to plain text
  
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    toast.success('Code copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return <code className="bg-base-300 px-1.5 py-0.5 rounded-md text-sm">{children}</code>;
  }

  return (
    <div className="relative my-4 rounded-lg bg-base-300 text-sm">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="btn btn-ghost btn-xs absolute top-2 right-2 z-10"
        aria-label="Copy code"
      >
        {copied ? <FaCheck className="text-success" /> : <FaCopy />}
      </button>
      
      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1.5rem 1rem',         }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;