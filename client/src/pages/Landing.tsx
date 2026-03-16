/**
 * Landing Page — Region Selection
 * Theme: Dark Forest Green + Amber/Gold (matching Tea Catalogue Studio Lovable design)
 */
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Sparkles, ArrowRight, BarChart3, Shield, Upload, Layers, FileSpreadsheet, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="hero-dark min-h-screen flex flex-col">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[oklch(0.50_0.14_155)] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-base leading-tight">Tea Catalogue Studio</p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Auctioneer's Ease</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs border border-white/15">
            <Sparkles className="w-3 h-3" />
            AI Engine Active
          </span>
          <span className="text-xs text-white/40">Enterprise v3.0</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          {/* Logo icon */}
          <div className="w-16 h-16 rounded-full bg-[oklch(0.26_0.07_155)] border border-white/15 flex items-center justify-center mx-auto mb-8">
            <Leaf className="w-8 h-8 text-[oklch(0.72_0.14_75)]" />
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
            Tea Auction Intelligence
          </h1>
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: 'oklch(0.72 0.14 75)' }}>
            Platform
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            AI-powered catalogue generation for Indian tea auctions. Streamline
            your workflow from upload to export.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Button
              onClick={() => navigate('/region/north')}
              className="h-11 px-7 rounded-full font-semibold text-sm gap-2"
              style={{ background: 'oklch(0.72 0.14 75)', color: 'oklch(0.12 0.02 50)' }}
            >
              Start Workflow <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/region/north')}
              className="h-11 px-7 rounded-full font-semibold text-sm border-white/25 text-white/80 bg-transparent hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/region/north')}
              className="h-11 px-7 rounded-full font-semibold text-sm border-white/25 text-white/80 bg-transparent hover:bg-white/10"
            >
              Try Demo Dataset
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-white/40 mb-16">
            <span>Upload Excel &amp; build catalogue</span>
            <span>·</span>
            <span>View past sale trends &amp; KPIs</span>
            <span>·</span>
            <span>Explore with 50 sample lots</span>
          </div>

          {/* Workflow Steps */}
          <div className="flex items-center justify-center gap-4 mb-16">
            {['Upload Excel', 'Configure & Allocate', 'Export Catalogue'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2"
                    style={{
                      borderColor: 'oklch(0.72 0.14 75)',
                      color: 'oklch(0.72 0.14 75)',
                      background: 'transparent',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-white/50 whitespace-nowrap">{step}</span>
                </div>
                {i < 2 && (
                  <div className="w-16 h-px mb-5" style={{ background: 'oklch(0.35 0.06 155)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[
              { icon: Upload, label: 'Upload & Parse', desc: 'Import Excel files with automatic sheet detection and column mapping' },
              { icon: Layers, label: 'Smart Categorization', desc: 'Classify lots by CTC, Orthodox, Green with hierarchical grade taxonomy' },
              { icon: Shield, label: 'SOP Allocation', desc: 'Rule-based Main vs Supplementary allocation with 27 India-specific rules' },
              { icon: FileSpreadsheet, label: 'Catalogue Export', desc: 'Generate auction-ready Excel and PowerPoint catalogues' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="hero-feature-card">
                <Icon className="w-5 h-5 mb-3" style={{ color: 'oklch(0.72 0.14 75)' }} />
                <p className="text-sm font-semibold text-white mb-1">{label}</p>
                <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-t border-white/10 px-8 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2000+', unit: 'Lots', desc: 'Handles 2000+ lots' },
            { value: '6', unit: 'Auction Centers', desc: 'All Indian auction centres' },
            { value: '8-Step', unit: 'Workflow', desc: 'End-to-end automation' },
            { value: 'Excel + PPT', unit: 'Export', desc: 'Export-ready formats' },
          ].map(({ value, unit, desc }) => (
            <div key={unit}>
              <p className="text-2xl font-bold" style={{ color: 'oklch(0.72 0.14 75)' }}>
                {value} <span className="text-sm font-normal text-white/60">{unit}</span>
              </p>
              <p className="text-xs text-white/35 mt-1 flex items-center justify-center gap-1">
                <span className="text-[oklch(0.50_0.14_155)]">✓</span> {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Region Selection ── */}
      <section className="px-8 py-12 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs text-white/40 uppercase tracking-widest mb-2">Select Your Region</p>
          <h3 className="text-center text-xl font-semibold text-white mb-8">Choose an Auction Region to Begin</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { region: 'north', label: 'North India', sub: 'Assam, Darjeeling & Dooars', centres: ['CTTA', 'GTAC', 'STAC'] },
              { region: 'south', label: 'South India', sub: 'Nilgiri, Munnar & Kerala', centres: ['Coonoor', 'Coimbatore', 'Cochin'] },
            ].map(({ region, label, sub, centres }) => (
              <motion.button
                key={region}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/region/${region}`)}
                className="hero-feature-card text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.30 0.08 155)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'oklch(0.72 0.14 75)' }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-white/45 text-xs">{sub}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {centres.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">{c}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium group-hover:gap-2.5 transition-all" style={{ color: 'oklch(0.72 0.14 75)' }}>
                  Enter Region <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-8 py-4 flex items-center justify-between text-xs text-white/25">
        <span>Auctioneer's Ease v3.0 — Enterprise License</span>
        <span>AI-Powered Tea Auction Management</span>
      </footer>
    </div>
  );
}
