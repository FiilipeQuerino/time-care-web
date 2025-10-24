import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import toast from "react-hot-toast";

// Estilos baseados na sua landing page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#FCE7EB", // Fundo levemente rosado
    padding: "20px",
  } as React.CSSProperties, // Cast para React.CSSProperties

  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  } as React.CSSProperties,

  title: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600",
  } as React.CSSProperties,

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  } as React.CSSProperties,

  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    transition: "border-color 0.3s",
  } as React.CSSProperties,

  button: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#F08080", // Salmão mais forte para o botão
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  } as React.CSSProperties,
};

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica de autenticação
    if (user === "admin" && pass === "123") {
      // 1. Notificação de sucesso
      toast.success("Login realizado com sucesso! Redirecionando...", {
        duration: 1500, // Mostra por 1.5 segundos
      });
      // Atraso de 200ms para a notificação aparecer antes do redirect
      setTimeout(() => navigate("/dashboard"), 200); 
      
    } else {
      // 2. Notificação de erro
      toast.error("Usuário ou senha inválidos. Tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bem-vindo(a) ao TimeCare</h2> {/* Exemplo de nome */}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={styles.input}
          />
          <button 
            type="submit" 
            style={styles.button}
            // Adicionando um hover básico com onMouseOver/onMouseOut
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E96464")} 
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F08080")}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}