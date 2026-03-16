/**
 * Allocation Module (Step 4)
 * SOP-based allocation into Main & Supplement. Two-stage: categorization then allocation.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SplitSquareHorizontal, Sparkles, Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, Filter, Download, Settings } from 'lucide-react';

export default function AllocationPage() {
  const [simMode, setSimMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 4</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            SOP Allocation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Main & Supplement allocation based on 27 SOP rules</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimMode(!simMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              simMode ? 'bg-tea-gold/10 text-tea-gold border border-tea-gold/30' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {simMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {simMode ? 'Simulation Active' : 'Simulation Mode'}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Run Allocation
          </button>
        </div>
      </div>

      {simMode && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-tea-gold/5 border border-tea-gold/20">
          <AlertTriangle className="w-5 h-5 text-tea-gold shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Simulation Mode Active</p>
            <p className="text-xs text-muted-foreground">Changes will not be saved to master file. Test rule modifications safely.</p>
          </div>
          <button onClick={() => setSimMode(false)} className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-tea-gold/30 text-tea-gold text-xs font-medium">
            <RotateCcw className="w-3 h-3" /> Exit Simulation
          </button>
        </motion.div>
      )}

      {/* Allocation Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Categorized', value: '2,798', color: 'text-foreground' },
          { label: 'Main Sale', value: '1,892', color: 'text-primary' },
          { label: 'Supplementary', value: '857', color: 'text-tea-gold' },
          { label: 'Pending', value: '49', color: 'text-destructive' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <p className={`text-2xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Two-Stage Visual */}
      <div className="tea-card p-6">
        <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Two-Stage Allocation Pipeline</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-4 rounded-lg bg-secondary/50 border border-border text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <p className="text-sm font-semibold">Categorization</p>
            <p className="text-[10px] text-muted-foreground">Mfg Type: CTC / Orthodox</p>
            <p className="text-xs font-mono text-primary mt-2">2,798 classified</p>
          </div>
          <div className="text-2xl text-muted-foreground">→</div>
          <div className="flex-1 p-4 rounded-lg bg-secondary/50 border border-border text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-tea-gold/10 flex items-center justify-center mb-2">
              <span className="text-sm font-bold text-tea-gold">4</span>
            </div>
            <p className="text-sm font-semibold">SOP Allocation</p>
            <p className="text-[10px] text-muted-foreground">27 rules → Main / Supplement</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-xs font-mono text-primary">Main: 1,892</span>
              <span className="text-xs font-mono text-tea-gold">Supp: 857</span>
            </div>
          </div>
          <div className="text-2xl text-muted-foreground">→</div>
          <div className="flex-1 p-4 rounded-lg bg-primary/5 border border-primary/15 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-semibold">Ready for Tables</p>
            <p className="text-[10px] text-muted-foreground">Part I/II bifurcated</p>
            <p className="text-xs font-mono text-primary mt-2">2,749 allocated</p>
          </div>
        </div>
      </div>

      {/* Allocation Table */}
      <div className="tea-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h4 className="text-sm font-semibold">Allocation Results</h4>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:text-foreground">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded border border-border text-xs text-muted-foreground hover:text-foreground">
              <Settings className="w-3 h-3" /> SOP Rules
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Category</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Net Wt</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Season</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Allocation</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Part</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">SOP Rule</th>
            </tr>
          </thead>
          <tbody>
            {[
              { mark: 'DOORIA', grade: 'BOP', cat: 'CTC/Leaf', pkg: 45, wt: '1,012', season: 'New', alloc: 'MAIN', part: 'I', rule: '#3' },
              { mark: 'HALMARI', grade: 'GBOP', cat: 'CTC/Leaf', pkg: 32, wt: '576', season: 'New', alloc: 'MAIN', part: 'I', rule: '#3' },
              { mark: 'MANGALAM', grade: 'FOP', cat: 'Orth/Leaf', pkg: 28, wt: '425', season: 'Old', alloc: 'SUPP', part: 'II', rule: '#14' },
              { mark: 'MAKAIBARI', grade: 'TGFOP', cat: 'Orth/Leaf', pkg: 15, wt: '127', season: 'New', alloc: 'MAIN', part: 'I', rule: '#12' },
              { mark: 'BORENGAJULI', grade: 'PD', cat: 'CTC/Dust', pkg: 60, wt: '1,800', season: 'New', alloc: 'MAIN', part: 'I', rule: '#7' },
              { mark: 'JALINGA', grade: 'BP', cat: 'CTC/Leaf', pkg: 38, wt: '722', season: 'New', alloc: 'MAIN', part: 'I', rule: '#3' },
              { mark: 'TONGANAGAON', grade: 'BOP', cat: 'CTC/Leaf', pkg: 52, wt: '1,352', season: 'Old', alloc: 'SUPP', part: 'II', rule: '#15' },
              { mark: 'GREENWOOD', grade: 'FBOP', cat: 'Orth/Dust', pkg: 20, wt: '200', season: 'New', alloc: 'MAIN', part: 'I', rule: '#18' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                <td className="py-2.5 px-4 font-mono text-xs">{row.grade}</td>
                <td className="py-2.5 px-4 text-xs">{row.cat}</td>
                <td className="py-2.5 px-4 text-right font-mono text-xs">{row.pkg}</td>
                <td className="py-2.5 px-4 text-right font-mono text-xs">{row.wt}</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${row.season === 'New' ? 'bg-primary/10 text-primary' : 'bg-tea-gold/10 text-tea-gold'}`}>
                    {row.season}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.alloc === 'MAIN' ? 'bg-primary/10 text-primary' : 'bg-tea-gold/10 text-tea-gold'}`}>
                    {row.alloc}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-center font-mono text-xs">{row.part}</td>
                <td className="py-2.5 px-4 text-center">
                  <span className="text-[10px] font-mono text-muted-foreground">{row.rule}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
