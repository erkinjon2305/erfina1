import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { motion } from 'motion/react';
import { Logo } from '../../components/ui/Logo';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email yoki parol noto\'g\'ri');
      } else {
        setError('Tizimga kirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Google orqali kirishda xatolik yuz berdi');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F172A] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none invert" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Logo size="xl" className="justify-center mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Aqlli moliya boshqaruvi</p>
        </div>

        <Card className="p-10 shadow-2xl shadow-black/60 border-white/5 backdrop-blur-xl bg-slate-800/40 rounded-[2.5rem]">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">Xush kelibsiz</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Davom etish uchun hisobingizga kiring</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Input
                label="Email manzili"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-900/50 border-white/5 focus:bg-slate-900 transition-all h-14 rounded-2xl pl-12 text-white placeholder:text-slate-600"
              />
              <Mail className="absolute left-4 bottom-4.5 w-5 h-5 text-slate-500" />
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  label="Parol"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-900/50 border-white/5 focus:bg-slate-900 transition-all h-14 rounded-2xl pl-12 text-white placeholder:text-slate-600"
                />
                <Lock className="absolute left-4 bottom-4.5 w-5 h-5 text-slate-500" />
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-xs font-black text-amber-500 hover:underline decoration-2 underline-offset-4">
                  Parolni unutdingizmi?
                </button>
              </div>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">{error}</p>
              </motion.div>
            )}
            
            <Button type="submit" className="w-full h-14 text-base font-black bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none shadow-2xl shadow-amber-500/20 rounded-2xl hover:scale-105 transition-transform" isLoading={loading}>
              Tizimga kirish
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
              <span className="bg-[#1E293B] px-6 text-slate-500">Yoki</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-14 border-white/10 hover:bg-white/5 hover:border-white/20 transition-all gap-3 font-bold text-slate-300 rounded-2xl"
            onClick={handleGoogleLogin}
            isLoading={googleLoading}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google orqali davom etish
          </Button>

          <div className="mt-10 text-center text-sm text-slate-500 font-medium">
            Hisobingiz yo'qmi?{' '}
            <Link to="/royhatdan-otish" className="text-amber-500 font-black hover:underline decoration-2 underline-offset-4">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
