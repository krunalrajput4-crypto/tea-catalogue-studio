/**
 * Sampling Module (Step 7) [NEW MODULE]
 * FTS drawing, sticker generation, buyer offer lists, FIFO distribution, despatch tracking
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Users, Tag, Truck, Clock, CheckCircle2, AlertCircle, Download, Printer, Search, Sparkles } from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663443865192/PLQ7sMUS95Brz8RdgpbbsD/hero-sampling-fUpwfB2Y7YP4wnX4BEX8T5.webp';

export default function SamplingPage() {
  const [activeTab, setActiveTab] = useState<'fts' | 'stickers' | 'buyer-offers' | 'despatch'>('fts');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 7</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary">NEW MODULE</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Sampling</h2>
          <p className="text-sm text-muted-foreground mt-1">FTS sample drawing, sticker generation, buyer offers & despatch</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden h-32">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tea-brown/80 to-transparent flex items-center px-6">
          <div>
            <p className="text-white text-sm font-medium">Sample Management Pipeline</p>
            <p className="text-white/70 text-xs">From FTS drawing to buyer despatch — fully automated</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'FTS Samples', value: '2,680', icon: FlaskConical, status: 'Dust ready Tue' },
          { label: 'Stickers Generated', value: '1,840', icon: Tag, status: '840 pending' },
          { label: 'Buyer Offers', value: '24', icon: Users, status: 'Active buyers' },
          { label: 'Despatched', value: '18/24', icon: Truck, status: '6 pending' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{kpi.status}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {[
          { id: 'fts', label: 'FTS Drawing List' },
          { id: 'stickers', label: 'Sticker Generation' },
          { id: 'buyer-offers', label: 'Buyer Offers' },
          { id: 'despatch', label: 'Despatch Tracking' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'fts' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold">FTS Sample Drawing List — From Kutcha Catalogue</h4>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Auto-generated from Kutcha
              </span>
              <button className="flex items-center gap-1 px-2 py-1 rounded border border-border text-xs"><Download className="w-3 h-3" /> Export</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Lot No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Type</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Priority</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Ready By</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { lot: 'L-0001', mark: 'HALMARI', grade: 'GBOP', type: 'Leaf', priority: 'High', ready: 'Tue', status: 'drawn' },
                { lot: 'L-0005', mark: 'BORENGAJULI', grade: 'PD', type: 'Dust', priority: 'Urgent', ready: 'Tue', status: 'drawn' },
                { lot: 'L-0003', mark: 'MAKAIBARI', grade: 'TGFOP', type: 'Leaf', priority: 'High', ready: 'Wed', status: 'pending' },
                { lot: 'L-0004', mark: 'DOORIA', grade: 'BOP', type: 'Leaf', priority: 'Normal', ready: 'Wed', status: 'pending' },
                { lot: 'L-0008', mark: 'GREENWOOD', grade: 'FBOP', type: 'Dust', priority: 'Urgent', ready: 'Tue', status: 'drawn' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-4 font-mono text-xs">{row.lot}</td>
                  <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                  <td className="py-2.5 px-4 font-mono text-xs">{row.grade}</td>
                  <td className="py-2.5 px-4 text-xs">{row.type}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      row.priority === 'Urgent' ? 'bg-destructive/10 text-destructive' : row.priority === 'High' ? 'bg-tea-gold/10 text-tea-gold' : 'bg-secondary text-muted-foreground'
                    }`}>{row.priority}</span>
                  </td>
                  <td className="py-2.5 px-4 text-center text-xs">{row.ready}</td>
                  <td className="py-2.5 px-4 text-center">
                    {row.status === 'drawn' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary"><CheckCircle2 className="w-3 h-3" /> Drawn</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-tea-gold"><Clock className="w-3 h-3" /> Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stickers' && (
        <div className="tea-card p-6">
          <h4 className="text-sm font-semibold mb-4">Sticker Generation</h4>
          <p className="text-xs text-muted-foreground mb-4">Auto-generate sticker lists from Kutcha catalogue matched with buyer requirements.</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/15 text-center">
              <p className="text-xl font-bold font-mono text-primary">1,840</p>
              <p className="text-[10px] text-muted-foreground">Stickers Generated</p>
            </div>
            <div className="p-4 rounded-lg bg-tea-gold/5 border border-tea-gold/15 text-center">
              <p className="text-xl font-bold font-mono text-tea-gold">840</p>
              <p className="text-[10px] text-muted-foreground">Pending Approval</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border text-center">
              <p className="text-xl font-bold font-mono text-foreground">24</p>
              <p className="text-[10px] text-muted-foreground">Buyer Profiles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Generate Stickers</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm"><Printer className="w-4 h-4 inline mr-1" /> Print Stickers</button>
          </div>
        </div>
      )}

      {activeTab === 'buyer-offers' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h4 className="text-sm font-semibold">Buyer-Specific Offer Lists</h4>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Buyer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Preferences</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Matched Lots</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Duplicates</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { buyer: 'Tata Consumer Products', prefs: 'CTC/Leaf, BOP/GBOP, >₹250', matched: 145, dupes: 3, status: 'sent' },
                { buyer: 'Hindustan Unilever', prefs: 'CTC/Dust, PD/PF, Assam', matched: 98, dupes: 0, status: 'sent' },
                { buyer: 'Wagh Bakri', prefs: 'CTC/Leaf, BP/BOP, Gujarat', matched: 67, dupes: 1, status: 'pending' },
                { buyer: 'Goodricke Group', prefs: 'Orthodox/Leaf, TGFOP', matched: 34, dupes: 0, status: 'pending' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-4 font-medium text-xs">{row.buyer}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{row.prefs}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.matched}</td>
                  <td className="py-2.5 px-4 text-center">
                    {row.dupes > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-tea-gold"><AlertCircle className="w-3 h-3" /> {row.dupes}</span>
                    ) : (
                      <span className="text-[10px] text-primary">None</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${row.status === 'sent' ? 'bg-primary/10 text-primary' : 'bg-tea-gold/10 text-tea-gold'}`}>
                      {row.status === 'sent' ? 'Sent' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button className="px-2 py-1 rounded border border-border text-[10px] hover:bg-secondary">View List</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'despatch' && (
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold">Despatch Tracking — FIFO Queue</h4>
            <span className="text-xs text-muted-foreground">Deadline: 2nd week Friday</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Buyer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Courier</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Destination</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Samples</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Urgency</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { buyer: 'Tata Consumer', courier: 'Blue Dart', dest: 'Mumbai', samples: 145, urgency: 'High', status: 'delivered' },
                { buyer: 'HUL', courier: 'DTDC', dest: 'Kolkata', samples: 98, urgency: 'Normal', status: 'in-transit' },
                { buyer: 'Wagh Bakri', courier: 'Blue Dart', dest: 'Ahmedabad', samples: 67, urgency: 'High', status: 'packed' },
                { buyer: 'Goodricke', courier: 'FedEx', dest: 'Kolkata', samples: 34, urgency: 'Normal', status: 'pending' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-4 font-medium text-xs">{row.buyer}</td>
                  <td className="py-2.5 px-4 text-xs">{row.courier}</td>
                  <td className="py-2.5 px-4 text-xs">{row.dest}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs">{row.samples}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${row.urgency === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                      {row.urgency}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      row.status === 'delivered' ? 'bg-primary/10 text-primary' :
                      row.status === 'in-transit' ? 'bg-blue-50 text-blue-700' :
                      row.status === 'packed' ? 'bg-tea-gold/10 text-tea-gold' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
