/**
 * Tables / Review Module (Step 5)
 * Non-destructive ranking, lot generation, undo/redo, validation
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TableProperties, GripVertical, Undo2, Redo2, CheckCircle2, AlertTriangle, Eye, Download, Sparkles, ArrowUpDown } from 'lucide-react';

export default function TablesPage() {
  const [activeTab, setActiveTab] = useState<'ranking' | 'lots' | 'validation'>('ranking');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 5</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Tables & Review</h2>
          <p className="text-sm text-muted-foreground mt-1">Non-destructive ranking and lot number generation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
            <button className="px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><Undo2 className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-border" />
            <button className="px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><Redo2 className="w-4 h-4" /></button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Generate Lot Numbers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Allocated', value: '2,749' },
          { label: 'Ranked', value: '2,680' },
          { label: 'Lot Numbers', value: '2,680' },
          { label: 'Validation Issues', value: '3', warn: true },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-2xl font-bold font-mono mt-1 ${s.warn ? 'text-tea-gold' : 'text-foreground'}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: 'ranking', label: 'Garden Ranking' },
          { id: 'lots', label: 'Lot Generation' },
          { id: 'validation', label: 'Validation' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'ranking' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold">Garden Ranking — Drag to Reorder</h4>
            <span className="text-xs text-muted-foreground">Ranked by weighted average price & region</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="w-10 py-3 px-2"></th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Garden / Mark</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Region</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Avg. Price</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Lots</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, mark: 'HALMARI', region: 'Upper Assam', avg: '₹342', lots: 32, pkg: 216 },
                { rank: 2, mark: 'MAKAIBARI', region: 'Darjeeling', avg: '₹328', lots: 15, pkg: 90 },
                { rank: 3, mark: 'DOORIA', region: 'Dooars', avg: '₹285', lots: 45, pkg: 304 },
                { rank: 4, mark: 'MANGALAM', region: 'Upper Assam', avg: '₹271', lots: 28, pkg: 189 },
                { rank: 5, mark: 'BORENGAJULI', region: 'Lower Assam', avg: '₹245', lots: 60, pkg: 405 },
                { rank: 6, mark: 'JALINGA', region: 'Cachar', avg: '₹232', lots: 38, pkg: 256 },
                { rank: 7, mark: 'TONGANAGAON', region: 'Upper Assam', avg: '₹218', lots: 52, pkg: 351 },
                { rank: 8, mark: 'GREENWOOD', region: 'Dooars', avg: '₹205', lots: 20, pkg: 135 },
              ].map((row) => (
                <tr key={row.rank} className="border-b border-border/50 hover:bg-secondary/20 cursor-grab active:cursor-grabbing">
                  <td className="py-2.5 px-2 text-center"><GripVertical className="w-4 h-4 text-muted-foreground/30 inline" /></td>
                  <td className="py-2.5 px-4"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{row.rank}</span></td>
                  <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{row.region}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-medium">{row.avg}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.lots}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.pkg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'lots' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4">Lot Number Preview</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">L-0001</p>
              <p className="text-[10px] text-muted-foreground">First Lot</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">L-2680</p>
              <p className="text-[10px] text-muted-foreground">Last Lot</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-center">
              <p className="text-xl font-bold font-mono text-primary">2,680</p>
              <p className="text-[10px] text-muted-foreground">Total Generated</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Lot numbers generated per garden by rank and grade. Real-time preview updates as ranking changes.</p>
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="space-y-3">
          <div className="tea-card p-4 flex items-center gap-3 border-l-4 border-l-primary">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">No Duplicate Lot Numbers</p>
              <p className="text-xs text-muted-foreground">All 2,680 lot numbers are unique</p>
            </div>
          </div>
          <div className="tea-card p-4 flex items-center gap-3 border-l-4 border-l-primary">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">All Required Fields Present</p>
              <p className="text-xs text-muted-foreground">Mark, grade, packages, weight — all populated</p>
            </div>
          </div>
          <div className="tea-card p-4 flex items-center gap-3 border-l-4 border-l-tea-gold">
            <AlertTriangle className="w-5 h-5 text-tea-gold shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">3 Weight Anomalies Detected</p>
              <p className="text-xs text-muted-foreground">Lots L-0456, L-1023, L-2101 — net weight exceeds expected range for grade</p>
            </div>
            <button className="ml-auto px-3 py-1 rounded border border-tea-gold/30 text-tea-gold text-xs font-medium">Review</button>
          </div>
        </div>
      )}
    </div>
  );
}
