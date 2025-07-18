export const capitalizeFirstLetter = (str?: string | null): string => {
  if (!str || str.trim() === '') return '';

  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
};

export const formatMoney = (value?:number | null):string => (value
  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  : 'R$ 0,00');

export const formatCurrency = (input:string) => {
  let numericValue = input.replace(/\D/g, "");

  if (!numericValue) return '';

  let formattedValue = new Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(numericValue) / 100);

  return formattedValue;
};

export const stringToFloat = (value: string): number => {
  if (!value.trim()) return 0;

  const cleaned = value.trim().replace(/[R$\s]/g, '');

  let normalized = cleaned;

  if (cleaned.includes(',') && cleaned.includes('.')) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.') && !cleaned.includes(',')) {
    normalized = cleaned;
  } else if (cleaned.includes(',') && !cleaned.includes('.')) {
    normalized = cleaned.replace(',', '.');
  }

  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? 0 : parsed;
};

export const stringToInteger = (value: string):number => {
  if (!value.trim()) return 0;

  const cleanedValue = value.trim().replace(/[^\d]/g, '');

  const parsed = parseInt(cleanedValue, 10);

  return isNaN(parsed) ? 0 : Math.abs(parsed);
};

export const floatToCurrency = (value:number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const floatToString = (value:number):string => {
  if (isNaN(value)) return '';

  const formattedValue = value.toFixed(2).replace('.', ',');

  return formattedValue;
};
