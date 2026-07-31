import { DollarSign, Fuel, Car, TrendingUp, Gauge } from 'lucide-react';
import { useMemo } from 'react';
import type { Vehicle, FuelRecord, WashRecord } from '../types';
import { formatBRL, modeloInfo } from '../utils/formatters';

interface Props {
  vehicles: Vehicle[];
  fuelRecords: FuelRecord[];
  washRecords: WashRecord[];
  onNavigateToVeiculos: () => void;
}

export function Dashboard({ vehicles, fuelRecords, washRecords, onNavigateToVeiculos }: Props) {
  const stats = useMemo(() => {
    const now = new Date(); const m = now.getMonth(); const y = now.getFullYear();
    const fuelMes = fuelRecords.filter(r => { const d = new Date(r.data); return d.getMonth() === m && d.getFullYear() === y; });
    const washMes = washRecords.filter(r => { const d = new Date(r.data); return d.getMonth() === m && d.getFullYear() === y; });
    return {
      gastoMes: [...fuelMes, ...washMes].reduce((s, r) => s + r.valor, 0),
      litrosMes: fuelMes.reduce((s, r) => s + r.litros, 0),
      veiculosAtivos: vehicles.filter(v => v.status === 'ativo').length,
      totalVeiculos: vehicles.length,
    };
  }, [vehicles, fuelRecords, washRecords]);

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
    <div className="space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gasto do Mês', value: formatBRL(stats.gastoMes), sub: 'Combustível + Lavagens', icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Litros', value: `${stats.litrosMes.toFixed(0)} L`, sub: 'Este mês', icon: Fuel, color: 'from-emerald-500 to-teal-500' },
          { label: 'Veículos Ativos', value: `${stats.veiculosAtivos}/${stats.totalVeiculos}`, sub: 'Em operação', icon: Car, color: 'from-violet-500 to-purple-500' },
          { label: 'Economia', value: '-12%', sub: 'vs mês anterior', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
        ].map((card, i) => (
          <div key={i} className="relative overflow-hidden rounded-[20px] bg-[#111827] border border-[#1E293B] p-5">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-[0.08] blur-2xl rounded-full -mr-8 -mt-8`} />
            <div className="flex justify-between items-start">
              <div><p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">{card.label}</p><p className="text-[24px] font-extrabold mt-2 tracking-tight">{card.value}</p><p className="text-[11px] text-[#64748B] mt-1">{card.sub}</p></div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}><card.icon className="w-5 h-5 text-white" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[20px] bg-[#111827] border border-[#1E293B] p-6">
          <div className="flex justify-between items-center mb-6"><h3 className="font-bold">Custo Mensal • Últimos 6 meses</h3><span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">{formatBRL(monthlyData.reduce((s, m) => s + m.total, 0))} total</span></div>
          <div className="flex items-end gap-3 h-[180px]">
            {monthlyData.map(m => {
              const max = Math.max(...monthlyData.map(x => x.total), 1); const h = Math.max(12, (m.total / max) * 140);
              const isCurrent = m.date.getMonth() === new Date().getMonth();
              return <div key={m.label} className="flex-1 flex flex-col items-center gap-2"><div className="text-[10px] font-bold">{formatBRL(m.total)}</div><div style={{ height: h }} className={`w-full max-w-[64px] rounded-t-xl border transition-all ${isCurrent ? 'bg-gradient-to-t from-blue-600 to-blue-400 border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-[#1E293B] border-[#2A364D]'}`} /><span className={`text-[11px] capitalize ${isCurrent ? 'text-blue-400 font-bold' : 'text-[#64748B]'}`}>{m.label}</span></div>;
            })}
          </div>
        </div>
        <div className="rounded-[20px] bg-[#111827] border border-[#1E293B] p-6">
          <h3 className="font-bold mb-5">Veículos Recentes</h3>
          <div className="space-y-3">
            {vehicles.slice(0, 4).map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[14px]">{modeloInfo(v.modelo).icon}</div>
                <div className="flex-1 min-w-0"><p className="text-[13px] font-bold truncate">{v.placa}</p><p className="text-[11px] text-[#64748B] truncate">{modeloInfo(v.modelo).label} • {v.kmAtual.toLocaleString()} km</p></div>
                <div className={`w-2 h-2 rounded-full ${v.status === 'ativo' ? 'bg-emerald-500' : v.status === 'manutencao' ? 'bg-amber-500' : 'bg-slate-500'}`} />
              </div>
            ))}
          </div>
          <button onClick={onNavigateToVeiculos} className="w-full mt-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#252F45] text-[13px] font-semibold transition-colors">Ver garagem completa →</button>
        </div>
      </div>
    </div>
  );
}
