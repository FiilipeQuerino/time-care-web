import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface FormularioClienteProps {
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
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    backgroundColor: 'white',
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

// Hook simples para formatar telefone (opcional, mas melhora a UX)
const usePhoneFormat = (initialValue = "") => {
    const [value, setValue] = useState(initialValue);
    
    const formatPhone = (input: string) => {
        // Remove tudo que não for dígito
        let digits = input.replace(/\D/g, '');
        
        // Aplica a formatação (xx) xxxxx-xxxx
        if (digits.length > 0) {
            digits = digits.replace(/^(\d{2})/, '($1) ');
            digits = digits.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        
        return digits.substring(0, 15); // Limita ao tamanho máximo de telefone com ddd e 9 dígitos
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(formatPhone(e.target.value));
    };

    return { value, handleChange, rawValue: value.replace(/\D/g, '') };
};


export const FormularioCliente: React.FC<FormularioClienteProps> = ({ onClose, onSubmit }) => {
  const [nome, setNome] = useState('');
  const phoneInput = usePhoneFormat();
  const [email, setEmail] = useState('');
  const [sexo, setSexo] = useState(''); // 'Masculino', 'Feminino', 'Outro', ou vazio
  const [observacao, setObservacao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || phoneInput.rawValue.length < 10) {
        toast.error('O Nome e o Telefone são campos obrigatórios.');
        return;
    }

    const data = {
      nome,
      telefone: phoneInput.rawValue,
      email: email || null,
      sexo: sexo || null,
      observacao: observacao || null,
    };
    
    onSubmit(data);
  };

  return (
    <div style={formStyles.overlay} onClick={onClose}>
      <div style={formStyles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: '#F08080', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            Cadastrar Novo Cliente
        </h2>
        <form onSubmit={handleSubmit}>
          
          {/* Campo Nome (Obrigatório) */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Nome do Cliente <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={formStyles.input}
              placeholder="Ex: Maria Luiza"
              required
            />
          </div>

          {/* Campo Telefone (Obrigatório, com formatação) */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Telefone <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              value={phoneInput.value}
              onChange={phoneInput.handleChange}
              style={formStyles.input}
              placeholder="(00) 00000-0000"
              required
              maxLength={15}
            />
          </div>

          {/* Campo Email (Opcional) */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={formStyles.input}
              placeholder="email@exemplo.com"
            />
          </div>

          {/* Campo Sexo (Opcional) */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Gênero</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              style={formStyles.select}
            >
              <option value="">-- Não Informar --</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Campo Observação (Opcional) */}
          <div style={formStyles.inputGroup}>
            <label style={formStyles.label}>Observação</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              style={{ ...formStyles.input, height: '80px' }}
              placeholder="Ex: Cliente só pode ser atendido após as 18h; Alergia a produtos específicos."
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
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};