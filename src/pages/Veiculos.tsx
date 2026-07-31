import { useState, useMemo } from 'react';
import { Search, Car } from 'lucide-react';
import type { Vehicle, FuelRecord, WashRecord } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleForm } from '../components/VehicleForm';

interface Props {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  fuelRecords: FuelRecord[];
  washRecords: WashRecord[];
}

export function VeiculosPage({ vehicles, setVehicles, fuelRecords, washRecords }: Props) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    if (!search) return vehicles;
    const s = search.toLowerCase();
    return vehicles.filter(v => v.placa.toLowerCase().includes(s) || v.modelo.toLowerCase().includes(s) || (v.motorista || '').toLowerCase().includes(s));
  }, [vehicles, search]);

  const handleSave = (data: Omit<Vehicle, 'id' | 'status' | 'criadoEm'>) => {
    if (editing) {
      setVehicles(prev => prev.map(v => v.id === editing.id ? { ...v, ...data } : v));
      setEditing(null);
    } else {
      const novo: Vehicle = { id: Date.now().toString(), ...data, status: 'ativo', criadoEm: new Date().toISOString() };
      setVehicles(prev => [novo, ...prev]);
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por placa, modelo ou motorista..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111827] border border-[#1E293B] text-[13px] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all" />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#64748B]"><div className="w-2 h-2 rounded-full bg-emerald-500" />{vehicles.filter(v => v.status === 'ativo').length} ativos • {vehicles.length} total</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <VehicleForm onSave={handleSave} editingVehicle={editing} onCancelEdit={() => setEditing(null)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-[20px] border border-dashed border-[#1E293B] p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111827] flex items-center justify-center mb-4"><Car className="w-8 h-8 text-[#475569]" /></div>
              <p className="text-[14px] font-bold">Nenhum veículo encontrado</p><p className="text-[12px] text-[#64748B] mt-1">Cadastre o primeiro veículo da frota</p>
            </div>
          ) : filtered.map(v => {
            const totalGasto = [...fuelRecords, ...washRecords].filter(r => r.veiculoId === v.id).reduce((s, r) => s + r.valor, 0);
            return <VehicleCard key={v.id} vehicle={v} totalGasto={totalGasto} totalAbastec={fuelRecords.filter(r => r.veiculoId === v.id).length} onEdit={() => setEditing(v)} onDelete={() => { if (confirm(`Remover ${v.placa}?`)) setVehicles(prev => prev.filter(x => x.id !== v.id)); }} />;
          })}
        </div>
      </div>
    </div>
  );
}
