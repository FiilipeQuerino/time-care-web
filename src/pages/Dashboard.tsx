import Menu from "../components/Menu";
import { useIsMobile } from "../hooks/useIsMobile";
import { FiCalendar, FiDollarSign, FiUsers, FiClock, FiAlertTriangle } from "react-icons/fi";
import { IconContext } from "react-icons";

const ACCENT_COLOR = "#F08080";
const DARK_TEXT = "#333";
const SECONDARY_TEXT = "#777";
const BORDER_COLOR = "#eee";
const ALERT_COLOR = "#ffc107";
const DANGER_COLOR = "#dc3545";

const dataClientesPorDia = {
  labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  datasets: [
    {
      label: "Clientes Agendados",
      data: [3, 0, 10, 5, 8, 4],
      backgroundColor: ACCENT_COLOR,
      borderRadius: 4,
    },
  ],
};

const proximosAtendimentos = [
  { id: 1, hora: "10:00", cliente: "Ana Silva", servico: "Corte e Hidratação" },
  { id: 2, hora: "11:30", cliente: "Bruno Costa", servico: "Coloração" },
  { id: 3, hora: "14:00", cliente: "Carla Matos", servico: "Manicure" },
];

const alertas = [
  { id: 1, mensagem: "3 agendamentos para hoje não confirmados.", tipo: "Atenção", cor: DANGER_COLOR },
  { id: 2, mensagem: "5 clientes de ontem que não pagaram/finalizaram.", tipo: "Pendente", cor: ALERT_COLOR },
  { id: 3, mensagem: "A meta de receita do mês está 15% abaixo do esperado.", tipo: "Atenção", cor: ALERT_COLOR },
  { id: 4, mensagem: "2 clientes VIPs não agendam há 30 dias.", tipo: "Ação Imediata", cor: DANGER_COLOR },
  { id: 5, mensagem: "Estoque de produto X está baixo (faltam 5 dias).", tipo: "Estoque", cor: ALERT_COLOR },
];

