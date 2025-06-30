import { REGEX_EMAIL } from '@/utils/regex';

export const isValidEmail = (email: string): boolean => {
  return REGEX_EMAIL.test(email);
};
