import React, { useState } from 'react';
import { MermaidViewer } from './MermaidViewer';
import { validateMermaidSwimlane, convertSwimlaneToClassicFlowchart, ValidationRuleResult } from '../utils/mermaidHelper';
import { 
  Code2, 
  Play, 
  CheckSquare, 
  RotateCcw, 
  FilePlus, 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Copy,
  Check
} from 'lucide-react';

const STARTER_TEMPLATES = [
  {
    name: 'Lean Goods Receipt (Odoo 19)',
    code: `%% Lean Goods Receipt Workflow
swimlane-beta TB

  subgraph Warehouse
    start([เริ่มต้น])
    wh1{Verify Delivery Order}
    wh2[Verify Product & Quantity]
    wh3[Determine Storage Bin]
    wh4[Validate]
    done([เสร็จสิ้น])
  end

  subgraph Purchase
    pu1[[Purchase Order Exception]]
  end

  subgraph Quality Assurance
    qa1[[goods_receipt_inspection]]
  end

  %% Happy Path Flow
  start e1@--> wh1
  wh1 e2@-->|Status: Valid| wh2
  wh2 e3@-->|Status: Ready| wh3
  wh3 e4@-->|Status: Ready| wh4
  wh4 e5@-->|Status: Done| done
  done e6@--> qa1

  %% Exception Flow
  wh1 -->|Mismatch| pu1
  pu1 --> start

  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;
  class start attention;
  class done attention;
  class wh1 attention;
  class wh2 attention;
  class wh3 attention;
  class wh4 attention;

  e1@{ animate: true}
  e2@{ animate: true}
  e3@{ animate: true}
  e4@{ animate: true}
  e5@{ animate: true}
  e6@{ animate: true}`
  },
  {
    name: 'Odoo Sales: Quote to Cash',
    code: `%% Odoo 19 Sales Flow
swimlane-beta LR

  subgraph Customer
    c1([Request Quotation])
    c2{Confirm Order}
    c3[Make Payment]
    done([End])
  end

  subgraph Sales
    s1[Prepare Quotation]
    s2[Confirm Sales Order]
  end

  subgraph Warehouse
    w1[Process Delivery Order]
    w2[Validate Shipment]
  end

  subgraph Accounting
    a1[Issue Customer Invoice]
    a2[Reconcile Payment]
  end

  c1 --> s1
  s1 -->|Quotation Sent| c2
  c2 -->|Approved| s2
  s2 -->|Create Delivery| w1
  w1 --> w2
  w2 -->|Shipped| a1
  a1 -->|Invoice Sent| c3
  c3 --> a2
  a2 --> done`
  },
  {
    name: 'Odoo Purchase: Procure to Pay',
    code: `%% Odoo 19 Procure to Pay Flow
swimlane-beta TB

  subgraph Requestor
    r1([Purchase Request])
  end

  subgraph Purchasing
    p1[Create RFQ]
    p2[Confirm Purchase Order]
  end

  subgraph Vendor
    v1[Quote Price & Terms]
    v2[Deliver Goods]
    v3[Send Vendor Bill]
  end

  subgraph Warehouse
    w1[Receive Goods / Validate PO]
  end

  subgraph Accounting
    a1[Register Vendor Bill]
    a2[3-Way Match & Pay]
    done([Completed])
  end

  r1 --> p1
  p1 -->|RFQ| v1
  v1 -->|Quotation| p2
  p2 -->|Purchase Order| v2
  v2 -->|Goods| w1
  v2 -->|Bill| v3
  v3 --> a1
  w1 -->|Receipt Validated| a2
  a1 --> a2
  a2 --> done`
  }
];

export const ProcessStudio: React.FC = () => {
  const [editorCode, setEditorCode] = useState<string>(STARTER_TEMPLATES[0].code);
  const [validationResults, setValidationResults] = useState<ValidationRuleResult[]>(() => 
    validateMermaidSwimlane(STARTER_TEMPLATES[0].code)
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleCodeChange = (newCode: string) => {
    setEditorCode(newCode);
    setValidationResults(validateMermaidSwimlane(newCode));
  };

  const handleConvertClassic = () => {
    const classic = convertSwimlaneToClassicFlowchart(editorCode);
    setEditorCode(classic);
    setValidationResults(validateMermaidSwimlane(classic));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div id="process-studio-view" className="space-y-6">
      {/* Studio Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">Mermaid Process Studio & Validator</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build, edit, and validate swimlane process diagrams against project BPR standards, Odoo 19 patterns, and Mermaid syntax rules.
          </p>
        </div>

        {/* Templates Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-600">Templates:</span>
          {STARTER_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => handleCodeChange(tmpl.code)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor and Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Code Editor */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-sky-600" />
              Mermaid Code Editor
            </span>
            <div className="flex items-center gap-1.5">
              <button
                id="btn-studio-convert-classic"
                onClick={handleConvertClassic}
                title="Convert Swimlane Beta to Classic Flowchart"
                className="px-2 py-1 text-xs font-medium rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
              >
                Convert to Classic
              </button>
              <button
                id="btn-studio-copy"
                onClick={handleCopy}
                className="p-1.5 text-xs font-medium rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[460px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xs flex flex-col">
            <textarea
              id="studio-code-input"
              value={editorCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
              className="w-full h-full flex-1 p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-hidden selection:bg-sky-700"
              placeholder="Enter Mermaid diagram code..."
            />
          </div>

          {/* Quick Syntax Helper Tips */}
          <div className="bg-sky-50/60 rounded-lg p-3 border border-sky-100 text-[11px] text-sky-950 space-y-1">
            <div className="font-semibold flex items-center gap-1 text-sky-900">
              <Sparkles className="w-3 h-3 text-sky-600" />
              <span>Swimlane Rules from SKILL.md</span>
            </div>
            <div>• Each lane must represent exactly <strong>one actor/team</strong> (not status mixtures).</div>
            <div>• Label every cross-lane arrow with the document or condition handed off (<code>--&gt;|Pass|</code>).</div>
            <div>• Place decisions in the lane that actually makes the determination.</div>
          </div>
        </div>

        {/* Right Side: Live Diagram Preview & Validation */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-4 h-4 text-emerald-600" />
              Live Interactive Diagram
            </span>
          </div>

          <MermaidViewer
            id="studio-live-preview"
            code={editorCode}
            title="Live Process Diagram"
            initialMode="auto"
          />

          {/* Validation Checklist / Quality Gate */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-sky-600" />
                Process Ownership & Syntax Audit
              </h3>
              <span className="text-[11px] font-medium text-slate-500">
                {validationResults.filter(r => r.passed).length} / {validationResults.length} criteria satisfied
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {validationResults.map((res, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                    res.passed 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                      : res.severity === 'error'
                      ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                      : 'bg-amber-50/60 border-amber-200 text-amber-950'
                  }`}
                >
                  {res.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : res.severity === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-xs">{res.rule}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-normal">{res.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
