
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Briefcase, Users, CheckCircle, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import { MOCK_STATS_HISTORY } from '../services/mockData';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const stats = {
    active: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
    completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
    delayed: projects.filter(p => p.status === ProjectStatus.ON_HOLD).length,
    totalBudget: projects.reduce((acc, curr) => acc + parseInt(curr.budget.replace(/[^0-9]/g, '')), 0),
  };

  const statusData = [
    { name: 'Planning', value: projects.filter(p => p.status === ProjectStatus.PLANNING).length, color: '#6366f1' },
    { name: 'In Progress', value: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length, color: '#3b82f6' },
    { name: 'Review', value: projects.filter(p => p.status === ProjectStatus.IN_REVIEW).length, color: '#eab308' },
    { name: 'Completed', value: projects.filter(p => p.status === ProjectStatus.COMPLETED).length, color: '#22c55e' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Executive Dashboard</h2>
        <p className="text-slate-400">Overview of agency performance, project health, and team utilization.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-slate-400 font-medium">Active Projects</span>
            </div>
            <p className="text-4xl font-bold text-white">{stats.active}</p>
            <p className="text-sm text-indigo-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {projects.length} Total Projects
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-slate-400 font-medium">Team Allocation</span>
            </div>
            <p className="text-4xl font-bold text-white">85%</p>
            <p className="text-sm text-blue-400/80 mt-2 font-medium">High Utilization</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-slate-400 font-medium">Pipeline Value</span>
            </div>
            <p className="text-4xl font-bold text-white">${(stats.totalBudget / 1000).toFixed(1)}k</p>
            <p className="text-sm text-green-400 mt-2">Total Budget Volume</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </div>
           <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-slate-400 font-medium">At Risk</span>
            </div>
            <p className="text-4xl font-bold text-white">{stats.delayed}</p>
            <p className="text-sm text-red-400 mt-2">Projects Delayed/Hold</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Development Velocity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_STATS_HISTORY}>
                <defs>
                  <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#6366f1" fillOpacity={1} fill="url(#colorSubmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Project Status Distribution</h3>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}/>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
