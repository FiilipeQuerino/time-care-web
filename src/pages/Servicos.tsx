import Menu from "../components/Menu";
import ListaPadrao from "../components/ListaPadrao";
import { FormularioServico } from "../components/FormularioServico";
import { useState } from "react";
import toast from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile";
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const initialServicosData = [
  { id: 1, primaryText: "Limpeza de Pele Profunda", secondaryText: "Duração: 60 min | Preço: R$ 150,00", isActive: true },
  { id: 2, primaryText: "Massagem Relaxante", secondaryText: "Duração: 90 min | Preço: R$ 180,00", isActive: true },
  { id: 3, primaryText: "Depilação a Laser (Sessão)", secondaryText: "Duração: 45 min | Preço: R$ 250,00", isActive: true },
  { id: 5, primaryText: "Teste Inativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: false },
  { id: 6, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 7, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 8, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 9, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 10, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 11, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
  { id: 12, primaryText: "Teste Ativo", secondaryText: "Duração: 5 min | Preço: R$ 10,00", isActive: true },
];

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
      isActive: true,
    };

    setServicosData([newService, ...servicosData]);

    toast.success(`Serviço "${data.nome}" cadastrado com sucesso!`, {
      duration: 2500,
      icon: <FiCheckCircle size={20} />
    });
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: number | string, newStatus: boolean) => {
    setServicosData(prevData =>
      prevData.map(servico =>
        servico.id === id ? { ...servico, isActive: newStatus } : servico
      )
    );

    const message = newStatus ? 'Serviço ativado com sucesso!' : 'Serviço desabilitado com sucesso.';
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

        <div style={pageStyles.content(isMobile)}>
          <h1 style={pageStyles.title}>Gerenciar Serviços</h1>

          <ListaPadrao
            data={servicosData}
            emptyMessage="Nenhum serviço cadastrado."
            onStatusChange={handleStatusChange}
          />

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
            onClick={() => setIsModalOpen(true)}
          >
            + Adicionar Novo Serviço
          </button>
        </div>
      </div>

      {isModalOpen && (
        <FormularioServico
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewServiceSubmit}
        />
      )}
    </>
  );
}