/**
 * DashboardLayout — Tea Catalogue Studio design
 * Dark forest green sidebar (#162416) + white top bar + cream content area
 * Matches the Lovable Tea Discovery Studio design exactly
 */
import { useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  Leaf, Upload, ChevronDown, Gavel, Lock, Building2,
  Package, Warehouse, GitBranch, SplitSquareHorizontal, TableProperties,
  BookOpen, FlaskConical, Coffee, BarChart3, Settings, ArrowDownToLine,
  ChevronRight, PanelLeftClose, PanelLeft, Home,
  X, FileSpreadsheet, AlertCircle, CheckCircle2
} from 'lucide-react';
import { CENTRES, type ViewType } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  centerId: string;
  viewType: ViewType;
}

const WORKFLOW_MODULES = [
  { id: 'arrivals',       label: 'Arrivals',        icon: Package,               step: 1 },
  { id: 'stock',          label: 'Stock',            icon: Warehouse,             step: 2 },
  { id: 'categorization', label: 'Categorization',   icon: GitBranch,             step: 3 },
  { id: 'allocation',     label: 'Allocation',       icon: SplitSquareHorizontal, step: 4 },
  { id: 'tables',         label: 'Review Console',   icon: TableProperties,       step: 5 },
  { id: 'catalogue',      label: 'Catalogue',        icon: BookOpen,              step: 6 },
  { id: 'sampling',       label: 'Sampling',         icon: FlaskConical,          step: 7, isNew: true },
  { id: 'tasting',        label: 'Tasting',          icon: Coffee,                step: 8, isNew: true },
];

const TOOL_MODULES = [
  { id: 'post-auction', label: 'Post-Auction', icon: ArrowDownToLine },
  { id: 'analytics',    label: 'Analytics',    icon: BarChart3 },
  { id: 'settings',     label: 'Settings',     icon: Settings },
];

