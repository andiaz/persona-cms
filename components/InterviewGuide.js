// components/InterviewGuide.js
import { useState } from 'react';

const STAKEHOLDER_QUESTIONS = [
  {
    question: 'Who are your primary users?',
    description: 'Identify the main user groups and their characteristics',
  },
  {
    question: 'What problems are you solving for them?',
    description: 'Understand the core value proposition',
  },
  {
    question: 'What business goals depend on user behavior?',
    description: 'Connect user actions to business outcomes',
  },
  {
    question: 'What user behaviors would indicate success?',
    description: 'Define measurable success criteria',
  },
  {
    question: 'What constraints affect the user experience?',
    description: 'Technical, regulatory, or resource limitations',
  },
  {
    question: 'Who else interacts with the system?',
    description: 'Secondary users, administrators, support staff',
  },
  {
    question: 'What user research has been done?',
    description: 'Existing insights, surveys, analytics data',
  },
  {
    question: 'What assumptions need validation?',
    description: 'Hypotheses that should be tested with users',
  },
];

const USER_QUESTIONS = [
  {
    question: 'Tell me about your typical day at work.',
    description: 'Open-ended to understand context and workflow',
  },
  {
    question: 'What tools do you currently use for [task]?',
    description: 'Identify existing solutions and switching costs',
  },
  {
    question: "What's the most frustrating part of [process]?",
    description: 'Uncover pain points and emotional triggers',
  },
  {
    question: 'Walk me through how you accomplish [goal].',
    description: 'Observe actual workflows and workarounds',
  },
  {
    question: 'What would make your work easier?',
    description: 'Discover unmet needs and desires',
  },
  {
    question: 'How do you currently solve [problem]?',
    description: 'Understand existing coping strategies',
  },
  {
    question: 'What information do you need to make decisions?',
    description: 'Identify data requirements and decision points',
  },
  {
    question: 'Who do you collaborate with on [task]?',
    description: 'Map relationships and communication flows',
  },
  {
    question: 'What workarounds have you developed?',
    description: 'Find hidden pain points and innovation opportunities',
  },
  {
    question: 'Describe a recent successful/unsuccessful experience.',
    description: 'Get specific stories and emotional context',
  },
];

export default function InterviewGuide({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('stakeholder');

  if (!isOpen) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-in slide-in-from-top duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Interview Question Reference</h3>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close guide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('stakeholder')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'stakeholder'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stakeholder Questions
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Interview Questions
        </button>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg border border-blue-100 divide-y divide-blue-50 max-h-64 overflow-y-auto">
        {(activeTab === 'stakeholder' ? STAKEHOLDER_QUESTIONS : USER_QUESTIONS).map((item, index) => (
          <div key={index} className="px-4 py-3">
            <p className="text-sm font-medium text-slate-900">{item.question}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Use these questions as a starting point. Adapt them based on your specific context and research goals.
      </p>
    </div>
  );
}

// Standalone version for the help page or separate access
export function InterviewGuideStandalone() {
  const [activeTab, setActiveTab] = useState('stakeholder');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Interview Question Reference</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('stakeholder')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'stakeholder'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Stakeholder Questions
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'user'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          User Interview Questions
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {(activeTab === 'stakeholder' ? STAKEHOLDER_QUESTIONS : USER_QUESTIONS).map((item, index) => (
          <div key={index} className="bg-slate-50 rounded-lg p-4">
            <p className="font-medium text-slate-900">{item.question}</p>
            <p className="text-sm text-slate-500 mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> Use these questions as a starting point. Adapt them based on your
          specific context and research goals. Follow up with &quot;why&quot; and &quot;can you tell me more&quot;
          to dig deeper into interesting responses.
        </p>
      </div>
    </div>
  );
}
