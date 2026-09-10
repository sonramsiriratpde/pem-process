import React, { useState, useMemo } from 'react';
import { PROCESS_ITEMS, ProcessItem } from './data/processData';
import { MermaidViewer } from './components/MermaidViewer';
import { MarkdownViewer } from './components/MarkdownViewer';
import { ProcessComparison } from './components/ProcessComparison';
import { ProcessStudio } from './components/ProcessStudio';
import { ReferenceViewer } from './components/ReferenceViewer';
import { 
  Layers, 
  Search, 
  Filter, 
  GitCompare, 
  Code2, 
  BookOpen, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  Package,
  ShieldCheck,
  ShoppingCart,
  Calendar,
  DollarSign,
  Menu,
  X,
  Share2,
  ExternalLink
} from 'lucide-react';

type MainTab = 'processes' | 'comparison' | 'studio' | 'references';
type CategoryFilter = 'all' | 'as-is' | 'to-be' | 'reference' | 'template';
type DeptFilter = 'all' | 'Warehouse' | 'QA' | 'Purchase' | 'S&OP' | 'Accounting';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('processes');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [deptFilter, setDeptFilter] = useState<DeptFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('as-is_process-warehouse-1-1_receipt_rm-mermaid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Filtered processes list
  const filteredProcesses = useMemo(() => {
    return PROCESS_ITEMS.filter(item => {
      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      // Department filter
      if (deptFilter !== 'all' && item.department !== deptFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesTitleTh = item.titleTh.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesContent = item.content.toLowerCase().includes(query);
        const matchesLanes = item.lanes.some(l => l.toLowerCase().includes(query));
        return matchesTitle || matchesTitleTh || matchesSummary || matchesContent || matchesLanes;
      }
      return true;
    });
  }, [categoryFilter, deptFilter, searchQuery]);

  const activeProcess = useMemo(() => {
    return PROCESS_ITEMS.find(p => p.id === selectedProcessId) || PROCESS_ITEMS[0];
  }, [selectedProcessId]);

  // Find counterpart process for quick jump (e.g. As-Is -> To-Be counterpart)
  const counterpartProcess = useMemo(() => {
    if (!activeProcess) return null;
    if (activeProcess.category === 'as-is') {
      if (activeProcess.filePath.includes('1.1_receipt_rm')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('0_receipt_goods'));
      }
      if (activeProcess.filePath.includes('1.2_revise_po')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('2_discrepancy_receive'));
      }
      if (activeProcess.filePath.includes('1.4_return_rm')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('return_goods'));
      }
      if (activeProcess.filePath.includes('1.3_transfer_rm')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('1_transfer_to_quality_control'));
      }
    } else if (activeProcess.category === 'to-be') {
      if (activeProcess.filePath.includes('0_receipt_goods')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('1.1_receipt_rm'));
      }
      if (activeProcess.filePath.includes('2_discrepancy_receive')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('1.2_revise_po'));
      }
      if (activeProcess.filePath.includes('return_goods')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('1.4_return_rm'));
      }
      if (activeProcess.filePath.includes('1_transfer_to_quality_control')) {
        return PROCESS_ITEMS.find(p => p.filePath.includes('1.3_transfer_rm'));
      }
    }
    return null;
  }, [activeProcess]);

  const asIsCount = PROCESS_ITEMS.filter(p => p.category === 'as-is').length;
  const toBeCount = PROCESS_ITEMS.filter(p => p.category === 'to-be').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight">PEM Process Explorer</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                    Odoo 19 BPR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Enterprise Swimlane Architecture • As-Is & To-Be Lean Workflows
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                id="tab-btn-processes"
                onClick={() => setActiveTab('processes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                  activeTab === 'processes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Process Catalog</span>
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full font-mono text-slate-700">
                  {PROCESS_ITEMS.length}
                </span>
              </button>

              <button
                id="tab-btn-comparison"
                onClick={() => setActiveTab('comparison')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                  activeTab === 'comparison'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
                <span>As-Is vs To-Be</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  Impact
                </span>
              </button>

              <button
                id="tab-btn-studio"
                onClick={() => setActiveTab('studio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                  activeTab === 'studio'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Mermaid Studio & Audit</span>
              </button>

              <button
                id="tab-btn-references"
                onClick={() => setActiveTab('references')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                  activeTab === 'references'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                <span>Odoo Patterns & Standards</span>
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 bg-white border-t border-slate-200 space-y-1">
            <button
              onClick={() => { setActiveTab('processes'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between ${
                activeTab === 'processes' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Process Catalog</span>
              </div>
              <span className="font-mono text-xs">{PROCESS_ITEMS.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('comparison'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'comparison' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
              }`}
            >
              <GitCompare className="w-4 h-4 text-emerald-600" />
              <span>As-Is vs To-Be Re-Engineering</span>
            </button>
            <button
              onClick={() => { setActiveTab('studio'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'studio' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4 text-sky-600" />
              <span>Mermaid Studio & Validator</span>
            </button>
            <button
              onClick={() => { setActiveTab('references'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'references' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Odoo Patterns & Reference</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: PROCESS CATALOG */}
        {activeTab === 'processes' && (
          <div className="space-y-6">
            {/* KPI Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Artifacts</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{PROCESS_ITEMS.length} Files</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Mermaid & SOP Docs</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">As-Is Processes</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{asIsCount} Workflows</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Baseline Operations</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">To-Be Lean Flows</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{toBeCount} Workflows</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Odoo 19 Aligned</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider">Lean Waste Reduction</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">~55% Fewer Steps</div>
                <div className="text-[11px] text-sky-600 font-medium mt-0.5">Automated Handoffs</div>
              </div>
            </div>

            {/* Split Screen: Navigation Directory & Active Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Filterable Process List */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search processes, steps, Thai text..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-sky-500 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lifecycle Stage</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'as-is', 'to-be', 'reference', 'template'] as CategoryFilter[]).map(cat => (
                      <button
                        key={cat}
                        id={`filter-cat-${cat}`}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                          categoryFilter === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat === 'as-is' ? 'As-Is' : cat === 'to-be' ? 'To-Be Lean' : cat === 'reference' ? 'References' : 'Templates'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department Tabs */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['all', 'Warehouse', 'QA', 'Purchase', 'S&OP', 'Accounting'] as DeptFilter[]).map(dept => (
                      <button
                        key={dept}
                        id={`filter-dept-${dept}`}
                        onClick={() => setDeptFilter(dept)}
                        className={`px-2 py-1 text-[11px] rounded-md font-medium text-center truncate transition ${
                          deptFilter === dept
                            ? 'bg-sky-100 text-sky-800 font-semibold'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                        }`}
                      >
                        {dept === 'all' ? 'All Depts' : dept}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Process List Container */}
                <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                  <div className="text-[11px] text-slate-400 font-medium px-1 flex justify-between">
                    <span>Showing {filteredProcesses.length} results</span>
                    <span className="capitalize">{categoryFilter}</span>
                  </div>

                  {filteredProcesses.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No matching processes found. Try clearing filters.
                    </div>
                  ) : (
                    filteredProcesses.map(process => {
                      const isSelected = process.id === activeProcess?.id;
                      return (
                        <button
                          key={process.id}
                          id={`process-item-${process.id}`}
                          onClick={() => setSelectedProcessId(process.id)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50/70 shadow-2xs'
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {process.title}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              process.category === 'as-is' 
                                ? 'bg-rose-100 text-rose-800' 
                                : process.category === 'to-be'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {process.category.toUpperCase()}
                            </span>
                          </div>

                          {process.titleTh && (
                            <div className="text-[11px] text-slate-600 line-clamp-1 mb-1 font-sans">
                              {process.titleTh}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="font-medium text-slate-500">{process.department}</span>
                            <span>•</span>
                            <span>{process.type === 'mermaid' ? `${process.lanes.length} lanes` : 'Document'}</span>
                            {process.stepCount > 0 && (
                              <>
                                <span>•</span>
                                <span>{process.stepCount} steps</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Active Process Workspace */}
              <div className="lg:col-span-8 space-y-4">
                {activeProcess && (
                  <>
                    {/* Process Header Banner */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                            <span className="text-sky-600">{activeProcess.department}</span>
                            <span>/</span>
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                              activeProcess.category === 'as-is'
                                ? 'bg-rose-100 text-rose-800'
                                : activeProcess.category === 'to-be'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {activeProcess.category.toUpperCase()}
                            </span>
                            <span>/</span>
                            <span className="text-slate-400 font-mono text-[11px]">{activeProcess.filename}</span>
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">{activeProcess.title}</h2>
                          {activeProcess.titleTh && (
                            <p className="text-sm font-medium text-slate-600 mt-0.5">{activeProcess.titleTh}</p>
                          )}
                        </div>

                        {/* Counterpart Action Button */}
                        {counterpartProcess && (
                          <button
                            id={`btn-jump-counterpart-${counterpartProcess.id}`}
                            onClick={() => setSelectedProcessId(counterpartProcess.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold transition shrink-0 shadow-2xs"
                          >
                            <span>View {counterpartProcess.category === 'to-be' ? 'To-Be Lean' : 'As-Is'} Version</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {activeProcess.summary && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {activeProcess.summary}
                        </p>
                      )}

                      {/* Swimlane Actors Tags */}
                      {activeProcess.lanes.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">Swimlane Actors:</span>
                          {activeProcess.lanes.map((lane, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {lane}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Diagram or Markdown Renderer */}
                    {activeProcess.type === 'mermaid' ? (
                      <MermaidViewer
                        id={`catalog-${activeProcess.id}`}
                        code={activeProcess.content}
                        title={activeProcess.title}
                        initialMode="auto"
                      />
                    ) : (
                      <MarkdownViewer
                        id={`catalog-md-${activeProcess.id}`}
                        title={activeProcess.title}
                        content={activeProcess.content}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: AS-IS VS TO-BE COMPARISON MATRIX */}
        {activeTab === 'comparison' && <ProcessComparison />}

        {/* VIEW 3: MERMAID PROCESS STUDIO & VALIDATOR */}
        {activeTab === 'studio' && <ProcessStudio />}

        {/* VIEW 4: ODOO PATTERNS & STANDARDS REFERENCE */}
        {activeTab === 'references' && <ReferenceViewer />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>PEM Business Process Architecture</span>
            <span>•</span>
            <span>Odoo 19 ERP Re-engineering</span>
            <span>•</span>
            <span className="font-mono text-[11px]">sonramsiriratpde/pem-process</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Mermaid v11 & Google AI Studio
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
