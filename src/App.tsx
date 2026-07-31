import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { Page, FuelRecord, WashRecord, Vehicle } from './types';
import { useFrota } from './hooks/useFrota';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { VeiculosPage } from './pages/Veiculos';
import { CombustivelPage } from './pages/Combustivel';
import { LavagemPage } from './pages/Lavagem';
import { RelatoriosPage } from './pages/Relatorios';

export default function App() {
  const { vehicles, setVehicles, fuelRecords, setFuelRecords, washRecords, setWashRecords } = useFrota();
  const [page, setPage] = useState<Page>('veiculos');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string }>({ open: false, msg: '' });

  const showSnack = (msg: string) => setSnack({ open: true, msg });

  // Wrap setters to show snack
  const handleAddFuel = (r: FuelRecord) => { setFuelRecords(prev => [r, ...prev]); showSnack(`Abastecimento de ${r.placa} registrado!`); };
  const handleAddWash = (r: WashRecord) => { setWashRecords(prev => [r, ...prev]); showSnack(`Lavagem de ${r.placa} registrada!`); };
  const handleUpdateKm = (id: string, km: number) => setVehicles(prev => prev.map(v => v.id === id ? { ...v, kmAtual: Math.max(v.kmAtual, km) } : v));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Sidebar currentPage={page} onNavigate={setPage} totalVeiculos={vehicles.length} veiculosAtivos={vehicles.filter(v => v.status === 'ativo').length} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <main className="flex-1 min-w-0">
        <Header page={page} onToggleMobile={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} />
        <div className="p-4 md:p-8">
          {page === 'dashboard' && <Dashboard vehicles={vehicles} fuelRecords={fuelRecords} washRecords={washRecords} onNavigateToVeiculos={() => setPage('veiculos')} />}
          {page === 'veiculos' && <VeiculosPage vehicles={vehicles} setVehicles={setVehicles} fuelRecords={fuelRecords} washRecords={washRecords} />}
          {page === 'combustivel' && <CombustivelPage vehicles={vehicles} fuelRecords={fuelRecords} onAddFuel={handleAddFuel} onUpdateVehicleKm={handleUpdateKm} />}
          {page === 'lavagem' && <LavagemPage vehicles={vehicles} washRecords={washRecords} onAddWash={handleAddWash} />}
          {page === 'relatorios' && <RelatoriosPage vehicles={vehicles} fuelRecords={fuelRecords} washRecords={washRecords} />}
        </div>
      </main>

      {snack.open && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] border border-[#1E293B] rounded-2xl px-5 py-4 shadow-2xl animate-[slideUp_0.3s_ease]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
          <p className="text-[13px] font-semibold pr-2">{snack.msg}</p>
          <button onClick={() => setSnack({ open: false, msg: '' })} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center"><X className="w-4 h-4 text-[#64748B]" /></button>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
