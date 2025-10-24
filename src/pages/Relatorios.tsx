import React from "react";
import Menu from "../components/Menu";
import { useIsMobile } from "../hooks/useIsMobile";
import toast from "react-hot-toast";
import { FaMoneyBillWave, FaUserFriends, FaSpa } from "react-icons/fa";
import { generatePDF } from "../utils/generatePDF";
import { financeiroLucroPDF } from "../reports/financeiro_lucro";
import { financeiroDespesasPDF } from "../reports/financeiro_despesas";
import { financeiroVendasPDF  } from "../reports/financeiro_vendas";

const reportCategories = [
  {
    id: "financeiro",
    title: "Financeiro e Lucro",
    description: "Visão geral de receitas, despesas e margem de lucro.",
    icon: <FaMoneyBillWave />,
    reports: [
      { name: "Relatório de Vendas por Período", file: "/reports/financeiro.pdf" },
      { name: "Relatório de Despesas", file: "/reports/financeiro.pdf" },
      { name: "Demonstrativo de Lucro", file: "/reports/financeiro.pdf" },
    ],
  },
  {
    id: "clientes",
    title: "Gestão de Clientes",
    description: "Análise de retenção, novos clientes e serviços mais procurados.",
    icon: <FaUserFriends />,
    reports: [
      { name: "Clientes Inativos (Retenção)", file: "/reports/example.pdf" },
      { name: "Performance por Cliente", file: "/reports/example.pdf" },
      { name: "Fidelidade e Frequência", file: "/reports/example.pdf" },
    ],
  },
  {
    id: "servicos",
    title: "Performance de Serviços",
    description: "Identifique os serviços mais rentáveis e a performance dos profissionais.",
    icon: <FaSpa />,
    reports: [
      { name: "Serviços Mais Vendidos", file: "/reports/example.pdf" },
      { name: "Performance por Profissional", file: "/reports/example.pdf" },
      { name: "Ocupação da Agenda", file: "/reports/example.pdf" },
    ],
  },
];

// --- Estilos ---
const styles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
  }),
  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
  }),
  title: { fontSize: "28px", fontWeight: 700, color: "#333", marginBottom: "30px" } as React.CSSProperties,
  grid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
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

    const handleDownload = (reportName: string) => {
    // Financeiro e Lucro
    if (reportName === "Relatório de Vendas por Período") {
      financeiroVendasPDF();
    } else if (reportName === "Relatório de Despesas") {
      financeiroDespesasPDF();
    } else if (reportName === "Demonstrativo de Lucro") {
      financeiroLucroPDF();
    } else {
      // Para relatórios que não têm PDF específico ainda, gera PDF genérico
      generatePDF(reportName);
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.08)",
    border: "1px solid #eee",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  };

  return (
    <div
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(240, 128, 128, 0.3)";
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "10px", color: "#F08080" }}>{category.icon}</div>
      <h3 style={{ color: "#F08080", marginBottom: "5px", fontSize: "18px" }}>{category.title}</h3>
      <p style={{ color: "#777", fontSize: "14px", marginBottom: "20px" }}>{category.description}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {category.reports.map((report, index) => (
        <button
          key={index}
          onClick={() => {
            toast.success(`Baixando: ${report.name}`, { duration: 2000 });
            handleDownload(report.name);
          }}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #FCE7EB",
            backgroundColor: "#FFF",
            color: "#333",
            textAlign: isMobile ? "center" : "left",
            cursor: "pointer",
            transition: "all 0.2s",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {report.name}
        </button>
        ))}
      </div>
    </div>
  );
};

// --- Componente principal ---
export default function Relatorios() {
  const isMobile = useIsMobile();

  return (
    <div style={styles.container(isMobile)}>
      <Menu />
      <div style={styles.content(isMobile)}>
        <h1 style={styles.title}>Painel de Relatórios</h1>
        <p style={{ color: "#555", marginBottom: "30px" }}>
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
