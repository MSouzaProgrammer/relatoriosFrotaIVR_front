import {
  LucideTruck,
  LucideHome,
  Droplet,
  Wrench,
  Activity,
  Settings,
  LucideCar,
  UserRound

} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `
      flex items-center gap-2
      w-full
      px-2
      xl:px-2.5
      2xl:px-3
      py-1.5
      xl:py-2
      2xl:py-2.5
      rounded-md
      text-[11px]
      xl:text-xs
      2xl:text-sm
      transition-colors
      ${isActive ? "bg-blue-500" : "hover:bg-slate-800"}
    `;

  return (
    <aside
      className="
        fixed
        top-0
        left-0
        z-40
        hidden
        md:flex
        flex-col
        h-screen

        w-48
        lg:w-52
        xl:w-60
        2xl:w-72

        shrink-0
        bg-[#0F172A]
        text-white
      "
    >
      {/* LOGO */}
      <div
        className="
          flex items-center
          gap-2
          px-2.5
          xl:gap-2.5
          xl:px-3
          2xl:gap-3
          2xl:px-4
          pt-3
          xl:pt-4
          2xl:pt-5
        "
      >
        <div
          className="
            bg-blue-500
            w-8
            h-8
            xl:w-9
            xl:h-9
            2xl:w-10
            2xl:h-10
            flex
            items-center
            justify-center
            rounded-md
            shrink-0
          "
        >
          <LucideTruck
            size={19}
            strokeWidth={2.5}
            className="
              xl:w-5.25
              xl:h-5.25
              2xl:w-5.75
              2xl:h-5.75
            "
          />
        </div>

        <div className="min-w-0">
          <h1
            className="
              text-xs
              xl:text-sm
              2xl:text-lg
              font-bold
              truncate
            "
          >
            Controle de Frota
          </h1>

          <p
            className="
              text-[9px]
              xl:text-[11px]
              2xl:text-sm
              text-slate-400
              leading-none
              truncate
              mt-0.5
            "
          >
            Gestão de despesas
          </p>
        </div>
      </div>

      {/* MENU */}
      <nav
        className="
          flex flex-col
          gap-1
          xl:gap-2
          2xl:gap-2.5
          mt-7
          xl:mt-8
          2xl:mt-10
          px-2.5
          xl:px-3
        "
      >
        <NavLink to="/" className={linkClass}>
          <LucideHome size={17} strokeWidth={2.3} />

          <span>Visão geral</span>
        </NavLink>

        <NavLink to="/abastecimentos" className={linkClass}>
          <Droplet size={17} strokeWidth={2.3} />

          <span>Abastecimento</span>
        </NavLink>

        <NavLink to="/manutencao" className={linkClass}>
          <Wrench size={17} strokeWidth={2.3} />

          <span>Manutenção</span>
        </NavLink>

        <NavLink to="/relatorio" className={linkClass}>
          <Activity size={17} strokeWidth={2.3} />

          <span>Média KM/L</span>
        </NavLink>
      </nav>

      {/* SEPARADOR */}
      <div
        className="
          border-t
          border-slate-700
          mx-2.5
          xl:mx-3
          2xl:mx-4
          mt-4
          xl:mt-5
          2xl:mt-6
        "
      />

      {/* CONFIGURAÇÕES */}
      <nav
        className="
          flex flex-col
          gap-1
          xl:gap-2
          2xl:gap-2.5
          mt-7
          xl:mt-8
          2xl:mt-6
          px-2.5
          xl:px-3
        "
      >
        <NavLink to="/veiculos" className={linkClass}>
          <LucideCar size={17} strokeWidth={2.3} />

          <span>Veículos</span>
        </NavLink>

        <NavLink to="/motoristas" className={linkClass}>
          <UserRound size={17} strokeWidth={2.3} />

          <span>Motoristas</span>
        </NavLink>

        <NavLink to="/configuracoes" className={linkClass}>
          <Settings size={17} strokeWidth={2.3} />

          <span>Configurações</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
