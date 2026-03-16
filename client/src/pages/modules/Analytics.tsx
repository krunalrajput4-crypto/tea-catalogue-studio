/**
 * Analytics Module — Qlik Sense-style drag-and-drop analytics dashboard
 * Features: cross-dimensional analysis, interactive charts, global filters,
 * comparison views, KPI scorecards, drag-drop widget layout
 */
import { useState, useMemo, useCallback } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  rectSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import {
  GripVertical, Plus, X, Filter, Download, RefreshCw, BarChart3,
  TrendingUp, TrendingDown, Minus, Settings2, Maximize2, Minimize2,
  LayoutGrid, Leaf, Building2, Users, ShoppingCart,
  Award, Activity, Layers, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar' | 'table' | 'kpi';
type DimensionType = 'garden' | 'grade' | 'category' | 'centre' | 'buyer' | 'season' | 'year' | 'saleNo';

interface Widget {
  id: string;
  title: string;
  chartType: ChartType;
  dimension: DimensionType;
  metric: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

interface GlobalFilters {
  centreId: string;
  saleYear: string;
  category: string;
  grade: string;
}

const CHART_COLORS = [
  '#4ade80','#86efac','#22c55e','#16a34a',
  '#fbbf24','#f59e0b','#d97706','#b45309',
  '#60a5fa','#3b82f6','#2563eb','#1d4ed8',
  '#f87171','#ef4444','#dc2626','#b91c1c',
];

const TEA_CATEGORIES = ['All','CTC','DUST','ORTHODOX','ORTHODOX DUST','GREEN TEA'];
const METRICS = ['avgPrice','totalPackages','soldCount','soldPercent','totalNetWeight'];
const METRIC_LABELS: Record<string,string> = {
  avgPrice: 'Avg Price (₹/kg)',
  totalPackages: 'Total Packages',
  soldCount: 'Lots Sold',
  soldPercent: 'Sold %',
  totalNetWeight: 'Net Weight (kg)',
};

const DEFAULT_WIDGETS: Widget[] = [
  { id:'w1', title:'Garden Performance', chartType:'bar', dimension:'garden', metric:'avgPrice', size:'lg', color:'#4ade80' },
  { id:'w2', title:'Price Trend by Year', chartType:'line', dimension:'year', metric:'avgPrice', size:'lg', color:'#60a5fa' },
  { id:'w3', title:'Category Breakdown', chartType:'pie', dimension:'category', metric:'totalPackages', size:'md', color:'#fbbf24' },
  { id:'w4', title:'Grade Distribution', chartType:'bar', dimension:'grade', metric:'totalPackages', size:'md', color:'#f87171' },
  { id:'w5', title:'Buyer Activity', chartType:'bar', dimension:'buyer', metric:'totalPackages', size:'lg', color:'#a78bfa' },
  { id:'w6', title:'Seasonal Analysis', chartType:'area', dimension:'season', metric:'avgPrice', size:'md', color:'#34d399' },
  { id:'w7', title:'Centre Comparison', chartType:'radar', dimension:'centre', metric:'avgPrice', size:'md', color:'#fb923c' },
  { id:'w8', title:'Sold vs Unsold', chartType:'pie', dimension:'category', metric:'soldCount', size:'sm', color:'#818cf8' },
];

const WIDGET_TEMPLATES = [
  { type:'bar' as ChartType, label:'Bar Chart' },
  { type:'line' as ChartType, label:'Line Chart' },
  { type:'area' as ChartType, label:'Area Chart' },
  { type:'pie' as ChartType, label:'Pie Chart' },
  { type:'scatter' as ChartType, label:'Scatter Plot' },
  { type:'radar' as ChartType, label:'Radar Chart' },
  { type:'table' as ChartType, label:'Data Table' },
  { type:'kpi' as ChartType, label:'KPI Card' },
];

function generateMockData(dimension: DimensionType) {
  const dimensionData: Record<DimensionType, string[]> = {
    garden: ['Assam Gold','Darjeeling Pearl','Nilgiri Mist','Dooars Valley','Munnar Estate','Wayanad Hills','Kangra Select','Brahmaputra'],
    grade: ['BOP','BOPSM','BP','BP1','BPS','CD','D','D1','FBOP','FOP','GBOP','OF'],
    category: ['CTC','DUST','ORTHODOX','GREEN TEA'],
    centre: ['CTTA','GTAC','Siliguri','Coonoor','Coimbatore','Kochi'],
    buyer: ['TBG Ltd','PAR Exports','ATB Corp','ETB Trading','PTM Group','JT Brokers','ABL Tea','CBPL'],
    season: ['First Flush','Second Flush','Monsoon','Autumn'],
    year: ['2022','2023','2024','2025'],
    saleNo: ['01','02','03','04','05','06'],
  };
  return (dimensionData[dimension] || dimensionData.garden).map(label => ({
    name: label,
    avgPrice: Math.round(200 + Math.random() * 300),
    totalPackages: Math.round(500 + Math.random() * 2000),
    soldCount: Math.round(50 + Math.random() * 200),
    soldPercent: Math.round(60 + Math.random() * 35),
    totalNetWeight: Math.round(10000 + Math.random() * 50000),
  }));
}

function ChartRenderer({ widget, data }: { widget: Widget; data: ReturnType<typeof generateMockData> }) {
  const color = widget.color || '#4ade80';

  if (widget.chartType === 'kpi') {
    const avg = Math.round(data.reduce((s, d) => s + (((d as unknown) as Record<string,number>)[widget.metric] || 0), 0) / data.length);
    return (
      <div className="flex flex-col h-full justify-between p-2">
        <p className="text-xs text-muted-foreground font-medium">{METRIC_LABELS[widget.metric] || widget.metric}</p>
        <div>
          <div className="text-3xl font-bold" style={{ color }}>{avg.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs mt-1 text-green-600">
            <TrendingUp className="w-3 h-3" /><span>+8.2% vs last year</span>
          </div>
        </div>
      </div>
    );
  }

  if (widget.chartType === 'table') {
    return (
      <div className="overflow-auto h-full">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-1.5 px-2 font-semibold text-muted-foreground">Name</th>
              <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">{METRIC_LABELS[widget.metric] || widget.metric}</th>
              <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">Sold%</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 8).map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-1.5 px-2 font-medium text-foreground truncate max-w-[120px]">{row.name}</td>
                <td className="py-1.5 px-2 text-right font-mono">{(((row as unknown) as Record<string,number>)[widget.metric] || 0).toLocaleString()}</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={cn("text-xs font-medium", row.soldPercent >= 80 ? 'text-green-600' : row.soldPercent >= 60 ? 'text-yellow-600' : 'text-red-500')}>
                    {row.soldPercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (widget.chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data.slice(0, 6)} cx="50%" cy="50%" outerRadius="75%" dataKey={widget.metric} nameKey="name"
            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false} fontSize={10}>
            {data.slice(0, 6).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === 'radar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data.slice(0, 6)}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Radar name={METRIC_LABELS[widget.metric]} dataKey={widget.metric} stroke={color} fill={color} fillOpacity={0.3} />
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === 'scatter') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="totalPackages" name="Packages" tick={{ fontSize: 10 }} />
          <YAxis dataKey="avgPrice" name="Avg Price" tick={{ fontSize: 10 }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill={color} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
          <Line type="monotone" dataKey={widget.metric} stroke={color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`grad-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
          <Area type="monotone" dataKey={widget.metric} stroke={color} fill={`url(#grad-${widget.id})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip formatter={(v: number) => v.toLocaleString()} />
        <Bar dataKey={widget.metric} fill={color} radius={[3, 3, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function SortableWidget({ widget, onRemove, onEdit, onExpand, expanded }: {
  widget: Widget;
  onRemove: (id: string) => void;
  onEdit: (w: Widget) => void;
  onExpand: (id: string) => void;
  expanded: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const data = useMemo(() => generateMockData(widget.dimension), [widget.dimension]);

  const sizeClass = {
    sm: 'col-span-1',
    md: 'col-span-1 md:col-span-2',
    lg: 'col-span-1 md:col-span-2 lg:col-span-3',
    xl: 'col-span-1 md:col-span-2 lg:col-span-4',
  }[widget.size];

  const heightClass = ({ sm: 'h-48', md: 'h-56', lg: 'h-64', xl: 'h-72' } as Record<string,string>)[widget.size];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sizeClass, 'tea-card overflow-hidden',
        isDragging && 'opacity-80 shadow-2xl',
        expanded && 'fixed inset-4 z-50 col-span-full',
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/20">
        <button {...attributes} {...listeners} className="p-0.5 rounded hover:bg-muted cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <span className="text-xs font-semibold text-foreground flex-1 truncate">{widget.title}</span>
        <div className="flex items-center gap-1">
          <span className="tea-badge-green text-[10px] px-1.5">{widget.dimension}</span>
          <button onClick={() => onEdit(widget)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Settings2 className="w-3 h-3" />
          </button>
          <button onClick={() => onExpand(widget.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button onClick={() => onRemove(widget.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className={cn("p-2", expanded ? 'h-[calc(100%-40px)]' : heightClass)}>
        <ChartRenderer widget={widget} data={data} />
      </div>
    </div>
  );
}

function WidgetEditor({ widget, onSave, onClose }: {
  widget: Widget | null;
  onSave: (w: Widget) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Widget>(
    widget || { id: `w${Date.now()}`, title: 'New Widget', chartType: 'bar', dimension: 'garden', metric: 'avgPrice', size: 'md', color: '#4ade80' }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-foreground">Configure Widget</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Widget Title</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Chart Type</label>
              <Select value={form.chartType} onValueChange={v => setForm(f => ({ ...f, chartType: v as ChartType }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WIDGET_TEMPLATES.map(t => (
                    <SelectItem key={t.type} value={t.type} className="text-xs">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Dimension</label>
              <Select value={form.dimension} onValueChange={v => setForm(f => ({ ...f, dimension: v as DimensionType }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['garden', 'grade', 'category', 'centre', 'buyer', 'season', 'year', 'saleNo'] as DimensionType[]).map(d => (
                    <SelectItem key={d} value={d} className="text-xs capitalize">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Metric</label>
              <Select value={form.metric} onValueChange={v => setForm(f => ({ ...f, metric: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {METRICS.map(m => <SelectItem key={m} value={m} className="text-xs">{METRIC_LABELS[m]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Size</label>
              <Select value={form.size} onValueChange={v => setForm(f => ({ ...f, size: v as Widget['size'] }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm" className="text-xs">Small</SelectItem>
                  <SelectItem value="md" className="text-xs">Medium</SelectItem>
                  <SelectItem value="lg" className="text-xs">Large</SelectItem>
                  <SelectItem value="xl" className="text-xs">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Accent Color</label>
            <div className="flex gap-2 flex-wrap">
              {CHART_COLORS.slice(0, 8).map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={cn("w-6 h-6 rounded-full border-2 transition-all", form.color === c ? 'border-foreground scale-110' : 'border-transparent')}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
          <Button size="sm" onClick={() => { onSave(form); onClose(); }} className="flex-1">Apply</Button>
        </div>
      </div>
    </div>
  );
}

function ComparisonView() {
  const [dimA, setDimA] = useState<DimensionType>('garden');
  const [dimB, setDimB] = useState<DimensionType>('grade');
  const [metric, setMetric] = useState('avgPrice');
  const dataA = useMemo(() => generateMockData(dimA).slice(0, 8), [dimA]);
  const dataB = useMemo(() => generateMockData(dimB).slice(0, 8), [dimB]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Compare:</span>
        <Select value={dimA} onValueChange={v => setDimA(v as DimensionType)}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(['garden', 'grade', 'category', 'centre', 'buyer', 'season'] as DimensionType[]).map(d => (
              <SelectItem key={d} value={d} className="text-xs capitalize">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">vs</span>
        <Select value={dimB} onValueChange={v => setDimB(v as DimensionType)}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(['garden', 'grade', 'category', 'centre', 'buyer', 'season'] as DimensionType[]).map(d => (
              <SelectItem key={d} value={d} className="text-xs capitalize">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">by</span>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {METRICS.map(m => <SelectItem key={m} value={m} className="text-xs">{METRIC_LABELS[m]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[{ dim: dimA, data: dataA, color: '#4ade80' }, { dim: dimB, data: dataB, color: '#60a5fa' }].map(({ dim, data, color }) => (
          <div key={dim} className="tea-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <h4 className="text-sm font-semibold text-foreground capitalize">{dim} Analysis</h4>
              <span className="tea-badge-green ml-auto">{METRIC_LABELS[metric]}</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 60, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                  <Bar dataKey={metric} fill={color} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [filters, setFilters] = useState<GlobalFilters>({ centreId: 'all', saleYear: '2025', category: 'all', grade: 'all' });
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgets(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const kpiData = useMemo(() => [
    { label: 'Avg Price (₹/kg)', value: '₹312', trend: 'up' as const, icon: TrendingUp, color: '#4ade80' },
    { label: 'Total Lots', value: '14,280', trend: 'up' as const, icon: Layers, color: '#60a5fa' },
    { label: 'Sold %', value: '78.4%', trend: 'flat' as const, icon: Target, color: '#fbbf24' },
    { label: 'Active Gardens', value: '342', trend: 'up' as const, icon: Leaf, color: '#f87171' },
    { label: 'Active Buyers', value: '89', trend: 'down' as const, icon: Users, color: '#a78bfa' },
    { label: 'Total Packages', value: '2.1M', trend: 'up' as const, icon: Award, color: '#34d399' },
  ], []);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-4 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-foreground text-lg">Analytics Intelligence</h2>
            <span className="ai-badge">AI Powered</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Global Filters */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>
            <Select value={filters.centreId} onValueChange={v => setFilters(f => ({ ...f, centreId: v }))}>
              <SelectTrigger className="h-7 text-xs w-32 border-dashed">
                <Building2 className="w-3 h-3 mr-1" />
                <SelectValue placeholder="All Centres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Centres</SelectItem>
                {['ctta', 'gtac', 'siliguri', 'coonoor', 'coimbatore', 'kochi'].map(c => (
                  <SelectItem key={c} value={c} className="text-xs uppercase">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.saleYear} onValueChange={v => setFilters(f => ({ ...f, saleYear: v }))}>
              <SelectTrigger className="h-7 text-xs w-24 border-dashed"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Years</SelectItem>
                {[2025, 2024, 2023, 2022].map(y => <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={v => setFilters(f => ({ ...f, category: v }))}>
              <SelectTrigger className="h-7 text-xs w-32 border-dashed">
                <Leaf className="w-3 h-3 mr-1" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {TEA_CATEGORIES.map(c => <SelectItem key={c} value={c.toLowerCase()} className="text-xs">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.info('Refreshing...')}>
              <RefreshCw className="w-3 h-3" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.info('Export coming soon')}>
              <Download className="w-3 h-3" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="border-b border-border bg-muted/20 px-4 py-2">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {kpiData.map(({ label, value, trend, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
                <p className="text-sm font-bold text-foreground leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card/30 px-4">
          <TabsList className="h-9 bg-transparent gap-1">
            <TabsTrigger value="dashboard" className="text-xs h-7 data-[state=active]:bg-background">
              <LayoutGrid className="w-3.5 h-3.5 mr-1" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs h-7 data-[state=active]:bg-background">
              <Layers className="w-3.5 h-3.5 mr-1" /> Comparison
            </TabsTrigger>
            <TabsTrigger value="gardens" className="text-xs h-7 data-[state=active]:bg-background">
              <Leaf className="w-3.5 h-3.5 mr-1" /> Gardens
            </TabsTrigger>
            <TabsTrigger value="buyers" className="text-xs h-7 data-[state=active]:bg-background">
              <Users className="w-3.5 h-3.5 mr-1" /> Buyers
            </TabsTrigger>
            <TabsTrigger value="centres" className="text-xs h-7 data-[state=active]:bg-background">
              <Building2 className="w-3.5 h-3.5 mr-1" /> Centres
            </TabsTrigger>
            <TabsTrigger value="price" className="text-xs h-7 data-[state=active]:bg-background">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Price Trends
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Drag-and-Drop Dashboard */}
        <TabsContent value="dashboard" className="flex-1 overflow-auto p-4 m-0">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              Drag widgets to rearrange. Click ⚙ to configure each widget.
            </p>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowWidgetLibrary(true)}>
              <Plus className="w-3 h-3" /> Add Widget
            </Button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
                {widgets.map(widget => (
                  <SortableWidget
                    key={widget.id}
                    widget={widget}
                    onRemove={id => setWidgets(prev => prev.filter(w => w.id !== id))}
                    onEdit={w => { setEditingWidget(w); setShowEditor(true); }}
                    onExpand={id => setExpandedWidget(prev => prev === id ? null : id)}
                    expanded={expandedWidget === widget.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No widgets yet</p>
              <Button size="sm" className="mt-4" onClick={() => setShowWidgetLibrary(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Widget
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="flex-1 overflow-auto p-4 m-0">
          <ComparisonView />
        </TabsContent>

        {/* Gardens Tab */}
        <TabsContent value="gardens" className="flex-1 overflow-auto p-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" /> Top Gardens by Avg Price
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateMockData('garden').slice(0, 8)} layout="vertical" margin={{ left: 80, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip formatter={(v: number) => `₹${v}/kg`} />
                    <Bar dataKey="avgPrice" fill="#4ade80" radius={[0, 3, 3, 0]}>
                      {generateMockData('garden').slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % 8]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Volume vs Price Scatter
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="totalPackages" name="Packages" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="avgPrice" name="Avg Price" tick={{ fontSize: 10 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v: number) => v.toLocaleString()} />
                    <Scatter data={generateMockData('garden')} fill="#60a5fa" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Buyers Tab */}
        <TabsContent value="buyers" className="flex-1 overflow-auto p-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Top Buyers by Volume
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateMockData('buyer').slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => v.toLocaleString()} />
                    <Bar dataKey="totalPackages" fill="#a78bfa" radius={[3, 3, 0, 0]}>
                      {generateMockData('buyer').slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 4) % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" /> Buyer Avg Price Radar
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={generateMockData('buyer').slice(0, 6)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <Radar name="Avg Price" dataKey="avgPrice" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.3} />
                    <Tooltip formatter={(v: number) => `₹${v}/kg`} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Centres Tab */}
        <TabsContent value="centres" className="flex-1 overflow-auto p-4 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Centre Avg Price Benchmark
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateMockData('centre')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => `₹${v}/kg`} />
                    <Bar dataKey="avgPrice" fill="#fb923c" radius={[3, 3, 0, 0]}>
                      {generateMockData('centre').map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 8) % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Sold % by Centre
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateMockData('centre')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Bar dataKey="soldPercent" fill="#34d399" radius={[3, 3, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Price Trends Tab */}
        <TabsContent value="price" className="flex-1 overflow-auto p-4 m-0">
          <div className="grid grid-cols-1 gap-4">
            <div className="tea-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Price Trend Over Years
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateMockData('year')} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => `₹${v}/kg`} />
                    <Area type="monotone" dataKey="avgPrice" stroke="#4ade80" fill="url(#priceGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="tea-card p-4">
                <h3 className="text-sm font-semibold mb-3">Seasonal Price Pattern</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateMockData('season')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => `₹${v}/kg`} />
                      <Line type="monotone" dataKey="avgPrice" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="tea-card p-4">
                <h3 className="text-sm font-semibold mb-3">Grade-wise Price Distribution</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateMockData('grade').slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => `₹${v}/kg`} />
                      <Bar dataKey="avgPrice" fill="#60a5fa" radius={[3, 3, 0, 0]}>
                        {generateMockData('grade').slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground">Add Widget</h3>
              <button onClick={() => setShowWidgetLibrary(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Choose a chart type to add to your dashboard</p>
            <div className="grid grid-cols-2 gap-2">
              {WIDGET_TEMPLATES.map(t => (
                <button
                  key={t.type}
                  onClick={() => {
                    const newWidget: Widget = {
                      id: `w${Date.now()}`,
                      title: `New ${t.label}`,
                      chartType: t.type,
                      dimension: 'garden',
                      metric: 'avgPrice',
                      size: 'md',
                      color: CHART_COLORS[widgets.length % CHART_COLORS.length],
                    };
                    setWidgets(prev => [...prev, newWidget]);
                    setShowWidgetLibrary(false);
                    toast.success('Widget added to dashboard');
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/30 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Widget Editor */}
      {showEditor && (
        <WidgetEditor
          widget={editingWidget}
          onSave={w => setWidgets(prev => prev.map(x => x.id === w.id ? w : x))}
          onClose={() => { setShowEditor(false); setEditingWidget(null); }}
        />
      )}
    </div>
  );
}
