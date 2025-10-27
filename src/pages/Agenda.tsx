import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Menu from "../components/Menu";

// --- Configuração de localização (pt-BR) ---
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// --- Cores e estilos (mantendo o padrão da outra tela) ---
const ACCENT_COLOR = "#F08080";
const BORDER_COLOR = "#eee";
const DARK_TEXT = "#333";

// --- Tipagem de evento ---
interface Appointment extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  client?: string;
  service?: string;
}

export default function Agenda() {
  const [events, setEvents] = useState<Appointment[]>([
    {
      id: 1,
      title: "Massagem Relaxante - Ana Souza",
      start: new Date(2025, 9, 27, 10, 0),
      end: new Date(2025, 9, 27, 11, 0),
      client: "Ana Souza",
      service: "Massagem Relaxante",
    },
    {
      id: 2,
      title: "Depilação a Laser - Carlos Ferreira",
      start: new Date(2025, 9, 27, 14, 0),
      end: new Date(2025, 9, 27, 15, 0),
      client: "Carlos Ferreira",
      service: "Depilação a Laser",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Appointment>>({});

  // --- Adicionar evento ---
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({ start, end });
    setIsModalOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const client = formData.get("client") as string;
    const service = formData.get("service") as string;
    const title = `${service} - ${client}`;

    setEvents([
      ...events,
      {
        id: Date.now(),
        title,
        client,
        service,
        start: newEvent.start!,
        end: newEvent.end!,
      },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#FDFDFD" }}>
      <Menu />
      <div style={{ flex: 1, padding: "30px" }}>
        <h1 style={{ color: DARK_TEXT, marginBottom: "25px", fontSize: "28px", fontWeight: 700 }}>
          Agenda da Clínica
        </h1>
        <p style={{ marginBottom: 20, color: "#666" }}>
          Aqui você pode visualizar e cadastrar novos agendamentos.
        </p>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
<Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  defaultView="week" // Aqui você muda para "week" ou "day"
  views={["month", "week", "day"]} // Permite trocar entre mês, semana e dia
  step={30} // Intervalo de tempo das células, em minutos
  timeslots={2} // Quantas divisões por step
  style={{ height: "80vh" }}
  messages={{
    today: "Hoje",
    previous: "Anterior",
    next: "Próximo",
    month: "Mês",
    week: "Semana",
    day: "Dia",
  }}
  eventPropGetter={() => ({
    style: {
      backgroundColor: ACCENT_COLOR,
      color: "white",
      borderRadius: "4px",
      border: "none",
      padding: "2px 6px",
      fontSize: "12px",
    },
  })}
/>

        </div>

        {/* --- Modal de novo agendamento --- */}
        {isModalOpen && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2>Novo Agendamento</h2>
              <form onSubmit={handleAddEvent}>
                <input
                  name="client"
                  placeholder="Nome do cliente"
                  style={inputStyle}
                  required
                />
                <input
                  name="service"
                  placeholder="Serviço"
                  style={inputStyle}
                  required
                />
                <div style={{ marginTop: 15, textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={actionBtn("#dc3545")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" style={actionBtn("#28a745")}>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Estilos reutilizáveis ---
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox: React.CSSProperties = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "100%",
  maxWidth: "400px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: `1px solid #eee`,
};

const actionBtn = (color: string): React.CSSProperties => ({
  padding: "8px 15px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: color,
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  marginLeft: "8px",
});
