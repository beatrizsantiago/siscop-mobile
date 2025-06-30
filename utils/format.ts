export const capitalizeFirstLetter = (str?: string | null): string => {
  if (!str || str.trim() === '') return '';

  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
};
