import React, { useState } from 'react';
import { GraduationCap, Lock, User, Hash, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (data: { regNo: string; rollNo: string; name: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    regNo: '',
    rollNo: '',
    name: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        regNo: formData.regNo,
        rollNo: formData.rollNo,
        name: formData.name
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-nist-navy">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nist-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nist-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-nist-gold text-nist-navy text-4xl font-bold shadow-2xl shadow-nist-gold/20 animate-bounce">
            N
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">NIST UNIVERSITY</h1>
            <p className="text-nist-gold font-bold tracking-[0.3em] uppercase text-xs mt-1">Student Portal</p>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-10 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-nist-gold transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 ring-nist-gold/50 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-nist-gold transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="Registration Number"
                  value={formData.regNo}
                  onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 ring-nist-gold/50 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-nist-gold transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="Roll Number"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 ring-nist-gold/50 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-nist-gold transition-colors" />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 ring-nist-gold/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-nist-gold text-nist-navy font-bold py-4 rounded-2xl shadow-xl shadow-nist-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Enter Portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Forgot credentials? <a href="#" className="text-nist-gold hover:underline">Contact Admin</a>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-white/20 uppercase tracking-[0.4em]">
          © 2026 NIST University • Academic Excellence
        </p>
      </div>
    </div>
  );
}
