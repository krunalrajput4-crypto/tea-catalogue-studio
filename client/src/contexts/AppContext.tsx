import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Region = 'north' | 'south';
export type ViewType = 'auctions' | 'private';

export interface Centre {
  id: string;
  name: string;
  fullName: string;
  region: Region;
}

export const CENTRES: Centre[] = [
  { id: 'ctta', name: 'CTTA', fullName: 'Calcutta Tea Traders Association', region: 'north' },
  { id: 'gtac', name: 'GTAC', fullName: 'Guwahati Tea Auction Centre', region: 'north' },
  { id: 'siliguri', name: 'Siliguri', fullName: 'Siliguri Tea Auction Centre', region: 'north' },
  { id: 'coonoor', name: 'Coonoor', fullName: 'Coonoor Tea Auction Centre', region: 'south' },
  { id: 'coimbatore', name: 'Coimbatore', fullName: 'Coimbatore Tea Auction Centre', region: 'south' },
  { id: 'kochi', name: 'Kochi', fullName: 'Kochi Tea Auction Centre', region: 'south' },
];

export const REGIONS = {
  north: { id: 'north', name: 'North India', centres: CENTRES.filter(c => c.region === 'north') },
  south: { id: 'south', name: 'South India', centres: CENTRES.filter(c => c.region === 'south') },
};

export interface SaleInfo {
  id: number;
  label: string;
  saleNo: number;
  saleYear: number;
  status: string;
}

interface AppContextType {
  // Centre / Region
  selectedCentre: Centre | null;
  setSelectedCentre: (centre: Centre | null) => void;
  // View type
  viewType: ViewType;
  setViewType: (vt: ViewType) => void;
  // Active sale
  activeSale: SaleInfo | null;
  setActiveSale: (sale: SaleInfo | null) => void;
  // Upload modal
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  // Current module
  currentModule: string;
  setCurrentModule: (m: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedCentre, setSelectedCentre] = useState<Centre | null>(null);
  const [viewType, setViewType] = useState<ViewType>('auctions');
  const [activeSale, setActiveSale] = useState<SaleInfo | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState('arrivals');

  return (
    <AppContext.Provider value={{
      selectedCentre, setSelectedCentre,
      viewType, setViewType,
      activeSale, setActiveSale,
      uploadModalOpen, setUploadModalOpen,
      currentModule, setCurrentModule,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
