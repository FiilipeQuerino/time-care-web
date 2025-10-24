import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
// Importe o novo hook que criamos
import { useIsMobile } from "../hooks/useIsMobile"; 

// --- Estilos de Menu ---
// ... (Seus estilos menuStyles permanecem os mesmos) ...
const menuStyles = {
  // Container principal do Menu
  navBase: {
    padding: "1.5rem 1rem",
    backgroundColor: "white",
    // Removendo minHeight: "100vh" daqui para controlar melhor na lógica abaixo
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.05)",
    flexShrink: 0,
    position: "relative",
    transition: "transform 0.3s ease-in-out, width 0.3s ease-in-out",
  } as React.CSSProperties,

  // Estilo para o Toggle (Botão Hambúrguer) - VISÍVEL APENAS EM MOBILE
  menuToggle: {
    display: "none", 
    position: "fixed",
    top: "15px",
    left: "15px",
    zIndex: 1000,
    backgroundColor: "#F08080",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    transition: "left 0.3s ease-in-out, background-color 0.3s",
  } as React.CSSProperties,
  
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#F08080",
    marginBottom: "2rem",
    textAlign: "center",
  } as React.CSSProperties,

  ul: { listStyle: "none", padding: 0, margin: 0, } as React.CSSProperties,
  li: { marginBottom: "0.5rem", } as React.CSSProperties,
  linkBase: {
    display: "block",
    padding: "12px 15px",
    textDecoration: "none",
    color: "#555",
    borderRadius: "8px",
    transition: "background-color 0.3s, color 0.3s",
    fontSize: "16px",
    fontWeight: "500",
  } as React.CSSProperties,
};

// ... (getLinkStyle permanece o mesmo) ...
const getLinkStyle = (path: string, currentPath: string): React.CSSProperties => {
  const isActive = currentPath === path;
  return {
    ...menuStyles.linkBase,
    backgroundColor: isActive ? "#FCE7EB" : "transparent",
    color: isActive ? "#F08080" : "#555",
    fontWeight: isActive ? "600" : "500",
  };
};

// Largura fixa do menu
const MENU_WIDTH = "220px";

export default function Menu() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // *** Usa o Hook Dinâmico Aqui ***
  const isMobile = useIsMobile();
  
  const currentPath = location.pathname;

  // Lógica para o estilo do NAV
  let navStyle: React.CSSProperties = { ...menuStyles.navBase };
  
  if (isMobile) {
    // Mobile (Off-Canvas)
    navStyle = {
      ...navStyle,
      width: MENU_WIDTH, 
      height: "100%", 
      minHeight: "100vh", // Garante que ocupe a altura da tela
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 999,
      transform: isOpen ? "translateX(0)" : "translateX(-100%)", 
      boxShadow: isOpen ? "2px 0 5px rgba(0, 0, 0, 0.3)" : "none",
    };
  } else {
    // Desktop (Sidebar Fixo)
    navStyle = {
        ...navStyle,
        width: MENU_WIDTH,
        minHeight: "100vh",
        position: "sticky", // Mantém o menu na tela ao rolar
        top: 0,
    };
  }

  // Fecha o menu após clicar em um link (em mobile)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  // Se estiver no desktop, garante que não há transformação 'translateX'
  // e o menu está sempre 'aberto' (pois não usamos o toggle)
  if (!isMobile) {
      navStyle.transform = 'none';
  }

  return (
    <>
      {/* 1. Botão Hambúrguer (Visível apenas em mobile) */}
      {isMobile && (
        <button 
          style={{ 
            ...menuStyles.menuToggle, 
            display: "block",
            // A posição do X em relação ao menu aberto (Largura do menu + 15px)
            left: isOpen ? `calc(${MENU_WIDTH} + 15px)` : "15px", 
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* 2. Overlay escuro quando o menu está aberto em mobile */}
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 998,
          }}
        />
      )}

      {/* 3. O Próprio Menu */}
      {/* No desktop, o menu é sempre renderizado e o conteúdo se ajusta ao lado.
          No mobile, ele só é 'visível' através do transform: translateX. */}
      <nav style={navStyle}>
        <h3 style={menuStyles.logo}>TimeCare</h3>
        <ul style={menuStyles.ul}>
          <li style={menuStyles.li}>
            <Link to="/dashboard" style={getLinkStyle("/dashboard", currentPath)} onClick={handleLinkClick}>
              Dashboard
            </Link>
          </li>
          {/* ... Repita para os demais links ... */}
          <li style={menuStyles.li}>
            <Link to="/agenda" style={getLinkStyle("/agenda", currentPath)} onClick={handleLinkClick}>
              Agenda
            </Link>
          </li>
          <li style={menuStyles.li}>
            <Link to="/clientes" style={getLinkStyle("/clientes", currentPath)} onClick={handleLinkClick}>
              Clientes
            </Link>
          </li>
          <li style={menuStyles.li}>
            <Link to="/servicos" style={getLinkStyle("/servicos", currentPath)} onClick={handleLinkClick}>
              Serviços
            </Link>
          </li>
          <li style={menuStyles.li}>
            <Link to="/relatorios" style={getLinkStyle("/relatorios", currentPath)} onClick={handleLinkClick}>
              Relatórios
            </Link>
          </li>
          <li style={menuStyles.li}>
            <Link to="/configuracoes" style={getLinkStyle("/configuracoes", currentPath)} onClick={handleLinkClick}>
              Configurações
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}