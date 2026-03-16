/**
 * Catalogue Module (Step 6)
 * Kutcha/Trade/Tasting/Limits formats. All requirements unchanged.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Download, Printer, Upload, Eye, CheckCircle2, Clock } from 'lucide-react';

const FORMATS = [
  { id: 'kutcha', name: 'Kutcha Catalogue', desc: 'Internal working catalogue with all lot details', icon: '📋', status: 'ready', count: 2680 },
  { id: 'trade', name: 'Trade Catalogue', desc: 'Published catalogue for buyers and brokers', icon: '📄', status: 'ready', count: 2680 },
  { id: 'tasting', name: 'Tasting Catalogue', desc: 'Catalogue with muster values and tasting fields', icon: '☕', status: 'pending', count: 2680 },
  { id: 'limits', name: 'Limits Catalogue', desc: 'Price limits and reserve price catalogue', icon: '💰', status: 'draft', count: 2680 },
];

export default function CataloguePage() {
  const [selectedFormat, setSelectedFormat] = useState('kutcha');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 6</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Catalogue Generation</h2>
          <p className="text-sm text-muted-foreground mt-1">Generate and export catalogue in multiple formats</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info('Export Settings', { description: 'Configure column order, page layout, and branding for the catalogue export.' })} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
            <Upload className="w-4 h-4" /> Portal Upload Format
          </button>
        </div>
      </div>

      {/* Format Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FORMATS.map((fmt) => (
          <motion.button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id)}
            whileHover={{ y: -2 }}
            className={`tea-card p-4 text-left transition-all ${selectedFormat === fmt.id ? 'ring-2 ring-primary/30 border-primary/30' : ''}`}
          >
            <div className="text-2xl mb-2">{fmt.icon}</div>
            <h4 className="text-sm font-semibold text-foreground">{fmt.name}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{fmt.desc}</p>
            <div className="flex items-center gap-2 mt-3">
              {fmt.status === 'ready' && <span className="inline-flex items-center gap-1 text-[10px] text-primary"><CheckCircle2 className="w-3 h-3" /> Ready</span>}
              {fmt.status === 'pending' && <span className="inline-flex items-center gap-1 text-[10px] text-tea-gold"><Clock className="w-3 h-3" /> Pending</span>}
              {fmt.status === 'draft' && <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><FileText className="w-3 h-3" /> Draft</span>}
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">{fmt.count} lots</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Format Preview */}
      <div className="tea-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            {FORMATS.find(f => f.id === selectedFormat)?.name} Preview
          </h4>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground">
              <Eye className="w-3 h-3" /> Preview
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground">
              <Printer className="w-3 h-3" /> Print
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Lot No.</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Mark</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Grade</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Category</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Packages</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Net Wt (kg)</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Allocation</th>
              {selectedFormat === 'tasting' && <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Muster Val.</th>}
              {selectedFormat === 'limits' && <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs">Reserve ₹</th>}
            </tr>
          </thead>
          <tbody>
            {[
              { lot: 'L-0001', mark: 'HALMARI', grade: 'GBOP', cat: 'CTC/Leaf', pkg: 32, wt: '576', alloc: 'MAIN', muster: '₹340', reserve: '₹310' },
              { lot: 'L-0002', mark: 'HALMARI', grade: 'BOP', cat: 'CTC/Leaf', pkg: 28, wt: '504', alloc: 'MAIN', muster: '₹325', reserve: '₹295' },
              { lot: 'L-0003', mark: 'MAKAIBARI', grade: 'TGFOP', cat: 'Orth/Leaf', pkg: 15, wt: '127', alloc: 'MAIN', muster: '₹520', reserve: '₹480' },
              { lot: 'L-0004', mark: 'DOORIA', grade: 'BOP', cat: 'CTC/Leaf', pkg: 45, wt: '1,012', alloc: 'MAIN', muster: '₹280', reserve: '₹255' },
              { lot: 'L-0005', mark: 'BORENGAJULI', grade: 'PD', cat: 'CTC/Dust', pkg: 60, wt: '1,800', alloc: 'MAIN', muster: '₹195', reserve: '₹175' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="py-2.5 px-4 font-mono text-xs font-medium">{row.lot}</td>
                <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                <td className="py-2.5 px-4 font-mono text-xs">{row.grade}</td>
                <td className="py-2.5 px-4 text-xs">{row.cat}</td>
                <td className="py-2.5 px-4 text-right font-mono text-xs">{row.pkg}</td>
                <td className="py-2.5 px-4 text-right font-mono text-xs">{row.wt}</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.alloc === 'MAIN' ? 'bg-primary/10 text-primary' : 'bg-tea-gold/10 text-tea-gold'}`}>
                    {row.alloc}
                  </span>
                </td>
                {selectedFormat === 'tasting' && <td className="py-2.5 px-4 text-right font-mono text-xs">{row.muster}</td>}
                {selectedFormat === 'limits' && <td className="py-2.5 px-4 text-right font-mono text-xs">{row.reserve}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auction Portal Upload */}
      <div className="tea-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Auction Portal Upload</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Auto-map fields to auction portal format and generate upload-ready file.</p>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success('Generating Catalogue...', { description: 'Catalogue is being generated in the selected format. This will take a few seconds.' })} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Generate Portal Upload File
          </button>
          <span className="text-xs text-muted-foreground">Compatible with GRILL / auction portal format</span>
        </div>
      </div>
    </div>
  );
}
