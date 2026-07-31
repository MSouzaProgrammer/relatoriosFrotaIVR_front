import { useState } from 'react';
import { Droplets, Check, Droplet, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import type { Vehicle, WashRecord, TipoLavagem } from '../types';
import { TIPOS_LAVAGEM } from '../types';
import { modeloInfo, formatBRL } from '../utils/formatters';

interface Props {
  vehicles: Vehicle[];
  washRecords: WashRecord[];
  onAddWash: (record: WashRecord) => void;
}

export function LavagemPage({ vehicles, washRecords, onAddWash }: Props) {
  const [form, setForm] = useState({ veiculoId: '', km: '', valor: '', tipo: 'completa' as TipoLavagem, obs: '' });
  const selectedVehicle = vehicles.find(v => v.id === form.veiculoId);

  const handleSave = () => {
    if (!form.veiculoId || !form.km || !form.valor) return;
    const veh = vehicles.find(v => v.id === form.veiculoId)!;
    const novo: WashRecord = {
      id: Date.now().toString(), veiculoId: veh.id, placa: veh.placa, modelo: veh.modelo,
      km: Number(form.km), valor: Number(form.valor), tipo: form.tipo,
      data: new Date().toISOString(), obs: form.obs
    };
    onAddWash(novo);
    setForm({ veiculoId: '', km: '', valor: '', tipo: 'completa', obs: '' });
  };

  return (
    <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="rounded-[24px] bg-[#111827] border border-[#1E293B] overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600/20 via-cyan-500/10 to-transparent border-b border-[#1E293B] p-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-500/20"><Droplets className="w-6 h-6 text-white" /></div>
            <div><h2 className="text-[20px] font-extrabold tracking-tight">Registrar Lavagem</h2><p className="text-[12px] text-[#94A3B8] mt-1">Escolha o veículo e o tipo de limpeza</p></div>
          </div>
        </div>

        <div className="p-7 space-y-6">
          <div>
            <label className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase mb-2.5 block">Veículo *</label>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-auto pr-1">
              {vehicles.filter(v => v.status === 'ativo').map(v => (
                <button key={v.id} onClick={() => setForm({ ...form, veiculoId: v.id })}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${form.veiculoId === v.id ? 'bg-sky-500/10 border-sky-500/40 ring-2 ring-sky-500/20' : 'bg-[#0B0F19] border-[#1E293B] hover:border-[#2A364D]'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center">{modeloInfo(v.modelo).icon}</div>
                  <div className="flex-1"><p className="font-bold text-[13px]">{v.placa} • {modeloInfo(v.modelo).label}</p><p className="text-[11px] text-[#64748B]">{v.kmAtual.toLocaleString()} km</p></div>
                  {form.veiculoId === v.id && <Check className="w-5 h-5 text-sky-400" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase mb-3 block">Tipo de Lavagem *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TIPOS_LAVAGEM.map(t => {
                const Icon = t.value === 'simples' ? Droplet : t.value === 'completa' ? Sparkles : ShieldCheck;
                return (
                  <button key={t.value} onClick={() => setForm({ ...form, tipo: t.value as TipoLavagem })}
                    className={`relative p-4 rounded-2xl border text-left transition-all ${form.tipo === t.value ? `${t.color} ring-2 ring-offset-0 ring-offset-[#111827]` : 'bg-[#0B0F19] border-[#1E293B] hover:border-[#2A364D]'}`}>
                    {t.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-violet-600 text-[9px] font-bold text-white tracking-widest">POPULAR</span>}
                    <Icon className="w-6 h-6 mb-3" />
                    <p className="font-bold text-[13px]">{t.label}</p><p className="text-[11px] opacity-70 mt-1 leading-snug">{t.desc}</p><p className="text-[12px] font-extrabold mt-3">{t.price}</p>
                    {form.tipo === t.value && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center"><Check className="w-3 h-3 text-black" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">KM Atual</label><input type="number" value={form.km} onChange={e => setForm({ ...form, km: e.target.value })} placeholder="45250" className="w-full px-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-[14px] font-semibold" /></div>
            <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Valor (R$)</label><input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="60,00" className="w-full px-4 py-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-[14px] font-bold" /></div>
          </div>

          <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Observação (opcional)</label><textarea value={form.obs} onChange={e => setForm({ ...form, obs: e.target.value })} placeholder="Ex: com cera, tirar manchas do banco..." rows={3} className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-[13px] resize-none" /></div>

          <button onClick={handleSave} disabled={!form.veiculoId} className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-[14px] shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />Salvar Lavagem
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[20px] bg-gradient-to-br from-sky-600/10 via-[#111827] to-[#111827] border border-sky-500/20 p-6">
          <h3 className="font-bold flex items-center gap-2"><Droplet className="w-5 h-5 text-sky-400" />Veículo Selecionado</h3>
          {!selectedVehicle ? <p className="text-[12px] text-[#64748B] mt-4">Selecione um veículo</p> : (
            <div className="mt-4 p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] flex gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center text-[20px]">{modeloInfo(selectedVehicle.modelo).icon}</div>
              <div><p className="font-bold">{selectedVehicle.placa}</p><p className="text-[12px] text-[#94A3B8]">{modeloInfo(selectedVehicle.modelo).label} • {selectedVehicle.kmAtual.toLocaleString()} km</p></div>
            </div>
          )}
        </div>
        <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-6">
          <h4 className="font-bold text-[13px] mb-3">Histórico</h4>
          <div className="space-y-2">
            {washRecords.slice(0, 4).map(r => (
              <div key={r.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B]/60"><div><p className="text-[12px] font-bold">{r.placa} • {r.tipo}</p><p className="text-[10px] text-[#64748B]">{new Date(r.data).toLocaleDateString('pt-BR')}</p></div><span className="text-[12px] font-bold">{formatBRL(r.valor)}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