// Upload modal component
function UploadModal({ onClose }: { onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Upload Arrivals Data</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div
            className={cn("upload-dropzone p-12 text-center cursor-pointer", dragOver && "drag-over")}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
            />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-primary" />
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="font-medium text-foreground">Drop your MyArrivals Excel file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports .xlsx and .xls files</p>
              </div>
            )}
          </div>
          {file && (
            <div className="mt-4 p-3 rounded-lg bg-accent/50 border border-accent flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground">
                File will be parsed and arrivals data will be imported. Existing data for this sale will be replaced.
              </p>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button disabled={!file} className="flex-1" style={{ background: 'oklch(0.72 0.14 75)', color: 'oklch(0.12 0.02 50)' }}>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, centerId, viewType }: DashboardLayoutProps) {
  const [, navigate] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const center = CENTRES.find(c => c.id === centerId);
  const currentPath = window.location.pathname;
  const currentModule = currentPath.split('/').pop() || 'arrivals';

  if (!center) return null;

  const basePath = `/center/${centerId}/${viewType}`;

  // Breadcrumb label
  const allModules = [...WORKFLOW_MODULES, ...TOOL_MODULES];
  const activeModule = allModules.find(m => m.id === currentModule);
  const breadcrumbSection = WORKFLOW_MODULES.find(m => m.id === currentModule) ? 'Workflow' : 'Tools';

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'oklch(0.975 0.006 85)' }}>
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "h-full flex flex-col border-r transition-all duration-300 shrink-0",
          sidebarCollapsed ? "w-[60px]" : "w-[200px]"
        )}
        style={{
          background: 'oklch(0.20 0.06 155)',
          borderColor: 'oklch(0.26 0.06 155)',
        }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center gap-2.5 px-4 shrink-0 border-b"
          style={{ borderColor: 'oklch(0.26 0.06 155)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'oklch(0.50 0.14 155)' }}
          >
            <Leaf className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold leading-tight truncate">Tea Catalogue Studio</p>
              <p className="text-white/35 text-[9px] truncate">Auctioneer's Ease</p>
            </div>
          )}
        </div>

        {/* Home link */}
        <div className="px-2 pt-3 pb-1">
          <button
            onClick={() => navigate('/')}
            className="sidebar-nav-item w-full"
          >
            <Home className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Home</span>}
          </button>
        </div>

        {/* Centre + View toggle */}
        {!sidebarCollapsed && (
          <div className="px-2 pb-2">
            <button
              onClick={() => navigate(`/region/${center.region}`)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/8 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-white/50 shrink-0" />
              <span className="text-white/70 text-xs truncate flex-1 text-left">{center.name}</span>
              <ChevronDown className="w-3 h-3 text-white/30" />
            </button>
            <div className="flex gap-1 mt-1.5">
              <button
                onClick={() => navigate(`/center/${centerId}/auctions/${currentModule}`)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-all",
                  viewType === 'auctions'
                    ? "text-[oklch(0.12_0.02_50)]"
                    : "text-white/50 hover:text-white/80"
                )}
                style={viewType === 'auctions' ? { background: 'oklch(0.72 0.14 75)' } : {}}
              >
                <Gavel className="w-2.5 h-2.5" /> Auctions
              </button>
              <button
                onClick={() => navigate(`/center/${centerId}/private/${currentModule}`)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-all",
                  viewType === 'private'
                    ? "text-[oklch(0.12_0.02_50)]"
                    : "text-white/50 hover:text-white/80"
                )}
                style={viewType === 'private' ? { background: 'oklch(0.72 0.14 75)' } : {}}
              >
                <Lock className="w-2.5 h-2.5" /> Private
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mx-3 border-t" style={{ borderColor: 'oklch(0.26 0.06 155)' }} />

        {/* Workflow nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {!sidebarCollapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1.5" style={{ color: 'oklch(0.55 0.03 155)' }}>
              Workflow
            </p>
          )}
          {WORKFLOW_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(`${basePath}/${mod.id}`)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md mb-0.5 transition-all text-left",
                  isActive
                    ? "text-white"
                    : "text-white/55 hover:text-white/85 hover:bg-white/8"
                )}
                style={isActive ? { background: 'oklch(0.28 0.08 155)' } : {}}
              >
                {/* Step badge */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                  )}
                  style={
                    isActive
                      ? { background: 'oklch(0.72 0.14 75)', color: 'oklch(0.12 0.02 50)' }
                      : { background: 'oklch(0.28 0.06 155)', color: 'oklch(0.60 0.03 155)' }
                  }
                >
                  {mod.step}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
                    <span className="text-xs font-medium truncate">{mod.label}</span>
                    {mod.isNew && (
                      <span
                        className="px-1 py-0 rounded text-[7px] font-bold shrink-0"
                        style={{ background: 'oklch(0.50 0.14 155)', color: 'white' }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Tools section */}
          <div className="mx-1 my-2 border-t" style={{ borderColor: 'oklch(0.26 0.06 155)' }} />
          {!sidebarCollapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1.5" style={{ color: 'oklch(0.55 0.03 155)' }}>
              Tools
            </p>
          )}
          {TOOL_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(`${basePath}/${mod.id}`)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md mb-0.5 transition-all text-left",
                  isActive
                    ? "text-white"
                    : "text-white/55 hover:text-white/85 hover:bg-white/8"
                )}
                style={isActive ? { background: 'oklch(0.28 0.08 155)' } : {}}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span className="text-xs font-medium">{mod.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-3 border-t" style={{ borderColor: 'oklch(0.26 0.06 155)' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-md text-white/35 hover:text-white/70 hover:bg-white/8 transition-colors"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar — white, clean, matches Lovable */}
        <header className="topbar shrink-0">
          <div className="flex items-center gap-1 flex-1">
            <span className="breadcrumb-text">Workflow</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{activeModule?.label || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {center.name}
              <span className="mx-1.5 text-muted-foreground/40">·</span>
              <span className="capitalize">{viewType}</span>
            </span>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              New Upload
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
}
