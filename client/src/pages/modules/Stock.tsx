/**
 * Stock Module (Step 2)
 * Cumulative daily stock with week-wise breakdown and post-auction carry-forward
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Warehouse, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Layers, RefreshCw, Download, Filter, ChevronRight } from 'lucide-react';

export default function StockPage() {
  const [activeView, setActiveView] = useState<'overview' | 'weekly' | 'carry-forward'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 2</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Stock Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Cumulative daily stock with week-wise breakdown. Sale No. 08/2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"><Filter className="w-4 h-4" />Filters</button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" />Export</button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Stock', value: '2,847', sub: 'Cumulative lots', icon: Warehouse, change: '+350 today', up: true },
          { label: 'Carry-Forward', value: '1,600', sub: 'From previous sale', icon: RefreshCw, change: 'Week 7 unsold', up: false },
          { label: 'Fresh Arrivals', value: '1,247', sub: 'This week', icon: TrendingUp, change: '+198 today', up: true },
          { label: 'Total Weight', value: '1,42,350 kg', sub: 'Net weight', icon: Layers, change: '+17,500', up: true },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.up ? <ArrowUpRight className="w-3 h-3 text-primary" /> : <ArrowDownRight className="w-3 h-3 text-tea-gold" />}
              <span className={`text-xs ${kpi.up ? 'text-primary' : 'text-tea-gold'}`}>{kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: 'overview', label: 'Stock Overview' },
          { id: 'weekly', label: 'Week-Wise Breakdown' },
          { id: 'carry-forward', label: 'Carry-Forward' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as typeof activeView)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeView === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'overview' && (
        <>
          {/* Stock Formula */}
          <div className="tea-card p-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-tea-gold/10 border border-tea-gold/20 font-mono font-medium text-tea-brown">Carry-Forward: 1,600</span>
              <span className="text-muted-foreground font-bold">+</span>
              <span className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 font-mono font-medium text-primary">Fresh Arrivals: 1,247</span>
              <span className="text-muted-foreground font-bold">=</span>
              <span className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 font-mono font-bold text-foreground">Total Stock: 2,847</span>
            </div>
          </div>

          {/* Stock Table */}
          <div className="tea-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h4 className="text-sm font-semibold">Stock by Category</h4>
              <span className="text-xs text-muted-foreground">Last updated: Today, 5:30 PM</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Tea Type</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Carry-Fwd</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Fresh</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Total Lots</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Net Wt (kg)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: 'CTC', type: 'Leaf', cf: 820, fresh: 645, lots: 1465, pkg: 9870, wt: '73,500' },
                  { cat: 'CTC', type: 'Dust', cf: 380, fresh: 290, lots: 670, pkg: 4520, wt: '33,600' },
                  { cat: 'Orthodox', type: 'Leaf', cf: 280, fresh: 212, lots: 492, pkg: 3320, wt: '24,700' },
                  { cat: 'Orthodox', type: 'Dust', cf: 120, fresh: 100, lots: 220, pkg: 1480, wt: '10,550' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4 font-medium">{row.cat}</td>
                    <td className="py-3 px-4"><span className="tea-badge-green text-[10px]">{row.type}</span></td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-tea-gold">{row.cf}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-primary">{row.fresh}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold">{row.lots}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{row.pkg}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{row.wt}</td>
                  </tr>
                ))}
                <tr className="bg-secondary/50 font-bold">
                  <td className="py-3 px-4" colSpan={2}>Total</td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-tea-gold">1,600</td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-primary">1,247</td>
                  <td className="py-3 px-4 text-right font-mono text-xs">2,847</td>
                  <td className="py-3 px-4 text-right font-mono text-xs">19,190</td>
                  <td className="py-3 px-4 text-right font-mono text-xs">1,42,350</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeView === 'weekly' && (
        <div className="space-y-4">
          {/* Week-wise Timeline */}
          <div className="tea-card p-6">
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Daily Upload Timeline — Week 12</h4>
            <div className="space-y-3">
              {[
                { day: 'Wednesday', date: 'Mar 11', uploads: 100, running: 100, color: 'bg-primary' },
                { day: 'Thursday', date: 'Mar 12', uploads: 200, running: 300, color: 'bg-primary' },
                { day: 'Friday', date: 'Mar 13', uploads: 50, running: 350, color: 'bg-primary' },
                { day: 'Saturday', date: 'Mar 14', uploads: 0, running: 350, color: 'bg-muted' },
                { day: 'Today', date: 'Mar 16', uploads: 897, running: 1247, color: 'bg-tea-gold' },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-right">
                    <p className="text-xs font-medium text-foreground">{d.day}</p>
                    <p className="text-[10px] text-muted-foreground">{d.date}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full border-2 border-primary bg-card shrink-0" />
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-6 rounded-md bg-secondary overflow-hidden">
                      <div className={`h-full ${d.color} rounded-md transition-all`} style={{ width: `${(d.running / 1247) * 100}%` }} />
                    </div>
                    <div className="w-32 text-right">
                      <span className="text-xs font-mono font-medium text-foreground">{d.running.toLocaleString()}</span>
                      {d.uploads > 0 && <span className="text-[10px] text-primary ml-1">(+{d.uploads})</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Week Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="tea-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-tea-gold" />
                <h5 className="text-sm font-semibold">Previous Weeks (Carry-Forward)</h5>
              </div>
              <p className="text-3xl font-bold font-mono text-tea-gold mb-1">1,600</p>
              <p className="text-xs text-muted-foreground">Unsold lots from Sale 07/2026</p>
            </div>
            <div className="tea-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h5 className="text-sm font-semibold">This Week (Fresh Arrivals)</h5>
              </div>
              <p className="text-3xl font-bold font-mono text-primary mb-1">1,247</p>
              <p className="text-xs text-muted-foreground">5 daily uploads consolidated</p>
            </div>
          </div>
        </div>
      )}

      {activeView === 'carry-forward' && (
        <div className="space-y-4">
          <div className="tea-card p-6">
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Carry-Forward Calculation</h4>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border mb-4">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold font-mono">2,450</p>
                <p className="text-xs text-muted-foreground">Total Stock at Auction</p>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">−</span>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold font-mono text-primary">850</p>
                <p className="text-xs text-muted-foreground">Sold Lots</p>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">=</span>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold font-mono text-tea-gold">1,600</p>
                <p className="text-xs text-muted-foreground">Carry-Forward</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Carry-forward lots from Sale 07 become the base stock for Sale 08. New daily arrivals are added on top.
            </p>
          </div>

          {/* Outlot Actions */}
          <div className="tea-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h4 className="text-sm font-semibold">Outlot Decisions</h4>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Lot No.</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { lot: 'L-0234', mark: 'DOORIA', grade: 'BOP', pkg: 12, action: 'Reprint' },
                  { lot: 'L-0567', mark: 'HALMARI', grade: 'GBOP', pkg: 8, action: 'Hold' },
                  { lot: 'L-0891', mark: 'MANGALAM', grade: 'FOP', pkg: 15, action: 'Withdraw' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4 font-mono text-xs">{row.lot}</td>
                    <td className="py-3 px-4 font-medium text-xs">{row.mark}</td>
                    <td className="py-3 px-4 font-mono text-xs">{row.grade}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs">{row.pkg}</td>
                    <td className="py-3 px-4 text-center">
                      <select className="px-2 py-1 rounded border border-border text-xs bg-card">
                        <option>{row.action}</option>
                        <option>Reprint</option>
                        <option>Withdraw</option>
                        <option>Hold in Stock</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
