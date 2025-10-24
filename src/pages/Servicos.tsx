import Menu from "../components/Menu";
import ListaPadrao from "../components/ListaPadrao";
import { FormularioServico } from "../components/FormularioServico";
import { useState } from "react";
import toast from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile";
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

// Dados de Exemplo (Adicionando status: 'ativo')
const initialServicosData = [
  { id: 1, primaryText: "Limpeza de Pele Profunda", secondaryText: "Duração: 60 min | Preço: R$ 150,00", isActive: true },
  { id: 2, primaryText: "Massagem Relaxante", secondaryText: "Duração: 90 min | Preço: R$ 180,00", isActive: true },
  { id: 3, primaryText: "Depilação a Laser (Sessão)", secondaryText: "Duração: 45 min | Preço: R$ 250,00", isActive: true },
  // Exemplo de um serviço inativo
  { id: 5, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: false },
  { id: 6, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 7, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 8, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 9, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 10, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 11, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 12, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
];

export default function Servicos() {
  const isMobile = useIsMobile();
  const [servicosData, setServicosData] = useState(initialServicosData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewServiceSubmit = (data: any) => {
    const newId = Date.now();

    const newService = {
      id: newId,
      primaryText: data.nome,
      secondaryText: `Duração: ${data.duracaoMinutos} min | Preço: ${data.valorFormatado}`,
      isActive: true, // Novo serviço é sempre ativo (removido 'as const')
    };

    setServicosData([newService, ...servicosData]);

    // ATUALIZADO: Usando ícone profissional para o toast de sucesso de cadastro
    toast.success(`Serviço "${data.nome}" cadastrado com sucesso!`, {
      duration: 2500,
      icon: <FiCheckCircle size={20} />
    });
    setIsModalOpen(false);
  };

  // --- NOVO: Função para alterar o status do serviço ---
  const handleStatusChange = (id: number | string, newStatus: boolean) => {
    setServicosData(prevData =>
      prevData.map(servico =>
        // Encontra o serviço pelo ID e atualiza o isActive
        servico.id === id ? { ...servico, isActive: newStatus } : servico
      )
    );

    // ATUALIZADO: Usando ícones profissionais para o toast de mudança de status
    const message = newStatus ? 'Serviço ativado com sucesso!' : 'Serviço desabilitado com sucesso.';
    const icon = newStatus ? <FiCheckCircle size={20} /> : <FiAlertTriangle size={20} />;

    toast.success(message, {
      icon: icon,
      duration: 2500
    });
  };

  // ... (pageStyles e container permanecem os mesmos) ...

  return (
    <>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        <Menu />

        <div style={{ flex: 1, padding: isMobile ? "60px 15px 15px 15px" : "30px", backgroundColor: "#FDFDFD" }}>
          <h1 style={{ color: "#333", marginBottom: "30px", fontSize: '28px' }}>Gerenciar Serviços</h1>

          <ListaPadrao
            data={servicosData}
            emptyMessage="Nenhum serviço cadastrado."
            // CORRIGIDO: Passando a prop onStatusChange obrigatória
            onStatusChange={handleStatusChange}
          />

          {/* Botão para abrir o Modal */}
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#F08080",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: '600'
            }}
            onClick={() => setIsModalOpen(true)} // Abre o Modal
          >
            + Adicionar Novo Serviço
          </button>
        </div>
      </div>

      {/* Renderiza o Modal se isModalOpen for true */}
      {isModalOpen && (
        <FormularioServico
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewServiceSubmit}
        />
      )}
    </>
  );
}