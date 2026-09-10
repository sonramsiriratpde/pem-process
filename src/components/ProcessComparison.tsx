import React, { useState } from 'react';
import { MermaidViewer } from './MermaidViewer';
import { PROCESS_ITEMS, ProcessItem } from '../data/processData';
import { 
  GitCompare, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  Clock,
  Layers
} from 'lucide-react';

interface ComparisonPair {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  asIsId: string;
  toBeId: string;
  improvements: string[];
  leanWasteReduced: string[];
  stepReductionPct: number;
}

const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: 'receipt-flow',
    title: 'Goods Receipt & QA Inspection',
    titleTh: 'การรับมอบวัตถุดิบและส่งตรวจ QC',
    description: 'Compares legacy multi-loop receipt process against Odoo 19 lean Delivery Order flow with immediate QC handoff.',
    asIsId: 'as-is_process-warehouse-1-1_receipt_rm-mermaid',
    toBeId: 'to-be_process-warehouse-0_receipt_goods-mermaid',
    improvements: [
      'Eliminated 5 manual paper verification loops (Invoice vs Product vs Count).',
      'Replaced repeated revision cycles with standardized Odoo Delivery Order stages: Status: Ready -> Status: Done.',
      'Decoupled Supplier debit note delays from warehouse floor operations.',
      'Automated QA routing directly upon Delivery Order validation.'
    ],
    leanWasteReduced: ['Waiting Time (Supplier corrections)', 'Defect/Rework loops', 'Excess Motion/Paper Handoffs'],
    stepReductionPct: 65
  },
  {
    id: 'po-revision-flow',
    title: 'PO Revision vs Discrepancy Receive',
    titleTh: 'การแก้ไข PO เทียบกับระบบ Discrepancy Receive',
    description: 'Transition from manual phone/paper notifications to Odoo automated discrepancy exception routing.',
    asIsId: 'as-is_process-warehouse-1-2_revise_po-mermaid',
    toBeId: 'to-be_process-warehouse-2_discrepancy_receive-mermaid',
    improvements: [
      'As-Is required 6 sequential handoffs for any minor PO quantity difference.',
      'To-Be handles discrepancy at receipt with automated Vendor RFQ/Credit note integration.',
      'Eliminated inventory dock congestion during PO revisions.'
    ],
    leanWasteReduced: ['Overprocessing', 'Idle inventory on dock'],
    stepReductionPct: 40
  },
  {
    id: 'return-flow',
    title: 'Return Raw Material to Supplier',
    titleTh: 'การส่งคืนสินค้าให้แก่ Supplier / Vendor',
    description: 'From physical Tag printing and paper return slips to integrated Odoo 19 Return Picking and Vendor Credit Note tracking.',
    asIsId: 'as-is_process-warehouse-1-4_return_rm-mermaid',
    toBeId: 'to-be_process-return_goods-mermaid',
    improvements: [
      'Replaced physical Tag printing and manual signature forms with digital transfer lines.',
      'Direct linkage to Supplier Credit Note without separate manual accounting notification.',
      'Unified return goods authorization (RGA) workflow.'
    ],
    leanWasteReduced: ['Paper waste', 'Manual reconciliation effort'],
    stepReductionPct: 55
  },
  {
    id: 'transfer-flow',
    title: 'Internal Stock Transfer',
    titleTh: 'การโอนย้ายและเบิกจ่าย RM ภายใน',
    description: 'Compares paper credit note requisition against standard Odoo 19 internal transfer routes.',
    asIsId: 'as-is_process-warehouse-1-3_transfer_rm-mermaid',
    toBeId: 'to-be_process-warehouse-1_transfer_to_quality_control-mermaid',
    improvements: [
      'Eliminated paper slip printing and physical sign-offs between Production and Warehouse.',
      'Automated stock reservation and route tracking (Source Location -> Transfer -> Destination Location).',
      'Instant visibility into actual warehouse bin quantities.'
    ],
    leanWasteReduced: ['Waiting for paper slips', 'Manual entry errors'],
    stepReductionPct: 60
  },
  {
    id: 'stock-auditing-flow',
    title: 'Stock Auditing & Physical Inventory',
    titleTh: 'การตรวจนับสต็อกและปรับปรุงยอดสินค้าคงคลัง',
    description: 'Replaces 14 manual steps (paper memos, manual counting, and accounting reconciliation) with Odoo 19 mobile barcode cycle counts and automated inventory valuation adjustment.',
    asIsId: 'as-is_process-warehouse-1-6_stock_auditing-mermaid',
    toBeId: 'to-be_process-stock_auditing-mermaid',
    improvements: [
      'Eliminated manual paper memo generation and cross-department revision cycles.',
      'Mobile barcode scanning directly on warehouse storage bins.',
      'Real-time comparison between Counted Quantity and On-Hand stock.',
      'Automatic inventory loss/gain stock moves and journal entry posting upon approval.'
    ],
    leanWasteReduced: ['Overprocessing', 'Waiting for Paper Memos', 'Manual Inventory Re-counts'],
    stepReductionPct: 60
  },
  {
    id: 'job-transfer-flow',
    title: 'Job Transfer RM & Internal Requisition',
    titleTh: 'การโอนย้ายวัตถุดิบข้าม Job / การเบิกจ่ายภายใน',
    description: 'Shifts from physical paper transfer documents to real-time Odoo Internal Transfer picking routes between production jobs.',
    asIsId: 'as-is_process-warehouse-1-5_job_transfer_rm-mermaid',
    toBeId: 'to-be_process-internal_transfer-mermaid',
    improvements: [
      'Automated availability checking across warehouse locations and production jobs.',
      'Barcode scanning at picking and delivery to job work centers.',
      'Instant stock location updates without manual paperwork.'
    ],
    leanWasteReduced: ['Transportation', 'Waiting Time', 'Paperwork Waste'],
    stepReductionPct: 50
  }
];

