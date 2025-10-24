import { jsPDF } from "jspdf";

export function financeiroDespesasPDF() {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Relatório de Despesas", 20, 30);

  doc.setFontSize(16);
  doc.text("Categoria: Financeiro e Lucro", 20, 45);

  doc.setFontSize(12);
  doc.text("Resumo Mensal:", 20, 60);
  doc.text("- Aluguel: R$ 5.000,00", 25, 70);
  doc.text("- Salários: R$ 12.000,00", 25, 80);
  doc.text("- Marketing: R$ 2.500,00", 25, 90);
  doc.text("- Serviços Terceirizados: R$ 1.500,00", 25, 100);
  doc.text("Total de Despesas: R$ 21.000,00", 20, 120);

  doc.save("Relatorio_Despesas.pdf");
}
