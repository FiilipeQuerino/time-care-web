import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
// Importando IconContext e os ícones necessários do Feather Icons (Fi)
import { IconContext } from 'react-icons';
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiDollarSign,
  FiTool, // Usado para Serviços
  FiBarChart2 // Usado para Relatórios
} from 'react-icons/fi';


// --- Definição dos Dados de Navegação (Links e Ícones) ---
const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: FiGrid },
  { name: "Agenda", path: "/agenda", icon: FiCalendar },
  { name: "Clientes", path: "/clientes", icon: FiUsers },
  { name: "Serviços", path: "/servicos", icon: FiTool },
  { name: "Relatórios", path: "/relatorios", icon: FiBarChart2 },
  { name: "Finanças", path: "/financas", icon: FiDollarSign },
  { name: "Configurações", path: "/configuracoes", icon: FiSettings },
];

const ACCENT_COLOR = "#F08080";

// --- Estilos de Menu ---
const menuStyles = {
  navBase: {
    padding: "1.5rem 1rem",
    backgroundColor: "white",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.05)",
    flexShrink: 0,
    position: "relative",
    transition: "transform 0.3s ease-in-out, width 0.3s ease-in-out",
  } as React.CSSProperties,

  menuToggle: {
    display: "none",
    position: "fixed",
    top: "15px",
    left: "15px",
    zIndex: 1000,
    backgroundColor: ACCENT_COLOR,
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
    color: ACCENT_COLOR,
    marginBottom: "2rem",
    textAlign: "center",
  } as React.CSSProperties,

  ul: { listStyle: "none", padding: 0, margin: 0, } as React.CSSProperties,
  li: { marginBottom: "0.5rem", } as React.CSSProperties,

  // NOVO: Estilo para o link que agora é um flexbox
  linkBase: {
    display: "flex", // Adiciona Flexbox
    alignItems: "center", // Centraliza o ícone e o texto verticalmente
    padding: "12px 15px",
    textDecoration: "none",
    color: "#555",
    borderRadius: "8px",
    transition: "background-color 0.3s, color 0.3s",
    fontSize: "16px",
    fontWeight: "500",
  } as React.CSSProperties,
  // NOVO: Estilo para o contêiner do ícone
  iconContainer: {
    marginRight: '12px',
    display: 'flex', // Garante que o ícone fique centralizado no seu próprio contêiner
    alignItems: 'center',
  } as React.CSSProperties
};

// --- Função de Estilo de Link Atualizada ---
const getLinkStyle = (path: string, currentPath: string): React.CSSProperties => {
  const isActive = currentPath === path;
  return {
    ...menuStyles.linkBase,
    backgroundColor: isActive ? "#FCE7EB" : "transparent",
    color: isActive ? ACCENT_COLOR : "#555",
    fontWeight: isActive ? "600" : "500",
  };
};

// Largura fixa do menu
const MENU_WIDTH = "220px";

export default function Menu() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentPath = location.pathname;

  // Lógica para o estilo do NAV (MANTIDA IGUAL)
  let navStyle: React.CSSProperties = { ...menuStyles.navBase };

  if (isMobile) {
    // Mobile (Off-Canvas)
    navStyle = {
      ...navStyle,
      width: MENU_WIDTH,
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
      position: "sticky",
      top: 0,
    };
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!isMobile) {
    navStyle.transform = 'none';
  }

  return (
    <>
      {/* 1. Botão Hambúrguer e 2. Overlay (MANTIDOS IGUAIS) */}
      {isMobile && (
        <button
          style={{
            ...menuStyles.menuToggle,
            display: "block",
            left: isOpen ? `calc(${MENU_WIDTH} + 15px)` : "15px",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      )}

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
      <nav style={navStyle}>
        <h3 style={menuStyles.logo}>TimeCare</h3>
        <ul style={menuStyles.ul}>
          {/* NOVO: Mapeamento dos Links */}
          <IconContext.Provider value={{ size: "18px" }}>
            {navigation.map((item) => {
              const ItemIcon = item.icon; // Componente do ícone
              const isActive = item.path === currentPath;
              const linkStyle = getLinkStyle(item.path, currentPath);

              // Cor do ícone
              const iconColor = isActive ? ACCENT_COLOR : '#999';

              return (
                <li key={item.path} style={menuStyles.li}>
                  <Link to={item.path} style={linkStyle} onClick={handleLinkClick}>
                    <div style={{ ...menuStyles.iconContainer, color: iconColor }}>
                      <ItemIcon />
                    </div>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </IconContext.Provider>
        </ul>
      </nav>
    </>
  );
}