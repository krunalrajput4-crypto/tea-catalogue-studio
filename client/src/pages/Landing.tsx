/**
 * Landing Page — Region Selection as Primary CTA
 * Theme: Dark Forest Green + Amber/Gold (matching Tea Catalogue Studio Lovable design)
 * Layout: Two-column — left: branding/info, right: region selector (above the fold)
 */
import { useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  MapPin, Leaf, Sparkles, ArrowRight, BarChart3,
  Upload, Layers, Shield, FileSpreadsheet, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const REGIONS = [
  {
    id: 'north',
    label: 'North India',
    sub: 'Assam, Darjeeling & Dooars',
    centres: ['CTTA', 'GTAC', 'STAC'],
    description: 'Kolkata & Guwahati auction centres',
    color: 'oklch(0.50 0.14 155)',
  },
  {
    id: 'south',
    label: 'South India',
    sub: 'Nilgiri, Munnar & Kerala',
    centres: ['Coonoor', 'Coimbatore', 'Cochin'],
    description: 'South India auction centres',
    color: 'oklch(0.55 0.13 200)',
  },
];

const FEATURES = [
  { icon: Upload, label: 'Upload & Parse', desc: 'Excel import with auto column mapping' },
  { icon: Layers, label: 'Smart Categorization', desc: 'CTC, Orthodox, Green with grade taxonomy' },
  { icon: Shield, label: 'SOP Allocation', desc: '27 India-specific rules, Main vs Supp' },
  { icon: FileSpreadsheet, label: 'Catalogue Export', desc: 'Excel + PPT auction-ready formats' },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const regionRef = useRef<HTMLDivElement>(null);

  const scrollToRegion = () => {
    regionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="hero-dark min-h-screen flex flex-col">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 shrink-0">
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

      {/* ── Main Content: Two-column layout ── */}
      <main className="flex-1 flex flex-col lg:flex-row">

        {/* LEFT: Branding + Info */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 lg:py-0 lg:max-w-[52%]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Logo */}
            <div className="w-14 h-14 rounded-full bg-[oklch(0.26_0.07_155)] border border-white/15 flex items-center justify-center mb-7">
              <Leaf className="w-7 h-7 text-[oklch(0.72_0.14_75)]" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              Tea Auction Intelligence
            </h1>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: 'oklch(0.72 0.14 75)' }}>
              Platform
            </h2>
            <p className="text-base text-white/55 max-w-md leading-relaxed mb-8">
              AI-powered catalogue generation for Indian tea auctions.
              Streamline your workflow from upload to export across all auction centres.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                onClick={scrollToRegion}
                className="h-10 px-6 rounded-full font-semibold text-sm gap-2"
                style={{ background: 'oklch(0.72 0.14 75)', color: 'oklch(0.12 0.02 50)' }}
              >
                Start Workflow <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/center/ctta/auctions/analytics')}
                className="h-10 px-6 rounded-full font-semibold text-sm border-white/25 text-white/80 bg-transparent hover:bg-white/10"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>

            {/* Workflow steps */}
            <div className="flex items-center gap-4 mb-10">
              {['Upload Excel', 'Configure & Allocate', 'Export Catalogue'].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                      style={{ borderColor: 'oklch(0.72 0.14 75)', color: 'oklch(0.72 0.14 75)' }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[10px] text-white/45 whitespace-nowrap">{step}</span>
                  </div>
                  {i < 2 && <div className="w-10 h-px mb-4" style={{ background: 'oklch(0.35 0.06 155)' }} />}
                </div>
              ))}
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="hero-feature-card">
                  <Icon className="w-4 h-4 mb-2" style={{ color: 'oklch(0.72 0.14 75)' }} />
                  <p className="text-xs font-semibold text-white mb-0.5">{label}</p>
                  <p className="text-[10px] text-white/45 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Region Selector — PRIMARY CTA */}
        <div
          ref={regionRef}
          className="lg:w-[48%] flex flex-col justify-center px-10 py-12 lg:border-l border-white/10"
        >
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            {/* Header */}
            <div className="mb-8">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Step 0 of 8</p>
              <h3 className="text-2xl font-bold text-white mb-1">Select Your Region</h3>
              <p className="text-sm text-white/50">Choose an auction region to begin the workflow</p>
            </div>

            {/* Region Cards — large and prominent */}
            <div className="flex flex-col gap-4 mb-8">
              {REGIONS.map(({ id, label, sub, centres, description, color }, idx) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ scale: 1.015, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/region/${id}`)}
                  className="w-full text-left rounded-xl border border-white/15 p-5 group transition-all duration-200 hover:border-[oklch(0.72_0.14_75)] hover:bg-white/5"
                  style={{ background: 'oklch(0.16 0.04 155)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'oklch(0.22 0.06 155)' }}
                      >
                        <MapPin className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-base leading-tight">{label}</p>
                        <p className="text-white/50 text-xs mt-0.5">{sub}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className="w-5 h-5 mt-1 text-white/30 group-hover:text-[oklch(0.72_0.14_75)] group-hover:translate-x-1 transition-all duration-200"
                    />
                  </div>

                  {/* Centre badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {centres.map(c => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-md text-xs font-medium border border-white/15 text-white/70"
                        style={{ background: 'oklch(0.20 0.05 155)' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-white/35">{description}</p>

                  {/* Bottom CTA row */}
                  <div
                    className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
                    style={{ color: 'oklch(0.72 0.14 75)' }}
                  >
                    Enter Region
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/10">
              {[
                { value: '6', label: 'Auction Centres' },
                { value: '8-Step', label: 'Workflow' },
                { value: '2000+', label: 'Lots / Sale' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-bold" style={{ color: 'oklch(0.72 0.14 75)' }}>{value}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-8 py-3 flex items-center justify-between text-xs text-white/25 shrink-0">
        <span>Auctioneer's Ease v3.0 — Enterprise License</span>
        <span className="flex items-center gap-1">
          <ChevronDown className="w-3 h-3" />
          Scroll for more
        </span>
        <span>AI-Powered Tea Auction Management</span>
      </footer>
    </div>
  );
}
