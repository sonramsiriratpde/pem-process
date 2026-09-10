import React from 'react';
import { MermaidViewer } from './MermaidViewer';
import { FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface MarkdownViewerProps {
  id: string;
  content: string;
  title?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ id, content, title }) => {
  // Parse sections: split markdown and fenced mermaid blocks
  const parts: Array<{ type: 'markdown' | 'mermaid'; content: string }> = [];
  const regex = /```mermaid([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.substring(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'mermaid',
      content: match[1].trim()
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      content: content.substring(lastIndex)
    });
  }

  // Simple clean markdown renderer without external heavy parsers
  const renderSimpleMarkdown = (text: string, partIdx: number) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-5 my-2 space-y-1 text-slate-700 text-sm">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        return;
      }

      // Headings
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${idx}`} className="text-xl font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200">
            {trimmed.replace(/^#\s+/, '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${idx}`} className="text-lg font-semibold text-slate-800 mt-3 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-sky-500 rounded-full inline-block" />
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${idx}`} className="text-base font-semibold text-slate-800 mt-2 mb-1">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push(
          <li key={`li-${idx}`} className="leading-relaxed">
            {renderInlineStyles(trimmed.replace(/^[-*]\s+/, ''))}
          </li>
        );
      } else if (/^\d+\.\s+/.test(trimmed)) {
        flushList();
        elements.push(
          <div key={`ol-${idx}`} className="flex items-start gap-2 my-1 text-sm text-slate-700">
            <span className="font-semibold text-sky-600 shrink-0 font-mono text-xs mt-0.5">
              {trimmed.match(/^\d+\./)?.[0]}
            </span>
            <span>{renderInlineStyles(trimmed.replace(/^\d+\.\s+/, ''))}</span>
          </div>
        );
      } else if (trimmed.startsWith('>')) {
        flushList();
        elements.push(
          <blockquote key={`quote-${idx}`} className="p-3 my-2 bg-sky-50/70 border-l-3 border-sky-500 rounded-r-lg text-xs text-sky-950 italic">
            {renderInlineStyles(trimmed.replace(/^>\s*/, ''))}
          </blockquote>
        );
      } else if (trimmed.startsWith('**Follow to lean') || trimmed.includes('Lean approach')) {
        flushList();
        elements.push(
          <div key={`lean-${idx}`} className="p-3 my-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>{renderInlineStyles(trimmed)}</div>
          </div>
        );
      } else {
        flushList();
        elements.push(
          <p key={`p-${idx}`} className="my-1.5 text-sm text-slate-700 leading-relaxed">
            {renderInlineStyles(trimmed)}
          </p>
        );
      }
    });

    flushList();
    return <div key={`md-part-${partIdx}`} className="space-y-1">{elements}</div>;
  };

  const renderInlineStyles = (str: string) => {
    // Basic bold/italic inline parser
    const tokens = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={i} className="italic">{token.slice(1, -1)}</em>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 text-xs bg-slate-100 text-sky-800 rounded font-mono border border-slate-200">{token.slice(1, -1)}</code>;
      }
      return token;
    });
  };

  return (
    <div id={`markdown-viewer-${id}`} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <FileText className="w-5 h-5 text-sky-600" />
        <h2 className="text-lg font-bold text-slate-900">{title || 'Procedure Documentation'}</h2>
      </div>

      <div className="space-y-4">
        {parts.map((part, index) => {
          if (part.type === 'mermaid') {
            return (
              <div key={`part-mermaid-${index}`} className="my-4">
                <MermaidViewer
                  id={`${id}-embed-${index}`}
                  code={part.content}
                  title={`${title || 'Process Flow'} (Diagram)`}
                />
              </div>
            );
          }
          return renderSimpleMarkdown(part.content, index);
        })}
      </div>
    </div>
  );
};
