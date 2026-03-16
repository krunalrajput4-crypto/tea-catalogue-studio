import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import LandingPage from "./pages/Landing";
import CenterSelectPage from "./pages/CenterSelect";
import DashboardLayout from "./components/layout/DashboardLayout";
import ArrivalsPage from "./pages/modules/Arrivals";
import StockPage from "./pages/modules/Stock";
import CategorizationPage from "./pages/modules/Categorization";
import AllocationPage from "./pages/modules/Allocation";
import TablesPage from "./pages/modules/Tables";
import CataloguePage from "./pages/modules/Catalogue";
import SamplingPage from "./pages/modules/Sampling";
import TastingPage from "./pages/modules/Tasting";
import PostAuctionPage from "./pages/modules/PostAuction";
import AnalyticsPage from "./pages/modules/Analytics";
import SettingsPage from "./pages/modules/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/region/:regionId" component={CenterSelectPage} />
      <Route path="/center/:centerId/:viewType/arrivals">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <ArrivalsPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/stock">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <StockPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/categorization">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <CategorizationPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/allocation">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <AllocationPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/tables">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <TablesPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/catalogue">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <CataloguePage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/sampling">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <SamplingPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/tasting">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <TastingPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/post-auction">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <PostAuctionPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/analytics">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <AnalyticsPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/center/:centerId/:viewType/settings">
        {(params) => (
          <DashboardLayout centerId={params.centerId} viewType={params.viewType as 'auctions' | 'private'}>
            <SettingsPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
