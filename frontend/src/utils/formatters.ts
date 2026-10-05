export const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};
