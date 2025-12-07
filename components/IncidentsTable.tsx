import React, { useState } from 'react';
import { Incident, IncidentSeverity, IncidentStatus, AIAnalysisResult } from '../types';
import { Eye, Terminal, MoreHorizontal, Bot, CheckCircle, AlertOctagon, Cpu, Loader } from 'lucide-react';
import { analyzeIncidentWithGemini } from '../services/geminiService';

interface IncidentsTableProps {
  incidents: Incident[];
}

const IncidentsTable: React.FC<IncidentsTableProps> = ({ incidents }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case IncidentSeverity.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
      case IncidentSeverity.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case IncidentSeverity.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case IncidentSeverity.LOW: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
     switch (status) {
      case IncidentStatus.OPEN: return 'text-green-400';
      case IncidentStatus.IN_PROGRESS: return 'text-yellow-400';
      case IncidentStatus.RESOLVED: return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const handleAnalyze = async (incident: Incident) => {
    setSelectedIncident(incident);
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeIncidentWithGemini(incident);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Incident Log</h2>
          <p className="text-cyber-500">Manage and analyze security incidents reported by client nodes.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-cyber-700 hover:bg-cyber-600 text-white rounded-lg flex items-center gap-2 border border-cyber-600 transition-colors">
                <Terminal className="w-4 h-4" /> Export CSV
            </button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Table Section */}
        <div className={`flex-1 bg-cyber-800 rounded-xl border border-cyber-700 overflow-hidden flex flex-col transition-all duration-300 ${selectedIncident ? 'w-2/3' : 'w-full'}`}>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-cyber-900 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-cyber-500 font-medium text-sm">ID</th>
                  <th className="p-4 text-cyber-500 font-medium text-sm">Severity</th>
                  <th className="p-4 text-cyber-500 font-medium text-sm">Title</th>
                  <th className="p-4 text-cyber-500 font-medium text-sm">System</th>
                  <th className="p-4 text-cyber-500 font-medium text-sm">Status</th>
                  <th className="p-4 text-cyber-500 font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-700">
                {incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-cyber-700/50 transition-colors group">
                    <td className="p-4 font-mono text-xs text-gray-400">{incident.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs border font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="p-4 text-white font-medium">{incident.title}</td>
                    <td className="p-4 text-gray-400 text-sm">{incident.affectedSystem}</td>
                    <td className="p-4">
                        <span className={`text-sm flex items-center gap-1 ${getStatusColor(incident.status)}`}>
                           {incident.status === IncidentStatus.OPEN && <AlertOctagon className="w-3 h-3" />}
                           {incident.status === IncidentStatus.RESOLVED && <CheckCircle className="w-3 h-3" />}
                           {incident.status}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleAnalyze(incident)}
                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        title="Analyze with AI"
                      >
                        <Bot className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Analysis Panel */}
        {selectedIncident && (
          <div className="w-[400px] bg-cyber-800 border-l border-cyber-700 flex flex-col animate-slide-in-right relative">
             <button 
                onClick={() => setSelectedIncident(null)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
                ✕
            </button>
            
            <div className="p-6 border-b border-cyber-700 bg-cyber-900/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-white">Gemini Analysis</h3>
                </div>
                <p className="text-sm text-gray-400 font-mono">{selectedIncident.id}</p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-full text-blue-400 space-y-4">
                        <Loader className="w-8 h-8 animate-spin" />
                        <p className="animate-pulse">Analyzing threat vectors...</p>
                    </div>
                ) : aiAnalysis ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Score</label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-3 bg-cyber-900 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            aiAnalysis.riskScore > 70 ? 'bg-red-500' : 
                                            aiAnalysis.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} 
                                        style={{ width: `${aiAnalysis.riskScore}%` }}
                                    />
                                </div>
                                <span className={`text-xl font-bold ${
                                     aiAnalysis.riskScore > 70 ? 'text-red-500' : 
                                     aiAnalysis.riskScore > 40 ? 'text-yellow-500' : 'text-green-500'
                                }`}>{aiAnalysis.riskScore}/100</span>
                            </div>
                        </div>

                        <div className="bg-cyber-900/50 p-4 rounded-lg border border-cyber-700">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Executive Summary</label>
                             <p className="text-sm text-gray-300 leading-relaxed">
                                {aiAnalysis.summary}
                             </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recommended Actions</label>
                            {aiAnalysis.recommendedActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                    <Cpu className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                    <span className="text-sm text-gray-300">{action}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                   <div className="text-center text-gray-500 mt-10">
                       Analysis failed. Please try again.
                   </div> 
                )}
            </div>

            <div className="p-4 border-t border-cyber-700 bg-cyber-900/50">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Apply Automated Fixes
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentsTable;