import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 mb-4"
          >
            <Clock size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">TimeCare</h1>
          <p className="text-slate-500 font-medium mt-1">Gestão inteligente e humana</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-pink-600 hover:text-pink-700 mt-1">
                Esqueci minha senha
              </button>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-4 w-full py-4 text-lg">
            Entrar no Sistema
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Ainda não tem acesso? <span className="text-pink-600 font-bold cursor-pointer">Fale com o suporte</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
