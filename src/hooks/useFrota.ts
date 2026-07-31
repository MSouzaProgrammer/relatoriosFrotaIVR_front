import { useState, useEffect } from 'react';
import { Vehicle, FuelRecord, WashRecord } from '../types';

export function useFrota() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try { const r = localStorage.getItem('frota_vehicles_v3'); return r ? JSON.parse(r) : []; } catch { return []; }
  });
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(() => {
    try { const r = localStorage.getItem('frota_fuel_v3'); return r ? JSON.parse(r) : []; } catch { return []; }
  });
  const [washRecords, setWashRecords] = useState<WashRecord[]>(() => {
    try { const r = localStorage.getItem('frota_wash_v3'); return r ? JSON.parse(r) : []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('frota_vehicles_v3', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('frota_fuel_v3', JSON.stringify(fuelRecords)); }, [fuelRecords]);
  useEffect(() => { localStorage.setItem('frota_wash_v3', JSON.stringify(washRecords)); }, [washRecords]);

  // Seed inicial
  useEffect(() => {
    if (vehicles.length === 0) {
      const seed: Vehicle[] = [
        { id: 'v1', placa: 'BRA-2E19', modelo: 'hilux', ano: '2022', kmAtual: 89400, motorista: 'Carlos Silva', status: 'ativo', criadoEm: new Date().toISOString() },
        { id: 'v2', placa: 'ABC-1D23', modelo: 'strada', ano: '2023', kmAtual: 45230, motorista: 'Marcos Oliveira', status: 'ativo', criadoEm: new Date().toISOString() },
        { id: 'v3', placa: 'XYZ-9A87', modelo: 'saveiro', ano: '2021', kmAtual: 62100, status: 'manutencao', criadoEm: new Date().toISOString() },
        { id: 'v4', placa: 'MOB-0I46', modelo: 'mobi', ano: '2024', kmAtual: 12400, motorista: 'Ana Paula', status: 'ativo', criadoEm: new Date().toISOString() },
      ];
      setVehicles(seed);
      setFuelRecords([
        { id: 'f1', veiculoId: 'v2', placa: 'ABC-1D23', modelo: 'strada', km: 45230, litros: 42, valor: 235.20, data: new Date(Date.now() - 86400000 * 2).toISOString(), posto: 'Posto IVR' },
        { id: 'f2', veiculoId: 'v1', placa: 'BRA-2E19', modelo: 'hilux', km: 89400, litros: 65, valor: 422.50, data: new Date(Date.now() - 86400000 * 5).toISOString(), posto: 'Shell' },
      ]);
    }
  }, []);

  return { vehicles, setVehicles, fuelRecords, setFuelRecords, washRecords, setWashRecords };
}
