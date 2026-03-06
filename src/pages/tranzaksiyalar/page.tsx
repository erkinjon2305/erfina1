import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency, cn } from '../../utils/helpers';
import { Plus, Trash2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TransactionsPage({ type }: { type?: 'daromad' | 'xarajat' }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [txType, setTxType] = useState<'daromad' | 'xarajat'>(type || 'xarajat');

  useEffect(() => {
    if (!user) return;

    let q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy('date', 'desc')
    );

    if (type) {
      q = query(q, where('type', '==', type));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, type]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        amount: parseFloat(amount),
        description,
        categoryId: category,
        type: txType,
        date: Timestamp.now(),
        userId: user.uid
      });
      setShowModal(false);
      setAmount('');
      setDescription('');
      setCategory('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {type === 'daromad' ? 'Daromadlar' : type === 'xarajat' ? 'Xarajatlar' : 'Barcha tranzaksiyalar'}
          </h1>
          <p className="text-slate-400 font-medium">Barcha moliyaviy amallar ro'yxati</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none shadow-2xl shadow-amber-500/20 h-12 rounded-2xl font-bold hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          Qo'shish
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-800/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl shadow-black/20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-2xl text-sm font-medium text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
        </div>
        <Button variant="outline" className="gap-2 font-bold w-full md:w-auto border-white/10 text-slate-300 hover:bg-white/5 h-12 rounded-2xl">
          <Filter className="w-4 h-4" />
          Filtr
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-black/40 bg-slate-800/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Tavsif</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Kategoriya</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Sana</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Miqdor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{tx.description}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/50 border border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      {tx.categoryId}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-400">
                    {new Date(tx.date?.toDate()).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '/')}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className={cn(
                      "text-base font-black tracking-tight",
                      tx.type === 'daromad' ? "text-emerald-400" : "text-white"
                    )}>
                      {tx.type === 'daromad' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-medium">Ma'lumotlar topilmadi</p>
            </div>
          )}
        </div>
      </Card>

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
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Yangi tranzaksiya</h2>
                <form onSubmit={handleAdd} className="space-y-8">
                  <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-950/50 rounded-2xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setTxType('xarajat')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        txType === 'xarajat' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Xarajat
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxType('daromad')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        txType === 'daromad' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Daromad
                    </button>
                  </div>

                  <Input 
                    label="Miqdor (so'm)" 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                    className="bg-slate-950/50 border-white/5 text-white h-14 rounded-2xl"
                  />
                  <Input 
                    label="Tavsif" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    className="bg-slate-950/50 border-white/5 text-white h-14 rounded-2xl"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Kategoriya</label>
                    <select 
                      className="w-full h-14 rounded-2xl border border-white/5 bg-slate-950/50 px-4 text-sm text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all shadow-inner appearance-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" className="bg-slate-900">Tanlang</option>
                      <option value="Ovqat" className="bg-slate-900">Ovqat</option>
                      <option value="Transport" className="bg-slate-900">Transport</option>
                      <option value="Uy-joy" className="bg-slate-900">Uy-joy</option>
                      <option value="Maosh" className="bg-slate-900">Maosh</option>
                      <option value="Boshqa" className="bg-slate-900">Boshqa</option>
                    </select>
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
