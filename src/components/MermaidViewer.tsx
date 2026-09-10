import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Layers, 
  Sparkles,
  AlertCircle,
  Play
} from 'lucide-react';
import { convertSwimlaneToClassicFlowchart } from '../utils/mermaidHelper';

interface MermaidViewerProps {
  id: string;
  code: string;
  title?: string;
  className?: string;
  initialMode?: 'auto' | 'classic';
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  id,
  code,
  title,
  className = '',
  initialMode = 'auto'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [useClassic, setUseClassic] = useState<boolean>(initialMode === 'classic');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);

  const activeCode = useClassic ? convertSwimlaneToClassicFlowchart(code) : code;

  // Initialize mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'neutral',
      fontFamily: 'Plus Jakarta Sans, Noto Sans Thai, sans-serif',
      themeVariables: {
        primaryColor: '#e0f2fe',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#38bdf8',
        lineColor: '#475569',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#fff2cc',
        noteBkgColor: '#fef3c7',
        noteTextColor: '#92400e',
        fontSize: '14px',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: false,
      }
    });
  }, []);

  // Render diagram whenever code or mode changes
  useEffect(() => {
    let isMounted = true;
    setRenderError(null);

    const renderDiagram = async () => {
      const renderId = `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}`;
      try {
        let codeToRender = activeCode;

        // If animations disabled, strip animate property temporarily
        if (!enableAnimations) {
          codeToRender = codeToRender.replace(/animate:\s*true/g, 'animate: false');
        }

        const { svg } = await mermaid.render(renderId, codeToRender);
        if (isMounted) {
          setSvgContent(svg);
          setRenderError(null);
        }
      } catch (err: any) {
        console.warn('Mermaid render failure:', err);
        if (isMounted) {
          // If first attempt failed in auto/swimlane-beta mode, automatically try classic mode
          if (!useClassic) {
            console.info('Retrying with classic flowchart mode...');
            try {
              const fallbackCode = convertSwimlaneToClassicFlowchart(code);
              const { svg } = await mermaid.render(`${renderId}-fallback`, fallbackCode);
              setSvgContent(svg);
              setUseClassic(true);
              setRenderError(null);
              return;
            } catch (fallbackErr: any) {
              setRenderError(fallbackErr?.message || String(fallbackErr));
            }
          } else {
            setRenderError(err?.message || String(err));
          }
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
      // Cleanup any dangling mermaid temporary elements
      const dangling = document.querySelectorAll(`[id^="dmermaid"]`);
      dangling.forEach(el => el.remove());
    };
  }, [id, activeCode, useClassic, enableAnimations]);

  // Reset view on diagram change
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [id, useClassic]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Copy code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Export as SVG
  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || id}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      id={`mermaid-viewer-${id}`}
      ref={containerRef}
      className={`relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } ${className}`}
    >
      {/* Viewer Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            {title || 'Process Swimlane'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${
            useClassic ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
          }`}>
            {useClassic ? 'Classic Flowchart' : 'Swimlane Beta'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Syntax Mode Switcher */}
          <button
            id={`btn-mode-toggle-${id}`}
            onClick={() => setUseClassic(!useClassic)}
            title={useClassic ? 'Switch to Swimlane Beta (Mermaid v11+)' : 'Switch to Classic Flowchart mode'}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{useClassic ? 'Try Swimlane Beta' : 'Classic Mode'}</span>
          </button>

          {/* Animation Toggle */}
          <button
            id={`btn-anim-toggle-${id}`}
            onClick={() => setEnableAnimations(!enableAnimations)}
            title="Toggle animated flow edges"
            className={`flex items-center gap-1 px-2 py-1 rounded border transition ${
              enableAnimations 
                ? 'bg-sky-50 border-sky-200 text-sky-700' 
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <Play className={`w-3 h-3 ${enableAnimations ? 'fill-sky-500' : ''}`} />
            <span>Flow Animation</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Zoom Buttons */}
          <button
            id={`btn-zoom-in-${id}`}
            onClick={zoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id={`btn-zoom-out-${id}`}
            onClick={zoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            id={`btn-reset-zoom-${id}`}
            onClick={resetZoom}
            title="Reset View"
            className="px-1.5 py-1 text-[11px] rounded hover:bg-slate-200 text-slate-600 font-mono transition"
          >
            {Math.round(zoom * 100)}%
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Code Viewer Toggle */}
          <button
            id={`btn-toggle-code-${id}`}
            onClick={() => setShowCode(!showCode)}
            title="Toggle Mermaid Source Code"
            className={`p-1.5 rounded transition ${
              showCode ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          {/* Copy Code */}
          <button
            id={`btn-copy-code-${id}`}
            onClick={handleCopy}
            title="Copy Mermaid Code"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download SVG */}
          <button
            id={`btn-download-svg-${id}`}
            onClick={handleDownloadSVG}
            title="Download Diagram as SVG"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id={`btn-fullscreen-${id}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Diagram Stage */}
      <div 
        className="relative flex-1 min-h-[420px] bg-radial from-slate-50 via-white to-slate-100 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render Error Warning */}
        {renderError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-50/90 backdrop-blur-xs text-center z-10">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">Diagram Preview Notice</h4>
            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4 font-mono bg-white p-2 border border-slate-200 rounded text-left overflow-x-auto">
              {renderError}
            </p>
            <button
              onClick={() => setUseClassic(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs"
            >
              Switch to Classic Subgraph Mode
            </button>
          </div>
        )}

        {/* Pan & Zoom Canvas */}
        <div
          ref={svgWrapperRef}
          className="w-full h-full flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Drag Helper Overlay / Watermark */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-slate-400 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200/50">
          Drag to pan • Scroll or buttons to zoom
        </div>
      </div>

      {/* Slide-down Source Code Drawer */}
      {showCode && (
        <div className="border-t border-slate-200 bg-slate-900 text-slate-200 p-4 max-h-60 overflow-auto font-mono text-xs">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-800 text-slate-400 text-[11px]">
            <span>Mermaid Code ({useClassic ? 'Classic Flowchart' : 'Original Swimlane'})</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-slate-300 leading-relaxed">{activeCode}</pre>
        </div>
      )}
    </div>
  );
};
