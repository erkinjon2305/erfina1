import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { formatCurrency, cn } from '../../utils/helpers';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Target, Zap, PieChart as PieIcon, BarChart3, Activity, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // 1. Monthly Dynamics Data
  const getMonthlyData = () => {
    const months = ['Yan', 'Feb', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const monthlyMap: { [key: string]: { daromad: number, xarajat: number } } = {};
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      monthlyMap[monthName] = { daromad: 0, xarajat: 0 };
    }

    transactions.forEach(tx => {
      const date = tx.date?.toDate();
      if (date) {
        const monthName = months[date.getMonth()];
        if (monthlyMap[monthName]) {
          if (tx.type === 'daromad') monthlyMap[monthName].daromad += tx.amount;
          else monthlyMap[monthName].xarajat += tx.amount;
        }
      }
    });

    return Object.entries(monthlyMap).map(([name, values]) => ({
      name,
      ...values,
      balans: values.daromad - values.xarajat
    }));
  };

  // 2. Category Radar Data
  const getRadarData = () => {
    const categories: { [key: string]: number } = {};
    transactions.filter(tx => tx.type === 'xarajat').forEach(tx => {
      categories[tx.categoryId] = (categories[tx.categoryId] || 0) + tx.amount;
    });

    const maxVal = Math.max(...Object.values(categories), 1);
    return Object.entries(categories).map(([subject, value]) => ({
      subject,
      A: (value / maxVal) * 100,
      fullMark: 100,
      realValue: value
    }));
  };

  // 3. Daily Spending Patterns (Day of Week)
  const getDailyPatterns = () => {
    const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    const data = days.map(day => ({ name: day, xarajat: 0, count: 0 }));
    
    transactions.filter(tx => tx.type === 'xarajat').forEach(tx => {
      const date = tx.date?.toDate();
      if (date) {
        const dayIdx = date.getDay();
        data[dayIdx].xarajat += tx.amount;
        data[dayIdx].count += 1;
      }
    });

    return data.map(d => ({
      ...d,
      avg: d.count > 0 ? d.xarajat / d.count : 0
    }));
  };

  // 4. Cumulative Wealth Growth
  const getCumulativeData = () => {
    let cumulative = 0;
    return transactions.map(tx => {
      const change = tx.type === 'daromad' ? tx.amount : -tx.amount;
      cumulative += change;
      return {
        date: tx.date?.toDate().toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' }),
        balance: cumulative
      };
    }).slice(-20); // Last 20 transactions for clarity
  };

  // 5. Category Distribution (Pie)
  const getPieData = () => {
    const categories: { [key: string]: number } = {};
    transactions.filter(tx => tx.type === 'xarajat').forEach(tx => {
      categories[tx.categoryId] = (categories[tx.categoryId] || 0) + tx.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const monthlyData = getMonthlyData();
  const radarData = getRadarData();
  const dailyData = getDailyPatterns();
  const cumulativeData = getCumulativeData();
  const pieData = getPieData();

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Analitika yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black text-white tracking-tight">Professional Analitika</h1>
          <p className="text-slate-400 font-medium mt-1">Sizning moliyaviy ekotizimingizning to'liq tahlili</p>
        </motion.div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 shadow-2xl text-xs font-bold text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            Oxirgi 6 oy
          </span>
        </div>
      </div>

      {/* Top Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Monthly Dynamics */}
        <Card className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border-none shadow-2xl shadow-black/40" title="Oylik Dinamika" subtitle="Daromad, xarajat va sof foyda balansi">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorBalans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8860B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#B8860B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="daromad" name="Daromad" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="xarajat" name="Xarajat" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} />
                <Area type="monotone" dataKey="balans" name="Sof Foyda" fill="url(#colorBalans)" stroke="#B8860B" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Category Distribution */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border-none shadow-2xl shadow-black/40" title="Xarajatlar Taqsimoti" subtitle="Kategoriyalar bo'yicha ulush">
          <div className="h-[350px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'Ma\'lumot yo\'q', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full px-4">
              {pieData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-black text-slate-500 truncate uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. Daily Patterns */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border-none shadow-2xl shadow-black/40" title="Haftalik Faollik" subtitle="Hafta kunlari bo'yicha o'rtacha xarajatlar">
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="xarajat" name="Jami xarajat" fill="#B8860B" radius={[10, 10, 10, 10]} barSize={32}>
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.xarajat > dailyData.reduce((a,b) => a+b.xarajat, 0)/7 ? '#B8860B' : 'rgba(255,255,255,0.1)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Category Radar */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border-none shadow-2xl shadow-black/40" title="Muvozanat Tahlili" subtitle="Kategoriyalararo xarajatlar balansi">
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData.length > 0 ? radarData : [{subject: 'N/A', A: 0}]}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Xarajat"
                  dataKey="A"
                  stroke="#B8860B"
                  fill="#B8860B"
                  fillOpacity={0.4}
                />
                <Tooltip 
                  formatter={(val: any, name: any, props: any) => [formatCurrency(props.payload.realValue), 'Xarajat']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Wealth Growth Trend */}
        <Card className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border-none shadow-2xl shadow-black/40" title="Kapital O'sish Tendentsiyasi" subtitle="Balansning vaqt bo'ylab o'zgarishi">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  name="Balans"
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex items-start gap-5 shadow-2xl shadow-emerald-500/5">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-emerald-500/70 text-[10px] uppercase tracking-widest">Eng yaxshi oy</h4>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              {monthlyData.sort((a,b) => b.balans - a.balans)[0]?.name || 'N/A'}
            </p>
            <p className="text-xs text-slate-500 font-bold mt-1">Maksimal sof foyda bilan</p>
          </div>
        </div>
        
        <div className="p-8 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/10 flex items-start gap-5 shadow-2xl shadow-amber-500/5">
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-amber-500/70 text-[10px] uppercase tracking-widest">O'rtacha balans</h4>
            <p className="text-2xl font-black text-white mt-1">
              {formatCurrency(cumulativeData.reduce((a,b) => a + b.balance, 0) / (cumulativeData.length || 1))}
            </p>
            <p className="text-xs text-slate-500 font-bold mt-1">Oxirgi 20 tranzaksiya bo'yicha</p>
          </div>
        </div>

        <div className="p-8 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/10 flex items-start gap-5 shadow-2xl shadow-rose-500/5">
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
            <PieIcon className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-rose-500/70 text-[10px] uppercase tracking-widest">Asosiy xarajat</h4>
            <p className="text-2xl font-black text-white mt-1">
              {pieData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
            <p className="text-xs text-slate-500 font-bold mt-1">Eng katta ulushga ega</p>
          </div>
        </div>
      </div>
    </div>
  );
}
