import { createContext, useContext, useState, type ReactNode } from 'react';

export type Region = 'north' | 'south';
export type ViewType = 'auctions' | 'private';

export interface Center {
  id: string;
  name: string;
  shortName: string;
  region: Region;
}

export const CENTERS: Center[] = [
  { id: 'ctta', name: 'CTTA (Calcutta Tea Traders Association)', shortName: 'CTTA', region: 'north' },
  { id: 'gtac', name: 'GTAC (Guwahati Tea Auction Centre)', shortName: 'GTAC', region: 'north' },
  { id: 'stac', name: 'STAC (Siliguri Tea Auction Centre)', shortName: 'STAC', region: 'north' },
  { id: 'coonoor', name: 'Coonoor', shortName: 'Coonoor', region: 'south' },
  { id: 'coimbatore', name: 'Coimbatore', shortName: 'Coimbatore', region: 'south' },
  { id: 'cochin', name: 'Cochin', shortName: 'Cochin', region: 'south' },
];

export const REGIONS = {
  north: { id: 'north', name: 'North India', centers: CENTERS.filter(c => c.region === 'north') },
  south: { id: 'south', name: 'South India', centers: CENTERS.filter(c => c.region === 'south') },
};

interface AppContextType {
  selectedCenter: Center | null;
  setSelectedCenter: (center: Center | null) => void;
  viewType: ViewType;
  setViewType: (vt: ViewType) => void;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [viewType, setViewType] = useState<ViewType>('auctions');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <AppContext.Provider value={{
      selectedCenter, setSelectedCenter,
      viewType, setViewType,
      uploadModalOpen, setUploadModalOpen,
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
