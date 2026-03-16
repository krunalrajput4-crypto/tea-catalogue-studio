/**
 * Categorization Module (Step 3)
 * Flowchart-style configurable hierarchy: CTC/Orthodox → Leaf/Dust → Grades
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Sparkles, ChevronDown, ChevronRight, Plus, Settings, CheckCircle2, AlertCircle, Leaf } from 'lucide-react';

const HIERARCHY = {
  root: 'All Tea',
  children: [
    {
      id: 'ctc', name: 'CTC', color: 'bg-primary', count: 2135,
      children: [
        { id: 'ctc-leaf', name: 'Leaf', count: 1465, grades: ['BOP', 'BP', 'FOP', 'GBOP', 'FBOP', 'GOF'] },
        { id: 'ctc-dust', name: 'Dust', count: 670, grades: ['PD', 'PF', 'CD', 'D', 'RD', 'SRD'] },
      ]
    },
    {
      id: 'orthodox', name: 'Orthodox', color: 'bg-tea-gold', count: 712,
      children: [
        { id: 'orth-leaf', name: 'Leaf', count: 492, grades: ['TGFOP', 'FOP', 'GFOP', 'FTGFOP', 'SFTGFOP'] },
        { id: 'orth-dust', name: 'Dust', count: 220, grades: ['PD', 'OF', 'OFD', 'GOF'] },
      ]
    },
  ]
};

export default function CategorizationPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ctc', 'orthodox', 'ctc-leaf', 'ctc-dust', 'orth-leaf', 'orth-dust']));

  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedNodes(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step 3</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pre-Auction</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Categorization
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manufacturing type classification — configurable hierarchy</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Auto-Classify All
          </button>
        </div>
      </div>

      {/* Classification Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Lots', value: '2,847', status: 'All' },
          { label: 'Classified', value: '2,798', status: 'success' },
          { label: 'Unclassified', value: '49', status: 'warning' },
          { label: 'OR-Dust Auto', value: '220', status: 'ai' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tea-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              {s.status === 'success' && <CheckCircle2 className="w-4 h-4 text-primary" />}
              {s.status === 'warning' && <AlertCircle className="w-4 h-4 text-tea-gold" />}
              {s.status === 'ai' && <Sparkles className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flowchart Tree */}
        <div className="tea-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <GitBranch className="w-4 h-4 text-primary" />
              Category Hierarchy
            </h4>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Settings className="w-3 h-3" />
              Configure in Settings
            </button>
          </div>

          {/* Root Node */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">{HIERARCHY.root}</span>
              <span className="ml-auto text-xs font-mono text-muted-foreground">2,847 lots</span>
            </div>

            {/* L1: Manufacturing Types */}
            <div className="ml-6 space-y-2 border-l-2 border-border pl-4">
              {HIERARCHY.children.map(mfg => (
                <div key={mfg.id}>
                  <button
                    onClick={() => toggleNode(mfg.id)}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    {expandedNodes.has(mfg.id) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <div className={`w-3 h-3 rounded-sm ${mfg.color}`} />
                    <span className="text-sm font-semibold">{mfg.name}</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">{mfg.count.toLocaleString()}</span>
                  </button>

                  {/* L2: Tea Types */}
                  {expandedNodes.has(mfg.id) && (
                    <div className="ml-8 space-y-1 border-l-2 border-border/50 pl-4 mt-1">
                      {mfg.children.map(tt => (
                        <div key={tt.id}>
                          <button
                            onClick={() => toggleNode(tt.id)}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                          >
                            {expandedNodes.has(tt.id) ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                            <span className="text-xs font-medium">{tt.name}</span>
                            <span className="ml-auto text-[10px] font-mono text-muted-foreground">{tt.count}</span>
                          </button>

                          {/* L5: Grades */}
                          {expandedNodes.has(tt.id) && (
                            <div className="ml-6 flex flex-wrap gap-1.5 mt-1 mb-2 pl-4 border-l border-border/30">
                              {tt.grades.map(g => (
                                <span key={g} className="px-2 py-1 rounded-md bg-secondary text-[10px] font-mono font-medium text-foreground border border-border/50">
                                  {g}
                                </span>
                              ))}
                              <button className="px-2 py-1 rounded-md bg-primary/5 text-[10px] font-medium text-primary border border-primary/20 hover:bg-primary/10 transition-colors">
                                <Plus className="w-3 h-3 inline mr-0.5" />
                                Add Grade
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-primary hover:underline ml-5">
                        <Plus className="w-3 h-3" />
                        Add Tea Type
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:underline ml-5">
                <Plus className="w-3 h-3" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Classification Results */}
        <div className="tea-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold">Classification Results</h4>
            <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Auto-Classified
            </span>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-2.5 px-4 font-medium text-muted-foreground text-xs">Mark</th>
                  <th className="text-left py-2.5 px-4 font-medium text-muted-foreground text-xs">Grade</th>
                  <th className="text-left py-2.5 px-4 font-medium text-muted-foreground text-xs">Category</th>
                  <th className="text-left py-2.5 px-4 font-medium text-muted-foreground text-xs">Type</th>
                  <th className="text-center py-2.5 px-4 font-medium text-muted-foreground text-xs">Season</th>
                  <th className="text-center py-2.5 px-4 font-medium text-muted-foreground text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mark: 'DOORIA', grade: 'BOP', cat: 'CTC', type: 'Leaf', season: 'New', auto: true },
                  { mark: 'HALMARI', grade: 'GBOP', cat: 'CTC', type: 'Leaf', season: 'New', auto: true },
                  { mark: 'MANGALAM', grade: 'FOP', cat: 'Orthodox', type: 'Leaf', season: 'Old', auto: true },
                  { mark: 'MAKAIBARI', grade: 'TGFOP', cat: 'Orthodox', type: 'Leaf', season: 'New', auto: true },
                  { mark: 'BORENGAJULI', grade: 'PD', cat: 'CTC', type: 'Dust', season: 'New', auto: true },
                  { mark: 'JALINGA', grade: 'BP', cat: 'CTC', type: 'Leaf', season: 'New', auto: true },
                  { mark: 'TONGANAGAON', grade: 'BOP', cat: 'CTC', type: 'Leaf', season: 'Old', auto: true },
                  { mark: 'GREENWOOD', grade: 'FBOP', cat: 'Orthodox', type: 'Dust', season: 'New', auto: true },
                  { mark: 'PANITOLA', grade: 'PD', cat: 'OR-Dust', type: 'Dust', season: 'New', auto: true },
                  { mark: 'SEAJULI', grade: 'OF', cat: 'OR-Dust', type: 'Dust', season: 'Old', auto: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-2.5 px-4 font-medium text-xs">{row.mark}</td>
                    <td className="py-2.5 px-4 font-mono text-xs">{row.grade}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.cat === 'CTC' ? 'bg-primary/10 text-primary' : row.cat === 'OR-Dust' ? 'bg-purple-100 text-purple-700' : 'bg-tea-gold/10 text-tea-brown'
                      }`}>
                        {row.cat}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs">{row.type}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.season === 'New' ? 'bg-primary/10 text-primary' : 'bg-tea-gold/10 text-tea-gold'
                      }`}>
                        {row.season}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {row.auto && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                          <Sparkles className="w-2.5 h-2.5" /> Auto
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
