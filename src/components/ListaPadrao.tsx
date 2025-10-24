import React, { useState, useMemo } from "react";
import { useIsMobile } from "../hooks/useIsMobile"; 
import toast from "react-hot-toast"; 
// =========================================================================
// !!! CORREÇÃO CRÍTICA: USANDO ÍCONES REAIS DO REACT-ICONS !!!
// Trocamos a simulação "const FiEye = (props: IconProps) => <i...>"
// por imports diretos, já que você instalou o pacote.
// =========================================================================
import { FiEye, FiEdit, FiToggleLeft, FiToggleRight } from 'react-icons/fi';


// --- Constantes de Layout ---
const ITEMS_PER_PAGE = 5; 
const ITEM_HEIGHT = 65; // Altura aproximada de cada item da lista em pixels (para calcular a altura fixa)


// --- Estilos da Lista (ATUALIZADO PARA ALTURA FIXA) ---
const listStyles = {
    // NOVO: Adicionamos minHeight para fixar o tamanho da área de itens
    listContainer: {
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        padding: "20px",
        marginTop: "20px",
        // Cálculo da altura mínima para 7 itens + preenchimento
        minHeight: `${ITEMS_PER_PAGE * ITEM_HEIGHT + 30}px`,
    } as React.CSSProperties,
    listItemBase: {
        padding: "15px 0",
        borderBottom: "1px solid #eee",
        transition: "background-color 0.3s",
    } as React.CSSProperties,
    lastItem: { borderBottom: "none" } as React.CSSProperties,
    title: { fontWeight: "600", color: "#333" } as React.CSSProperties,
    details: {
        color: "#777",
        fontSize: "14px",
        marginTop: '2px',
        marginRight: '15px', 
    } as React.CSSProperties,
    controlsContainer: (isMobile: boolean): React.CSSProperties => ({
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '20px',
        padding: '10px 20px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        gap: '20px',
    }),
    select: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        minWidth: '180px',
        fontSize: '14px',
        appearance: 'none',
        cursor: 'pointer',
    } as React.CSSProperties,
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px',
        justifyContent: 'flex-end',
    } as React.CSSProperties,
};

// --- Interfaces (Sem alteração) ---
interface Item {
  id: number | string;
  primaryText: string;
  secondaryText: string;
  isActive?: boolean; 
}

interface ListaPadraoProps {
  data: Item[];
  emptyMessage: string;
  onStatusChange: (itemId: number | string, newStatus: boolean) => void; 
}

// --- Componente de Botões de Ação (Ícones já atualizados) ---
const ActionButtons: React.FC<{ 
    item: Item, 
    isMobile: boolean, 
    onStatusChange: (itemId: number | string, newStatus: boolean) => void 
}> = ({ item, isMobile, onStatusChange }) => {
    
    const iconSize = isMobile ? 18 : 20;

    const iconStyle: React.CSSProperties = {
        padding: '8px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '5px',
        transition: 'background-color 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        border: '1px solid transparent'
    };

    // Ação de Ativação/Desativação é dinâmica
    const statusAction = item.isActive
        ? { 
            icon: <FiToggleLeft size={iconSize} />, 
            label: 'Desabilitar', 
            color: '#dc3545', 
            hoverBg: '#f8d7da', 
            handler: () => onStatusChange(item.id, false) 
        }
        : { 
            icon: <FiToggleRight size={iconSize} />, 
            label: 'Ativar', 
            color: '#28a745', 
            hoverBg: '#d4edda', 
            handler: () => onStatusChange(item.id, true) 
        };

    const staticActions = [
        { icon: <FiEye size={iconSize} />, label: 'Visualizar', color: '#6c757d', hoverBg: '#e2e6ea', handler: () => toast(`Visualizando ID: ${item.id}.`) },
        { icon: <FiEdit size={iconSize} />, label: 'Editar', color: '#007bff', hoverBg: '#cce5ff', handler: () => toast(`Editando ID: ${item.id}.`) },
    ];
    
    return (
        <div style={{ display: 'flex', gap: '5px', marginTop: isMobile ? '10px' : '0' }}>
            {[...staticActions, statusAction].map((action, index) => (
                <button
                    key={index}
                    title={action.label}
                    onClick={action.handler}
                    style={{ ...iconStyle, borderColor: action.color + '33' }}
                    onMouseOver={(e) => { 
                        e.currentTarget.style.backgroundColor = action.hoverBg;
                        e.currentTarget.style.color = action.color; 
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = action.color;
                    }}
                >
                    <span style={{ color: action.color }}>{action.icon}</span>
                </button>
            ))}
        </div>
    );
};


