import {
  MapPin,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200">

      <div
        className="
          flex
          items-center
          gap-3
          px-3
          lg:px-4
          xl:px-5
          2xl:px-8
          py-2
          lg:py-2.5
          2xl:py-3
        "
      >

        {/* BUSCA */}
        <div
          className="
            flex
            items-center
            gap-2
            h-9
            lg:h-10
            2xl:h-11
            flex-1
            min-w-0
            max-w-105
            bg-[#F1F5F9]
            rounded-lg
            px-2.5
            lg:px-3
            hover:bg-[#E5EBF0]
            transition-colors
          "
        >
          <Search
            size={17}
            className="text-slate-600 shrink-0"
            strokeWidth={2.5}
          />

          <input
            type="text"
            placeholder="Buscar placas, motoristas ou filiais..."
            className="
              w-full
              min-w-0
              h-full
              bg-transparent
              outline-none
              text-xs
              lg:text-sm
              2xl:text-sm
              text-slate-700
              placeholder:text-slate-400
            "
          />
        </div>

        {/* LADO DIREITO */}
        <div
          className="
            flex
            items-center
            gap-2
            lg:gap-3
            xl:gap-4
            2xl:gap-5
            ml-auto
            shrink-0
          "
        >

          {/* FILIAIS */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-1
              h-8
              lg:h-9
              2xl:h-10
              px-2
              lg:px-2.5
              2xl:px-3
              rounded-lg
              bg-blue-100
              hover:bg-blue-200
              text-blue-600
              cursor-pointer
              shrink-0
            "
          >
            <MapPin
              size={14}
              className="shrink-0"
              strokeWidth={2.5}
            />

            <span
              className="
                text-[10px]
                lg:text-xs
                2xl:text-sm
                font-semibold
                whitespace-nowrap
              "
            >
              7 Filiais Ativas
            </span>

            <ChevronDown
              size={14}
              className="shrink-0"
            />
          </button>

          {/* NOTIFICAÇÕES */}
          <button
            type="button"
            className="
              w-8
              h-8
              lg:w-9
              lg:h-9
              2xl:w-10
              2xl:h-10
              flex
              items-center
              justify-center
              rounded-full
              hover:bg-slate-100
              cursor-pointer
              shrink-0
            "
          >
            <Bell
              size={18}
              className="text-slate-700"
              strokeWidth={1.8}
            />
          </button>

          {/* USUÁRIO */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              rounded-lg
              p-1
              lg:p-1.5
              hover:bg-slate-100
              cursor-pointer
              shrink-0
            "
          >

            <div
              className="
                w-7
                h-7
                lg:w-8
                lg:h-8
                2xl:w-9
                2xl:h-9
                rounded-full
                bg-slate-900
                shrink-0
              "
            />

            <div className="hidden sm:block min-w-0 text-left">

              <p
                className="
                  text-[10px]
                  lg:text-xs
                  2xl:text-sm
                  font-semibold
                  text-slate-700
                  leading-tight
                  whitespace-nowrap
                "
              >
                Mateus Souza
              </p>

              <p
                className="
                  text-[9px]
                  lg:text-[10px]
                  2xl:text-xs
                  text-slate-500
                  leading-tight
                  whitespace-nowrap
                "
              >
                Administrador
              </p>

            </div>

            <ChevronDown
              size={14}
              className="text-slate-600 shrink-0"
            />

          </button>

        </div>

      </div>

    </header>
  );
}

export default Header;