import React, { useState } from 'react';
import { useCurrencyInput } from '../hooks/useCurrencyInput'; // Importe o hook de moeda
import toast from 'react-hot-toast';

interface FormularioServicoProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Estilos de Formulário (Modal)
const formStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
  } as React.CSSProperties,
  inputGroup: {
    marginBottom: '15px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    color: '#555',
    fontSize: '14px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  buttonPrimary: {
    backgroundColor: '#F08080',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    marginRight: '10px',
  } as React.CSSProperties,
};

export const FormularioServico: React.FC<FormularioServicoProps> = ({ onClose, onSubmit }) => {
  const [nome, setNome] = useState('');
  const currencyInput = useCurrencyInput();
  const [duracao, setDuracao] = useState('60'); // Padrão 60 minutos
  const [observacao, setObservacao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || currencyInput.rawValue === '0') {
        toast.error('Preencha o Nome e o Valor do Serviço.');
        return;
    }

    const data = {
      nome,
      valorCentavos: currencyInput.rawValue, // Valor em centavos para salvar no backend
      valorFormatado: currencyInput.formattedValue,
      duracaoMinutos: duracao,
      observacao,
    };
    
    onSubmit(data);
  };

  return (
    <div style={formStyles.overlay} onClick={onClose}>
      <div style={formStyles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: '#F08080', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            Cadastrar Novo Serviço
        </h2>
        <form onSubmit={handleSubmit}>
          
          {/* Campo Nome */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Nome do Serviço</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={formStyles.input}
              placeholder="Ex: Massagem Terapêutica"
              required
            />
          </div>

          {/* Campo Valor */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Valor (R$)</label>
            <input
              type="text"
              value={currencyInput.formattedValue}
              onChange={currencyInput.handleChange}
              style={formStyles.input}
              placeholder="R$ 0,00"
              required
            />
          </div>

          {/* Campo Duração */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Duração (Minutos)</label>
            <select
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              style={formStyles.input}
            >
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1 hora e 30 minutos</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          {/* Campo Observação */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Observação</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              style={{ ...formStyles.input, height: '80px' }}
              placeholder="Notas importantes sobre o serviço ou equipamentos necessários."
            />
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ ...formStyles.buttonPrimary, backgroundColor: '#ccc' }}>
              Cancelar
            </button>
            <button 
                type="submit" 
                style={formStyles.buttonPrimary}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E96464")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F08080")}
            >
              Cadastrar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};