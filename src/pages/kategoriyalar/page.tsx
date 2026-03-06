import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/helpers';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [type, setType] = useState<'daromad' | 'xarajat'>('xarajat');

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/categories`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    });

    return unsubscribe;
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/categories`), {
        name,
        color,
        type,
        userId: user.uid
      });
      setShowModal(false);
      setName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      await deleteDoc(doc(db, `users/${user.uid}/categories`, id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kategoriyalar</h1>
          <p className="text-slate-400 font-medium">Xarajat va daromad turlarini boshqarish</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none shadow-2xl shadow-amber-500/20 h-12 rounded-2xl font-bold hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          Yangi kategoriya
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="group hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 border-none bg-slate-800/40 backdrop-blur-xl p-6 rounded-[2rem]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: cat.color }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Palette className="w-7 h-7 relative z-10" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg tracking-tight group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mt-1", cat.type === 'daromad' ? "text-emerald-400" : "text-rose-400")}>
                    {cat.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Yangi kategoriya</h2>
                <form onSubmit={handleAdd} className="space-y-8">
                  <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-950/50 rounded-2xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setType('xarajat')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        type === 'xarajat' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Xarajat
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('daromad')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        type === 'daromad' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Daromad
                    </button>
                  </div>

                  <Input 
                    label="Kategoriya nomi" 
                    placeholder="Masalan: Ovqat"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="bg-slate-950/50 border-white/5 text-white h-14 rounded-2xl"
                  />
                  
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Rang tanlang</label>
                    <div className="flex flex-wrap gap-4">
                      {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={cn(
                            "w-10 h-10 rounded-full transition-all border-4 shadow-lg",
                            color === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 text-slate-400 hover:bg-white/5" onClick={() => setShowModal(false)}>
                      Bekor qilish
                    </Button>
                    <Button type="submit" className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none font-black shadow-2xl shadow-amber-500/30">
                      Saqlash
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
