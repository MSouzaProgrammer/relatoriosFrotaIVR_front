import { LucideTruck } from "lucide-react";

function Sidebar() {
  return (
    <aside className="bg-[#0F172A] h-screen w-70 text-white">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg w-9.5 h- ml-3">
          <LucideTruck size={23} />
        </div>
        <div className="mt-1">
          <h1 className="text-2xl font-bold p-0 ">Controle de Frota</h1>
          <p className="text-slate-400 text-1xl leading-none">Gestao de despesas</p>
        </div>
      </div>
      <nav>
        <a href="/">Visão geral</a>
        <a href="/abastecimentos">Abastecimento</a>
        <a href="/manutencao">Manutenção</a>
        <a href="/mediaKm">Média KM/L</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
