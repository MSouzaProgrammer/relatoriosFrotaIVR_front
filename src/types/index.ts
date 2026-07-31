export type Page = 'dashboard' | 'veiculos' | 'combustivel' | 'lavagem' | 'relatorios';
export type Modelo = 'strada' | 'mobi' | 'saveiro' | 'hilux';
export type TipoLavagem = 'simples' | 'completa' | 'premium';
export type StatusVeiculo = 'ativo' | 'inativo' | 'manutencao';

export interface Vehicle {
  id: string;
  placa: string;
  modelo: Modelo;
  ano: string;
  kmAtual: number;
  motorista?: string;
  status: StatusVeiculo;
  criadoEm: string;
}

export interface FuelRecord {
  id: string;
  veiculoId: string;
  placa: string;
  modelo: Modelo;
  km: number;
  litros: number;
  valor: number;
  data: string;
  posto?: string;
}

export interface WashRecord {
  id: string;
  veiculoId: string;
  placa: string;
  modelo: Modelo;
  km: number;
  valor: number;
  tipo: TipoLavagem;
  data: string;
  obs?: string;
}

export const MODELOS = [
  { value: 'strada', label: 'Fiat Strada', color: '#F97316', icon: '🛻' },
  { value: 'mobi', label: 'Fiat Mobi', color: '#3B82F6', icon: '🚗' },
  { value: 'saveiro', label: 'VW Saveiro', color: '#22C55E', icon: '🚙' },
  { value: 'hilux', label: 'Toyota Hilux', color: '#EF4444', icon: '🚚' },
] as const;

export const TIPOS_LAVAGEM = [
  { value: 'simples', label: 'Simples', desc: 'Lavagem externa', price: 'R$ 35', color: 'bg-sky-500/10 border-sky-500/30 text-sky-400' },
  { value: 'completa', label: 'Completa', desc: 'Interna + externa + pneus', price: 'R$ 60', color: 'bg-violet-500/10 border-violet-500/30 text-violet-400', popular: true },
  { value: 'premium', label: 'Premium', desc: 'Completa + cera + aspiração', price: 'R$ 90', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
] as const;
