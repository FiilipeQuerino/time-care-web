import Menu from "../components/Menu";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import toast from "react-hot-toast";

// --- Dados de Simulação dos Relatórios ---
const reportCategories = [
  {
    id: 'financeiro',
    title: "Financeiro e Lucro",
    description: "Visão geral de receitas, despesas e margem de lucro.",
    icon: "💰", // Ícone moderno
    reports: [
      { name: "Relatório de Vendas por Período" },
      { name: "Relatório de Despesas" },
      { name: "Demonstrativo de Lucro" },
    ],
  },
  {
    id: 'clientes',
    title: "Gestão de Clientes",
    description: "Análise de retenção, novos clientes e serviços mais procurados.",
    icon: "👤",
    reports: [
      { name: "Clientes Inativos (Retenção)" },
      { name: "Performance por Cliente" },
      { name: "Fidelidade e Frequência" },
    ],
  },
  {
    id: 'servicos',
    title: "Performance de Serviços",
    description: "Identifique os serviços mais rentáveis e a performance dos profissionais.",
    icon: "✨",
    reports: [
      { name: "Serviços Mais Vendidos" },
      { name: "Performance por Profissional" },
      { name: "Ocupação da Agenda" },
    ],
  },
];

// --- Estilos Comuns ---
const styles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
    flexDirection: isMobile ? "column" : "row",
  }),

  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    // Padding para mobile para desviar do botão hambúrguer
    padding: isMobile ? "60px 15px 15px 15px" : "30px", 
  }),
  
  title: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,

  // Estilo para o Grid de Categorias (Cards)
  grid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", // 3 colunas no desktop
    gap: "30px",
    marginTop: "20px",
  }),
};

// --- Componente Card de Categoria ---
interface ReportCategoryProps {
  category: typeof reportCategories[0];
}

const ReportCategoryCard: React.FC<ReportCategoryProps> = ({ category }) => {
  const isMobile = useIsMobile();
    
  // Estilos específicos do Card
  const cardStyle = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.08)",
    border: "1px solid #eee",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  } as React.CSSProperties;

  const handleCardClick = (reportName: string) => {
    toast.success(`Carregando relatório: ${reportName}`, { duration: 2000 });
    // Aqui você adicionaria a lógica para carregar o relatório ou mudar o estado/rota
  };

  return (
    <div style={cardStyle} 
        onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(240, 128, 128, 0.3)";
            e.currentTarget.style.transform = "translateY(-5px)";
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.08)";
            e.currentTarget.style.transform = "translateY(0)";
        }}
    >
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{category.icon}</div>
      <h3 style={{ color: "#F08080", marginBottom: "5px", fontSize: "18px" }}>{category.title}</h3>
      <p style={{ color: "#777", fontSize: "14px", marginBottom: "20px" }}>{category.description}</p>
      
      {/* Lista de Opções de Relatório (Botões) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {category.reports.map((report, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(report.name)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #FCE7EB",
              backgroundColor: "#FFF",
              color: "#333",
              textAlign: isMobile ? 'center' : 'left', // Alinhamento no mobile
              cursor: "pointer",
              transition: "background-color 0.2s, border-color 0.2s",
              fontSize: '14px',
              fontWeight: '500',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#FCE7EB";
                e.currentTarget.style.borderColor = "#F08080";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#FFF";
                e.currentTarget.style.borderColor = "#FCE7EB";
            }}
          >
            {report.name}
          </button>
        ))}
      </div>
    </div>
  );
};


// --- Componente principal Relatorios ---
export default function Relatorios() {
  const isMobile = useIsMobile();
  
  return (
    <div style={styles.container(isMobile)}>
      <Menu />
      
      <div style={styles.content(isMobile)}>
        <h1 style={styles.title}>Painel de Relatórios</h1>
        <p style={{ color: '#555', marginBottom: '30px' }}>
            Selecione a categoria para visualizar os relatórios detalhados.
        </p>
        
        <div style={styles.grid(isMobile)}>
          {reportCategories.map((category) => (
            <ReportCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}