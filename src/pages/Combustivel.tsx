import { useState, useMemo } from 'react';
import { Fuel, MapPin, Gauge, Plus, Check, Banknote, Clock, AlertCircle } from 'lucide-react';
import type { Vehicle, FuelRecord } from '../types';
import { modeloInfo, formatBRL } from '../utils/formatters';

interface Props {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  onAddFuel: (record: FuelRecord) => void;
  onUpdateVehicleKm: (id: string, km: number) => void;
}

export function CombustivelPage({ vehicles, fuelRecords, onAddFuel, onUpdateVehicleKm }: Props) {
  const [form, setForm] = useState({ veiculoId: '', km: '', litros: '', valor: '', posto: '' });

  const selectedVehicle = vehicles.find(v => v.id === form.veiculoId);
  const lastKm = useMemo(() => {
    if (!form.veiculoId) return 0;
    const recs = fuelRecords.filter(r => r.veiculoId === form.veiculoId).sort((a, b) => b.km - a.km);
    return recs[0]?.km || selectedVehicle?.kmAtual || 0;
  }, [form.veiculoId, fuelRecords, selectedVehicle]);

  const handleSave = () => {
    if (!form.veiculoId || !form.km || !form.litros || !form.valor) return;
    const veh = vehicles.find(v => v.id === form.veiculoId)!;
    const novo: FuelRecord = {
      id: Date.now().toString(), veiculoId: veh.id, placa: veh.placa, modelo: veh.modelo,
      km: Number(form.km), litros: Number(form.litros), valor: Number(form.valor),
      data: new Date().toISOString(), posto: form.posto
    };
    onAddFuel(novo);
    onUpdateVehicleKm(veh.id, novo.km);
    setForm({ veiculoId: '', km: '', litros: '', valor: '', posto: '' });
  };

  return (
    <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="rounded-[24px] bg-[#111827] border border-[#1E293B] overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-transparent border-b border-[#1E293B] p-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"><Fuel className="w-6 h-6 text-white" /></div>
            <div><h2 className="text-[20px] font-extrabold tracking-tight">Registrar Abastecimento</h2><p className="text-[12px] text-[#94A3B8] mt-1">Selecione o veículo da garagem, sem digitar placa</p></div>
          </div>
        </div>

        <div className="p-7 space-y-5">
          <div>
            <label className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase mb-2.5 flex items-center gap-2">Veículo da Frota *</label>
            {vehicles.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3"><AlertCircle className="w-5 h-5 text-amber-400 shrink-0" /><p className="text-[13px] font-bold text-amber-300">Nenhum veículo cadastrado</p></div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-auto pr-1">
                {vehicles.filter(v => v.status === 'ativo').map(v => (
                  <button key={v.id} onClick={() => setForm({ ...form, veiculoId: v.id })}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${form.veiculoId === v.id ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20' : 'bg-[#0B0F19] border-[#1E293B] hover:border-[#2A364D]'}`}>
                    <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-[16px]">{modeloInfo(v.modelo).icon}</div>
                    <div className="flex-1 min-w-0"><p className="font-bold text-[13px] tracking-wide">{v.placa} • {modeloInfo(v.modelo).label}</p><p className="text-[11px] text-[#64748B]">{v.kmAtual.toLocaleString()} km • {v.motorista || 'Sem motorista'}</p></div>
                    {form.veiculoId === v.id && <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedVehicle && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block flex items-center gap-1.5"><Gauge className="w-3 h-3" /> KM Atual • Último: {lastKm.toLocaleString()}</label><input type="number" value={form.km} onChange={e => setForm({ ...form, km: e.target.value })} placeholder={`${lastKm + 100}`} className="w-full px-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-[14px] font-semibold" /></div>
              <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Posto</label><div className="relative"><MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" /><input value={form.posto} onChange={e => setForm({ ...form, posto: e.target.value })} placeholder="Ex: Posto IVR" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-[13px]" /></div></div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Litros *</label><input type="number" value={form.litros} onChange={e => setForm({ ...form, litros: e.target.value })} placeholder="42,5" className="w-full px-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-emerald-500/50 outline-none text-[14px] font-bold" /></div>
            <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Valor Total *</label><input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="235,20" className="w-full px-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-emerald-500/50 outline-none text-[14px] font-bold" /></div>
          </div>

          <button onClick={handleSave} disabled={!form.veiculoId} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[14px] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all">
            <Plus className="w-5 h-5" />Salvar Abastecimento
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[20px] bg-gradient-to-br from-emerald-600/15 via-[#111827] to-[#111827] border border-emerald-500/20 p-6">
          <h3 className="font-bold flex items-center gap-2"><Banknote className="w-5 h-5 text-emerald-400" />Resumo</h3>
          {!selectedVehicle ? <p className="text-[12px] text-[#64748B] mt-4">Selecione um veículo</p> : (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]"><div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center">{modeloInfo(selectedVehicle.modelo).icon}</div><div><p className="font-bold text-[13px]">{selectedVehicle.placa}</p><p className="text-[11px] text-[#64748B]">{modeloInfo(selectedVehicle.modelo).label}</p></div></div>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]"><p className="text-[#64748B] text-[10px] uppercase font-bold">Preço / Litro</p><p className="font-extrabold text-[16px] mt-1 text-emerald-400">R$ {form.litros && form.valor ? (Number(form.valor) / Number(form.litros) || 0).toFixed(2) : '0,00'}</p></div>
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]"><p className="text-[#64748B] text-[10px] uppercase font-bold">Distância</p><p className="font-extrabold text-[16px] mt-1">{form.km ? Math.max(0, Number(form.km) - lastKm).toLocaleString() : '0'} km</p></div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-6">
          <h4 className="font-bold text-[13px] mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-[#64748B]" />Últimos abastecimentos</h4>
          <div className="space-y-2.5">
            {fuelRecords.slice(0, 4).map(r => (
              <div key={r.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B]/60"><div><p className="text-[12px] font-bold">{r.placa} • {r.litros}L</p><p className="text-[10px] text-[#64748B]">{new Date(r.data).toLocaleDateString('pt-BR')} • {r.km.toLocaleString()} km</p></div><span className="text-[12px] font-bold">{formatBRL(r.valor)}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
