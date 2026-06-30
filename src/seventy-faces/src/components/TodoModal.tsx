import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  version: string;
}

export const TodoModal: React.FC<{ onClose: () => void, isAdmin: boolean }> = ({ onClose, isAdmin }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newVersion, setNewVersion] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo));
      setTodos(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'todos');
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim() || !isAdmin) return;
    try {
      await addDoc(collection(db, 'todos'), {
        title: newTitle,
        completed: false,
        version: newVersion || 'TBD',
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewVersion('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'todos');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, 'todos', id), { completed: !completed });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `todos/${id}`);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `todos/${id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            מערכת שדרוגים (TODO)
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isAdmin && (
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="שדרוג חדש..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="גירסה"
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleAdd}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          <div className="space-y-2">
            {todos.map(todo => (
              <div key={todo.id} className={`flex items-center justify-between p-3 rounded-xl border ${todo.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    disabled={!isAdmin}
                    className={`transition-colors ${todo.completed ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <span className={`text-sm ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {todo.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded text-slate-400">v{todo.version}</span>
                  {isAdmin && (
                    <button onClick={() => deleteTodo(todo.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {todos.length === 0 && <p className="text-center text-slate-500 py-4">אין משימות כרגע</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
