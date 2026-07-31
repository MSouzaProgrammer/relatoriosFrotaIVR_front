import { useState } from 'react';
import { Plus, Check, User } from 'lucide-react';
import type { Modelo, Vehicle } from '../types';
import { MODELOS } from '../types';
import { formatPlaca } from '../utils/formatters';

interface Props {
  onSave: (data: Omit<Vehicle, 'id' | 'status' | 'criadoEm'>) => void;
  editingVehicle: Vehicle | null;
  onCancelEdit: () => void;
}

export function VehicleForm({ onSave, editingVehicle, onCancelEdit }: Props) {
  const [form, setForm] = useState({
    placa: editingVehicle?.placa || '',
    modelo: (editingVehicle?.modelo || '') as Modelo | '',
    ano: editingVehicle?.ano || '',
    kmAtual: editingVehicle ? String(editingVehicle.kmAtual) : '',
    motorista: editingVehicle?.motorista || ''
  });

  // Update when editing changes
  useState(() => {
    if (editingVehicle) {
      setForm({
        placa: editingVehicle.placa,
        modelo: editingVehicle.modelo,
        ano: editingVehicle.ano,
        kmAtual: String(editingVehicle.kmAtual),
        motorista: editingVehicle.motorista || ''
      });
    }
  });

  const handleSubmit = () => {
    if (!form.placa || !form.modelo || !form.kmAtual) return;
    onSave({
      placa: form.placa,
      modelo: form.modelo as Modelo,
      ano: form.ano || '2024',
      kmAtual: Number(form.kmAtual),
      motorista: form.motorista
    });
    setForm({ placa: '', modelo: '', ano: '', kmAtual: '', motorista: '' });
  };

  return (
    <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-6 h-fit sticky top-[88px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center"><Plus className="w-5 h-5 text-white" /></div>
        <div><h3 className="font-bold text-[15px]">{editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}</h3><p className="text-[11px] text-[#64748B]">Cadastre sua frota</p></div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase mb-2 block">Placa *</label>
          <input value={form.placa} onChange={e => setForm({ ...form, placa: formatPlaca(e.target.value) })} placeholder="BRA-2E19" className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-[14px] font-bold tracking-widest focus:border-blue-500/50 focus:outline-none uppercase" />
        </div>

        <div>
          <label className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase mb-2 block">Modelo *</label>
          <div className="grid grid-cols-2 gap-2">
            {MODELOS.map(m => (
              <button key={m.value} onClick={() => setForm({ ...form, modelo: m.value as Modelo })}
                className={`p-3 rounded-xl border text-left transition-all ${form.modelo === m.value ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'bg-[#0B0F19] border-[#1E293B] hover:border-[#2A364D] text-[#94A3B8]'}`}>
                <div className="text-[18px] mb-1">{m.icon}</div><div className="text-[12px] font-bold">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Ano</label><input value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} placeholder="2024" className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-[13px] focus:border-blue-500/50 focus:outline-none" /></div>
          <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">KM Atual *</label><input type="number" value={form.kmAtual} onChange={e => setForm({ ...form, kmAtual: e.target.value })} placeholder="45000" className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-[13px] focus:border-blue-500/50 focus:outline-none" /></div>
        </div>

        <div><label className="text-[11px] font-bold text-[#94A3B8] uppercase mb-2 block">Motorista (opcional)</label>
          <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" /><input value={form.motorista} onChange={e => setForm({ ...form, motorista: e.target.value })} placeholder="Nome do responsável" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-[13px] focus:border-blue-500/50 focus:outline-none" /></div>
        </div>

        <div className="flex gap-2 pt-2">
          {editingVehicle && <button onClick={onCancelEdit} className="flex-1 py-3 rounded-xl bg-[#1E293B] text-[13px] font-bold">Cancelar</button>}
          <button onClick={handleSubmit} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-[13px] font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />{editingVehicle ? 'Salvar' : 'Cadastrar Veículo'}
          </button>
        </div>
      </div>
    </div>
  );
}
