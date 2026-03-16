/**
 * DashboardLayout — Main app shell with sidebar, top bar, breadcrumb
 * Persistent sidebar with module navigation following the workflow pipeline
 * Top bar with Upload button (always visible), center context, view toggle
 */
import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Upload, ChevronDown, Gavel, Lock, Building2, Sparkles,
  Package, Warehouse, GitBranch, SplitSquareHorizontal, TableProperties,
  BookOpen, FlaskConical, Coffee, BarChart3, Settings, ArrowDownToLine,
  ChevronRight, PanelLeftClose, PanelLeft, Bell, Search, User,
  X, FileSpreadsheet, CheckCircle2, AlertCircle
} from 'lucide-react';
import { CENTRES, type ViewType } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  centerId: string;
  viewType: ViewType;
}

const MODULES = [
  { id: 'arrivals', label: 'Arrivals', icon: Package, desc: 'Arrival data & new gardens', step: 1 },
  { id: 'stock', label: 'Stock', icon: Warehouse, desc: 'Cumulative stock tracking', step: 2 },
  { id: 'categorization', label: 'Categorization', icon: GitBranch, desc: 'Grade classification', step: 3 },
  { id: 'allocation', label: 'Allocation', icon: SplitSquareHorizontal, desc: 'Main & supplement SOP', step: 4 },
  { id: 'tables', label: 'Tables / Review', icon: TableProperties, desc: 'Ranking & lot generation', step: 5 },
  { id: 'catalogue', label: 'Catalogue', icon: BookOpen, desc: 'Format generation', step: 6 },
  { id: 'sampling', label: 'Sampling', icon: FlaskConical, desc: 'FTS & buyer offers', step: 7, isNew: true },
  { id: 'tasting', label: 'Tasting', icon: Coffee, desc: 'Valuation & remarks', step: 8, isNew: true },
];

