import { Search, X } from 'lucide-react';
import type { Page } from '../../types';

interface Props {
  page: Page;
  onToggleMobile: () => void;
  mobileOpen: boolean;
}

export function Header({ page, onToggleMobile, mobileOpen }: Props) {
  const titles: Record<Page, string> = {
    dashboard: 'Dashboard',
    veiculos: 'Garagem • Veículos',
    combustivel: 'Combustível',
    lavagem: 'Lavagem',
    relatorios: 'Relatórios'
  };

  return (
    <header className="sticky top-0 z-10 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-[#1E293B] px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onToggleMobile} className="md:hidden w-9 h-9 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center justify-center">
          {mobileOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
        <div>
          <h2 className="text-[18px] md:text-[22px] font-extrabold tracking-tight">{titles[page]}</h2>
          <p className="text-[12px] text-[#64748B] hidden md:block">Gerencie sua frota com inteligência</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827] border border-[#1E293B]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-[#94A3B8]">Sistema Online</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-[13px]">A</div>
      </div>
    </header>
  );
}
