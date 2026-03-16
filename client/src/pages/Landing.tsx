/**
 * Landing Page — Region Selection
 * Design: "Chai Intelligence" — Warm parchment base, tea garden hero, AI automation indicators
 * First touchpoint: user selects North India or South India
 */
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Sparkles, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663443865192/PLQ7sMUS95Brz8RdgpbbsD/hero-landing-Yk7AZyxaboM7ddfnj6wLSv.webp';
const DASHBOARD_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663443865192/PLQ7sMUS95Brz8RdgpbbsD/hero-dashboard-iYJwWRFnDEhEBcimQivt9T.webp';

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-tea-parchment">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-tea-cream/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Auctioneer's Ease
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AI-Powered Tea Auction Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="tea-badge-green">
              <Sparkles className="w-3 h-3" />
              AI Engine Active
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-tea-brown/70 via-tea-brown/50 to-tea-parchment" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium border border-white/20">
                <Zap className="w-3 h-3" />
                Enterprise Edition v3.0
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Intelligent Tea
              <br />
              <span className="text-tea-gold">Auction Management</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
              From garden arrivals to post-auction settlement — one unified platform
              powered by AI to automate every step of the tea auction workflow.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Center-Level Isolation</span>
              <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Cross-Center Analytics</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI Auto-Classification</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Region Selection */}
      <section className="relative z-20 -mt-16 max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Select Your Region</p>
            <h3 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Choose an Auction Region to Begin
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* North India */}
            <motion.button
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/region/north')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-8 text-left transition-all hover:border-primary/40"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                  <path d="M50 5 C60 25, 80 35, 95 50 C80 65, 60 75, 50 95 C40 75, 20 65, 5 50 C20 35, 40 25, 50 5Z" />
                </svg>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    North India
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assam, Darjeeling & Dooars tea auction centres
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">CTTA</span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">GTAC</span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">STAC</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Enter Region <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* South India */}
            <motion.button
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/region/south')}
              className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-8 text-left transition-all hover:border-primary/40"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-tea-gold">
                  <path d="M50 5 C60 25, 80 35, 95 50 C80 65, 60 75, 50 95 C40 75, 20 65, 5 50 C20 35, 40 25, 50 5Z" />
                </svg>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-tea-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-tea-gold" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    South India
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nilgiri, Munnar & Kerala tea auction centres
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">Coonoor</span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">Coimbatore</span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">Cochin</span>
                  </div>
                  <div className="flex items-center gap-2 text-tea-gold font-medium text-sm group-hover:gap-3 transition-all">
                    Enter Region <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: '🍃', label: 'Arrivals & Stock', desc: 'Cumulative daily tracking' },
            { icon: '🏷️', label: 'Auto-Categorization', desc: 'AI-powered grade classification' },
            { icon: '📋', label: 'Catalogue Generation', desc: 'Kutcha, Trade, Tasting, Limits' },
            { icon: '📊', label: 'Cross-Center Analytics', desc: 'Real-time price intelligence' },
          ].map((feat, i) => (
            <div key={i} className="tea-card p-4 text-center">
              <div className="text-2xl mb-2">{feat.icon}</div>
              <p className="text-sm font-semibold text-foreground">{feat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{feat.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Workflow Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 tea-card p-6 overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              AI-Powered Auction Workflow
            </h4>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['Arrivals', 'Stock', 'Categorization', 'Allocation', 'Tables', 'Catalogue', 'Sampling', 'Tasting'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">{step}</span>
                </div>
                {i < 7 && <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Pre-Auction Flow</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tea-gold" /> Post-Auction available in both views</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Auctioneer's Ease v3.0 — Enterprise License</span>
          <span>AI-Powered Tea Auction Management</span>
        </div>
      </footer>
    </div>
  );
}
