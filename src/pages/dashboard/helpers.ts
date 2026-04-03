const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatCurrency = (value: number) => currencyFormatter.format(value ?? 0);

export const getProcedureCategoryLabel = (category: number): string => {
  if (category === 1) return 'Facial';
  if (category === 2) return 'Corporal';
  if (category === 3) return 'Estetico';
  return `Categoria ${category}`;
};
