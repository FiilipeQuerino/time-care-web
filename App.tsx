
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Servicos from './components/modules/Servicos';
import Clientes from './components/modules/Clientes';
import Agenda from './components/modules/Agenda';
import Financeiro from './components/modules/Financeiro';
import Relatorios from './components/modules/Relatorios';
import Configuracoes from './components/modules/Configuracoes';
import Estoque from './components/modules/Estoque';
import Login from './components/Login';
import NotificationsDropdown from './components/NotificationsDropdown';

export type ViewType = 'dashboard' | 'agenda' | 'clientes' | 'servicos' | 'financeiro' | 'relatorios' | 'estoque' | 'configuracoes';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

const renderView = () => {
  switch (currentView) {
    case 'dashboard':
      return <Dashboard setView={setCurrentView} />;

    case 'servicos':
      return <Servicos />;

    case 'clientes':
      return <Clientes />;

    case 'agenda':
      return <Agenda />;

    case 'financeiro':
      return <Financeiro />;

    case 'relatorios':
      return <Relatorios />;

    case 'estoque':
      return <Estoque />;

    case 'configuracoes':
      return <Configuracoes />;

    default:
      return <Dashboard setView={setCurrentView} />;
  }
};


  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] pb-24 md:pb-0 animate-in fade-in duration-1000">
      {/* Navigation: Sidebar on Desktop, Bottom Bar on Mobile */}
      <Navigation currentView={currentView} setView={setCurrentView} />

      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Header Branding for all views */}
        <header className="flex items-center justify-between mb-8">
          <div className="md:hidden">
            <h1 className="text-xl font-display font-bold text-pink-500">Time<span className="text-pink-300 italic ml-1">Care</span></h1>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Unidade São Paulo • Time Care</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors mr-2"
             >
                Sair
             </button>
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="bg-white p-2 rounded-xl border border-rose-50 shadow-sm relative hover:bg-rose-50 transition-colors"
              >
                <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></div>

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="text-slate-400"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </button>

              {showNotifications && <NotificationsDropdown setView={setCurrentView} onLogout={handleLogout} />}
            </div>

          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
};

export default App;
