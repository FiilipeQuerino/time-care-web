import Menu from "../components/Menu";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { FiCalendar, FiDollarSign, FiUsers } from "react-icons/fi";
import { IconContext } from "react-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// =================================================================
// ESTILOS
// =================================================================
const ACCENT_COLOR = "#F08080";
const DARK_TEXT = "#333";
const SECONDARY_TEXT = "#777";
const BORDER_COLOR = "#eee";

const dashboardStyles = {
  container: {
    display: "flex",
    backgroundColor: "#FDFDFD",
  } as React.CSSProperties,

  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
    minWidth: 0,
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
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  }),

  block: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  } as React.CSSProperties,
};

// =================================================================
// CARD RESUMO
// =================================================================
interface ModernCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const ModernCard: React.FC<ModernCardProps> = ({ title, value, icon, color }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
      borderLeft: `5px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div>
      <div style={{ color: SECONDARY_TEXT, fontSize: "14px", marginBottom: "5px" }}>
        {title}
      </div>
      <div style={{ fontSize: "26px", fontWeight: "bold", color: DARK_TEXT }}>{value}</div>
    </div>

    <div
      style={{
        padding: "12px",
        borderRadius: "50%",
        backgroundColor: `${color}1A`,
        color: color,
      }}
    >
      <IconContext.Provider value={{ size: "24px" }}>{icon}</IconContext.Provider>
    </div>
  </div>
);

// =================================================================
// DASHBOARD PRINCIPAL
// =================================================================
export default function Dashboard() {
  const isMobile = useIsMobile();

  const summaryCards: ModernCardProps[] = [
    { title: "Agendamentos Hoje", value: "12", icon: <FiCalendar />, color: ACCENT_COLOR },
    { title: "Receita (Mês)", value: "R$ 15.800", icon: <FiDollarSign />, color: "#28a745" },
    { title: "Próxima Semana", value: "35 Clientes", icon: <FiUsers />, color: "#007bff" },
  ];

  const nextAppointments = [
    { time: "09:00", client: "Ana Beatriz", service: "Limpeza de Pele" },
    { time: "10:30", client: "João Silva", service: "Massagem Relaxante" },
    { time: "14:00", client: "Maria Luiza", service: "Depilação a Laser" },
  ];

  const weeklyAppointments = [
    { dia: "Seg", qtd: 3 },
    { dia: "Ter", qtd: 0 },
    { dia: "Qua", qtd: 10 },
    { dia: "Qui", qtd: 6 },
    { dia: "Sex", qtd: 8 },
  ];

  return (
    <div style={{ ...dashboardStyles.container, flexDirection: isMobile ? "column" : "row" }}>
      <Menu />

      <div style={dashboardStyles.content(isMobile)}>
        <h1 style={dashboardStyles.title}>Resumo Geral</h1>

        {/* KPIs */}
        <div style={dashboardStyles.cardsGrid(isMobile)}>
          {summaryCards.map((card, index) => (
            <ModernCard key={index} {...card} />
          ))}
        </div>

        {/* Blocos de Conteúdo */}
        <div style={dashboardStyles.overviewGrid(isMobile)}>
          {/* Agenda */}
          <div style={dashboardStyles.block}>
            <h2
              style={{
                color: DARK_TEXT,
                fontSize: "20px",
                borderBottom: `1px solid ${BORDER_COLOR}`,
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              Próximos na Agenda
            </h2>
            {nextAppointments.map((app, index) => (
              <div
                key={index}
                style={{
                  padding: "10px 0",
                  borderBottom:
                    index < nextAppointments.length - 1 ? `1px dotted ${BORDER_COLOR}` : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontWeight: "bold", color: ACCENT_COLOR }}>{app.time}</span> -{" "}
                  {app.client}
                </div>
                <span style={{ fontSize: "12px", color: SECONDARY_TEXT }}>{app.service}</span>
              </div>
            ))}
          </div>

          {/* Gráfico de Agendamentos por Dia */}
          <div style={dashboardStyles.block}>
            <h2
              style={{
                color: DARK_TEXT,
                fontSize: "20px",
                borderBottom: `1px solid ${BORDER_COLOR}`,
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              Agendamentos por Dia da Semana
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="dia" stroke={SECONDARY_TEXT} />
                <YAxis allowDecimals={false} stroke={SECONDARY_TEXT} />
                <Tooltip cursor={{ fill: "#f8f8f8" }} />
                <Bar dataKey="qtd" fill={ACCENT_COLOR} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
