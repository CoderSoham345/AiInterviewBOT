import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, RefreshCw, Sparkles, Tag, Edit3 } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeUploaderProps {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  resumeData,
  setResumeData,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check size limit (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB limit. Please upload a smaller document.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];

        const response = await fetch('/api/resume/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            fileName: file.name,
            mimeType: file.type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to parse resume file.');
        }

        setResumeData({
          fileName: file.name,
          fileType: file.type,
          text: data.text,
          summary: data.summary,
          topSkills: data.topSkills || [],
          experienceYears: data.experienceYears,
          highlights: data.highlights || [],
        });
        setPastedText(data.text);
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      setUploadError(err.message || 'Error parsing resume file.');
      setIsUploading(false);
    }
  };

  const handleTextPasteSubmit = async () => {
    if (!pastedText.trim()) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: pastedText,
          fileName: 'Pasted Resume Text',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process resume text.');
      }

      setResumeData({
        fileName: 'Pasted Resume Profile',
        fileType: 'text/plain',
        text: data.text,
        summary: data.summary,
        topSkills: data.topSkills || [],
        experienceYears: data.experienceYears,
        highlights: data.highlights || [],
      });
      setIsEditingText(false);
      setIsUploading(false);
    } catch (err: any) {
      console.error('Error parsing pasted resume text:', err);
      setUploadError(err.message || 'Error parsing text.');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            Candidate Resume Profile
          </h2>
          <p className="text-xs text-slate-400">
            Upload your resume (PDF / DOCX) to generate tailored questions matching your experience.
          </p>
        </div>
        {resumeData && (
          <button
            onClick={() => {
              setResumeData(null);
              setPastedText('');
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Replace Resume
          </button>
        )}
      </div>

      {uploadError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {!resumeData && !isEditingText && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700/80 bg-slate-950/50 p-8 text-center transition-all hover:border-cyan-500/60 hover:bg-slate-900/80 cursor-pointer"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              <p className="text-sm font-medium text-slate-200">Analyzing Resume & Extracting Technical Skills...</p>
              <p className="text-xs text-slate-500">Parsing structure, skills, and past achievements...</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Drag & drop your resume here, or <span className="text-cyan-400 underline">browse files</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">Supports PDF, DOCX, or plain text (Max 15MB)</p>

              <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px w-12 bg-slate-800"></span>
                <span>or</span>
                <span className="h-px w-12 bg-slate-800"></span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingText(true);
                }}
                className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Paste resume plain text manually
              </button>
            </>
          )}
        </div>
      )}

      {/* Manual Paste Form */}
      {isEditingText && !resumeData && (
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your resume text here (experience, skills, projects, education)..."
            rows={8}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setIsEditingText(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleTextPasteSubmit}
              disabled={!pastedText.trim() || isUploading}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Analyze Text Profile
            </button>
          </div>
        </div>
      )}

      {/* Parsed Resume Display */}
      {resumeData && (
        <div className="space-y-4 rounded-xl bg-slate-950/80 p-4 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{resumeData.fileName}</h3>
                <p className="text-xs text-slate-400">Estimated Level: {resumeData.experienceYears || 'Detected from profile'}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
              Parsed & Ready
            </span>
          </div>

          {/* AI Summary */}
          {resumeData.summary && (
            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
              "{resumeData.summary}"
            </p>
          )}

          {/* Top Skills Tags */}
          {resumeData.topSkills && resumeData.topSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-400">
                <Tag className="h-3.5 w-3.5 text-cyan-400" />
                <span>Detected Key Skills & Keywords:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.topSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-700/80 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {resumeData.highlights && resumeData.highlights.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1.5">Key Resume Highlights:</span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {resumeData.highlights.slice(0, 3).map((item, i) => (
                  <li key={i} className="truncate">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
