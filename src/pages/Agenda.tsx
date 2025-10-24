import Menu from "../components/Menu";

export default function Agenda() {
  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Agenda</h1>
        <p>Aqui você pode visualizar os relatórios.</p>
      </div>
    </div>
  );
}