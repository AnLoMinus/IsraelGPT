import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, Send, Copy, Check } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, arrayUnion } from 'firebase/firestore';

export const SharedTable: React.FC<{ onClose: () => void, user: any }> = ({ onClose, user }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'rooms');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    const q = query(collection(db, `rooms/${activeRoom}/messages`), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `rooms/${activeRoom}/messages`);
    });
    return () => unsub();
  }, [activeRoom]);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: newRoomName,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        participants: [user.uid]
      });
      setActiveRoom(docRef.id);
      setNewRoomName('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rooms');
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        participants: arrayUnion(user.uid)
      });
      setActiveRoom(roomId);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `rooms/${roomId}`);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;
    try {
      await addDoc(collection(db, `rooms/${activeRoom}/messages`), {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `rooms/${activeRoom}/messages`);
    }
  };

  const copyRoomLink = (roomId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-1/3 border-l border-white/10 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="text-blue-400" />
              חדרי דיון
            </h2>
          </div>
          <div className="p-4 border-b border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="שם החדר החדש..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={createRoom}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                צור
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => joinRoom(room.id)}
                className={`w-full text-right p-3 rounded-xl transition-colors ${activeRoom === room.id ? 'bg-blue-500/20 border border-blue-500/30 text-white' : 'hover:bg-white/5 text-slate-300 border border-transparent'}`}
              >
                <div className="font-bold text-sm">{room.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Users size={10} /> {room.participants?.length || 0} משתתפים
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10">
            <X className="text-slate-400 hover:text-white" />
          </button>

          {activeRoom ? (
            <>
              <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {rooms.find(r => r.id === activeRoom)?.name}
                </h3>
                <button
                  onClick={() => copyRoomLink(activeRoom)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? 'הועתק!' : 'העתק קישור לחדר'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 flex flex-col">
                {messages.map(msg => {
                  const isMe = msg.userId === user.uid;
                  return (
                    <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                      <img src={msg.userPhoto || ''} alt="" className="w-8 h-8 rounded-full bg-black/40 flex-shrink-0" />
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-500 mb-1">{msg.userName}</span>
                        <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/10 text-slate-200 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-600 mt-1">
                          {msg.timestamp?.toDate().toLocaleTimeString().slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="הקלד הודעה..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>בחר חדר או צור חדש כדי להתחיל</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
