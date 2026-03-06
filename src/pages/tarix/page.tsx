import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { formatCurrency, cn } from '../../utils/helpers';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Download,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';

export default function TransactionsHistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Tranzaksiyalar tarixi</h1>
          <p className="text-slate-400 font-medium">Barcha moliyaviy amallaringizning batafsil ro'yxati</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 font-bold border-white/10 text-slate-300 hover:bg-white/5">
            <Download className="w-4 h-4" />
            Eksport (CSV)
          </Button>
          <Button className="gap-2 font-bold bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none shadow-xl shadow-amber-500/20">
            <Calendar className="w-4 h-4" />
            Sana tanlash
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-800/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl shadow-black/20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Tavsif yoki kategoriya bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-2xl text-sm font-medium text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2 font-bold flex-1 md:flex-none border-white/10 text-slate-300 hover:bg-white/5">
            <Filter className="w-4 h-4" />
            Filtrlar
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-black/40 bg-slate-800/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tranzaksiya</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kategoriya</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Sana</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Holat</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Miqdor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <motion.tr 
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
                          tx.type === 'daromad' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}>
                          {tx.type === 'daromad' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{tx.description}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">ID: {tx.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-lg bg-slate-900/50 border border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                        {tx.categoryId}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-200">
                        {new Date(tx.date?.toDate()).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '/')}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {new Date(tx.date?.toDate()).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold">Muvaffaqiyatli</span>
                      </div>
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
                      <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-medium">Hech qanday tranzaksiya topilmadi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
