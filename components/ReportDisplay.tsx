
import React, { useState } from 'react';
import { marked } from 'marked';
import type { Report, ActiveTab, AiBuilderStep } from '../types';
import { DocumentIcon, BlueprintIcon, AiBuilderIcon, CopyIcon, CheckIcon } from './icons';

interface ReportDisplayProps {
  reports: Report;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const TabButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'text-cyan-400 border-cyan-400'
        : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const CopyPromptButton: React.FC<{ prompt: string }> = ({ prompt }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center text-xs px-2 py-1 bg-slate-600/50 text-slate-300 rounded-md hover:bg-slate-500/50 transition-colors"
            aria-label="Copy prompt"
        >
            {copied ? (
                <>
                    <CheckIcon />
                    <span className="ml-1.5">Copied</span>
                </>
            ) : (
                <>
                    <CopyIcon />
                    <span className="ml-1.5">Copy Prompt</span>
                </>
            )}
        </button>
    );
};

export default function ReportDisplay({ reports, activeTab, setActiveTab }: ReportDisplayProps) {
  const [copied, setCopied] = useState(false);

  const getTitle = () => {
     switch (activeTab) {
      case 'specification':
        return 'Specification';
      case 'blueprint':
        return 'Blueprint';
      case 'aiBuilderGuide':
        return 'All Prompts';
      default:
        return '';
    }
  }

  const handleCopyAll = () => {
    let contentToCopy = '';
    if (activeTab === 'specification') {
      contentToCopy = reports.specification;
    } else if (activeTab === 'blueprint') {
      contentToCopy = reports.blueprint;
    } else if (activeTab === 'aiBuilderGuide') {
      contentToCopy = reports.aiBuilderGuide.map(step => step.prompt).join('\n\n---\n\n');
    }
    
    if (contentToCopy) {
        navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (activeTab === 'specification' || activeTab === 'blueprint') {
      const content = activeTab === 'specification' ? reports.specification : reports.blueprint;
      const htmlContent = marked.parse(content) as string;
      return (
        <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-cyan-400 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-slate-100 prose-code:text-amber-400 prose-pre:bg-slate-900/70 prose-pre:rounded-md prose-blockquote:border-l-cyan-500"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }

    if (activeTab === 'aiBuilderGuide') {
      return (
        <div className="space-y-6">
          {reports.aiBuilderGuide.map((step, index) => (
            <article key={index} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
              <h3 className="text-md font-semibold text-cyan-400 mb-3">
                  <span className="text-slate-500 mr-2">{index + 1}.</span>
                  {step.title}
              </h3>
              <div className="bg-slate-950 p-3 rounded-md relative group">
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300">
                  <code>{step.prompt}</code>
                </pre>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyPromptButton prompt={step.prompt} />
                </div>
              </div>
            </article>
          ))}
        </div>
      );
    }
    return null;
  }


  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 border-b border-slate-700 px-2 sm:px-4">
        <nav className="flex space-x-1 sm:space-x-2">
          <TabButton
            label="Specification"
            icon={<DocumentIcon />}
            isActive={activeTab === 'specification'}
            onClick={() => setActiveTab('specification')}
          />
          <TabButton
            label="Blueprint"
            icon={<BlueprintIcon />}
            isActive={activeTab === 'blueprint'}
            onClick={() => setActiveTab('blueprint')}
          />
          <TabButton
            label="AI Guide"
            icon={<AiBuilderIcon />}
            isActive={activeTab === 'aiBuilderGuide'}
            onClick={() => setActiveTab('aiBuilderGuide')}
          />
        </nav>
      </div>

      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto p-6" role="tabpanel" id={`tabpanel-${activeTab}`}>
            {renderContent()}
        </div>
      </div>
       <div className="flex-shrink-0 p-3 bg-slate-800/70 border-t border-slate-700">
        <button
          onClick={handleCopyAll}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span className="ml-2">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span className="ml-2">Copy {getTitle()}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
