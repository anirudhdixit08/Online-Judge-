
import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-hot-toast';

import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

const AiTutorTab = ({ problem }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiPayload = {
        messages: newMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases.map(tc => `Input: ${tc.input}, Output: ${tc.output}`).join('\n'),
        startCode: problem.startCode.find(sc => sc.language === 'javascript')?.initialCode || ""
      };

      const response = await axiosClient.post('/ai/chat', apiPayload);

      const aiResponseText = response.data.message;
      const aiMessage = { role: "model", parts: [{ text: aiResponseText }] };

      setMessages([...newMessages, aiMessage]);

    } catch (err) {
      toast.error(err.response?.data?.message || "Error communicating with AI.");
      setMessages(messages); 
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-full max-h-[75vh] flex-col">
      
      <div ref={chatContainerRef} className="grow overflow-y-auto pr-2 space-y-3">
        {/* Initial Prompt */}
        {messages.length === 0 && (
          <div className="chat chat-start">
            <div className="chat-bubble rounded-md bg-base-200/70 text-sm leading-6 text-base-content">
              <ReactMarkdown>
                {`Hi! I'm your AI assistant for the problem **${problem.title}**.\n\nHow can I help you? You can ask for hints, code reviews, or the solution.`}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-bubble rounded-md text-sm leading-6 ${msg.role === 'user' ? 'chat-bubble-primary' : 'bg-base-200/70 text-base-content'}`}>
              
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    code: CodeBlock
                  }}
                >
                  {msg.parts[0].text}
                </ReactMarkdown>
              </div>
              
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble rounded-md bg-base-200/70 text-base-content">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        
      </div>

      {/* --- Input Form (no change) --- */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-base-300 pt-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a hint or review..."
          className="input input-bordered w-full"
          disabled={loading}
        />
        <button type="submit" className={`btn btn-primary min-w-20 ${loading ? 'loading' : ''}`} disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AiTutorTab;
