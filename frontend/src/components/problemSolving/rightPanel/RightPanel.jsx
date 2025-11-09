import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-hot-toast';

import RightPanelTabs from './RightPanelTabs';
import CodeEditorPanel from './CodeEditorPanel';
import TestcasePanel from './TestcasePanel';
import ResultPanel from './ResultPanel';
import EditorActions from './EditorActions';

const RightPanel = () => {
  const { id: problemId } = useParams();

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [boilerplate, setBoilerplate] = useState(''); // To reset the editor
  const [activeTab, setActiveTab] = useState('code'); // 'testcase', 'custom', 'result'
  const [customInput, setCustomInput] = useState('');
  
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {

    setRunResult(null);
    setSubmitResult(null);
    setCustomInput('');
    setActiveTab('code');

    const fetchBoilerplate = async () => {
      try {
        const response = await axiosClient.get(`/problem/${problemId}`);
        const startCode = response.data.startCode.find(sc => sc.language === selectedLanguage)?.initialCode;
        setCode(startCode || '');
        setBoilerplate(startCode || ''); 
      } catch (error) {
        console.error("Failed to fetch boilerplate", error);
      }
    };
    fetchBoilerplate();
  }, [problemId, selectedLanguage]);

  
  const handleRun = async () => {
    setRunLoading(true);
    setRunResult(null);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      console.log(response);
      setRunResult({ type: 'run', data: response.data });
      setActiveTab('result'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Error running code.");
    } finally {
      setRunLoading(false);
    }
  };

  const handleCustomRun = async () => {
    setRunLoading(true);
    setRunResult(null);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/run-custom/${problemId}`, { code, language: selectedLanguage, customInput });
      setRunResult({ type: 'custom', data: response.data, input: customInput });
      setActiveTab('result'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Error running custom code.");
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmitLoading(true);
    setRunResult(null);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
      setActiveTab('result');
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting code.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const onRunClick = activeTab === 'testcase' ? handleCustomRun : handleRun;
  
  return (
    <div className="w-full lg:w-1/2 h-full flex flex-col">
      {/* 1. The Tab "Navbar" */}
      <RightPanelTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        runResult={runResult}
        submitResult={submitResult}
      />

      {/* 2. The Content Area (changes based on tab) */}
      <div className="grow min-h-0">
        {activeTab === 'code' && (
          <CodeEditorPanel
            code={code}
            onCodeChange={setCode}
            language={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            boilerplate={boilerplate}
          />
        )}
        {activeTab === 'testcase' && (
          <TestcasePanel
            customInput={customInput}
            onCustomInputChange={setCustomInput}
          />
        )}
        {activeTab === 'result' && (
          <ResultPanel
            runResult={runResult}
            submitResult={submitResult}
          />
        )}
      </div>

      {/* 3. The Action Button Bar */}
      <EditorActions
          onRun={onRunClick} // This now passes the correct function
          onSubmit={handleSubmitCode}
          runLoading={runLoading}
          submitLoading={submitLoading}
          
          runButtonText={activeTab === 'testcase' ? 'Run Custom' : 'Run'}
        />
    </div>
  );
};

export default RightPanel;