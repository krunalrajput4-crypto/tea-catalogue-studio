/**
 * Tasting Module (Step 8) [NEW MODULE]
 * Valuation entry, muster values, tasting remarks, limit price setting
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Coffee, Star, DollarSign, MessageSquare, CheckCircle2, Clock, Sparkles, Download, Filter, Edit3 } from 'lucide-react';

export default function TastingPage() {
  const [activeTab, setActiveTab] = useState<'valuation' | 'muster' | 'remarks' | 'limits'>('valuation');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 8</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary">NEW MODULE</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Tasting & Valuation</h2>
          <p className="text-sm text-muted-foreground mt-1">Muster values, tasting remarks, and limit price management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('Exporting Tasting Catalogue...', { description: 'Muster values, limit prices, and remarks will be exported as Excel.' })} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" /> Export Valuations
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Lots', value: '2,680', icon: Coffee, sub: 'For tasting' },
          { label: 'Valued', value: '2,120', icon: DollarSign, sub: '79% complete' },
          { label: 'Remarks Added', value: '1,840', icon: MessageSquare, sub: '69% complete' },
          { label: 'Limits Set', value: '1,560', icon: Star, sub: '58% complete' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress */}
      <div className="tea-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Tasting Progress</h4>
          <span className="text-xs text-muted-foreground">Deadline: Thursday 5:00 PM</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Valuation Entry', pct: 79, color: 'bg-primary' },
            { label: 'Tasting Remarks', pct: 69, color: 'bg-tea-gold' },
            { label: 'Limit Prices', pct: 58, color: 'bg-primary' },
          ].map((bar, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-32 shrink-0">{bar.label}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full ${bar.color} rounded-full transition-all`} style={{ width: `${bar.pct}%` }} />
              </div>
              <span className="text-xs font-mono text-foreground w-10 text-right">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: 'valuation', label: 'Valuation Entry' },
          { id: 'muster', label: 'Muster Values' },
          { id: 'remarks', label: 'Tasting Remarks' },
          { id: 'limits', label: 'Limit Prices' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'valuation' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold">Valuation Entry — Inline Editable</h4>
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info('Filter Tasting', { description: 'Filter by grade, category, or buyer group to focus your tasting session.' })} className="flex items-center gap-1 px-2 py-1 rounded border border-border text-xs"><Filter className="w-3 h-3" /> Filter</button>
              <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                <Edit3 className="w-3 h-3" /> Click cell to edit
              </span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Lot No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Prev. Price ₹</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Muster Val. ₹</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Limit ₹</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Remark</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { lot: 'L-0001', mark: 'HALMARI', grade: 'GBOP', prev: '340', muster: '342', limit: '310', remark: 'Bright liquor, tippy', done: true },
                { lot: 'L-0002', mark: 'HALMARI', grade: 'BOP', prev: '325', muster: '328', limit: '295', remark: 'Good body, malty', done: true },
                { lot: 'L-0003', mark: 'MAKAIBARI', grade: 'TGFOP', prev: '510', muster: '520', limit: '480', remark: 'Muscatel notes, premium', done: true },
                { lot: 'L-0004', mark: 'DOORIA', grade: 'BOP', prev: '275', muster: '280', limit: '', remark: '', done: false },
                { lot: 'L-0005', mark: 'BORENGAJULI', grade: 'PD', prev: '190', muster: '195', limit: '', remark: '', done: false },
                { lot: 'L-0006', mark: 'JALINGA', grade: 'BP', prev: '228', muster: '', limit: '', remark: '', done: false },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-border/50 hover:bg-secondary/20 ${!row.done ? 'bg-tea-gold/3' : ''}`}>
                  <td className="py-2.5 px-4 font-mono text-xs">{row.lot}</td>
                  <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                  <td className="py-2.5 px-4 font-mono text-xs">{row.grade}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs text-muted-foreground">{row.prev}</td>
                  <td className="py-2.5 px-4 text-right">
                    {row.muster ? (
                      <span className="font-mono text-xs font-medium text-foreground">{row.muster}</span>
                    ) : (
                      <span className="inline-block w-16 h-6 rounded border border-dashed border-primary/30 bg-primary/5" />
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {row.limit ? (
                      <span className="font-mono text-xs font-medium text-foreground">{row.limit}</span>
                    ) : (
                      <span className="inline-block w-16 h-6 rounded border border-dashed border-border bg-secondary/30" />
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground max-w-[200px] truncate">{row.remark || '—'}</td>
                  <td className="py-2.5 px-4 text-center">
                    {row.done ? (
                      <CheckCircle2 className="w-4 h-4 text-primary inline" />
                    ) : (
                      <Clock className="w-4 h-4 text-tea-gold inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'muster' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Muster Value Summary</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/15 text-center">
              <p className="text-xl font-bold font-mono text-primary">₹285</p>
              <p className="text-[10px] text-muted-foreground">Avg. Muster (CTC/Leaf)</p>
            </div>
            <div className="p-4 rounded-lg bg-tea-gold/5 border border-tea-gold/15 text-center">
              <p className="text-xl font-bold font-mono text-tea-gold">₹195</p>
              <p className="text-[10px] text-muted-foreground">Avg. Muster (CTC/Dust)</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">₹420</p>
              <p className="text-[10px] text-muted-foreground">Avg. Muster (Orthodox)</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Muster values are derived from previous sale prices, market trends, and taster assessment. AI suggests initial values.</p>
        </div>
      )}

      {activeTab === 'remarks' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4">Tasting Remarks — Quick Entry</h4>
          <div className="space-y-3">
            {[
              { lot: 'L-0001', mark: 'HALMARI', grade: 'GBOP', remark: 'Bright liquor, tippy, golden tips visible. Good body with malty character.' },
              { lot: 'L-0002', mark: 'HALMARI', grade: 'BOP', remark: 'Strong body, coppery infusion. Brisk with good keeping quality.' },
              { lot: 'L-0003', mark: 'MAKAIBARI', grade: 'TGFOP', remark: 'Muscatel notes, light amber liquor. Premium Darjeeling character.' },
            ].map((row, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-primary">{row.lot}</span>
                  <span className="font-medium text-xs">{row.mark}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{row.grade}</span>
                </div>
                <p className="text-xs text-foreground">{row.remark}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">AI can suggest remarks based on grade, garden history, and season</span>
          </div>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4">Limit Price Management</h4>
          <p className="text-xs text-muted-foreground mb-4">Set reserve/limit prices for each lot. AI suggests based on muster values and market data.</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/15">
              <p className="text-sm font-semibold mb-1">Auto-Set Limits</p>
              <p className="text-xs text-muted-foreground mb-3">Apply formula: Muster Value × 0.90 for all pending lots</p>
              <button onClick={() => toast.success('Valuation Saved', { description: 'Muster value and limit price have been saved for this lot.' })} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                <Sparkles className="w-3 h-3 inline mr-1" /> Apply to 1,120 Lots
              </button>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <p className="text-sm font-semibold mb-1">Manual Override</p>
              <p className="text-xs text-muted-foreground mb-3">Edit individual lot limits in the valuation table</p>
              <button onClick={() => toast.info('Lot Skipped', { description: 'This lot has been moved to the pending review queue.' })} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium">
                <Edit3 className="w-3 h-3 inline mr-1" /> Open Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
