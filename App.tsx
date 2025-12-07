
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectsTable from './components/ProjectsTable';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import { generateMockProjects } from './services/mockData';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [projects, setProjects] = useState(generateMockProjects());

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard projects={projects} />;
      case 'projects':
        return <ProjectsTable projects={projects} onUpdateProject={(updated) => {
             setProjects(projects.map(p => p.id === updated.id ? updated : p));
        }} />;
      case 'clients':
      case 'team':
        return <UserManagement />;
      case 'settings':
         return (
            <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Platform Settings</h2>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-2xl">
                    <div className="space-y-6">
                         <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-white font-medium">System Notifications</h3>
                                <p className="text-sm text-slate-500">Alerts for deadline risks and client updates</p>
                            </div>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                         </div>
                         <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-white font-medium">Risk Analysis Model</h3>
                                <p className="text-sm text-slate-500">Select which model analyzes project health</p>
                            </div>
                            <select className="bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                                <option>Gemini 2.5 Flash (Recommended)</option>
                                <option>Gemini 1.5 Pro</option>
                            </select>
                         </div>
                    </div>
                </div>
            </div>
        );
      default:
        return <Dashboard projects={projects} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        onLogout={() => setIsAuthenticated(false)} 
      />
      <main className="flex-1 ml-64 overflow-y-auto h-screen bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 to-violet-900/5 pointer-events-none" />
          {renderContent()}
      </main>
    </div>
  );
};

export default App;
