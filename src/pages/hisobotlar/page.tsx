import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, FileText, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hisobotlar</h1>
          <p className="text-slate-500">Moliyaviy natijalarni yuklab olish va ko'rish</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'monthly' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
          >
            Oylik
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'yearly' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
          >
            Yillik
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-white border-none">
          <p className="text-primary-foreground/80 text-sm font-medium">Jami daromad</p>
          <h2 className="text-3xl font-bold mt-1">{formatCurrency(45000000)}</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-300">
            <span className="bg-emerald-500/20 px-2 py-1 rounded-lg">+15% o'tgan oydan</span>
          </div>
        </Card>
        <Card className="bg-red-500 text-white border-none">
          <p className="text-red-100 text-sm font-medium">Jami xarajat</p>
          <h2 className="text-3xl font-bold mt-1">{formatCurrency(28000000)}</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-red-200">
            <span className="bg-red-600/20 px-2 py-1 rounded-lg">+5% o'tgan oydan</span>
          </div>
        </Card>
        <Card className="bg-emerald-500 text-white border-none">
          <p className="text-emerald-100 text-sm font-medium">Sof foyda</p>
          <h2 className="text-3xl font-bold mt-1">{formatCurrency(17000000)}</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-100">
            <span className="bg-emerald-600/20 px-2 py-1 rounded-lg">Yaxshi natija!</span>
          </div>
        </Card>
      </div>

      <Card title="Hisobotlarni yuklab olish">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-primary group-hover:text-white transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">PDF Hisobot</h4>
                <p className="text-sm text-slate-500">Barcha ma'lumotlar PDF formatda</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Yuklash
            </Button>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/20 hover:bg-emerald-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Excel (CSV)</h4>
                <p className="text-sm text-slate-500">Tranzaksiyalar jadvali</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Yuklash
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
