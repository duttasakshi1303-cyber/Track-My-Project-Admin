
import React, { useState } from 'react';
import { Project, ProjectStatus, AIHealthCheckResult } from '../types';
import { ExternalLink, Github, Bot, Loader, Edit, Calendar, Layout, AlertCircle, CheckCircle2, TrendingUp, Save, X } from 'lucide-react';
import { analyzeProjectHealth } from '../services/geminiService';

interface ProjectsTableProps {
  projects: Project[];
  onUpdateProject?: (updatedProject: Project) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects: initialProjects, onUpdateProject }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  
  const [aiAnalysis, setAiAnalysis] = useState<AIHealthCheckResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const getStatusColor = (status: ProjectStatus) => {
     switch (status) {
      case ProjectStatus.PLANNING: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case ProjectStatus.IN_PROGRESS: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case ProjectStatus.IN_REVIEW: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case ProjectStatus.COMPLETED: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case ProjectStatus.ON_HOLD: return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400';
    }
  };

  const handleAnalyze = async (project: Project) => {
    setSelectedProject(project);
    setIsEditing(false);
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeProjectHealth(project);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditForm(project);
    setIsEditing(true);
    setAiAnalysis(null);
  };

  const handleSave = () => {
    if (!selectedProject || !editForm) return;
    
    const updated = { ...selectedProject, ...editForm } as Project;
    const updatedList = projects.map(p => p.id === updated.id ? updated : p);
    
    setProjects(updatedList);
    if(onUpdateProject) onUpdateProject(updated);
    
    setSelectedProject(updated);
    setIsEditing(false);
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-orange-500';
      case 'Critical': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Project Management</h2>
          <p className="text-slate-400">Track progress, manage timelines, and monitor health.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-colors">
                <Layout className="w-4 h-4" /> New Project
            </button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Table Section */}
        <div className={`flex-1 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col transition-all duration-300 ${selectedProject ? 'w-2/3' : 'w-full'}`}>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-slate-400 font-medium text-sm">Project</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Client</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Progress</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Status</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Deadline</th>
                  <th className="p-4 text-slate-400 font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-700/50 transition-colors group">
                    <td className="p-4">
                        <div className="font-medium text-white">{project.title}</div>
                        <div className="text-xs text-slate-500 font-mono">{project.id}</div>
                    </td>
                    <td className="p-4 text-slate-300 text-sm">{project.clientName}</td>
                    <td className="p-4 w-32">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-400">{project.progress}%</span>
                        </div>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                           {project.status}
                        </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs font-mono">
                        {project.deadline}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleAnalyze(project)}
                        className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors border border-indigo-500/20"
                        title="AI Health Check"
                      >
                        <Bot className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(project)}
                        className="p-2 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white rounded-lg transition-colors"
                        title="Edit Project Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail/Edit Panel */}
        {selectedProject && (
          <div className="w-[450px] bg-slate-800 border-l border-slate-700 flex flex-col animate-slide-in-right relative shadow-2xl">
             <button 
                onClick={() => setSelectedProject(null)} 
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
                ✕
            </button>
            
            <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                        {isEditing ? <Edit className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    <h3 className="font-bold text-lg text-white">
                        {isEditing ? 'Edit Project' : 'Project Health'}
                    </h3>
                </div>
                <h4 className="text-md text-white font-medium">{selectedProject.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedProject.clientName}</p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                value={editForm.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value as ProjectStatus})}
                            >
                                {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Progress (%)</label>
                            <input 
                                type="number" 
                                min="0" max="100"
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                value={editForm.progress}
                                onChange={(e) => setEditForm({...editForm, progress: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deadline</label>
                            <input 
                                type="date"
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                value={editForm.deadline}
                                onChange={(e) => setEditForm({...editForm, deadline: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Budget</label>
                            <input 
                                type="text"
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                                value={editForm.budget}
                                onChange={(e) => setEditForm({...editForm, budget: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                            <textarea 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm h-24"
                                value={editForm.description}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                    {analyzing ? (
                        <div className="flex flex-col items-center justify-center h-full text-indigo-400 space-y-4">
                            <Loader className="w-10 h-10 animate-spin" />
                            <p className="animate-pulse font-medium">Analyzing Project Metrics...</p>
                        </div>
                    ) : aiAnalysis ? (
                        <>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Health Score</label>
                                     <span className={`text-xl font-bold ${
                                         aiAnalysis.healthScore > 80 ? 'text-green-500' : 
                                         aiAnalysis.healthScore > 50 ? 'text-yellow-500' : 'text-red-500'
                                     }`}>{aiAnalysis.healthScore}/100</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {aiAnalysis.summary}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Assessment</label>
                                <div className={`p-3 rounded-lg border bg-slate-900/50 flex items-center gap-3 ${
                                    aiAnalysis.riskLevel === 'Critical' ? 'border-red-500/50 text-red-400' :
                                    aiAnalysis.riskLevel === 'High' ? 'border-orange-500/50 text-orange-400' :
                                    aiAnalysis.riskLevel === 'Medium' ? 'border-yellow-500/50 text-yellow-400' :
                                    'border-green-500/50 text-green-400'
                                }`}>
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-bold">{aiAnalysis.riskLevel} Risk Level</span>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Key Risk Factors</h5>
                                <ul className="space-y-1">
                                    {aiAnalysis.keyRisks.map((s, i) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                                            <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommendations</label>
                                {aiAnalysis.recommendations.map((action, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-slate-300">{action}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                       <div className="text-center text-slate-500 mt-10">
                           <p>Select "Analyze Health" to generate a report.</p>
                       </div> 
                    )}
                    </>
                )}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                {isEditing ? (
                    <div className="flex gap-3">
                         <button 
                            onClick={() => { setIsEditing(false); setEditForm({}); }}
                            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => handleEdit(selectedProject)}
                        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Update Project Details
                    </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTable;
