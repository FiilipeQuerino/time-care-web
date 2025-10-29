import Menu from "../components/Menu";
import { useIsMobile } from "../hooks/useIsMobile";

const pageStyles = {
  container: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#FDFDFD",
    flexDirection: isMobile ? "column" : "row",
    minWidth: 0,
  }),
  content: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "60px 15px 15px 15px" : "30px",
  }),
  title: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "700",
  } as React.CSSProperties,
  addButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#F08080",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: '600',
    transition: 'background-color 0.3s'
  } as React.CSSProperties,
};


export default function Agenda() {
  const isMobile = useIsMobile();
  return (
    <div style={pageStyles.container(isMobile)}>
      <Menu/>

      <div style={pageStyles.content(isMobile)}>
        <h1 style={pageStyles.title}>Agenda</h1>
      </div>
    </div>
  );
}