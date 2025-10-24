import React, { useState } from "react";
import Menu from "../components/Menu";
import { useIsMobile } from "../hooks/useIsMobile";
import toast from "react-hot-toast";
import { FaUser, FaUsers, FaCalendarAlt, FaBell, FaSpa } from "react-icons/fa";

// --- Configuração das abas ---
const configTabs = [
  { id: "perfil", name: "Perfil da Clínica", icon: <FaUser /> },
  { id: "usuarios", name: "Gestão de Usuários", icon: <FaUsers /> },
  { id: "servicos", name: "Catálogo de Serviços", icon: <FaSpa /> },
  { id: "agenda", name: "Configurações de Agenda", icon: <FaCalendarAlt /> },
  { id: "notificacoes", name: "Modelos de Notificação", icon: <FaBell /> },
];

// --- Estilos ---
const styles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
  }),
  contentWrapper: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px" : "30px",
  }),
  title: { fontSize: "28px", fontWeight: 700, color: "#333", marginBottom: "20px" } as React.CSSProperties,
  configLayout: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "20px",
    marginTop: "20px",
  }),
  sidebar: (isMobile: boolean): React.CSSProperties => ({
    width: isMobile ? "100%" : "250px",
    flexShrink: 0,
    backgroundColor: "white",
    borderRadius: "10px",
    padding: isMobile ? "0" : "15px 0",
    boxShadow: isMobile ? "none" : "0 4px 10px rgba(0,0,0,0.05)",
  }),
  mainContent: {
    flex: 1,
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  tabItem: (isActive: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    cursor: "pointer",
    backgroundColor: isActive ? "#FCE7EB" : "transparent",
    color: isActive ? "#F08080" : "#555",
    fontWeight: isActive ? 600 : 400,
    borderLeft: isActive ? "4px solid #F08080" : "4px solid transparent",
    transition: "all 0.2s",
  }),
};

// --- Componente de Aba ---
const TabItem = ({
  tab,
  isActive,
  onClick,
}: {
  tab: typeof configTabs[0];
  isActive: boolean;
  onClick: () => void;
}) => (
  <div style={styles.tabItem(isActive)} onClick={onClick}>
    <span style={{ marginRight: "10px", fontSize: "18px" }}>{tab.icon}</span>
    {tab.name}
  </div>
);

// --- Sidebar para Desktop ---
const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) => (
  <div style={styles.sidebar(false)}>
    {configTabs.map((tab) => (
      <TabItem key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
    ))}
  </div>
);

// --- Dropdown para Mobile ---
const DropdownNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) => (
  <div style={{ marginBottom: "20px" }}>
    <select
      value={activeTab}
      onChange={(e) => setActiveTab(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 15px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        backgroundColor: "white",
        color: "#333",
      }}
    >
      {configTabs.map((tab) => (
        <option key={tab.id} value={tab.id}>
          {tab.name}
        </option>
      ))}
    </select>
  </div>
);

// --- Conteúdo da Aba ---
const ConfigContent = ({ tabId }: { tabId: string }) => {
  const currentTab = configTabs.find((t) => t.id === tabId);
  return (
    <div>
      <h2
        style={{
          color: "#333",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        {currentTab?.name}
      </h2>
      <p style={{ color: "#777" }}>
        Detalhes da seção <strong>{tabId.toUpperCase()}</strong>. Aqui você teria formulários complexos e opções de salvar.
      </p>
      <button
        onClick={() => toast.success("Configurações salvas!", { duration: 1500 })}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#F08080",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Salvar Alterações
      </button>
    </div>
  );
};

// --- Componente principal ---
export default function Configuracoes() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("perfil");

  return (
    <div style={styles.container(isMobile)}>
      <Menu />
      <div style={styles.contentWrapper(isMobile)}>
        <h1 style={styles.title}>Configurações do Sistema</h1>
        <div style={styles.configLayout(isMobile)}>
          {isMobile ? <DropdownNav activeTab={activeTab} setActiveTab={setActiveTab} /> : <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
          <div style={styles.mainContent}>
            <ConfigContent tabId={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}