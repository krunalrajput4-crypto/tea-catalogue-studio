/**
 * Post-Auction Module
 * Sold/unsold tracking, carry-forward calculation, outlot management
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowDownToLine, CheckCircle2, XCircle, RefreshCw, TrendingUp, DollarSign, Package, Download, Filter, Sparkles } from 'lucide-react';

export default function PostAuctionPage() {
  const [activeTab, setActiveTab] = useState<'results' | 'carry-forward' | 'settlement'>('results');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Post-Auction</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Operations</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Post-Auction</h2>
          <p className="text-sm text-muted-foreground mt-1">Auction results, carry-forward calculation, and settlement</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('Exporting Auction Results...', { description: 'Sale results with buyer details, prices, and settlement data will be downloaded.' })} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" /> Export Results
          </button>
          <button onClick={() => toast.success('Processing Carry-Forward', { description: 'Unsold lots are being moved to Sale 09/2026 base stock.' })} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Import Auction Data
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Offered', value: '2,680', icon: Package },
          { label: 'Sold', value: '1,890', icon: CheckCircle2, color: 'text-primary' },
          { label: 'Unsold', value: '790', icon: XCircle, color: 'text-destructive' },
          { label: 'Avg. Price', value: '₹267', icon: DollarSign },
          { label: 'Carry-Forward', value: '790', icon: RefreshCw, color: 'text-tea-gold' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <p className={`text-2xl font-bold font-mono ${kpi.color || 'text-foreground'}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Sale Summary */}
      <div className="tea-card p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div>
              <span className="text-xs text-muted-foreground">Sold</span>
              <p className="text-sm font-bold font-mono">70.5%</p>
            </div>
          </div>
          <div className="flex-1 h-4 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '70.5%' }} />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-destructive/30" />
            <div>
              <span className="text-xs text-muted-foreground">Unsold</span>
              <p className="text-sm font-bold font-mono">29.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: 'results', label: 'Auction Results' },
          { id: 'carry-forward', label: 'Carry-Forward' },
          { id: 'settlement', label: 'Settlement' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'results' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold">Sale No. 08/2026 — Auction Results</h4>
            <button onClick={() => toast.info('Filter Results', { description: 'Filter by buyer, grade, category, or price range.' })} className="flex items-center gap-1 px-2 py-1 rounded border border-border text-xs"><Filter className="w-3 h-3" /> Filter</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Lot No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Limit ₹</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Sold ₹</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Buyer</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { lot: 'L-0001', mark: 'HALMARI', grade: 'GBOP', pkg: 32, limit: '310', sold: '345', buyer: 'Tata Consumer', status: 'sold' },
                { lot: 'L-0002', mark: 'HALMARI', grade: 'BOP', pkg: 28, limit: '295', sold: '312', buyer: 'HUL', status: 'sold' },
                { lot: 'L-0003', mark: 'MAKAIBARI', grade: 'TGFOP', pkg: 15, limit: '480', sold: '535', buyer: 'Goodricke', status: 'sold' },
                { lot: 'L-0004', mark: 'DOORIA', grade: 'BOP', pkg: 45, limit: '255', sold: '—', buyer: '—', status: 'unsold' },
                { lot: 'L-0005', mark: 'BORENGAJULI', grade: 'PD', pkg: 60, limit: '175', sold: '192', buyer: 'Wagh Bakri', status: 'sold' },
                { lot: 'L-0006', mark: 'JALINGA', grade: 'BP', pkg: 38, limit: '210', sold: '—', buyer: '—', status: 'unsold' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-border/50 hover:bg-secondary/20 ${row.status === 'unsold' ? 'bg-destructive/3' : ''}`}>
                  <td className="py-2.5 px-4 font-mono text-xs">{row.lot}</td>
                  <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                  <td className="py-2.5 px-4 font-mono text-xs">{row.grade}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.pkg}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs text-muted-foreground">{row.limit}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-medium">{row.sold}</td>
                  <td className="py-2.5 px-4 text-xs">{row.buyer}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.status === 'sold' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {row.status === 'sold' ? 'SOLD' : 'UNSOLD'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'carry-forward' && (
        <div className="space-y-4">
          <div className="tea-card p-6">
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Carry-Forward Calculation</h4>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border mb-4">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold font-mono">2,680</p>
                <p className="text-xs text-muted-foreground">Offered</p>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">−</span>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold font-mono text-primary">1,890</p>
                <p className="text-xs text-muted-foreground">Sold</p>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">=</span>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold font-mono text-tea-gold">790</p>
                <p className="text-xs text-muted-foreground">Carry-Forward to Sale 09</p>
              </div>
            </div>
          </div>

          {/* Outlot Actions */}
          <div className="tea-card p-6">
            <h4 className="text-sm font-semibold mb-4">Outlot Decisions for Unsold Lots</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/15 text-center">
                <p className="text-xl font-bold font-mono text-primary">620</p>
                <p className="text-xs text-muted-foreground">Reprint in Next Sale</p>
              </div>
              <div className="p-4 rounded-lg bg-tea-gold/5 border border-tea-gold/15 text-center">
                <p className="text-xl font-bold font-mono text-tea-gold">140</p>
                <p className="text-xs text-muted-foreground">Hold in Stock</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/15 text-center">
                <p className="text-xl font-bold font-mono text-destructive">30</p>
                <p className="text-xs text-muted-foreground">Withdraw</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settlement' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Settlement Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-secondary border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">₹5,04,630</p>
              <p className="text-[10px] text-muted-foreground">Total Sale Value</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/15 text-center">
              <p className="text-xl font-bold font-mono text-primary">₹267</p>
              <p className="text-[10px] text-muted-foreground">Weighted Avg. Price</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">₹535</p>
              <p className="text-[10px] text-muted-foreground">Highest Price</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">₹142</p>
              <p className="text-[10px] text-muted-foreground">Lowest Price</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Settlement data auto-syncs with carry-forward for next sale cycle.</p>
        </div>
      )}
    </div>
  );
}
