import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Servicos from "./pages/Servicos";
import Clientes from "./pages/Clientes";
import Agenda from "./pages/Agenda";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import { Toaster } from "react-hot-toast";
import Financas from "./pages/Financas";

function App() {
  return (
    <BrowserRouter>
      <Toaster 
          position="top-right" // Onde as notificações vão aparecer
          reverseOrder={false}
        />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/financas" element={<Financas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;