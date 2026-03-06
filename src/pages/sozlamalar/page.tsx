import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { updateProfile } from 'firebase/auth';
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  CheckCircle2, 
  Camera,
  LogOut,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { user, userData, logout, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || user?.displayName || '');
      setPhone(userData.phone || '');
      setPhotoURL(userData.photoURL || user?.photoURL || '');
    }
  }, [userData, user]);

  const handleLogout = async () => {
    if (confirm('Haqiqatan ham tizimdan chiqmoqchimisiz?')) {
      try {
        await logout();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('DIQQAT! Hisobingizni o\'chirib tashlasangiz, barcha ma\'lumotlaringiz qayta tiklanmaydigan qilib o\'chiriladi. Davom etasizmi?')) {
      setLoading(true);
      try {
        await deleteAccount();
      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/requires-recent-login') {
          alert('Ushbu amalni bajarish uchun yaqinda tizimga kirgan bo\'lishingiz kerak. Iltimos, qaytadan kirib urinib ko\'ring.');
        } else {
          alert('Hisobni o\'chirishda xatolik yuz berdi.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Get compressed base64 string
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoURL(compressedBase64);
        
        try {
          // Update Firestore first as it's our primary source of truth for the UI
          await updateDoc(doc(db, 'users', user.uid), { photoURL: compressedBase64 });
          
          // Update Firebase Auth profile
          await updateProfile(user, { photoURL: compressedBase64 });
          
          console.log("Photo updated successfully");
        } catch (err) {
          console.error("Error updating photo:", err);
          alert("Rasmni saqlashda xatolik yuz berdi. Rasm hajmi juda katta bo'lishi mumkin.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Update Firebase Auth
      await updateProfile(user, { displayName });
      
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        phone,
        updatedAt: new Date()
      });
      
      setEditMode(false);
      alert('Profil muvaffaqiyatli yangilandi!');
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-[#B8860B] to-[#F9D71C] flex items-center justify-center text-slate-900 text-5xl font-black shadow-[0_20px_50px_-12px_rgba(184,134,11,0.3)] overflow-hidden border-4 border-white/10 relative z-10"
            >
              {photoURL ? (
                <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                (displayName || 'U').charAt(0).toUpperCase()
              )}
            </motion.div>
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 blur-2xl rounded-[3rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <label className="absolute -bottom-2 -right-2 p-3 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 text-slate-400 hover:text-amber-400 transition-all cursor-pointer z-20 hover:scale-110 active:scale-95">
              <Camera className="w-6 h-6" />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">{displayName || 'Foydalanuvchi'}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <Mail className="w-4 h-4 text-amber-500" />
                {user?.email}
              </span>
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tasdiqlangan
              </span>
              <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-amber-500/20">
                <Zap className="w-3.5 h-3.5" />
                Premium
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant={editMode ? 'ghost' : 'outline'} 
            onClick={() => setEditMode(!editMode)}
            className={cn(
              "font-black px-8 h-12 rounded-2xl border-2 transition-all",
              editMode ? "text-slate-400 hover:text-white" : "border-white/10 text-slate-300 hover:bg-white/5"
            )}
          >
            {editMode ? 'Bekor qilish' : 'Profilni tahrirlash'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="font-black px-8 h-12 rounded-2xl border-2 border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-[2.5rem] p-10 shadow-2xl shadow-black/40 border-none bg-slate-800/40 backdrop-blur-xl" title="Shaxsiy ma'lumotlar" subtitle="Ism va aloqa ma'lumotlarini boshqaring">
            <form onSubmit={handleUpdateProfile} className="space-y-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="To'liq ism" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  disabled={!editMode}
                  className={cn(
                    "h-14 rounded-2xl transition-all font-bold",
                    !editMode ? 'bg-slate-900/30 border-transparent opacity-50' : 'bg-slate-900/50 border-white/10 focus:ring-4 focus:ring-amber-500/10'
                  )}
                />
                <Input 
                  label="Telefon raqami" 
                  placeholder="+998 90 123 45 67"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  disabled={!editMode}
                  className={cn(
                    "h-14 rounded-2xl transition-all font-bold",
                    !editMode ? 'bg-slate-900/30 border-transparent opacity-50' : 'bg-slate-900/50 border-white/10 focus:ring-4 focus:ring-amber-500/10'
                  )}
                />
              </div>
              <Input 
                label="Email manzili" 
                value={user?.email || ''} 
                disabled 
                className="h-14 rounded-2xl bg-slate-900/30 border-transparent opacity-30 font-bold"
              />
              
              {editMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4"
                >
                  <Button type="submit" isLoading={loading} className="px-12 h-14 rounded-2xl bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 border-none shadow-2xl shadow-amber-500/30 font-black text-base hover:scale-105 transition-transform">
                    O'zgarishlarni saqlash
                  </Button>
                </motion.div>
              )}
            </form>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-xl border-none shadow-2xl shadow-black/40" title="Xavfsizlik" subtitle="Hisobingiz xavfsizligini ta'minlang">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5 group cursor-pointer hover:bg-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-800 rounded-xl shadow-inner text-slate-400 group-hover:text-amber-400 transition-colors">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Parolni o'zgartirish</p>
                    <p className="text-xs text-slate-500">Oxirgi marta 3 oy oldin yangilangan</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5 group cursor-pointer hover:bg-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-800 rounded-xl shadow-inner text-slate-400 group-hover:text-amber-400 transition-colors">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">To'lov usullari</p>
                    <p className="text-xs text-slate-500">Visa **** 4242 ulangan</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900/80 text-white border border-white/5 shadow-2xl shadow-black/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                Faol
              </span>
            </div>
            <h3 className="text-xl font-black mb-1 relative z-10">Premium Tarif</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">Barcha imkoniyatlar cheksiz</p>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Cheksiz tranzaksiyalar
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                AI tahlillar
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Eksport (PDF/Excel)
              </div>
            </div>

            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold relative z-10">
              Tarifni boshqarish
            </Button>
          </Card>

          <Card className="border-red-500/20 bg-red-500/5 shadow-2xl shadow-red-500/5">
            <h4 className="text-red-400 font-black text-sm uppercase tracking-widest mb-4">Xavfli hudud</h4>
            <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">
              Hisobingizni o'chirib tashlaganingizdan so'ng, barcha ma'lumotlar qayta tiklanmaydigan qilib o'chiriladi.
            </p>
            <Button 
              variant="danger" 
              className="w-full font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
              onClick={handleDeleteAccount}
              isLoading={loading}
            >
              Hisobni o'chirish
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
