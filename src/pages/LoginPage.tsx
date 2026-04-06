import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { warmupApi } from '../services/api';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    warmupApi('/');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao realizar login.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-white to-pink-50 px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-pink-200/35 blur-[110px]"></div>
        <div className="absolute -left-20 top-1/4 h-56 w-56 rounded-full bg-rose-200/45 blur-3xl"></div>
        <div className="absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-pink-200/45 blur-3xl"></div>
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="mb-4 flex items-center justify-center sm:mb-5">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-pink-100 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:px-4 sm:py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-300/35 sm:h-10 sm:w-10">
                <Clock size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">TimeCare</p>
                <p className="text-sm font-semibold tracking-tight text-slate-800 sm:text-base">Sistema de gestao</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-pink-100/80 bg-white/95 px-5 py-6 shadow-[0_14px_38px_rgba(244,114,182,0.16)] sm:rounded-[2rem] sm:px-7 sm:py-7">
            <div className="mb-6 sm:mb-7">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-semibold text-emerald-700">
                <ShieldCheck size={14} />
                Sessao protegida
              </div>
              <h1 className="text-[1.75rem] leading-[1.08] font-bold tracking-tight text-slate-900 sm:text-[1.95rem]">
                Bem-vinda de volta
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-500 sm:mt-3">
                Acesse seu painel para acompanhar clientes, agenda e resultados em um unico fluxo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
              <Input
                label="E-mail profissional"
                type="email"
                placeholder="nome@clinica.com"
                value={email}
                onChange={(e) => setEmail(String(e.target.value))}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[0.95rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] focus:border-pink-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(236,72,153,0.15)] sm:h-[3.15rem] sm:rounded-2xl sm:text-[0.96rem]"
                required
              />

              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(String(e.target.value))}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[0.95rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] focus:border-pink-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(236,72,153,0.15)] sm:h-[3.15rem] sm:rounded-2xl sm:text-[0.96rem]"
                required
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="mt-1.5 h-12 w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-[0.96rem] font-semibold text-white shadow-[0_10px_24px_rgba(236,72,153,0.34)] transition-all duration-200 hover:from-pink-700 hover:to-rose-600 hover:shadow-[0_14px_26px_rgba(236,72,153,0.4)] sm:mt-2 sm:h-[3.15rem] sm:rounded-2xl"
                disabled={isSubmitting}
                icon={ArrowRight}
              >
                Entrar na plataforma
              </Button>
            </form>

            <p className="mt-5 text-center text-xs font-medium text-slate-500 sm:mt-6">
              Sem acesso ainda? Solicite liberacao com o suporte interno.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
