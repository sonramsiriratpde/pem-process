import React, { useState } from 'react';
import { MarkdownViewer } from './MarkdownViewer';
import { PROCESS_ITEMS } from '../data/processData';
import { BookOpen, HelpCircle, Layers, FileCode, Award } from 'lucide-react';

export const ReferenceViewer: React.FC = () => {
  const referenceDocs = PROCESS_ITEMS.filter(p => p.category === 'reference' || p.category === 'template');
  const [selectedDocId, setSelectedDocId] = useState<string>(referenceDocs[0]?.id || '');

  const activeDoc = referenceDocs.find(d => d.id === selectedDocId) || referenceDocs[0];

  return (
    <div id="reference-viewer-view" className="space-y-6">
      {/* Header and Doc Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Enterprise Architecture & Process Reference Library
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {referenceDocs.map(doc => {
            const isSelected = doc.id === selectedDocId;
            return (
              <button
                key={doc.id}
                id={`btn-ref-${doc.id}`}
                onClick={() => setSelectedDocId(doc.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Document Content */}
      {activeDoc && (
        <MarkdownViewer
          id={`ref-doc-${activeDoc.id}`}
          title={activeDoc.title}
          content={activeDoc.content}
        />
      )}
    </div>
  );
};
