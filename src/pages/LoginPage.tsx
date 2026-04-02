import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, Sparkles } from 'lucide-react';
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
        className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <div className="hidden lg:flex flex-col justify-between rounded-[2rem] border border-white/70 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-pink-500/90 flex items-center justify-center">
                <Clock size={26} strokeWidth={2.6} />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">TimeCare</p>
                <p className="text-slate-300 text-sm">Gestao para clinicas modernas</p>
              </div>
            </div>
            <h2 className="text-3xl font-black leading-tight mb-3">Controle financeiro, clientes e procedimentos em um unico painel.</h2>
            <p className="text-slate-300">Entre com sua conta para acompanhar as metricas da clinica e manter o atendimento organizado.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 text-sm"><ShieldCheck size={16} /> Sessao segura com JWT</div>
            <div className="flex items-center gap-2 text-slate-200 text-sm"><Sparkles size={16} /> Interface otimizada para desktop e mobile</div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-[2rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 mb-4">
              <Clock size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Acessar TimeCare</h1>
            <p className="text-slate-500 font-medium mt-1">Veja como esta sua clinica hoje.</p>
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

            <Button type="submit" isLoading={isLoading} className="mt-2 w-full py-4 text-lg" disabled={isLoading}>
              Entrar no sistema
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">Ainda nao tem acesso? Fale com o suporte.</p>
        </div>
      </motion.div>
    </div>
  );
};
