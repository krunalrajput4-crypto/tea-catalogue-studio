/**
 * Center Selection Page — After region is chosen
 * Shows 3 centers for the selected region, then Auctions/Private view toggle
 */
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Building2, Gavel, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { REGIONS, CENTRES, useApp } from '@/contexts/AppContext';

export default function CenterSelectPage() {
  const { regionId } = useParams<{ regionId: string }>();
  const [, navigate] = useLocation();
  const { setSelectedCentre, setViewType } = useApp();
  const region = REGIONS[regionId as 'north' | 'south'];

  if (!region) {
    navigate('/');
    return null;
  }

  const handleCenterSelect = (centerId: string, view: 'auctions' | 'private') => {
    const center = CENTRES.find(c => c.id === centerId);
    if (center) {
      setSelectedCentre(center);
      setViewType(view);
      navigate(`/center/${centerId}/${view}/arrivals`);
    }
  };

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
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Region
          </button>
        </div>
      </header>

      <div className="pt-28 pb-20 max-w-6xl mx-auto px-6">
        {/* Region Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="cursor-pointer hover:text-foreground" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="text-foreground font-medium">{region.name}</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {region.name} Auction Centres
          </h2>
          <p className="text-muted-foreground mt-2">
            Select an auction centre and choose between Auction or Private sale workflow.
          </p>
        </motion.div>

        {/* Center Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {region.centres.map((center, i) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="tea-card overflow-hidden"
            >
              {/* Center Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {center.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{center.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="tea-badge-green">
                    <Sparkles className="w-3 h-3" />
                    Active
                  </span>
                  <span className="text-muted-foreground">Sale No. 08/2026</span>
                </div>
              </div>

              {/* View Selection */}
              <div className="p-4 space-y-3">
                <button
                  onClick={() => handleCenterSelect(center.id, 'auctions')}
                  className="w-full group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Gavel className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">Auctions</p>
                    <p className="text-xs text-muted-foreground">Public auction workflow</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => handleCenterSelect(center.id, 'private')}
                  className="w-full group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-tea-gold/40 hover:bg-tea-gold/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-tea-gold/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-tea-gold" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">Private</p>
                    <p className="text-xs text-muted-foreground">Private sale workflow</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-tea-gold transition-colors" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="px-6 py-3 bg-secondary/50 border-t border-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-foreground font-mono">1,247</p>
                  <p className="text-[10px] text-muted-foreground">Total Lots</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground font-mono">86</p>
                  <p className="text-[10px] text-muted-foreground">Gardens</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary font-mono">92%</p>
                  <p className="text-[10px] text-muted-foreground">Allocated</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
