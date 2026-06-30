import React, { useState, useEffect } from 'react';
import { X, Users, History, Zap, Search } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [histories, setHistories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'histories'>('users');

  useEffect(() => {
    const qUsers = query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(50));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const qHistories = query(collection(db, 'histories'), orderBy('createdAt', 'desc'), limit(50));
    const unsubHistories = onSnapshot(qHistories, (snap) => {
      setHistories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'histories');
    });

    return () => {
      unsubUsers();
      unsubHistories();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-purple-400" />
            לוח בקרה למנהל
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              משתמשים
            </button>
            <button 
              onClick={() => setActiveTab('histories')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'histories' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              היסטוריית שיחות
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {activeTab === 'users' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/10">
                <div className="col-span-2">משתמש</div>
                <div>תפקיד</div>
                <div>טוקנים</div>
                <div>התחברות אחרונה</div>
              </div>
              {users.map(u => (
                <div key={u.id} className="grid grid-cols-5 gap-4 p-4 rounded-xl bg-white/5 border border-white/5 items-center">
                  <div className="col-span-2 flex items-center gap-3">
                    <img src={u.photoURL || ''} alt="" className="w-8 h-8 rounded-full bg-black/40" />
                    <div>
                      <p className="text-sm font-bold text-white">{u.displayName}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-sm font-mono">
                    <Zap size={14} /> {u.totalTokensUsed?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-slate-400">
                    {u.lastLogin?.toDate().toLocaleString() || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {histories.map(h => {
                const user = users.find(u => u.id === h.userId);
                return (
                  <div key={h.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={user?.photoURL || ''} alt="" className="w-6 h-6 rounded-full bg-black/40" />
                        <span className="text-xs text-slate-300">{user?.displayName || h.userId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">{h.createdAt?.toDate().toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded">
                          <Zap size={10} /> {h.tokensUsed || 0}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-white font-medium bg-black/20 p-3 rounded-lg border border-white/5">
                      {h.query}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Need to import ShieldAlert locally since it's used in the JSX
import { ShieldAlert } from 'lucide-react';
