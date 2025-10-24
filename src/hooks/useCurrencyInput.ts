import { useState } from 'react';

// Hook para gerenciar e formatar input de moeda
export const useCurrencyInput = (initialValue = "") => {
  const [rawValue, setRawValue] = useState(initialValue);
  const [formattedValue, setFormattedValue] = useState(initialValue);

  const formatCurrency = (value: string) => {
    // 1. Remove tudo que não for dígito (e vírgula)
    let digits = value.replace(/\D/g, ""); 

    if (!digits) {
      setRawValue("");
      setFormattedValue("");
      return;
    }

    // 2. Transforma para centavos (ex: "5035" de 50,35)
    let cents = parseInt(digits, 10);
    
    // 3. Converte para o formato R$ X.XXX,XX
    let formatted = (cents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    setRawValue(cents.toString());
    setFormattedValue(formatted);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formatCurrency(e.target.value);
  };

  return { formattedValue, rawValue, handleChange };
};