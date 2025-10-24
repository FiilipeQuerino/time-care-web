import { jsPDF } from "jspdf";

/**
 * Gera um PDF de teste com o nome do relatório.
 * @param reportName Nome do relatório
 */
export function generatePDF(reportName: string) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(22);
  doc.text(reportName, 20, 30);

  // Texto de teste
  doc.setFontSize(14);
  doc.text("Este é um PDF de teste gerado no React.", 20, 50);
  doc.text("Você pode substituir este conteúdo pelo layout real do relatório.", 20, 60);

  // Salvar o PDF com o nome do relatório
  doc.save(`${reportName}.pdf`);
}
