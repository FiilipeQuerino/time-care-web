import Menu from "../components/Menu";
import ListaPadrao from "../components/ListaPadrao";
import { FormularioServico } from "../components/FormularioServico"; // Importe o formulário
import { useState } from "react"; // Importe useState
import toast from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile";

// Dados de Exemplo (Adicionados manualmente para simulação)
const initialServicosData = [
  { id: 1, primaryText: "Limpeza de Pele Profunda", secondaryText: "Duração: 60 min | Preço: R$ 150,00" },
  { id: 2, primaryText: "Massagem Relaxante", secondaryText: "Duração: 90 min | Preço: R$ 180,00" },
  { id: 3, primaryText: "Depilação a Laser (Sessão)", secondaryText: "Duração: 45 min | Preço: R$ 250,00" },
];

export default function Servicos() {
  const isMobile = useIsMobile();
  // Estado para controlar a lista de serviços (agora dinâmica)
  const [servicosData, setServicosData] = useState(initialServicosData);
  // Estado para controlar a visibilidade do modal
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleAction = (id: number | string) => {
    toast(`Detalhes do Serviço ID: ${id}.`, {
      icon: 'ℹ️',
      duration: 3000,
    });
  };
  
  const handleNewServiceSubmit = (data: any) => {
    // 1. Simula o cadastro e cria um novo ID
    const newId = Date.now(); 
    
    const newService = {
        id: newId,
        primaryText: data.nome,
        secondaryText: `Duração: ${data.duracaoMinutos} min | Preço: ${data.valorFormatado}`,
    };

    // 2. Atualiza a lista (Simulação de um POST bem-sucedido)
    setServicosData([...servicosData, newService]);
    
    // 3. Feedback e Fechamento
    toast.success(`Serviço "${data.nome}" cadastrado com sucesso!`, { duration: 2500 });
    setIsModalOpen(false);
  };
  
  // ... (pageStyles permanece o mesmo) ...

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", flexDirection: isMobile ? "column" : "row" }}>
        <Menu />
        
        <div style={{ flex: 1, padding: isMobile ? "60px 15px 15px 15px" : "30px", backgroundColor: "#FDFDFD" }}>
          <h1 style={{ color: "#333", marginBottom: "30px", fontSize: '28px' }}>Gerenciar Serviços</h1>
          
          <ListaPadrao 
            data={servicosData} // Usa o estado dinâmico
            onActionClick={handleAction}
            actionLabel="Detalhes"
            emptyMessage="Nenhum serviço cadastrado."
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