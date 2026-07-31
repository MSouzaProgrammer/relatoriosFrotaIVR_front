import { useMemo } from 'react';
import type { FuelRecord, WashRecord, Vehicle } from '../types';
import { formatBRL } from '../utils/formatters';

interface Props {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  washRecords: WashRecord[];
}

export function RelatoriosPage({ vehicles, fuelRecords, washRecords }: Props) {
  const monthlyData = useMemo(() => {
    const arr: { label: string; total: number; date: Date }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); arr.push({ label: d.toLocaleString('pt-BR', { month: 'short' }), total: 0, date: d }); }
    ;[...fuelRecords, ...washRecords].forEach(r => {
      const rd = new Date(r.data); const f = arr.find(a => a.date.getMonth() === rd.getMonth() && a.date.getFullYear() === rd.getFullYear()); if (f) f.total += r.valor;
    });
    return arr;
  }, [fuelRecords, washRecords]);

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-5"><p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">Total Frota</p><p className="text-[22px] font-extrabold mt-2">{formatBRL([...fuelRecords, ...washRecords].reduce((s, r) => s + r.valor, 0))}</p></div>
        <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-5"><p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">Média por Veículo</p><p className="text-[22px] font-extrabold mt-2">{formatBRL(vehicles.length ? [...fuelRecords, ...washRecords].reduce((s, r) => s + r.valor, 0) / vehicles.length : 0)}</p></div>
        <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-5"><p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">Registros</p><p className="text-[22px] font-extrabold mt-2">{fuelRecords.length + washRecords.length}</p></div>
      </div>
      <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-6">
        <h3 className="font-bold mb-6">Custo por Mês</h3>
        <div className="flex items-end gap-3 h-[200px]">
          {monthlyData.map(m => {
            const max = Math.max(...monthlyData.map(x => x.total), 1); const h = Math.max(12, (m.total / max) * 160);
            return <div key={m.label} className="flex-1 flex flex-col items-center gap-2"><div className="text-[10px] font-bold">{formatBRL(m.total)}</div><div style={{ height: h }} className="w-full max-w-[64px] rounded-t-xl bg-gradient-to-t from-blue-600 to-violet-500" /><span className="text-[11px] text-[#64748B] capitalize">{m.label}</span></div>;
          })}
        </div>
      </div>
    </div>
  );
}
