
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de delay de autenticação para efeito visual
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FDFBF7] animate-in fade-in duration-700">
      {/* Lado Esquerdo - Visual/Branding (Oculto no Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-pink-500 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-white text-center">
          <div className="bg-white/20 backdrop-blur-md w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Heart size={48} className="fill-white text-white" />
          </div>
          <h1 className="text-6xl font-display font-bold mb-4 tracking-tight">Time<span className="italic font-light">Care</span></h1>
          <p className="text-pink-100 text-xl font-medium max-w-md mx-auto leading-relaxed">
            A tecnologia que cuida da sua clínica enquanto você cuida da beleza.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-pink-500 shadow-sm" alt="User" />
              ))}
            </div>
            <p className="text-pink-100 text-sm font-bold uppercase tracking-widest">+500 Clínicas Premium</p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
               <div className="bg-pink-500 p-3 rounded-2xl shadow-lg">
                  <Heart size={32} className="fill-white text-white" />
               </div>
            </div>
            <h2 className="text-4xl font-display font-bold text-slate-800">Bem-vinda de volta</h2>
            <p className="text-slate-400 mt-2 font-medium">Acesse sua conta para gerenciar sua unidade.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">E-mail de Acesso</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-400 transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  required
                  type="email" 
                  defaultValue="dra.ana@timecare.com"
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-pink-200 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Senha</label>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-pink-400 hover:text-pink-500 transition-colors">Esqueceu a senha?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  defaultValue="senha123"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-pink-200 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 text-pink-500 focus:ring-pink-200 cursor-pointer" defaultChecked />
              <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer select-none">Manter conectada por 30 dias</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar no Sistema <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center">
            <p className="text-sm font-medium text-slate-400">
              Não é uma licenciada Time Care? <button className="text-pink-500 font-black uppercase tracking-widest ml-1 hover:underline">Saiba Mais</button>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-10 text-slate-300">
             <Sparkles size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gestão Estética de Alta Performance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
