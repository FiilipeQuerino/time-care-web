/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { motion, AnimatePresence } from 'motion/react';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 flex flex-col items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-pink-200/30 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-rose-200/40 blur-3xl"></div>
        </div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-200"
        >
          <div className="w-8 h-8 border-4 border-white/90 border-t-transparent rounded-full animate-spin" />
        </motion.div>
        <h2 className="text-slate-800 font-black tracking-wide uppercase text-sm">TimeCare</h2>
        <p className="text-slate-500 text-xs mt-1">Carregando seu painel</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
