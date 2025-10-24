import Menu from "../components/Menu";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";

// Estilos do Dashboard
const dashboardStyles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD", // Fundo do conteúdo
  } as React.CSSProperties,

  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    // Ajuste do padding em mobile para desviar do botão hambúrguer
    padding: isMobile ? "60px 15px 15px 15px" : "30px", 
  }),

  title: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,

  // Estilos para o Grid de Cards
  cardsGrid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    // 3 colunas no desktop, 1 coluna no mobile
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
    gap: "20px",
    marginBottom: "40px",
  }),
  
  // Estilo para a seção de Visão Geral (Agenda e Gráfico Simulado)
  overviewGrid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    // 2 colunas no desktop (Agenda e Relatório Rápido), 1 coluna no mobile
    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", 
    gap: "20px",
  }),
};

// Componente Card de Exemplo (Mantido e Reutilizado)
const cardStyles = {
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        borderLeft: "5px solid #F08080", // Linha de destaque
    } as React.CSSProperties,
    cardTitle: {
        color: "#777",
        fontSize: "14px",
        marginBottom: "10px",
    } as React.CSSProperties,
    cardValue: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
    } as React.CSSProperties,
}

const Card = ({ title, value }: { title: string, value: string }) => (
    <div style={cardStyles.card}>
        <div style={cardStyles.cardTitle}>{title}</div>
        <div style={cardStyles.cardValue}>{value}</div>
    </div>
);

// --- Componente principal Dashboard ---
export default function Dashboard() {
  const isMobile = useIsMobile();
  
  // Dados de simulação
  const summaryCards = [
    { title: "Agendamentos Hoje", value: "12" },
    { title: "Receita (Mês)", value: "R$ 15.800" },
    { title: "Próxima Semana", value: "35 Clientes" },
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
        
        {/* 1. Grid de Cards de Sumário */}
        <div style={dashboardStyles.cardsGrid(isMobile)}>
          {summaryCards.map((card, index) => (
            <Card key={index} title={card.title} value={card.value} />
          ))}
        </div>
        
        {/* 2. Visão Geral (Agenda e Relatórios Rápidos) */}
        <div style={dashboardStyles.overviewGrid(isMobile)}>
            {/* Bloco 1: Próximos Agendamentos */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)' }}>
                <h2 style={{ color: '#333', fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                    Próximos na Agenda
                </h2>
                {nextAppointments.map((app, index) => (
                    <div key={index} style={{ padding: '10px 0', borderBottom: index < nextAppointments.length - 1 ? '1px dotted #eee' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontWeight: 'bold', color: '#F08080' }}>{app.time}</span> - {app.client}
                        </div>
                        <span style={{ fontSize: '12px', color: '#777' }}>{app.service}</span>
                    </div>
                ))}
            </div>

            {/* Bloco 2: Gráfico Rápido/KPI */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)' }}>
                <h2 style={{ color: '#333', fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                    Taxa de Ocupação
                </h2>
                <div style={{ textAlign: 'center', padding: '20px', border: '3px dashed #FCE7EB', borderRadius: '8px' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#F08080' }}>
                        75%
                    </div>
                    <p style={{ color: '#555', marginTop: '10px' }}>
                        Média Semanal
                    </p>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}