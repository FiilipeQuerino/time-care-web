import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import React from "react";
import toast from "react-hot-toast";
// Importando ícone de cadeado para dar um toque visual
import { FiLock, FiMail } from 'react-icons/fi';

// Cor principal para destaque
const ACCENT_COLOR = "#F08080";
const HOVER_COLOR = "#E96464";

// Estilos baseados na sua landing page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#FCE7EB", // Fundo levemente rosado
    padding: "20px",
  } as React.CSSProperties,

  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)", // Sombra mais proeminente
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    transition: 'all 0.4s ease-out', // Transição suave para o card
  } as React.CSSProperties,

  logoContainer: {
    // Exemplo de um círculo com a inicial 'TC' (TimeCare)
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: ACCENT_COLOR,
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '20px',
  } as React.CSSProperties,

  title: {
    color: "#333",
    marginBottom: "5px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,

  subtitle: {
    color: "#777",
    marginBottom: "30px",
    fontSize: "14px",
  } as React.CSSProperties,

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  } as React.CSSProperties,

  // Novo estilo para agrupar ícone e input
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  } as React.CSSProperties,

  // Estado de foco/hover para input
  inputFocus: {
    borderColor: ACCENT_COLOR,
    boxShadow: `0 0 0 3px ${ACCENT_COLOR}33`,
  } as React.CSSProperties,

  iconStyle: {
    color: '#999',
    padding: '0 10px',
  } as React.CSSProperties,

  input: {
    padding: "12px 10px",
    border: "none",
    borderRadius: "0 8px 8px 0",
    flex: 1,
    fontSize: "16px",
    outline: 'none',
  } as React.CSSProperties,

  button: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: ACCENT_COLOR,
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.1s",
    marginTop: "10px",
  } as React.CSSProperties,

  forgotPassword: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#777',
    textDecoration: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
};

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [isUserFocused, setIsUserFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  // Ref para o formulário para melhor manipulação do DOM (opcional, mas bom para transições)
  const formRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação: Transição de "Shake" no erro
    if (formRef.current) {
      formRef.current.classList.remove('shake');
      // Gatilho para iniciar a transição
      formRef.current.offsetWidth;
    }


    // Lógica de autenticação
    if (user === "admin" && pass === "123") {
      // 1. Notificação de sucesso
      toast.success("Login realizado com sucesso! Redirecionando...", {
        duration: 1500,
      });
      setTimeout(() => navigate("/dashboard"), 300);

    } else {
      // 2. Notificação de erro
      toast.error("Usuário ou senha inválidos. Tente novamente.");
      if (formRef.current) {
        formRef.current.classList.add('shake');
      }
    }
  };

  // Estilo dinâmico para os campos
  const getUserStyle = () => ({
    ...styles.inputGroup,
    ...(isUserFocused ? styles.inputFocus : {}),
  });
  const getPassStyle = () => ({
    ...styles.inputGroup,
    ...(isPassFocused ? styles.inputFocus : {}),
  });


  return (
    <div style={styles.container}>
      <div style={styles.card} ref={formRef}>
        {/* LOGO */}
        <div style={styles.logoContainer}>
          TC
        </div>

        <h2 style={styles.title}>Bem-vindo(a)</h2>
        <p style={styles.subtitle}>Faça login para acessar o painel de gerenciamento.</p>

        <form onSubmit={handleLogin} style={styles.form}>

          {/* Campo Usuário/Email */}
          <div style={getUserStyle()}>
            <FiMail style={styles.iconStyle} size={20} />
            <input
              type="text"
              placeholder="E-mail ou Usuário"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setIsUserFocused(true)}
              onBlur={() => setIsUserFocused(false)}
              style={styles.input}
              required
            />
          </div>

          {/* Campo Senha */}
          <div style={getPassStyle()}>
            <FiLock style={styles.iconStyle} size={20} />
            <input
              type="password"
              placeholder="Senha"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onFocus={() => setIsPassFocused(true)}
              onBlur={() => setIsPassFocused(false)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = HOVER_COLOR)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = ACCENT_COLOR)}
          >
            Entrar
          </button>
        </form>

        {/* Opção de Recuperação de Senha */}
        <a
          href="#"
          style={styles.forgotPassword}
          onClick={(e) => { e.preventDefault(); toast("Em desenvolvimento: Em breve você poderá redefinir sua senha.", { icon: '🔑' }); }}
        >
          Esqueceu a senha?
        </a>
      </div>
    </div>
  );
}