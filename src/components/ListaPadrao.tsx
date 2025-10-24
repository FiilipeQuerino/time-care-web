import React from "react";
import { useIsMobile } from "../hooks/useIsMobile"; // Importe o hook

// Estilos da Lista (A maioria permanece a mesma)
const listStyles = {
  listContainer: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    padding: "20px",
    marginTop: "20px",
  } as React.CSSProperties,

  // Estilo base da linha do item
  listItemBase: {
    padding: "15px 0",
    borderBottom: "1px solid #eee",
    transition: "background-color 0.3s",
  } as React.CSSProperties,

  // Estilo para a última linha da lista
  lastItem: {
    borderBottom: "none",
  } as React.CSSProperties,

  title: {
    fontWeight: "600",
    color: "#333",
  } as React.CSSProperties,

  details: {
    color: "#777",
    fontSize: "14px",
    marginTop: '2px',
    // Adicionando um espaço à direita para evitar que o texto encoste no botão no desktop
    marginRight: '15px', 
  } as React.CSSProperties,

  actionButton: (isMobile: boolean): React.CSSProperties => ({
    backgroundColor: "#F9DDE4",
    color: "#F08080",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    // Em mobile, ocupa toda a largura e tem margem no topo
    width: isMobile ? "100%" : "auto", 
    marginTop: isMobile ? "10px" : "0",
  }),
};

interface Item {
  id: number | string;
  primaryText: string;
  secondaryText: string;
}

interface ListaPadraoProps {
  data: Item[];
  onActionClick: (id: number | string) => void;
  actionLabel: string;
  emptyMessage: string;
}

export default function ListaPadrao({ data, onActionClick, actionLabel, emptyMessage }: ListaPadraoProps) {
  const isMobile = useIsMobile(); // <<< Uso do Hook de Responsividade
  
  if (data.length === 0) {
    return <p style={{ color: "#777", textAlign: "center", padding: "40px" }}>{emptyMessage}</p>;
  }

  // Estilo do container interno do item (Textos + Botão)
  const getItemContainerStyle = (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    // Desktop: texto e botão lado a lado. Mobile: itens empilhados.
    flexDirection: isMobile ? "column" : "row", 
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center", // Alinha ao topo em mobile
    width: "100%",
  });

  return (
    <div style={listStyles.listContainer}>
      {data.map((item, index) => (
        <div 
          key={item.id} 
          style={{ ...listStyles.listItemBase, ...(index === data.length - 1 ? listStyles.lastItem : {}) }}
          // Efeito visual ao passar o mouse
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FDF6F8")} 
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div style={getItemContainerStyle(isMobile)}>
            {/* Bloco de Textos (sempre vertical) */}
            <div> 
              <div style={listStyles.title}>{item.primaryText}</div>
              <div style={listStyles.details}>{item.secondaryText}</div>
            </div>
            
            {/* Botão de Ação */}
            <button 
              style={listStyles.actionButton(isMobile)}
              onClick={() => onActionClick(item.id)}
              // Adicionando hover no botão
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FCE7EB")} 
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F9DDE4")}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}