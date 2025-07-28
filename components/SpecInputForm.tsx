
import React, { useState } from 'react';
import type { SpecForgeFormState } from '../types';

interface SpecInputFormProps {
  onGenerate: (formData: SpecForgeFormState) => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  id: keyof SpecForgeFormState;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
}> = ({ id, label, placeholder, value, onChange, isTextArea = false }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: "w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {isTextArea ? (
        <textarea {...commonProps} rows={5} />
      ) : (
        <input type="text" {...commonProps} />
      )}
    </div>
  );
};

export default function SpecInputForm({ onGenerate, isLoading }: SpecInputFormProps) {
  const [formData, setFormData] = useState<SpecForgeFormState>({
    idea: '',
    targetUsers: '',
    goals: '',
    techStack: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idea.trim()) {
      onGenerate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg">
      <div>
        <label htmlFor="idea" className="block text-lg font-semibold text-cyan-400 mb-2">
          Your Core Idea
        </label>
        <textarea
          id="idea"
          name="idea"
          value={formData.idea}
          onChange={handleChange}
          required
          rows={6}
          className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-base"
          placeholder="Describe your app, product, or feature in a few sentences..."
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Optional Details</h3>
        <div className="space-y-4">
            <InputField id="targetUsers" label="Target Users" placeholder="e.g., small business owners, students, developers" value={formData.targetUsers} onChange={handleChange} />
            <InputField id="goals" label="Primary Goals" placeholder="e.g., increase productivity, provide entertainment" value={formData.goals} onChange={handleChange} />
            <InputField id="techStack" label="Preferred Technologies (if any)" placeholder="e.g., React, Python, PostgreSQL, AWS" value={formData.techStack} onChange={handleChange} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.idea.trim()}
        className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-md hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-500"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Forge My Specs'
        )}
      </button>
    </form>
  );
}
