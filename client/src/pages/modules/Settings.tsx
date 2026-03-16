/**
 * Settings Module
 * Center configuration, hierarchy rules, SOP management, user roles
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Building2, GitBranch, Users, Shield, Database, Bell, Sparkles, ChevronRight, CheckCircle2, Edit3 } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'center' | 'hierarchy' | 'sop' | 'users' | 'notifications'>('center');

  const sections = [
    { id: 'center', label: 'Center Configuration', icon: Building2, desc: 'Center details and sale settings' },
    { id: 'hierarchy', label: 'Category Hierarchy', icon: GitBranch, desc: 'Configurable classification tree' },
    { id: 'sop', label: 'SOP Rules', icon: Database, desc: '27 allocation rules management' },
    { id: 'users', label: 'Users & Roles', icon: Users, desc: 'Multi-center user management' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alert and notification preferences' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Center configuration, rules, and user management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <div className="lg:col-span-1">
          <div className="tea-card overflow-hidden">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as typeof activeSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-0 ${
                    activeSection === sec.id ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{sec.label}</p>
                    <p className="text-[10px] text-muted-foreground">{sec.desc}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === 'center' && (
            <div className="space-y-4">
              <div className="tea-card p-6">
                <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Center Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Center Name', value: 'CTTA (Calcutta Tea Traders Association)' },
                    { label: 'Region', value: 'North India' },
                    { label: 'Current Sale', value: 'Sale No. 08/2026' },
                    { label: 'Sale Week', value: 'Week 12 (Mar 10-16)' },
                    { label: 'Auction Date', value: 'March 18, 2026' },
                    { label: 'Data Isolation', value: 'Center-Level (Strict)' },
                  ].map((field, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-[10px] text-muted-foreground mb-1">{field.label}</p>
                      <p className="text-sm font-medium text-foreground">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tea-card p-6">
                <h4 className="text-sm font-semibold mb-4">Sale Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="text-xs font-medium">Auto-Categorization</p>
                      <p className="text-[10px] text-muted-foreground">AI-powered grade classification on upload</p>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-primary flex items-center justify-end px-0.5">
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="text-xs font-medium">New Garden Detection</p>
                      <p className="text-[10px] text-muted-foreground">Flag gardens not in previous week's list</p>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-primary flex items-center justify-end px-0.5">
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="text-xs font-medium">Duplicate AWR Detection</p>
                      <p className="text-[10px] text-muted-foreground">Prevent duplicate entries during upload</p>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-primary flex items-center justify-end px-0.5">
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'hierarchy' && (
            <div className="tea-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Category Hierarchy Configuration</h4>
                <button onClick={() => toast.success('Settings Saved', { description: 'Centre configuration has been updated successfully.' })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                  <Edit3 className="w-3 h-3" /> Edit Hierarchy
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Define the classification tree: Manufacturing Type → Tea Type → Grade. This hierarchy drives categorization, allocation, and catalogue generation.
              </p>
              <div className="space-y-2">
                {[
                  { level: 'L1', name: 'Manufacturing Type', values: 'CTC, Orthodox', editable: true },
                  { level: 'L2', name: 'Tea Type', values: 'Leaf, Dust', editable: true },
                  { level: 'L3', name: 'Season', values: 'New Season, Old Season', editable: false },
                  { level: 'L4', name: 'Sub-Category', values: 'Main, Supplementary', editable: false },
                  { level: 'L5', name: 'Grade', values: 'BOP, GBOP, FOP, PD, etc.', editable: true },
                ].map((lvl, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{lvl.level}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{lvl.name}</p>
                      <p className="text-[10px] text-muted-foreground">{lvl.values}</p>
                    </div>
                    {lvl.editable && <Edit3 className="w-3 h-3 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'sop' && (
            <div className="tea-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h4 className="text-sm font-semibold">SOP Allocation Rules (27 Rules)</h4>
                <button onClick={() => toast.info('Add SOP Rule', { description: 'Rule builder will open here. Define conditions and allocation targets.' })} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Add Rule</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Rule #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Condition</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">Action</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Priority</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rule: '#1', cond: 'CTC/Leaf + New Season + BOP/GBOP', action: '→ MAIN, Part I', priority: 1, active: true },
                    { rule: '#3', cond: 'CTC/Leaf + New Season + Other Grades', action: '→ MAIN, Part I', priority: 3, active: true },
                    { rule: '#7', cond: 'CTC/Dust + New Season + All Grades', action: '→ MAIN, Part I', priority: 7, active: true },
                    { rule: '#12', cond: 'Orthodox/Leaf + New Season + TGFOP/FOP', action: '→ MAIN, Part I', priority: 12, active: true },
                    { rule: '#14', cond: 'Orthodox/Leaf + Old Season + All Grades', action: '→ SUPP, Part II', priority: 14, active: true },
                    { rule: '#15', cond: 'CTC/Leaf + Old Season + All Grades', action: '→ SUPP, Part II', priority: 15, active: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="py-2.5 px-4 font-mono text-xs font-medium">{row.rule}</td>
                      <td className="py-2.5 px-4 text-xs">{row.cond}</td>
                      <td className="py-2.5 px-4 text-xs font-medium">{row.action}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-xs">{row.priority}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-4">
              <div className="tea-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>User Management</h4>
                  <button onClick={() => toast.info('Invite User', { description: 'Enter email address to send an invitation. User will be assigned to this centre.' })} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Add User</button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Rajesh Kumar', role: 'Admin', center: 'CTTA', dept: 'Operations', status: 'active' },
                    { name: 'Priya Sharma', role: 'Taster', center: 'CTTA', dept: 'Tasting', status: 'active' },
                    { name: 'Amit Singh', role: 'Cataloguer', center: 'GTAC', dept: 'Catalogue', status: 'active' },
                    { name: 'Deepa Nair', role: 'Analyst', center: 'All Centers', dept: 'Analytics', status: 'active' },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{user.dept} — {user.center}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">{user.role}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tea-card p-6">
                <h4 className="text-sm font-semibold mb-4">Role Permissions</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { role: 'Admin', perms: 'Full access to all modules and settings' },
                    { role: 'Taster', perms: 'Tasting & Valuation, Sampling (read-only)' },
                    { role: 'Cataloguer', perms: 'Catalogue, Tables, Allocation' },
                    { role: 'Analyst', perms: 'Analytics (cross-center), Post-Auction (read-only)' },
                  ].map((r, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-3 h-3 text-primary" />
                        <p className="text-xs font-semibold">{r.role}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{r.perms}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="tea-card p-6">
              <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Notification Preferences</h4>
              <div className="space-y-3">
                {[
                  { label: 'New Upload Alerts', desc: 'Notify when new data is uploaded', on: true },
                  { label: 'New Garden Detection', desc: 'Alert when new gardens are found', on: true },
                  { label: 'Allocation Complete', desc: 'Notify when SOP allocation finishes', on: true },
                  { label: 'Tasting Deadline', desc: 'Remind before tasting deadline', on: true },
                  { label: 'Auction Results', desc: 'Notify when post-auction data is available', on: false },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="text-xs font-medium">{n.label}</p>
                      <p className="text-[10px] text-muted-foreground">{n.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full ${n.on ? 'bg-primary' : 'bg-border'} flex items-center ${n.on ? 'justify-end' : 'justify-start'} px-0.5`}>
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