const BOTTOM_MODULES = [
  { id: 'post-auction', label: 'Post-Auction', icon: ArrowDownToLine, desc: 'Sold/unsold & carry-forward' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Cross-center intelligence' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'Center configuration' },
];

export default function DashboardLayout({ children, centerId, viewType }: DashboardLayoutProps) {
  const [, navigate] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const center = CENTRES.find(c => c.id === centerId);
  const currentPath = window.location.pathname;
  const currentModule = currentPath.split('/').pop() || 'arrivals';

  if (!center) return null;

  const basePath = `/center/${centerId}/${viewType}`;

  return (
    <div className="h-screen flex overflow-hidden bg-tea-parchment">
      {/* Sidebar */}
      <aside className={cn(
        "h-full flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        sidebarCollapsed ? "w-[68px]" : "w-[260px]"
      )}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border shrink-0">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-sidebar-foreground truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                Auctioneer's Ease
              </h1>
              <p className="text-[9px] text-sidebar-foreground/50 tracking-widest uppercase">Enterprise v3.0</p>
            </div>
          )}
        </div>

        {/* Center & View Info */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <button
              onClick={() => navigate(`/region/${center.region}`)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors"
            >
              <Building2 className="w-4 h-4 text-sidebar-primary shrink-0" />
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">{center.name}</p>
                <p className="text-[10px] text-sidebar-foreground/50">{center.region === 'north' ? 'North India' : 'South India'}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-sidebar-foreground/40" />
            </button>
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => navigate(`/center/${centerId}/auctions/${currentModule}`)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
                  viewType === 'auctions'
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Gavel className="w-3 h-3" />
                Auctions
              </button>
              <button
                onClick={() => navigate(`/center/${centerId}/private/${currentModule}`)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
                  viewType === 'private'
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Lock className="w-3 h-3" />
                Private
              </button>
            </div>
          </div>
        )}

        {/* Workflow Modules */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <div className={cn("mb-1", !sidebarCollapsed && "px-2")}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-2">
                Workflow Pipeline
              </p>
            )}
          </div>
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(`${basePath}/${mod.id}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all group relative",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
                )}
                <div className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent/50 text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-sidebar-foreground/30">{mod.step}.</span>
                      <span className="text-xs font-medium truncate">{mod.label}</span>
                      {mod.isNew && (
                        <span className="px-1 py-0 rounded text-[8px] font-bold bg-sidebar-primary/20 text-sidebar-primary">NEW</span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className={cn("my-3 border-t border-sidebar-border", !sidebarCollapsed && "mx-2")} />

          {!sidebarCollapsed && (
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-2 px-2">
              Operations
            </p>
          )}
          {BOTTOM_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(`${basePath}/${mod.id}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all group relative",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
                )}
                <div className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent/50 text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {!sidebarCollapsed && (
                  <span className="text-xs font-medium truncate">{mod.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{center.region === 'north' ? 'North India' : 'South India'}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{center.name}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="font-medium text-foreground flex items-center gap-1.5">
              {viewType === 'auctions' ? <Gavel className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {viewType === 'auctions' ? 'Auctions' : 'Private'}
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="font-semibold text-primary capitalize">{currentModule.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:border-primary/30 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span>Search lots...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">⌘K</kbd>
            </button>
            {/* Upload Button */}
            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Upload className="w-4 h-4" />
              New Upload
            </button>
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">3</span>
            </button>
            {/* User */}
            <button className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <UploadModal onClose={() => setUploadModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>New Upload</h3>
              <p className="text-xs text-muted-foreground">Upload stock data to master file</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-secondary/30 border-b border-border">
          <div className="flex items-center gap-4">
            {['Select File', 'Map Columns', 'Review & Import'].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                  step > i + 1 ? "bg-primary text-primary-foreground" :
                  step === i + 1 ? "bg-primary text-primary-foreground" :
                  "bg-border text-muted-foreground"
                )}>
                  {step > i + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={cn("text-xs", step === i + 1 ? "font-medium text-foreground" : "text-muted-foreground")}>{s}</span>
                {i < 2 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-8 h-8 text-primary/50" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Drop your Excel file here</p>
              <p className="text-xs text-muted-foreground mb-4">Supports .xlsx, .xls, .csv formats</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Browse Files
                </button>
                <span className="text-xs text-muted-foreground">or drag and drop</span>
              </div>
              <div className="mt-6 flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 text-primary" />
                AI will auto-detect columns and suggest mappings
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">stock_data_week8.xlsx loaded — 1,247 rows detected</span>
              </div>
              <p className="text-sm font-medium mb-3">Column Mapping</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {['AWR No.', 'GP No.', 'Invoice No.', 'Mark', 'Grade', 'No. of Packages', 'Net Weight', 'Gross Weight', 'Garden', 'Manufacture Date'].map((col, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                    <span className="text-xs text-muted-foreground w-32 shrink-0">{col}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">→</span>
                      <span className="text-xs font-medium text-foreground">{col}</span>
                      <span className="ml-auto tea-badge-green text-[10px]">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Matched
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setStep(3)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                  Confirm Mapping
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to Import</p>
              <div className="grid grid-cols-3 gap-4 my-6 max-w-sm mx-auto">
                <div className="tea-card p-3 text-center">
                  <p className="text-lg font-bold font-mono text-foreground">1,247</p>
                  <p className="text-[10px] text-muted-foreground">Total Rows</p>
                </div>
                <div className="tea-card p-3 text-center">
                  <p className="text-lg font-bold font-mono text-primary">1,198</p>
                  <p className="text-[10px] text-muted-foreground">New Entries</p>
                </div>
                <div className="tea-card p-3 text-center">
                  <p className="text-lg font-bold font-mono text-tea-gold">49</p>
                  <p className="text-[10px] text-muted-foreground">Duplicates</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center mb-4">
                <AlertCircle className="w-3.5 h-3.5 text-tea-gold" />
                <span className="text-xs text-muted-foreground">49 duplicate AWR/GP entries will be skipped</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                Import to Master File
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
