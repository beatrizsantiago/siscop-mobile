export const INVENTORY_STATE_LABELS:{ [key: string]: string } = {
  WAITING: 'Aguardando plantio',
  IN_PRODUCTION: 'Em produção',
  READY: 'Colhido',
};

export const INVENTORY_STATE_OPTIONS = Object.keys(INVENTORY_STATE_LABELS).map((key) => ({
  value: key,
  label: INVENTORY_STATE_LABELS[key],
}));
