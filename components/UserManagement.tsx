
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { Mail, Shield, Trash2, Plus, Search, UserPlus, Key } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clients' | 'team'>('team');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeTab === 'team' 
        ? [UserRole.ADMIN, UserRole.DEVELOPER, UserRole.TEAM_LEAD].includes(u.role)
        : u.role === UserRole.CLIENT;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
        id: `U${Date.now()}`,
        name: 'New User',
        email: 'new.user@example.com',
        role: activeTab === 'team' ? UserRole.DEVELOPER : UserRole.CLIENT,
        avatar: 'NU',
        status: 'Active',
        lastActive: 'Just now'
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to remove this user? Access will be revoked immediately.')) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-8 h-full">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">User Access Control</h2>
                <p className="text-slate-400">Manage client accounts and team member permissions.</p>
            </div>
             <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
                <UserPlus className="w-4 h-4" /> Add {activeTab === 'team' ? 'Member' : 'Client'}
            </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-700 mb-6">
            <button 
                onClick={() => setActiveTab('team')}
                className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'team' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
                Team Members
                {activeTab === 'team' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('clients')}
                className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'clients' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
                Clients
                {activeTab === 'clients' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>}
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
                <div key={user.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-300 font-bold">
                                {user.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{user.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                    {user.status}
                                </div>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Mail className="w-4 h-4 text-slate-500" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Shield className="w-4 h-4 text-slate-500" />
                            {user.role}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Last active: {user.lastActive}</span>
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                            <Key className="w-3 h-3" /> Reset Access
                        </button>
                    </div>
                </div>
            ))}
            
            {/* Add New Card Dummy */}
             <button 
                onClick={() => setShowAddModal(true)}
                className="border border-dashed border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all min-h-[200px]"
            >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                    <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium">Add New {activeTab === 'team' ? 'Member' : 'Client'}</span>
            </button>
        </div>

        {/* Mock Modal */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Invite New {activeTab === 'team' ? 'Team Member' : 'Client'}</h3>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                            <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                            <input type="email" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" placeholder="john@example.com" required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                             <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white">
                                 {activeTab === 'team' ? (
                                     <>
                                        <option value={UserRole.DEVELOPER}>Developer</option>
                                        <option value={UserRole.TEAM_LEAD}>Team Lead</option>
                                        <option value={UserRole.ADMIN}>Admin</option>
                                     </>
                                 ) : (
                                     <option value={UserRole.CLIENT}>Client Representative</option>
                                 )}
                             </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded">Cancel</button>
                            <button type="submit" className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Send Invite</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default UserManagement;
