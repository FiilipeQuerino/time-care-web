import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      showToast('Login realizado com sucesso.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao realizar login.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-pink-200/30 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-rose-200/40 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl rounded-[2.2rem] border border-white/70 bg-white/85 backdrop-blur-md shadow-2xl shadow-rose-100/60 overflow-hidden"
      >
        <div className="px-8 py-7 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">TimeCare</p>
              <p className="text-pink-100 text-sm">Gestao para clinicas modernas</p>
            </div>
          </div>
          <p className="text-sm text-pink-50/95">Acesse para acompanhar clientes, procedimentos e metricas da clinica.</p>
        </div>

        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Entrar no sistema</h1>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-full">
              <ShieldCheck size={14} /> Sessao segura
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(String(e.target.value))}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(String(e.target.value))}
              required
            />

            <Button type="submit" isLoading={isLoading} className="mt-2 w-full py-4 text-lg" disabled={isLoading} icon={ArrowRight}>
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">Ainda nao tem acesso? Fale com o suporte.</p>
        </div>
      </motion.div>
    </div>
  );
};