const pageStyles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
    flexDirection: isMobile ? "column" : "row",
    minWidth: 0,
    overflow: "hidden",
  }),

  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
    overflowY: "auto",
  }),

  title: {
    color: DARK_TEXT,
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,

  cardsGrid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  }),

  card: (color: string): React.CSSProperties => ({
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    borderLeft: `5px solid ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "transform 0.2s, box-shadow 0.2s",
  }),

  cardText: {
    color: DARK_TEXT,
    fontWeight: "700",
    fontSize: "22px",
  } as React.CSSProperties,

  cardSubtitle: {
    color: SECONDARY_TEXT,
    fontSize: "14px",
    marginBottom: "5px",
  } as React.CSSProperties,

  iconCircle: (color: string): React.CSSProperties => ({
    padding: "12px",
    borderRadius: "50%",
    backgroundColor: `${color}1A`,
    color: color,
  }),

  bottomGrid: (isMobile: boolean): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  }),

  box: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  } as React.CSSProperties,

  boxTitle: {
    color: DARK_TEXT,
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: `1px solid ${BORDER_COLOR}`,
  } as React.CSSProperties,

  listItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "8px 0",
    borderBottom: `1px dashed ${BORDER_COLOR}`,
  } as React.CSSProperties,

  alertItem: (color: string): React.CSSProperties => ({
    ...pageStyles.listItem,
    backgroundColor: `${color}10`,
    borderLeft: `3px solid ${color}`,
    padding: "10px",
    borderRadius: "5px",
    borderBottom: 'none',
  })
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div
    style={pageStyles.card(color)}
    onMouseEnter={(e) =>
    ((e.currentTarget.style.transform = "translateY(-4px)"),
      (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"))
    }
    onMouseLeave={(e) =>
    ((e.currentTarget.style.transform = "translateY(0)"),
      (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)"))
    }
  >
    <div>
      <div style={pageStyles.cardSubtitle}>{title}</div>
      <div style={pageStyles.cardText}>{value}</div>
    </div>

    <div style={pageStyles.iconCircle(color)}>
      <IconContext.Provider value={{ size: "24px" }}>{icon}</IconContext.Provider>
    </div>
  </div>
);

const NextAppointmentsList: React.FC = () => (
  <div style={pageStyles.box}>
    <h3 style={pageStyles.boxTitle}><FiClock style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Próximos Atendimentos (Hoje)</h3>
    {proximosAtendimentos.map((item) => (
      <div key={item.id} style={pageStyles.listItem}>
        <div style={{ marginRight: '15px', fontWeight: 'bold', color: ACCENT_COLOR }}>{item.hora}</div>
        <div>
          <div style={{ color: DARK_TEXT, fontWeight: '500' }}>{item.cliente}</div>
          <div style={{ color: SECONDARY_TEXT, fontSize: '12px' }}>{item.servico}</div>
        </div>
      </div>
    ))}
    {proximosAtendimentos.length === 0 && (
      <div style={{ color: SECONDARY_TEXT }}>Nenhum atendimento agendado para o dia.</div>
    )}
  </div>
);

const AlertsList: React.FC = () => (
  <div style={pageStyles.box}>
    <h3 style={pageStyles.boxTitle}><FiAlertTriangle style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Alertas e Pendências</h3>
    <div style={{ display: 'grid', gap: '10px' }}>
      {alertas.map((alerta) => (
        <div key={alerta.id} style={pageStyles.alertItem(alerta.cor)}>
          <div style={{ color: alerta.cor, marginRight: '10px' }}>
            <IconContext.Provider value={{ size: "18px" }}>
              <FiAlertTriangle />
            </IconContext.Provider>
          </div>
          <div>
            <div style={{ color: DARK_TEXT, fontWeight: '500', fontSize: '14px' }}>{alerta.mensagem}</div>
            <div style={{ color: alerta.cor, fontSize: '12px', fontWeight: 'bold' }}>{alerta.tipo}</div>
          </div>
        </div>
      ))}
      {alertas.length === 0 && (
        <div style={{ color: SECONDARY_TEXT }}>Tudo certo! Nenhuma pendência ou alerta.</div>
      )}
    </div>
  </div>
);

const WeeklyClientSummary: React.FC = () => {
  const days = dataClientesPorDia.labels;
  const counts = dataClientesPorDia.datasets[0].data;

  return (
    <div style={{ ...pageStyles.box, minHeight: '300px' }}>
      <h3 style={pageStyles.boxTitle}>Total de Clientes por Dia</h3>

      <div style={{ display: 'grid', gap: '10px' }}>
        {days.map((day, index) => (
          <div
            key={day}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: index < days.length - 1 ? `1px dashed ${BORDER_COLOR}` : 'none'
            }}
          >
            <div style={{ fontWeight: '600', color: DARK_TEXT }}>
              {day}
            </div>

            {/* Contagem de Clientes */}
            <div
              style={{
                fontWeight: '700',
                fontSize: '18px',
                color: counts[index] > 0 ? ACCENT_COLOR : SECONDARY_TEXT,
                backgroundColor: counts[index] >= 8 ? `${ACCENT_COLOR}20` : 'transparent',
                padding: '4px 10px',
                borderRadius: '4px',
              }}
            >
              {counts[index]} Clientes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const isMobile = useIsMobile();

  const summaryCards: StatCardProps[] = [
    { title: "Agendamentos Hoje", value: "12", icon: <FiCalendar />, color: ACCENT_COLOR },
    { title: "Receita (Mês)", value: "R$ 15.800", icon: <FiDollarSign />, color: "#28a745" },
    { title: "Próxima Semana", value: "35 Clientes", icon: <FiUsers />, color: "#007bff" },
  ];

  return (
    <div style={pageStyles.container(isMobile)}>
      <Menu />

      <div style={pageStyles.content(isMobile)}>
        <h1 style={pageStyles.title}>Dashboard</h1>

        <div style={pageStyles.cardsGrid(isMobile)}>
          {summaryCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <div style={pageStyles.bottomGrid(isMobile)}>
          <WeeklyClientSummary />

          <NextAppointmentsList />

          <AlertsList />
        </div>

      </div>
    </div>
  );
}