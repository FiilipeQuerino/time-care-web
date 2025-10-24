import Menu from "../components/Menu";
import ListaPadrao from "../components/ListaPadrao";
import { FormularioCliente } from "../components/FormularioCliente";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile";
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

// --- Dados Iniciais de Exemplo para Clientes ---
const initialClientesData = [
  { id: 101, primaryText: "Ana Souza", secondaryText: "Último Serviço: Limpeza de Pele (05/Out) | Tel: (11) 98765-4321", isActive: true },
  { id: 102, primaryText: "Carlos Ferreira", secondaryText: "Último Serviço: Massagem (10/Set) | Tel: (21) 99876-5432", isActive: true },
  { id: 103, primaryText: "Mariana Oliveira", secondaryText: "Próximo Agendamento: 25/Nov | Tel: (31) 98765-1234", isActive: true },
  { id: 104, primaryText: "Ricardo Mendes", secondaryText: "Cadastro: 15/Jan/2023 | Tel: (47) 99999-0000", isActive: false },
];

// --- Estilos Comuns (Permanecem os mesmos) ---
const pageStyles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
    flexDirection: isMobile ? "column" : "row",
    minWidth: 0,
  }),
  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
  }),
  title: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,
  addButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#F08080",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: '600',
    transition: 'background-color 0.3s'
  } as React.CSSProperties,
};

// --- Componente principal Clientes ---
export default function Clientes() {
  const isMobile = useIsMobile();
  const [clientesData, setClientesData] = useState(initialClientesData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClient = () => {
    setIsModalOpen(true);
  };

  const handleNewClientSubmit = (data: any) => {
    const newId = Date.now();
    // 2. Monta o secondaryText formatado
    let secondaryText = `Tel: (${data.telefone.substring(0, 2)}) ${data.telefone.substring(2, 7)}-${data.telefone.substring(7, 11)}`;
    if (data.email) {
      secondaryText = `Email: ${data.email} | ${secondaryText}`;
    } else {
      secondaryText = `Email: N/A | ${secondaryText}`;
    }

    const newClient = {
      id: newId,
      primaryText: data.nome,
      secondaryText: secondaryText,
      isActive: true, // Novo cliente é sempre ativo
    };

    setClientesData([newClient, ...clientesData]);

    // MUDANÇA 1: Usando FiCheckCircle para o toast de sucesso de cadastro
    toast.success(`Cliente "${data.nome}" cadastrado com sucesso!`, {
      duration: 2500,
      icon: <FiCheckCircle size={20} />
    });
    setIsModalOpen(false);
  };

  // --- Função para alterar o status do cliente ---
  const handleStatusChange = (id: number | string, newStatus: boolean) => {
    setClientesData(prevData =>
      prevData.map(cliente =>
        cliente.id === id ? { ...cliente, isActive: newStatus } : cliente
      )
    );

    // MUDANÇA 2: Usando FiCheckCircle e FiAlertTriangle para o toast de mudança de status
    const message = newStatus ? 'Cliente ativado com sucesso!' : 'Cliente desabilitado com sucesso.';
    const icon = newStatus ? <FiCheckCircle size={20} /> : <FiAlertTriangle size={20} />;

    toast.success(message, {
      icon: icon,
      duration: 2500
    });
  };


  return (
    <>
      <div style={pageStyles.container(isMobile)}>
        <Menu />

        {/* Container de Conteúdo */}
        <div style={pageStyles.content(isMobile)}>
          <h1 style={pageStyles.title}>Gestão de Clientes</h1>

          <ListaPadrao
            data={clientesData}
            emptyMessage="Nenhum cliente encontrado. Adicione um novo para começar."
            onStatusChange={handleStatusChange}
          />

          {/* Botão de Adicionar Novo Cliente */}
          <button
            style={pageStyles.addButton}
            onClick={handleAddClient}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E96464")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F08080")}
          >
            + Cadastrar Novo Cliente
          </button>

        </div>
      </div>

      {/* Renderiza o Modal se isModalOpen for true */}
      {isModalOpen && (
        <FormularioCliente
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewClientSubmit}
        />
      )}
    </>
  );
}