// --- Componente principal ListaPadrao ---
export default function ListaPadrao({ data, emptyMessage, onStatusChange }: ListaPadraoProps) {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'todos' | 'true' | 'false'>('todos');
  const [sortBy, setSortBy] = useState<'id' | 'nome'>('nome');
  
  // Usamos ITEMS_PER_PAGE de fora
  
  const processedData = useMemo(() => {
    // ... (lógica de filtro e ordenação inalterada) ...
    let result = [...data];

    if (filter !== 'todos') {
      const isFilteringActive = filter === 'true';
      result = result.filter(item => item.isActive === isFilteringActive);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'nome') {
        const nameA = a.primaryText.toUpperCase();
        const nameB = b.primaryText.toUpperCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      }
      return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
    });

    return result;
  }, [data, filter, sortBy]); 
  
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return processedData.slice(start, end);
  }, [processedData, currentPage]);
  
  if (processedData.length === 0 && data.length > 0) {
      return <p style={{ color: "#777", textAlign: "center", padding: "40px" }}>Nenhum registro encontrado com o filtro/ordenação atual.</p>;
  }
  if (data.length === 0) {
    return <p style={{ color: "#777", textAlign: "center", padding: "40px" }}>{emptyMessage}</p>;
  }

  const getItemContainerStyle = (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row", 
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center", 
    width: "100%",
  });

  return (
    <>
        {/* --- Controles de Filtro e Ordenação --- */}
        <div style={listStyles.controlsContainer(isMobile)}>
            {/* Filtro por Status */}
            <div>
                <label style={listStyles.details}>Filtrar por Status:</label>
                <select 
                    style={listStyles.select}
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value as 'todos' | 'true' | 'false');
                        setCurrentPage(1); 
                    }}
                >
                    <option value="todos">Todos</option>
                    <option value="true">Ativos</option>
                    <option value="false">Inativos</option>
                </select>
            </div>
            
            {/* Ordenação */}
            <div>
                <label style={listStyles.details}>Ordenar por:</label>
                <select 
                    style={listStyles.select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'id' | 'nome')}
                >
                    <option value="nome">Nome (A-Z)</option>
                    <option value="id">ID</option>
                </select>
            </div>
        </div>

        {/* --- Lista de Registros --- */}
        <div style={listStyles.listContainer}>
            {paginatedData.map((item, index) => (
                <div 
                    key={item.id} 
                    style={{ ...listStyles.listItemBase, ...(index === paginatedData.length - 1 ? listStyles.lastItem : {}) }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FDF6F8")} 
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    <div style={getItemContainerStyle(isMobile)}>
                        {/* Bloco de Textos */}
                        <div> 
                            <div style={listStyles.title}>{item.primaryText}</div>
                            {/* CORREÇÃO: Removendo o Status explícito, mantendo apenas o secondaryText */}
                            <div style={{...listStyles.details, color: item.isActive ? '#28a745' : '#dc3545'}}>
                                {item.secondaryText}
                            </div>
                        </div>
                        
                        {/* Botões de Ação (Com ícones profissionais) */}
                        <ActionButtons 
                            item={item} 
                            isMobile={isMobile} 
                            onStatusChange={onStatusChange}
                        />
                    </div>
                </div>
            ))}
        </div>
        
        {/* --- Paginação --- */}
        {totalPages > 1 && (
            <div style={listStyles.paginationContainer}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ ...listStyles.select, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', minWidth: 'auto' }}
                >
                    Anterior
                </button>
                <span style={listStyles.details}>
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ ...listStyles.select, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', minWidth: 'auto' }}
                >
                    Próxima
                </button>
            </div>
        )}
    </>
  );
}