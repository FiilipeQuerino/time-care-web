import { useState, useEffect } from 'react';

// Define o breakpoint para mobile (padrão 768px)
const MOBILE_BREAKPOINT = 768;

export const useIsMobile = (breakpoint = MOBILE_BREAKPOINT) => {
  // 1. Estado para armazenar se é mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    // 2. Função que verifica e atualiza o estado
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // 3. Adiciona o listener de evento para o redimensionamento
    window.addEventListener('resize', handleResize);

    // 4. Cleanup: Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]); // O array de dependências garante que o efeito só rode se o breakpoint mudar

  return isMobile;
};