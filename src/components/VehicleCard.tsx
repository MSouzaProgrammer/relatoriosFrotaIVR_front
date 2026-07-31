import { Edit3, Trash2, Gauge } from 'lucide-react';
import type { Vehicle, FuelRecord, WashRecord } from '../types';
import { modeloInfo, formatBRL } from '../utils/formatters';

interface Props {
  vehicle: Vehicle;
  totalGasto: number;
  totalAbastec: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function VehicleCard({ vehicle, totalGasto, totalAbastec, onEdit, onDelete }: Props) {
  const info = modeloInfo(vehicle.modelo);
  return (
    <div className="group relative rounded-[20px] bg-[#111827] border border-[#1E293B] hover:border-[#2A364D] p-5 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[20px] shadow-inner" style={{ background: `${info.color}15`, border: `1px solid ${info.color}30` }}>{info.icon}</div>
          <div>
            <div className="flex items-center gap-2"><p className="font-extrabold tracking-widest text-[15px]">{vehicle.placa}</p><span className={`w-2 h-2 rounded-full ${vehicle.status === 'ativo' ? 'bg-emerald-500' : vehicle.status === 'manutencao' ? 'bg-amber-500' : 'bg-slate-500'}`} /></div>
            <p className="text-[12px] font-semibold text-[#E2E8F0]">{info.label} • {vehicle.ano}</p>
            <p className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5"><Gauge className="w-3 h-3" />{vehicle.kmAtual.toLocaleString()} km • {vehicle.motorista || 'Sem motorista'}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-[#252F45] flex items-center justify-center"><Edit3 className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#1E293B]/60">
        <div><p className="text-[10px] font-bold tracking-widest text-[#64748B] uppercase">Gasto Total</p><p className="text-[13px] font-bold mt-1">{formatBRL(totalGasto)}</p></div>
        <div><p className="text-[10px] font-bold tracking-widest text-[#64748B] uppercase">Abastec.</p><p className="text-[13px] font-bold mt-1">{totalAbastec}x</p></div>
        <div><p className="text-[10px] font-bold tracking-widest text-[#64748B] uppercase">Status</p><span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${vehicle.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : vehicle.status === 'manutencao' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>{vehicle.status.toUpperCase()}</span></div>
      </div>
    </div>
  );
}
