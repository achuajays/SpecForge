
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SpecInputForm from './components/SpecInputForm';
import ReportDisplay from './components/ReportDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { generateReports } from './services/geminiService';
import type { SpecForgeFormState, Report } from './types';

export default function App() {
  const [reports, setReports] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specification' | 'blueprint' | 'aiBuilderGuide'>('specification');

  const handleGenerate = useCallback(async (formData: SpecForgeFormState) => {
    setIsLoading(true);
    setError(null);
    setReports(null);
    setActiveTab('specification');

    try {
      const generatedReports = await generateReports(formData);
      setReports(generatedReports);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate reports. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SpecInputForm onGenerate={handleGenerate} isLoading={isLoading} />
            
            <div className="relative min-h-[600px] lg:min-h-0 bg-slate-800/50 rounded-xl border border-slate-700 shadow-2xl shadow-slate-950/50">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 rounded-xl z-10">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg text-slate-300">Forging specifications...</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                  <ErrorMessage message={error} />
                </div>
              )}
              {!isLoading && !reports && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082m.75.082a24.301 24.301 0 014.5 0m4.5 0a24.301 24.301 0 01-4.5 0m-4.5 0v.342c0 .921.32 1.8.868 2.508l.387.387c.21.21.434.394.676.551m-2.276-2.508a23.978 23.978 0 01-4.28 0m4.28 0a23.978 23.978 0 004.28 0m-4.28 0v9.497M5 14.5M5 14.5a24.254 24.254 0 007.5 0m7.5 0a24.254 24.254 0 00-7.5 0M5 14.5v3.375c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-3.375M19 14.5v3.375c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-3.375" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200">Your reports will appear here</h3>
                  <p className="mt-2 text-slate-400">Fill out the form and let the AI forge your technical documents.</p>
                </div>
              )}
              {reports && <ReportDisplay reports={reports} activeTab={activeTab} setActiveTab={setActiveTab} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