export const ProcessComparison: React.FC = () => {
  const [selectedPairId, setSelectedPairId] = useState<string>(COMPARISON_PAIRS[0].id);

  const currentPair = COMPARISON_PAIRS.find(p => p.id === selectedPairId) || COMPARISON_PAIRS[0];

  const asIsProcess = PROCESS_ITEMS.find(p => p.id === currentPair.asIsId);
  const toBeProcess = PROCESS_ITEMS.find(p => p.id === currentPair.toBeId);

  return (
    <div id="process-comparison-view" className="space-y-6">
      {/* Selector Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <GitCompare className="w-5 h-5 text-sky-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            BPR Re-Engineering Matrix (As-Is vs To-Be Lean)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPARISON_PAIRS.map(pair => {
            const isSelected = pair.id === selectedPairId;
            return (
              <button
                key={pair.id}
                id={`btn-pair-${pair.id}`}
                onClick={() => setSelectedPairId(pair.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>{pair.title}</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    -{pair.stepReductionPct}% steps
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{pair.titleTh}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Lean Odoo 19 Re-Engineering Impact</span>
            </div>
            <h3 className="text-xl font-bold">{currentPair.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{currentPair.titleTh} — {currentPair.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-lg border border-white/10 text-center">
              <div className="text-[11px] text-slate-300 uppercase tracking-wider">Complexity Drop</div>
              <div className="text-xl font-extrabold text-emerald-400">-{currentPair.stepReductionPct}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-lg border border-white/10 text-center">
              <div className="text-[11px] text-slate-300 uppercase tracking-wider">Lean Standard</div>
              <div className="text-base font-bold text-sky-300">Odoo 19 ERP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Diagram Panes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* As-Is Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h4 className="text-sm font-bold text-slate-900">As-Is Process (Legacy Baseline)</h4>
            </div>
            <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-mono">
              {asIsProcess?.stepCount || '~15'} steps • {asIsProcess?.lanes.length || 4} lanes
            </span>
          </div>

          {asIsProcess ? (
            <MermaidViewer
              id={`compare-asis-${asIsProcess.id}`}
              code={asIsProcess.content}
              title={`${asIsProcess.title} (As-Is)`}
              initialMode="auto"
            />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
              As-Is diagram not found.
            </div>
          )}
        </div>

        {/* To-Be Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">To-Be Process (Lean Re-Engineered)</h4>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
              {toBeProcess?.stepCount || '~5'} steps • {toBeProcess?.lanes.length || 2} lanes
            </span>
          </div>

          {toBeProcess ? (
            <MermaidViewer
              id={`compare-tobe-${toBeProcess.id}`}
              code={toBeProcess.content}
              title={`${toBeProcess.title} (To-Be)`}
              initialMode="auto"
            />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
              To-Be diagram not found.
            </div>
          )}
        </div>
      </div>

      {/* Lean Improvements & Waste Eliminated */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Re-Engineering Improvements
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentPair.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <TrendingDown className="w-4 h-4 text-sky-600" />
            Lean Wastes Eliminated (Muda)
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentPair.leanWasteReduced.map((waste, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                {waste}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
            <strong>Lean Principle Alignment:</strong> Standardized on the happy path first. Exceptions (discrepancies, quality failures) are isolated into dedicated, asynchronous sub-processes rather than interrupting primary warehouse velocity.
          </div>
        </div>
      </div>
    </div>
  );
};
