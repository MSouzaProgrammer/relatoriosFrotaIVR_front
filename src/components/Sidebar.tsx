import {
  LucideTruck,
  LucideHome,
  Droplet,
  Wrench,
  Activity,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="h-screen w-70 shrink-0 bg-[#0F172A] text-white">

      {/* Logo e título */}
      <div className="flex items-center gap-3">

        <div className="bg-blue-500 p-2 w-10 h-10 ml-3 flex items-center justify-center rounded-md">
          <LucideTruck size={23} />
        </div>

        <div className="mt-1">
          <h1 className="text-lg font-bold">
            Controle de Frota
          </h1>

          <p className="text-slate-400 text-sm leading-none">
            Gestão de despesas
          </p>
        </div>

      </div>

      {/* Menu principal */}
      <nav className="flex flex-col gap-3.5 mt-10">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-1.5 ml-3 w-55 p-2 pl-3 rounded-lg
            ${isActive ? "bg-blue-500" : "hover:bg-slate-800"}`
          }
        >
          <LucideHome size={20} />
          <span>Visão geral</span>
        </NavLink>

        <NavLink
          to="/abastecimentos"
          className={({ isActive }) =>
            `flex items-center gap-1.5 ml-3 w-55 p-2 pl-3 rounded-lg
            ${isActive ? "bg-blue-500" : "hover:bg-slate-800"}`
          }
        >
          <Droplet size={20} />
          <span>Abastecimento</span>
        </NavLink>

        <NavLink
          to="/manutencao"
          className={({ isActive }) =>
            `flex items-center gap-1.5 ml-3 w-55 p-2 pl-3 rounded-lg
            ${isActive ? "bg-blue-500" : "hover:bg-slate-800"}`
          }
        >
          <Wrench size={20} />
          <span>Manutenção</span>
        </NavLink>

        <NavLink
          to="/relatorio"
          className={({ isActive }) =>
            `flex items-center gap-1.5 ml-3 w-55 p-2 pl-3 rounded-lg
            ${isActive ? "bg-blue-500" : "hover:bg-slate-800"}`
          }
        >
          <Activity size={20} />
          <span>Média K/m</span>
        </NavLink>

      </nav>

      {/* Separador */}
      <div className="border-t border-slate-700 mt-3 w-60 ml-4" />

      {/* Configurações */}
      <nav className="mt-8">

        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `flex items-center gap-1.5 ml-3 w-55 p-2 pl-3 rounded-lg
            ${isActive ? "bg-blue-500" : "hover:bg-slate-800"}`
          }
        >
          <Settings size={20} />
          <span>Configurações</span>
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;