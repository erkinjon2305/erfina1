import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { formatCurrency, cn } from '../../utils/helpers';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { Logo } from '../../components/ui/Logo';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const MetricCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 border-none bg-slate-800/40 backdrop-blur-xl">
    <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700", color)} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{title}</p>
        <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">{value}</h2>
        {trend !== undefined && (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-3",
            trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={cn("p-4 rounded-2xl shadow-inner bg-slate-900/80 border border-white/5", color.replace('bg-', 'text-'))}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </Card>
);

export default function DashboardPage() {
  const { user, userData } = useAuth();
  const [metrics, setMetrics] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Query for all transactions to calculate metrics
    const allTxsQuery = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(allTxsQuery, (snapshot) => {
      const allTxs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Calculate metrics
      let totalIncome = 0;
      let totalExpenses = 0;
      
      allTxs.forEach((tx: any) => {
        if (tx.type === 'daromad') {
          totalIncome += tx.amount;
        } else {
          totalExpenses += tx.amount;
        }
      });

      setMetrics({
        balance: totalIncome - totalExpenses,
        income: totalIncome,
        expenses: totalExpenses,
        savings: 0 // Can be calculated if needed
      });

      // Set recent transactions (first 5)
      setRecentTransactions(allTxs.slice(0, 5));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Generate real chart data from transactions
  const getChartData = () => {
    const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    const data = days.map(day => ({ name: day, daromad: 0, xarajat: 0 }));
    
    // Get last 7 days
    const now = new Date();
    const last7Days = recentTransactions.filter(tx => {
      const txDate = tx.date?.toDate();
      return txDate && (now.getTime() - txDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
    });

    last7Days.forEach(tx => {
      const txDate = tx.date?.toDate();
      const dayName = days[txDate.getDay()];
      const dayData = data.find(d => d.name === dayName);
      if (dayData) {
        if (tx.type === 'daromad') dayData.daromad += tx.amount;
        else dayData.xarajat += tx.amount;
      }
    });

    return data;
  };

  const getPieData = () => {
    const categories: { [key: string]: number } = {};
    recentTransactions.filter(tx => tx.type === 'xarajat').forEach(tx => {
      categories[tx.categoryId] = (categories[tx.categoryId] || 0) + tx.amount;
    });

    const data = Object.entries(categories).map(([name, value]) => ({ name, value }));
    return data.length > 0 ? data : [{ name: 'Ma\'lumot yo\'q', value: 1 }];
  };

  const chartData = getChartData();
  const pieData = getPieData();

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      {/* Top Logo Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-2"
      >
        <Logo size="md" orientation="horizontal" className="-ml-1" />
      </motion.div>

      {/* Greeting and Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-black text-white tracking-tight">Xayrli kun, {userData?.displayName || user?.displayName || 'Foydalanuvchi'}!</h1>
          <p className="text-slate-400 font-medium">Bugun moliyaviy holatingiz qanday?</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end px-5 py-2.5 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Bugungi sana</span>
            <span className="text-sm font-black text-white tracking-tight">
              {new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '/')}
            </span>
          </div>
          <Button className="gap-3 px-8 bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none shadow-2xl shadow-amber-500/30 h-14 rounded-2xl text-base font-black hover:scale-105 transition-transform">
            <Plus className="w-6 h-6" />
            Yangi tranzaksiya
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Jami balans" 
          value={formatCurrency(metrics.balance)} 
          icon={Wallet} 
          color="bg-blue-600" 
        />
        <MetricCard 
          title="Jami daromad" 
          value={formatCurrency(metrics.income)} 
          icon={TrendingUp} 
          color="bg-emerald-500" 
        />
        <MetricCard 
          title="Jami xarajatlar" 
          value={formatCurrency(metrics.expenses)} 
          icon={TrendingDown} 
          color="bg-rose-500" 
        />
        <MetricCard 
          title="Jamg'arma" 
          value={formatCurrency(metrics.savings)} 
          icon={PiggyBank} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Haftalik tendentsiya">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="daromad" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="xarajat" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Xarajatlar bo'yicha">
          <div className="h-80 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Oxirgi tranzaksiyalar">
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg shadow-inner", tx.type === 'daromad' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                    {tx.type === 'daromad' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{tx.description}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tx.categoryId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-black text-lg tracking-tight", tx.type === 'daromad' ? "text-emerald-400" : "text-white")}>
                    {tx.type === 'daromad' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {new Date(tx.date?.toDate()).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '/')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Hozircha tranzaksiyalar yo'q</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
