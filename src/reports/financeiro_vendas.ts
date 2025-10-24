import { jsPDF } from "jspdf";

export function financeiroVendasPDF() {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(22);
  doc.text("Relatório de Vendas por Período", 20, 30);

  // Subtítulo
  doc.setFontSize(16);
  doc.text("Categoria: Financeiro e Lucro", 20, 45);

  // Conteúdo fictício
  doc.setFontSize(12);
  doc.text("Período: Janeiro a Março", 20, 60);
  doc.text("Total de Vendas: R$ 25.000,00", 20, 70);
  doc.text("Vendas por Produto:", 20, 80);
  doc.text("- Produto A: R$ 10.000,00", 25, 90);
  doc.text("- Produto B: R$ 8.000,00", 25, 100);
  doc.text("- Produto C: R$ 7.000,00", 25, 110);

  // Salvar PDF
  doc.save("Relatorio_Vendas.pdf");
}
