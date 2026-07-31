import { MODELOS } from '../types';

export const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPlaca = (v: string) => {
  let c = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (c.length > 3) c = c.slice(0, 3) + '-' + c.slice(3, 7);
  return c.slice(0, 8);
};

export const modeloInfo = (v: string) => MODELOS.find(m => m.value === v) || MODELOS[0];
