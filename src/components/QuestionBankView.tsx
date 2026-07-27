import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Code,
  Layers,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { QUESTION_BANK } from '../data/questionBankData';
import { InterviewType, NavigationTab, QuestionBankItem } from '../types';

interface QuestionBankViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    'All',
    'HR Interview',
    'Technical Interview',
    'Coding Interview',
    'Behavioural Interview',
    'System Design',
    'AI Interview',
    'Frontend',
    'Backend',
    'DevOps',
    'Data Science',
  ];

  const filteredQuestions = QUESTION_BANK.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Curated Technical & HR Question Bank</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore industry benchmark questions with model answer guidelines and interviewer pro-tips.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('mock-interview')}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
        >
          <PlayCircle className="h-4 w-4" />
          <span>Practice Mock Session</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by concept (e.g. RSC, RAG, RDBMS index, STAR method)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-sans"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-slate-700 transition-colors shadow-md"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="flex cursor-pointer items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.difficulty === 'Hard'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : item.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Concept: {item.concept}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.question}</h3>
                </div>

                <button className="text-slate-400 hover:text-white">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {/* Accordion Detail */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400">Benchmark Answer Guideline:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.answerGuideline}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400">Interviewer Pro-Tips:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {item.proTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No questions found matching search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
