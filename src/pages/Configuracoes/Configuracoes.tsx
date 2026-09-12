import {
  User,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Database,
  LogOut,
  ChevronRight,
} from "lucide-react";

function Configuracoes() {
  return (
    <div
      className="
        w-full
        h-[calc(100vh-48px)]
        lg:h-[calc(100vh-56px)]
        2xl:h-[calc(100vh-72px)]
        overflow-y-auto
        px-3
        lg:px-4
        2xl:px-8
        pt-3
        lg:pt-4
        2xl:pt-7
        pb-3
      "
    >
      {/* TÍTULO */}
      <div>
        <h1
          className="
            text-lg
            lg:text-xl
            2xl:text-[27px]
            font-bold
            text-slate-900
          "
        >
          Configurações
        </h1>

        <p
          className="
            text-[10px]
            lg:text-[11px]
            2xl:text-sm
            text-slate-600
            font-light
            mt-0.5
          "
        >
          Gerencie usuários, veículos, filiais e preferências do sistema.
        </p>
      </div>

      {/* CONTEÚDO */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-2
          lg:gap-3
          2xl:gap-5
          mt-3
          lg:mt-4
          2xl:mt-6
        "
      >
        {/* PERFIL */}
        <div
          className="
            bg-white
            border border-slate-200
            rounded-lg
            p-2.5
            lg:p-3
            2xl:p-5
          "
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 lg:gap-2.5 2xl:gap-3 min-w-0">
              <div
                className="
                  w-8 h-8
                  lg:w-9 lg:h-9
                  2xl:w-11 2xl:h-11
                  shrink-0
                  rounded-md
                  bg-blue-100
                  flex items-center justify-center
                "
              >
                <User
                  size={16}
                  className="text-blue-600 2xl:w-5.5l:h-[22px]"
                  strokeWidth={2.5}
                />
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-xs
                    lg:text-sm
                    2xl:text-lg
                    font-bold
                    text-slate-900
                    truncate
                  "
                >
                  Meu perfil
                </h2>

                <p
                  className="
                    text-[9px]
                    lg:text-[10px]
                    2xl:text-sm
                    text-slate-500
                    truncate
                  "
                >
                  Informações da sua conta
                </p>
              </div>
            </div>

            <ChevronRight
              size={15}
              className="text-slate-400 shrink-0"
            />
          </div>

          <div
            className="
              mt-2.5
              lg:mt-3
              2xl:mt-5
              space-y-1.5
              lg:space-y-2
            "
          >
            <div>
              <label
                className="
                  text-[9px]
                  lg:text-[10px]
                  2xl:text-sm
                  text-slate-500
                "
              >
                Nome
              </label>

              <input
                type="text"
                defaultValue="Mateus Souza"
                className="
                  w-full
                  h-7
                  lg:h-8
                  2xl:h-10
                  mt-0.5
                  px-2
                  lg:px-2.5
                  border border-slate-200
                  rounded-md
                  text-[10px]
                  lg:text-[11px]
                  2xl:text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>

            <div>
              <label
                className="
                  text-[9px]
                  lg:text-[10px]
                  2xl:text-sm
                  text-slate-500
                "
              >
                E-mail
              </label>

              <input
                type="email"
                defaultValue="mateus@email.com"
                className="
                  w-full
                  h-7
                  lg:h-8
                  2xl:h-10
                  mt-0.5
                  px-2
                  lg:px-2.5
                  border border-slate-200
                  rounded-md
                  text-[10px]
                  lg:text-[11px]
                  2xl:text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>
          </div>

          <button
            className="
              mt-2.5
              lg:mt-3
              2xl:mt-4
              px-2.5
              lg:px-3
              2xl:px-4
              py-1
              lg:py-1.5
              2xl:py-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-[10px]
              lg:text-[11px]
              2xl:text-sm
              rounded-md
              cursor-pointer
            "
          >
            Salvar alterações
          </button>
        </div>

        {/* SEGURANÇA */}
        <div
          className="
            bg-white
            border border-slate-200
            rounded-lg
            p-2.5
            lg:p-3
            2xl:p-5
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                w-8 h-8
                lg:w-9 lg:h-9
                2xl:w-11 2xl:h-11
                rounded-md
                bg-red-100
                flex items-center justify-center
                shrink-0
              "
            >
              <Shield
                size={16}
                className="text-red-600 2xl:w-5.5 2xl:h-5.5"
                strokeWidth={2.5}
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-xs
                  lg:text-sm
                  2xl:text-lg
                  font-bold
                  text-slate-900
                "
              >
                Segurança
              </h2>

              <p
                className="
                  text-[9px]
                  lg:text-[10px]
                  2xl:text-sm
                  text-slate-500
                  truncate
                "
              >
                Controle de acesso à sua conta
              </p>
            </div>
          </div>

          <div
            className="
              mt-2.5
              lg:mt-3
              2xl:mt-4
              space-y-1.5
              lg:space-y-2
            "
          >
            <button
              className="
                w-full
                h-8
                lg:h-9
                2xl:h-10
                flex
                items-center
                justify-between
                px-2
                lg:px-2.5
                2xl:px-3
                border border-slate-200
                rounded-md
                hover:bg-slate-50
                cursor-pointer
              "
            >
              <span
                className="
                  text-[10px]
                  lg:text-[11px]
                  2xl:text-sm
                  text-slate-700
                "
              >
                Alterar senha
              </span>

              <ChevronRight
                size={15}
                className="text-slate-400"
              />
            </button>

            <button
              className="
                w-full
                h-8
                lg:h-9
                2xl:h-10
                flex
                items-center
                justify-between
                px-2
                lg:px-2.5
                2xl:px-3
                border border-slate-200
                rounded-md
                hover:bg-slate-50
                cursor-pointer
              "
            >
              <span
                className="
                  text-[10px]
                  lg:text-[11px]
                  2xl:text-sm
                  text-slate-700
                "
              >
                Gerenciar sessões
              </span>

              <ChevronRight
                size={15}
                className="text-slate-400"
              />
            </button>
          </div>
        </div>

        {/* SISTEMA */}
        <div
          className="
            md:col-span-2
            bg-white
            border border-slate-200
            rounded-lg
            p-2.5
            lg:p-3
            2xl:p-5
          "
        >
          <div className="flex items-center gap-2.5">

            <div
              className="
                w-8 h-8
                lg:w-9 lg:h-9
                2xl:w-11 2xl:h-11
                rounded-md
                bg-slate-100
                flex items-center justify-center
                shrink-0
              "
            >
              <SettingsIcon
                size={16}
                className="text-slate-600 2xl:w-5.5 2xl:h-5.5"
                strokeWidth={2.5}
              />
            </div>

            <div className="min-w-0">

              <h2
                className="
                  text-xs
                  lg:text-sm
                  2xl:text-lg
                  font-bold
                  text-slate-900
                "
              >
                Configurações do Sistema
              </h2>

              <p
                className="
                  text-[9px]
                  lg:text-[10px]
                  2xl:text-sm
                  text-slate-500
                  truncate
                "
              >
                Preferências gerais do Controle de Frota
              </p>

            </div>

          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-2
              xl:gap-2.5
              2xl:gap-4
              mt-2.5
              lg:mt-3
              2xl:mt-5
            "
          >

            {/* NOTIFICAÇÕES */}
            <button
              className="
                min-h-9
                xl:min-h-10
                2xl:min-h-11
                flex
                items-center
                gap-2
                px-2.5
                lg:px-3
                2xl:px-4
                border border-slate-200
                rounded-md
                hover:bg-slate-50
                cursor-pointer
              "
            >
              <Bell
                size={16}
                className="text-slate-500 2xl:w-5 2xl:h-5 shrink-0"
              />

              <div className="text-left min-w-0">
                <p
                  className="
                    text-[10px]
                    lg:text-[11px]
                    2xl:text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Notificações
                </p>

                <p
                  className="
                    text-[8px]
                    lg:text-[9px]
                    2xl:text-xs
                    text-slate-500
                    truncate
                  "
                >
                  Preferências de alertas
                </p>
              </div>
            </button>

            {/* DADOS */}
            <button
              className="
                min-h-9
                xl:min-h-10
                2xl:min-h-11
                flex
                items-center
                gap-2
                px-2.5
                lg:px-3
                2xl:px-4
                border border-slate-200
                rounded-md
                hover:bg-slate-50
                cursor-pointer
              "
            >
              <Database
                size={16}
                className="text-slate-500 2xl:w-5 2xl:h-5 shrink-0"
              />

              <div className="text-left min-w-0">
                <p
                  className="
                    text-[10px]
                    lg:text-[11px]
                    2xl:text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Dados
                </p>

                <p
                  className="
                    text-[8px]
                    lg:text-[9px]
                    2xl:text-xs
                    text-slate-500
                    truncate
                  "
                >
                  Backup e informações
                </p>
              </div>
            </button>

            {/* SAIR */}
            <button
              className="
                min-h-9
                xl:min-h-10
                2xl:min-h-11
                flex
                items-center
                gap-2
                px-2.5
                lg:px-3
                2xl:px-4
                border border-red-200
                rounded-md
                hover:bg-red-50
                cursor-pointer
              "
            >
              <LogOut
                size={16}
                className="text-red-500 2xl:w-5 2xl:h-5 shrink-0"
              />

              <div className="text-left min-w-0">
                <p
                  className="
                    text-[10px]
                    lg:text-[11px]
                    2xl:text-sm
                    font-medium
                    text-red-600
                  "
                >
                  Sair
                </p>

                <p
                  className="
                    text-[8px]
                    lg:text-[9px]
                    2xl:text-xs
                    text-red-400
                    truncate
                  "
                >
                  Encerrar sessão
                </p>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Configuracoes;