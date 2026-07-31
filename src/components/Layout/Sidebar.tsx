import { LayoutDashboard, Fuel, Droplets, BarChart3, Car, Truck, TrendingUp } from 'lucide-react';
import type { Page } from '../../types';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  totalVeiculos: number;
  veiculosAtivos: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const menu = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, desc: 'Visão geral' },
  { id: 'veiculos' as Page, label: 'Veículos', icon: Car, desc: 'Garagem' },
  { id: 'combustivel' as Page, label: 'Combustível', icon: Fuel, desc: 'Abastecimentos' },
  { id: 'lavagem' as Page, label: 'Lavagem', icon: Droplets, desc: 'Limpeza' },
  { id: 'relatorios' as Page, label: 'Relatórios', icon: BarChart3, desc: 'Análises' },
];

export function Sidebar({ currentPage, onNavigate, totalVeiculos, mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onCloseMobile} />}
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 z-30 w-[280px] h-screen bg-[#111827] border-r border-[#1E293B] flex flex-col transition-transform duration-300`}>
        <div className="p-6 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-[16px] tracking-tight leading-none">Frota IVRNET</h1>
              <p className="text-[11px] text-[#64748B] font-medium mt-1 tracking-wide">FLEET MANAGEMENT</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {menu.map(item => {
            const active = currentPage === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${active ? 'bg-[#1E293B] text-white shadow-[0_0_0_1px_rgba(59,130,246,0.2)]' : 'text-[#94A3B8] hover:bg-[#1A2234] hover:text-white'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? 'bg-blue-500 text-white' : 'bg-[#1E293B] text-[#64748B]'}`}>
                  <item.icon className="w-[18px] h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold tracking-tight">{item.label}</span>
                    {item.id === 'veiculos' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">{totalVeiculos}</span>}
                  </div>
                  <p className="text-[11px] opacity-70 truncate">{item.desc}</p>
                </div>
                {active && <div className="w-1 h-6 rounded-full bg-blue-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E293B]">
          <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-400" /><span className="text-[12px] font-bold text-blue-300">Frota Otimizada</span></div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">Você economizou 12% este mês vs. mês passado.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
