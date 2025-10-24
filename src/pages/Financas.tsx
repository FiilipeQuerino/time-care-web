import React, { useState } from "react";
import Menu from "../components/Menu";
import { FiArrowUpCircle, FiArrowDownCircle, FiDollarSign, FiBell } from "react-icons/fi";
import { IconContext } from "react-icons";
import { useIsMobile } from "../hooks/useIsMobile";

// --- Cores e estilos globais ---
const ACCENT_COLOR = "#F08080";
const GREEN = "#28a745";
const RED = "#dc3545";
const DARK_TEXT = "#333";
const SECONDARY_TEXT = "#777";
const BORDER_COLOR = "#eee";

// --- Tipagem das transações ---
interface Transaction {
  id: number;
  date: string;
  type: "receita" | "despesa";
  category: string;
  description: string;
  value: number;
  status: "pago" | "pendente";
  client?: string;
}

export default function Financas() {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("hoje");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"receita" | "despesa" | null>(null);

  // Mock inicial (seria gerado pela Agenda)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2025-10-24", type: "receita", category: "Serviço", description: "Massagem Relaxante", value: 180, status: "pago", client: "Ana Souza" },
    { id: 2, date: "2025-10-24", type: "receita", category: "Serviço", description: "Depilação a Laser", value: 250, status: "pendente", client: "Carlos Ferreira" },
    { id: 3, date: "2025-10-24", type: "despesa", category: "Produtos", description: "Reposição de cremes", value: 160, status: "pago" },
  ]);

  // --- Filtros (apenas visual por enquanto) ---
  const handleFilterChange = (range: string) => setFilter(range);

  // --- Ações de modal ---
  const openModal = (type: "receita" | "despesa") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  // --- Adicionar novo lançamento ---
  const handleAddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: formData.get("type") as "receita" | "despesa",
      category: (formData.get("category") as string) || "",
      description: (formData.get("description") as string) || "",
      value: Number(formData.get("value")),
      status: formData.get("status") as "pago" | "pendente",
      client: formData.get("client") as string,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    closeModal();
  };

  // --- Marcar como pago ---
  const toggleStatus = (id: number) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "pago" ? "pendente" : "pago" } : t
      )
    );
  };

  // --- Cálculos ---
  const receitas = transactions.filter(t => t.type === "receita" && t.status === "pago").reduce((acc, t) => acc + t.value, 0);
  const despesas = transactions.filter(t => t.type === "despesa").reduce((acc, t) => acc + t.value, 0);
  const lucro = receitas - despesas;

  return (
    <div style={pageStyles.container(isMobile)}>
      <Menu />

      <div style={pageStyles.content(isMobile)}>
        <h1 style={pageStyles.title}>Controle Financeiro</h1>

        {/* --- Cards --- */}
        <div style={pageStyles.cardsContainer}>
          <FinanceCard title="Receitas" value={`R$ ${receitas.toFixed(2)}`} icon={<FiArrowUpCircle />} color={GREEN} />
          <FinanceCard title="Despesas" value={`R$ ${despesas.toFixed(2)}`} icon={<FiArrowDownCircle />} color={RED} />
          <FinanceCard title="Lucro Líquido" value={`R$ ${lucro.toFixed(2)}`} icon={<FiDollarSign />} color={ACCENT_COLOR} />
        </div>

        {/* --- Filtros e ações --- */}
        <div style={pageStyles.actionsContainer}>
          <div>
            <button style={filterBtn(filter === "ontem")} onClick={() => handleFilterChange("ontem")}>Ontem</button>
            <button style={filterBtn(filter === "hoje")} onClick={() => handleFilterChange("hoje")}>Hoje</button>
            <button style={filterBtn(filter === "semana")} onClick={() => handleFilterChange("semana")}>Últimos 7 dias</button>
          </div>

          <div>
            <button style={actionBtn(GREEN)} onClick={() => openModal("receita")}>+ Receita</button>
            <button style={actionBtn(RED)} onClick={() => openModal("despesa")}>+ Despesa</button>
            <button style={actionBtn(ACCENT_COLOR)}>
              <FiBell style={{ marginRight: 5 }} /> A Cobrar Pendentes
            </button>
          </div>
        </div>

        {/* --- Tabela --- */}
        <div style={pageStyles.tableContainer}>
          <h2 style={pageStyles.subtitle}>Lançamentos do Dia</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BORDER_COLOR}` }}>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Descrição</th>
                <th style={thStyle}>Valor</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
                  <td style={tdStyle}>{t.date}</td>
                  <td style={tdStyle}>{t.client || "-"}</td>
                  <td style={{ ...tdStyle, color: t.type === "receita" ? GREEN : RED }}>
                    {t.type === "receita" ? "Receita" : "Despesa"}
                  </td>
                  <td style={tdStyle}>{t.description}</td>
                  <td style={tdStyle}>R$ {t.value.toFixed(2)}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => toggleStatus(t.id)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: t.status === "pago" ? "#d4edda" : "#fff3cd",
                        color: t.status === "pago" ? "#155724" : "#856404",
                        fontWeight: 600,
                      }}
                    >
                      {t.status === "pago" ? "Pago" : "Pendente"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Modal de novo lançamento --- */}
        {isModalOpen && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2>Novo Lançamento ({modalType === "receita" ? "Receita" : "Despesa"})</h2>
              <form onSubmit={handleAddTransaction}>
                <input type="hidden" name="type" value={modalType!} />
                {modalType === "receita" && (
                  <input name="client" placeholder="Cliente (opcional)" style={inputStyle} />
                )}
                <input name="category" placeholder="Categoria" style={inputStyle} required />
                <input name="description" placeholder="Descrição" style={inputStyle} required />
                <input name="value" placeholder="Valor (R$)" type="number" step="0.01" style={inputStyle} required />
                <select name="status" style={inputStyle}>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                </select>
                <div style={{ marginTop: 15, textAlign: "right" }}>
                  <button type="button" onClick={closeModal} style={actionBtn(RED)}>Cancelar</button>
                  <button type="submit" style={actionBtn(GREEN)}>Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Estilos reutilizáveis ---
const pageStyles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
    flexDirection: isMobile ? "column" : "row",
  }),
  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
  }),
  title: { color: DARK_TEXT, marginBottom: "25px", fontSize: "28px", fontWeight: 700 },
  subtitle: { color: DARK_TEXT, marginBottom: "15px", fontSize: "18px", fontWeight: 600 },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap" as const,
    gap: "10px",
  },
  tableContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 8px",
  color: SECONDARY_TEXT,
  fontWeight: 600,
  fontSize: "14px",
};
const tdStyle: React.CSSProperties = { padding: "10px 8px", fontSize: "14px", color: DARK_TEXT };

const FinanceCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({
  title,
  value,
  icon,
  color,
}) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      borderLeft: `5px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div>
      <div style={{ color: SECONDARY_TEXT, fontSize: "14px", marginBottom: "5px" }}>{title}</div>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: DARK_TEXT }}>{value}</div>
    </div>
    <div style={{ padding: "10px", borderRadius: "50%", backgroundColor: `${color}1A`, color }}>
      <IconContext.Provider value={{ size: "24px" }}>{icon}</IconContext.Provider>
    </div>
  </div>
);

const filterBtn = (active: boolean): React.CSSProperties => ({
  padding: "8px 15px",
  marginRight: "8px",
  borderRadius: "6px",
  border: `1px solid ${active ? ACCENT_COLOR : BORDER_COLOR}`,
  background: active ? ACCENT_COLOR : "white",
  color: active ? "white" : DARK_TEXT,
  cursor: "pointer",
  fontWeight: 600,
});

const actionBtn = (color: string): React.CSSProperties => ({
  padding: "8px 15px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: color,
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  marginLeft: "8px",
});

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox: React.CSSProperties = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "100%",
  maxWidth: "400px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: `1px solid ${BORDER_COLOR}`,
};
