import { jsPDF } from "jspdf";

export function financeiroLucroPDF() {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Demonstrativo de Lucro", 20, 30);

  doc.setFontSize(16);
  doc.text("Categoria: Financeiro e Lucro", 20, 45);

  doc.setFontSize(12);
  doc.text("Receitas:", 20, 60);
  doc.text("- Vendas: R$ 25.000,00", 25, 70);
  doc.text("Despesas: R$ 21.000,00", 20, 90);
  doc.text("Lucro Líquido: R$ 4.000,00", 20, 110);

  doc.text("Observações:", 20, 130);
  doc.text("Lucro está dentro do esperado para o período.", 25, 140);

  doc.save("Demonstrativo_Lucro.pdf");
}
