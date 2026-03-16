/**
 * Analytics Module
 * Cross-center intelligence, price trends, garden performance, buyer analysis
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Building2, Leaf, Users, DollarSign, Filter, Download } from 'lucide-react';

const ANALYTICS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663443865192/PLQ7sMUS95Brz8RdgpbbsD/hero-analytics-DXKF3LE3Ggv5AvXkPMFxVj.webp';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'price' | 'gardens' | 'buyers'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Analytics & Intelligence</h2>
          <p className="text-sm text-muted-foreground mt-1">Cross-center price intelligence and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
            <option>Sale 08/2026</option>
            <option>Sale 07/2026</option>
            <option>Sale 06/2026</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden h-28">
        <img src={ANALYTICS_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tea-brown/80 to-transparent flex items-center px-6">
          <div>
            <p className="text-white text-sm font-medium">Cross-Center Intelligence Dashboard</p>
            <p className="text-white/70 text-xs">Compare performance across all 6 auction centres</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Price (All)', value: '₹267', icon: DollarSign, change: '+₹12 vs prev', up: true },
          { label: 'Total Turnover', value: '₹5.04 Cr', icon: TrendingUp, change: '+8.2%', up: true },
          { label: 'Active Gardens', value: '86', icon: Leaf, change: '+4 new', up: true },
          { label: 'Active Buyers', value: '24', icon: Users, change: '-2 vs prev', up: false },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.up ? <ArrowUpRight className="w-3 h-3 text-primary" /> : <ArrowDownRight className="w-3 h-3 text-destructive" />}
              <span className={`text-xs ${kpi.up ? 'text-primary' : 'text-destructive'}`}>{kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: 'overview', label: 'Center Overview' },
          { id: 'price', label: 'Price Trends' },
          { id: 'gardens', label: 'Garden Performance' },
          { id: 'buyers', label: 'Buyer Analysis' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h4 className="text-sm font-semibold">Cross-Center Comparison — Sale 08/2026</h4>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Centre</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Region</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Offered</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Sold</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Sold %</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Avg. ₹</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Turnover</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">vs Prev</th>
              </tr>
            </thead>
            <tbody>
              {[
                { center: 'CTTA', region: 'North', offered: '2,680', sold: '1,890', pct: '70.5%', avg: '₹267', turnover: '₹5.04 Cr', vs: '+8.2%', up: true },
                { center: 'GTAC', region: 'North', offered: '3,120', sold: '2,340', pct: '75.0%', avg: '₹245', turnover: '₹5.73 Cr', vs: '+5.1%', up: true },
                { center: 'STAC', region: 'North', offered: '1,890', sold: '1,260', pct: '66.7%', avg: '₹232', turnover: '₹2.92 Cr', vs: '-2.3%', up: false },
                { center: 'Coonoor', region: 'South', offered: '2,450', sold: '1,960', pct: '80.0%', avg: '₹298', turnover: '₹5.84 Cr', vs: '+12.4%', up: true },
                { center: 'Coimbatore', region: 'South', offered: '1,680', sold: '1,176', pct: '70.0%', avg: '₹275', turnover: '₹3.23 Cr', vs: '+3.7%', up: true },
                { center: 'Cochin', region: 'South', offered: '980', sold: '735', pct: '75.0%', avg: '₹312', turnover: '₹2.29 Cr', vs: '+6.8%', up: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-4 font-medium text-xs">{row.center}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{row.region}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.offered}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.sold}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-medium">{row.pct}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-medium">{row.avg}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.turnover}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs ${row.up ? 'text-primary' : 'text-destructive'}`}>
                      {row.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {row.vs}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'price' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Price Trend — Last 8 Sales</h4>
          <div className="space-y-4">
            {['CTC/Leaf', 'CTC/Dust', 'Orthodox/Leaf', 'Orthodox/Dust'].map((cat, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-28 shrink-0">{cat}</span>
                <div className="flex-1 flex items-center gap-1">
                  {[210, 225, 218, 240, 235, 252, 260, 267].map((v, j) => (
                    <div key={j} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-secondary rounded-t" style={{ height: `${(v / 300) * 60}px` }}>
                        <div className="w-full h-full bg-primary/20 rounded-t hover:bg-primary/40 transition-colors" />
                      </div>
                      <span className="text-[8px] text-muted-foreground">S{j + 1}</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs font-mono font-medium text-foreground w-16 text-right">₹{[267, 195, 420, 185][i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gardens' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h4 className="text-sm font-semibold">Top Performing Gardens</h4>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Garden</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Avg. Price ₹</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Lots Sold</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Sold %</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, garden: 'Makaibari', avg: '₹520', lots: 15, pct: '100%', trend: '+15%' },
                { rank: 2, garden: 'Halmari', avg: '₹342', lots: 30, pct: '94%', trend: '+8%' },
                { rank: 3, garden: 'Mangalam', avg: '₹285', lots: 25, pct: '89%', trend: '+3%' },
                { rank: 4, garden: 'Dooria', avg: '₹267', lots: 40, pct: '82%', trend: '+5%' },
                { rank: 5, garden: 'Borengajuli', avg: '₹245', lots: 55, pct: '92%', trend: '+2%' },
              ].map((row) => (
                <tr key={row.rank} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-4"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{row.rank}</span></td>
                  <td className="py-2.5 px-4 font-medium text-xs">{row.garden}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-medium">{row.avg}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.lots}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.pct}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <ArrowUpRight className="w-3 h-3" />{row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'buyers' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h4 className="text-sm font-semibold">Top Buyers — Sale 08/2026</h4>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Buyer</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Lots Bought</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Total Value</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Avg. Price ₹</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Preference</th>
              </tr>
            </thead>
            <tbody>
              {[
                { buyer: 'Tata Consumer Products', lots: 320, value: '₹1.12 Cr', avg: '₹350', pref: 'CTC/Leaf, Premium' },
                { buyer: 'Hindustan Unilever', lots: 280, value: '₹0.84 Cr', avg: '₹300', pref: 'CTC/Dust, Bulk' },
                { buyer: 'Wagh Bakri', lots: 180, value: '₹0.52 Cr', avg: '₹289', pref: 'CTC/Leaf, Gujarat' },
                { buyer: 'Goodricke Group', lots: 120, value: '₹0.48 Cr', avg: '₹400', pref: 'Orthodox/Leaf' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-4 font-medium text-xs">{row.buyer}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.lots}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-medium">{row.value}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.avg}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{row.pref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
