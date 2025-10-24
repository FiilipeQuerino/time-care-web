import Menu from "../components/Menu";
import React, { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile"; 
import toast from "react-hot-toast";

// --- Dados das Subseções de Configuração ---
const configTabs = [
  { id: 'perfil', name: "Perfil da Clínica", icon: "🏢" },
  { id: 'usuarios', name: "Gestão de Usuários", icon: "🔑" },
  { id: 'servicos', name: "Catálogo de Serviços", icon: "💅" },
  { id: 'agenda', name: "Configurações de Agenda", icon: "📅" },
  { id: 'notificacoes', name: "Modelos de Notificação", icon: "🔔" },
];

// --- Estilos Comuns ---
const styles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
    flexDirection: isMobile ? "column" : "row",
  }),

  contentWrapper: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    // Padding responsivo para desviar do botão hambúrguer
    padding: isMobile ? "60px 15px 15px 15px" : "30px", 
  }),
  
  title: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,

  // --- Layout interno da Configuração ---
  configLayout: (isMobile: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '20px',
    marginTop: '20px',
  }),

  // Navegação Lateral (Desktop) / Dropdown (Mobile)
  sidebar: (isMobile: boolean): React.CSSProperties => ({
    width: isMobile ? '100%' : '250px',
    flexShrink: 0,
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: isMobile ? '0' : '15px 0',
    boxShadow: isMobile ? 'none' : '0 4px 10px rgba(0, 0, 0, 0.05)',
  }),

  // Área de Conteúdo da Configuração
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,

  // Estilo do item de navegação
  tabItem: (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#FCE7EB' : 'transparent',
    color: isActive ? '#F08080' : '#555',
    fontWeight: isActive ? '600' : '400',
    borderLeft: isActive ? '4px solid #F08080' : '4px solid transparent',
    transition: 'background-color 0.2s, color 0.2s, border-left 0.2s',
  }),
};

// --- Componente de Conteúdo Fictício (Simulação) ---
const ConfigContent = ({ tabId }: { tabId: string }) => {
    return (
        <div>
            <h2 style={{ color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                {configTabs.find(t => t.id === tabId)?.name}
            </h2>
            <p style={{ color: '#777' }}>
                Detalhes da seção de **{tabId.toUpperCase()}**. Aqui você teria formulários complexos e opções de salvar.
            </p>
            <button 
                onClick={() => toast.success("Configurações salvas!", { duration: 1500 })}
                style={{
                    padding: '10px 20px',
                    marginTop: '20px',
                    backgroundColor: '#F08080',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600',
                }}
            >
                Salvar Alterações
            </button>
        </div>
    );
};


// --- Componente principal Configuracoes ---
export default function Configuracoes() {
  const isMobile = useIsMobile();
  // Estado para controlar qual aba está ativa (padrão é 'perfil')
  const [activeTab, setActiveTab] = useState('perfil'); 

  // Função para renderizar a navegação (Sidebar no desktop, Dropdown/Menu em mobile)
  const renderNav = () => {
    // No desktop, renderiza a navegação lateral
    if (!isMobile) {
      return (
        <div style={styles.sidebar(false)}>
          {configTabs.map((tab) => (
            <div
              key={tab.id}
              style={styles.tabItem(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = activeTab === tab.id ? '#FCE7EB' : '#FDFDFD')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = activeTab === tab.id ? '#FCE7EB' : 'transparent')}
            >
              <span style={{ marginRight: '10px' }}>{tab.icon}</span>
              {tab.name}
            </div>
          ))}
        </div>
      );
    }
    
    // No mobile, renderiza um Select (Dropdown)
    return (
        <div style={{ marginBottom: '20px' }}>
            <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px 15px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    color: '#333'
                }}
            >
                {configTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                        {tab.icon} {tab.name}
                    </option>
                ))}
            </select>
        </div>
    );
  };

  return (
    <div style={styles.container(isMobile)}>
      <Menu />
      
      <div style={styles.contentWrapper(isMobile)}>
        <h1 style={styles.title}>Configurações do Sistema</h1>
        
        <div style={styles.configLayout(isMobile)}>
            
            {/* 1. Navegação (Sidebar/Dropdown) */}
            {renderNav()}

            {/* 2. Conteúdo Principal da Aba Ativa */}
            <div style={styles.mainContent}>
                <ConfigContent tabId={activeTab} />
            </div>

        </div>
      </div>
    </div>
  );
}