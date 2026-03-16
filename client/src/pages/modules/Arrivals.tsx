/**
 * Arrivals Module (Step 1)
 * Dashboard view of arrival data from master file with new garden detection
 * Features: KPI strip, new garden flag, AWR type filter, dedicated new gardens tab
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Package, TrendingUp, Leaf, Sparkles, Filter, Download, Eye,
  ChevronDown, Star, AlertCircle, Printer, Search, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const SAMPLE_ARRIVALS = [
  { id: 1, awrNo: 'A-2847', gpNo: 'GP-1234', mark: 'DOORIA', garden: 'Dooria Tea Estate', grade: 'BOP', packages: 45, netWeight: 22.5, grossWeight: 23.1, awrType: 'ALPHA', isNew: true, category: 'CTC', teaType: 'Leaf' },
  { id: 2, awrNo: '5621', gpNo: 'GP-1235', mark: 'HALMARI', garden: 'Halmari Tea Estate', grade: 'GBOP', packages: 32, netWeight: 18.0, grossWeight: 18.5, awrType: 'NUM', isNew: false, category: 'CTC', teaType: 'Leaf' },
  { id: 3, awrNo: 'B-1093', gpNo: 'GP-1236', mark: 'MANGALAM', garden: 'Mangalam Tea Estate', grade: 'FOP', packages: 28, netWeight: 15.2, grossWeight: 15.8, awrType: 'ALPHA', isNew: false, category: 'Orthodox', teaType: 'Leaf' },
  { id: 4, awrNo: '7834', gpNo: 'GP-1237', mark: 'MAKAIBARI', garden: 'Makaibari Tea Estate', grade: 'TGFOP', packages: 15, netWeight: 8.5, grossWeight: 9.0, awrType: 'NUM', isNew: true, category: 'Orthodox', teaType: 'Leaf' },
  { id: 5, awrNo: 'C-4521', gpNo: 'GP-1238', mark: 'BORENGAJULI', garden: 'Borengajuli Tea Estate', grade: 'PD', packages: 60, netWeight: 30.0, grossWeight: 31.2, awrType: 'ALPHA', isNew: false, category: 'CTC', teaType: 'Dust' },
  { id: 6, awrNo: '9012', gpNo: 'GP-1239', mark: 'JALINGA', garden: 'Jalinga Tea Estate', grade: 'BP', packages: 38, netWeight: 19.0, grossWeight: 19.6, awrType: 'NUM', isNew: true, category: 'CTC', teaType: 'Leaf' },
  { id: 7, awrNo: 'D-6789', gpNo: 'GP-1240', mark: 'TONGANAGAON', garden: 'Tonganagaon Tea Estate', grade: 'BOP', packages: 52, netWeight: 26.0, grossWeight: 26.8, awrType: 'ALPHA', isNew: false, category: 'CTC', teaType: 'Leaf' },
  { id: 8, awrNo: '3456', gpNo: 'GP-1241', mark: 'GREENWOOD', garden: 'Greenwood Tea Estate', grade: 'FBOP', packages: 20, netWeight: 10.0, grossWeight: 10.4, awrType: 'NUM', isNew: true, category: 'Orthodox', teaType: 'Dust' },
];

export default function ArrivalsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'new-gardens'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const newGardens = SAMPLE_ARRIVALS.filter(a => a.isNew);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 1</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Arrivals Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Current sale arrivals filtered from master file. Sale No. 08/2026 — Week 12
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info('Filter Panel', { description: 'Use the AWR Type and Category dropdowns below to filter arrivals.' })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => toast.success('Exporting Arrivals...', { description: 'Your arrivals data is being prepared as Excel. Download will start shortly.' })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Lots', value: '1,247', icon: Package, change: '+198 today', up: true },
          { label: 'Total Packages', value: '8,432', icon: Package, change: '+1,204', up: true },
          { label: 'Net Weight (kg)', value: '42,160', icon: TrendingUp, change: '+6,020', up: true },
          { label: 'Gardens', value: '86', icon: Leaf, change: '4 new', up: true, highlight: true },
          { label: 'Avg. per Lot', value: '33.8 kg', icon: TrendingUp, change: '-0.2', up: false },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="tea-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.up ? (
                <ArrowUpRight className="w-3 h-3 text-primary" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-destructive" />
              )}
              <span className={`text-xs ${kpi.highlight ? 'text-primary font-semibold' : kpi.up ? 'text-primary' : 'text-destructive'}`}>
                {kpi.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Arrivals
          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-mono">{SAMPLE_ARRIVALS.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('new-gardens')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'new-gardens' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          New Gardens
          <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{newGardens.length}</span>
        </button>
      </div>

      {/* Search & AWR Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by mark, garden, AWR, grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </div>
        <select className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
          <option value="">AWR Type: All</option>
          <option value="ALPHA">ALPHA</option>
          <option value="NUM">NUM</option>
        </select>
        <select className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
          <option value="">Category: All</option>
          <option value="CTC">CTC</option>
          <option value="Orthodox">Orthodox</option>
        </select>
      </div>

      {/* New Gardens Alert */}
      {activeTab === 'all' && newGardens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15"
        >
          <Star className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {newGardens.length} New Garden{newGardens.length > 1 ? 's' : ''} Detected This Week
            </p>
            <p className="text-xs text-muted-foreground">
              {newGardens.map(g => g.garden).join(', ')} — not present in last week's list
            </p>
          </div>
          <button
            onClick={() => setActiveTab('new-gardens')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={() => toast.info('Print Ready', { description: 'Opening print preview for new gardens report.' })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-primary/30 text-primary text-xs font-medium">
            <Printer className="w-3 h-3" />
            Print
          </button>
        </motion.div>
      )}

      {/* Data Table */}
      <div className="tea-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">AWR No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">GP No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark / Garden</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Net Wt (kg)</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">AWR Type</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'new-gardens' ? newGardens : SAMPLE_ARRIVALS).map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs">{row.awrNo}</td>
                  <td className="py-3 px-4 font-mono text-xs">{row.gpNo}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-foreground text-xs">{row.mark}</p>
                        <p className="text-[10px] text-muted-foreground">{row.garden}</p>
                      </div>
                      {row.isNew && (
                        <span className="tea-badge-new">
                          <Star className="w-2.5 h-2.5" />
                          NEW
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-medium">{row.grade}</td>
                  <td className="py-3 px-4">
                    <span className="tea-badge-green text-[10px]">{row.category} / {row.teaType}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs">{row.packages}</td>
                  <td className="py-3 px-4 text-right font-mono text-xs">{(row.packages * row.netWeight).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      row.awrType === 'ALPHA' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {row.awrType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="tea-badge-green text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" />
                      Classified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {activeTab === 'new-gardens' ? newGardens.length : SAMPLE_ARRIVALS.length} of 1,247 entries</span>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.info('Page navigation will be active once real data is loaded via file upload.')} className="px-3 py-1 rounded border border-border hover:bg-secondary">Previous</button>
            <span className="px-3 py-1 rounded bg-primary text-primary-foreground font-medium">1</span>
            <button onClick={() => toast.info('Page 2 — Upload your MyArrivals file to load all records.')} className="px-3 py-1 rounded border border-border hover:bg-secondary">2</button>
            <button onClick={() => toast.info('Page 3 — Upload your MyArrivals file to load all records.')} className="px-3 py-1 rounded border border-border hover:bg-secondary">3</button>
            <button onClick={() => toast.info('Page navigation will be active once real data is loaded via file upload.')} className="px-3 py-1 rounded border border-border hover:bg-secondary">Next</button>
          </div>
        </div>
      </div>

      {/* Week-over-Week Comparison */}
      {activeTab === 'new-gardens' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Week-over-Week Garden Comparison
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
              <p className="text-2xl font-bold font-mono text-primary">{newGardens.length}</p>
              <p className="text-xs text-muted-foreground mt-1">New Gardens</p>
              <p className="text-[10px] text-primary mt-0.5">First appearance this week</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border text-center">
              <p className="text-2xl font-bold font-mono text-foreground">78</p>
              <p className="text-xs text-muted-foreground mt-1">Continuing Gardens</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Present in both weeks</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10 text-center">
              <p className="text-2xl font-bold font-mono text-destructive">2</p>
              <p className="text-xs text-muted-foreground mt-1">Dropped Gardens</p>
              <p className="text-[10px] text-destructive mt-0.5">Not present this week</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
