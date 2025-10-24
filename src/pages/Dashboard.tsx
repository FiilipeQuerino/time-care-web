import Menu from "../components/Menu";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";
// Importando ícones populares (Fi: Feather Icons)
import { FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi';
import { IconContext } from 'react-icons';

// =================================================================
// 1. ESTILOS ATUALIZADOS
// =================================================================
const ACCENT_COLOR = "#F08080"; // Sua cor principal (rosa claro)
const DARK_TEXT = "#333";
const SECONDARY_TEXT = "#777";
const BORDER_COLOR = "#eee";

const dashboardStyles = {
  container: {
    display: "flex",
    // Removendo minHeight: "100vh" aqui, pois já corrigimos no index.css
    backgroundColor: "#FDFDFD",
  } as React.CSSProperties,

  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
    minWidth: 0, // Garante que a div ocupe toda a largura
  }),

  title: {
    color: DARK_TEXT,
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,

  cardsGrid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  }),

  overviewGrid: (isMobile: boolean): React.CSSProperties => ({
    // Agora só precisamos de 1 coluna, já que removemos o Bloco 2.
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  }),

  // Novo estilo para o bloco de Agenda
  agendaBlock: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
  } as React.CSSProperties,
};

// =================================================================
// 2. COMPONENTE CARD MODERNIZADO (KPI)
// =================================================================
interface ModernCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const ModernCard: React.FC<ModernCardProps> = ({ title, value, icon, color }) => (
  <div style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    borderLeft: `5px solid ${color}`, // Destaque lateral pela cor
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    {/* Bloco de Texto */}
    <div>
      <div style={{ color: SECONDARY_TEXT, fontSize: "14px", marginBottom: "5px" }}>
        {title}
      </div>
      <div style={{ fontSize: "26px", fontWeight: "bold", color: DARK_TEXT }}>
        {value}
      </div>
    </div>

    {/* Bloco de Ícone */}
    <div style={{
      padding: '12px',
      borderRadius: '50%',
      backgroundColor: `${color}1A`, // Cor clara para o fundo do ícone
      color: color
    }}>
      {/* O IconContext garante que o ícone tenha o tamanho correto */}
      <IconContext.Provider value={{ size: "24px" }}>
        {icon}
      </IconContext.Provider>
    </div>
  </div>
);


// =================================================================
// 3. COMPONENTE PRINCIPAL DASHBOARD
// =================================================================
export default function Dashboard() {
  const isMobile = useIsMobile();

  // Dados de simulação
  const summaryCards: ModernCardProps[] = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      icon: <FiCalendar />,
      color: ACCENT_COLOR // Rosa
    },
    {
      title: "Receita (Mês)",
      value: "R$ 15.800",
      icon: <FiDollarSign />,
      color: "#28a745" // Verde
    },
    {
      title: "Próxima Semana",
      value: "35 Clientes",
      icon: <FiUsers />,
      color: "#007bff" // Azul
    },
  ];

  const nextAppointments = [
    { time: "09:00", client: "Ana Beatriz", service: "Limpeza de Pele" },
    { time: "10:30", client: "João Silva", service: "Massagem Relaxante" },
    { time: "14:00", client: "Maria Luiza", service: "Depilação a Laser" },
  ];

  return (
    <div style={{ ...dashboardStyles.container, flexDirection: isMobile ? "column" : "row" }}>
      <Menu />

      {/* Container de Conteúdo */}
      <div style={dashboardStyles.content(isMobile)}>
        <h1 style={dashboardStyles.title}>Resumo Geral</h1>

        {/* 1. Grid de Cards de Sumário (KPIs Modernos) */}
        <div style={dashboardStyles.cardsGrid(isMobile)}>
          {summaryCards.map((card, index) => (
            <ModernCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        {/* 2. Visão Geral (Apenas Agenda) */}
        <div style={dashboardStyles.overviewGrid(isMobile)}>
          {/* Bloco 1: Próximos Agendamentos */}
          <div style={dashboardStyles.agendaBlock}>
            <h2 style={{ color: DARK_TEXT, fontSize: '20px', borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: '10px', marginBottom: '15px' }}>
              Próximos na Agenda
            </h2>
            {nextAppointments.map((app, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 0',
                  borderBottom: index < nextAppointments.length - 1 ? `1px dotted ${BORDER_COLOR}` : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold', color: ACCENT_COLOR }}>{app.time}</span> - {app.client}
                </div>
                <span style={{ fontSize: '12px', color: SECONDARY_TEXT }}>{app.service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}