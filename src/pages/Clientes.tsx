import Menu from "../components/Menu";
import ListaPadrao from "../components/ListaPadrao";
import { FormularioCliente } from "../components/FormularioCliente"; // Importe o novo formulário
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile"; 

// --- Dados Iniciais de Exemplo para Clientes ---
const initialClientesData = [
  { id: 101, primaryText: "Ana Souza", secondaryText: "Último Serviço: Limpeza de Pele (05/Out) | Tel: (11) 98765-4321" },
  { id: 102, primaryText: "Carlos Ferreira", secondaryText: "Último Serviço: Massagem (10/Set) | Tel: (21) 99876-5432" },
  { id: 103, primaryText: "Mariana Oliveira", secondaryText: "Próximo Agendamento: 25/Nov | Tel: (31) 98765-1234" },
  { id: 104, primaryText: "Ricardo Mendes", secondaryText: "Cadastro: 15/Jan/2023 | Tel: (47) 99999-0000" },
];

// --- Estilos Comuns (Permanecem os mesmos) ---
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
  const [clientesData, setClientesData] = useState(initialClientesData); // Estado dinâmico
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
  
  // Função para lidar com a ação (Ver Perfil)
  const handleAction = (id: number | string) => {
    toast(`Abrindo perfil do Cliente ID: ${id}.`, {
      icon: '👤',
      duration: 3000,
    });
  };

  // Função para abrir o modal
  const handleAddClient = () => {
    setIsModalOpen(true);
  };
  
  // Função de submissão do formulário
  const handleNewClientSubmit = (data: any) => {
    // 1. Simula o cadastro
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
    };

    // 3. Atualiza a lista
    setClientesData([newClient, ...clientesData]); // Adiciona o novo no topo
    
    // 4. Feedback e Fechamento
    toast.success(`Cliente "${data.nome}" cadastrado com sucesso!`, { duration: 2500 });
    setIsModalOpen(false);
  };


  return (
    <>
      <div style={pageStyles.container(isMobile)}>
        <Menu />
        
        {/* Container de Conteúdo */}
        <div style={pageStyles.content(isMobile)}>
          <h1 style={pageStyles.title}>Gestão de Clientes</h1>
          <p style={{ color: '#555', marginBottom: '30px' }}>
              Lista completa de clientes cadastrados e suas informações básicas.
          </p>

          <ListaPadrao 
            data={clientesData}
            onActionClick={handleAction}
            actionLabel="Ver Perfil"
            emptyMessage="Nenhum cliente encontrado. Adicione um novo para começar."
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