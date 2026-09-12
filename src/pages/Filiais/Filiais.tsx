import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  Building2,
} from "lucide-react";

import { useState } from "react";
import BotaoFilial from "./BotaoFiliai";

interface Filial {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
  status: "ATIVA" | "INATIVA";
}

function Filiais() {
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [filialEditando, setFilialEditando] =
    useState<Filial | null>(null);

  const [filiais, setFiliais] = useState<Filial[]>([
    {
      id: 1,
      nome: "Matriz",
      cidade: "Sidrolândia",
      estado: "MS",
      responsavel: "Mateus Souza",
      status: "ATIVA",
    },
    {
      id: 2,
      nome: "Aquidauana / Anastácio",
      cidade: "Aquidauana",
      estado: "MS",
      responsavel: "Rafael",
      status: "ATIVA",
    },
    {
      id: 3,
      nome: "Dois Irmãos do Buriti",
      cidade: "Dois Irmãos do Buriti",
      estado: "MS",
      responsavel: "João",
      status: "ATIVA",
    },
    {
      id: 4,
      nome: "Nioaque",
      cidade: "Nioaque",
      estado: "MS",
      responsavel: "Carlos",
      status: "ATIVA",
    },
    {
      id: 5,
      nome: "Jardim / Guia Lopes",
      cidade: "Jardim",
      estado: "MS",
      responsavel: "Henrique",
      status: "ATIVA",
    },
    {
      id: 6,
      nome: "Bonito",
      cidade: "Bonito",
      estado: "MS",
      responsavel: "Pedro",
      status: "ATIVA",
    },
    {
      id: 7,
      nome: "Bodoquena",
      cidade: "Bodoquena",
      estado: "MS",
      responsavel: "Felipe",
      status: "ATIVA",
    },
  ]);

  const filiaisFiltradas = filiais.filter((filial) => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return true;
    }

    return (
      filial.nome.toLowerCase().includes(termo) ||
      filial.cidade.toLowerCase().includes(termo) ||
      filial.estado.toLowerCase().includes(termo) ||
      filial.responsavel.toLowerCase().includes(termo)
    );
  });

  function abrirNovaFilial() {
    setFilialEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(filial: Filial) {
    setFilialEditando(filial);
    setModalAberto(true);
    setMenuAberto(null);
  }

  function fecharModal() {
    setModalAberto(false);
    setFilialEditando(null);
  }

  function salvarFilial(
    dados: Omit<Filial, "id">
  ) {
    if (filialEditando) {
      setFiliais((filiaisAtuais) =>
        filiaisAtuais.map((filial) =>
          filial.id === filialEditando.id
            ? {
                ...filial,
                ...dados,
              }
            : filial
        )
      );
    } else {
      const novaFilial: Filial = {
        id:
          filiais.length > 0
            ? Math.max(
                ...filiais.map((filial) => filial.id)
              ) + 1
            : 1,
        ...dados,
      };

      setFiliais((filiaisAtuais) => [
        ...filiaisAtuais,
        novaFilial,
      ]);
    }

    fecharModal();
  }

  function alternarStatus(id: number) {
    setFiliais((filiaisAtuais) =>
      filiaisAtuais.map((filial) =>
        filial.id === id
          ? {
              ...filial,
              status:
                filial.status === "ATIVA"
                  ? "INATIVA"
                  : "ATIVA",
            }
          : filial
      )
    );

    setMenuAberto(null);
  }

  function excluirFilial(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta filial?"
    );

    if (!confirmar) {
      return;
    }

    setFiliais((filiaisAtuais) =>
      filiaisAtuais.filter(
        (filial) => filial.id !== id
      )
    );

    setMenuAberto(null);
  }

  return (
    <div className="w-full px-3 lg:px-4 xl:px-6 2xl:px-8 mt-3 lg:mt-4 xl:mt-5 pb-4">

      {/* CABEÇALHO */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <h1 className="text-lg lg:text-xl xl:text-2xl 2xl:text-[27px] font-bold text-slate-900">
            Filiais
          </h1>

          <p className="text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-slate-600 font-light mt-0.5">
            Visualize e gerencie as filiais cadastradas no sistema.
          </p>

        </div>

        <button
          type="button"
          onClick={abrirNovaFilial}
          className="
            flex
            items-center
            justify-center
            gap-1.5
            h-8
            lg:h-9
            xl:h-10
            px-2.5
            lg:px-3
            xl:px-4
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-md
            text-[10px]
            lg:text-[11px]
            xl:text-xs
            2xl:text-sm
            font-medium
            cursor-pointer
            shrink-0
          "
        >
          <Plus size={16} />
          Nova filial
        </button>

      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="mt-4 lg:mt-5 bg-white border border-slate-200 rounded-lg overflow-hidden">

        {/* BUSCA */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            p-2.5
            lg:p-3
            xl:p-4
            border-b
            border-slate-200
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              h-8
              lg:h-9
              xl:h-10
              w-full
              max-w-95
              bg-slate-50
              border
              border-slate-200
              rounded-md
              px-2.5
              focus-within:border-blue-500
              focus-within:ring-1
              focus-within:ring-blue-500
            "
          >

            <Search
              size={16}
              className="text-slate-400 shrink-0"
            />

            <input
              type="text"
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
              placeholder="Pesquisar filial..."
              className="
                w-full
                min-w-0
                h-full
                bg-transparent
                outline-none
                text-[10px]
                lg:text-xs
                xl:text-sm
                text-slate-700
                placeholder:text-slate-400
              "
            />

          </div>

          <span className="text-[10px] lg:text-xs xl:text-sm text-slate-500 whitespace-nowrap">
            {filiaisFiltradas.length}{" "}
            {filiaisFiltradas.length === 1
              ? "filial"
              : "filiais"}
          </span>

        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">

          <div className="min-w-200">

            {/* CABEÇALHO */}
            <div
              className="
                grid
                grid-cols-[2fr_1.3fr_0.7fr_1.4fr_0.9fr_50px]
                items-center
                h-9
                lg:h-10
                px-3
                lg:px-4
                bg-slate-100
                text-[10px]
                lg:text-xs
                font-semibold
                text-slate-600
              "
            >
              <span>Filial</span>
              <span>Cidade</span>
              <span>UF</span>
              <span>Responsável</span>
              <span>Status</span>
              <span></span>
            </div>

            {/* REGISTROS */}
            {filiaisFiltradas.length > 0 ? (
              filiaisFiltradas.map((filial) => (
                <div
                  key={filial.id}
                  className="
                    grid
                    grid-cols-[2fr_1.3fr_0.7fr_1.4fr_0.9fr_50px]
                    items-center
                    min-h-10
                    lg:min-h-11
                    xl:min-h-12
                    px-3
                    lg:px-4
                    border-b
                    border-slate-200
                    text-[10px]
                    lg:text-xs
                    xl:text-sm
                    text-slate-800
                    hover:bg-slate-50
                  "
                >

                  {/* FILIAL */}
                  <span className="flex items-center gap-2 font-medium truncate pr-3">

                    <span className="w-7 h-7 rounded-md bg-green-100 flex items-center justify-center shrink-0">
                      <Building2
                        size={15}
                        className="text-green-600"
                      />
                    </span>

                    <span className="truncate">
                      {filial.nome}
                    </span>

                  </span>

                  {/* CIDADE */}
                  <span className="text-slate-600 truncate pr-3">
                    {filial.cidade}
                  </span>

                  {/* UF */}
                  <span className="text-slate-500">
                    {filial.estado}
                  </span>

                  {/* RESPONSÁVEL */}
                  <span className="text-slate-500 truncate pr-3">
                    {filial.responsavel}
                  </span>

                  {/* STATUS */}
                  <span>

                    <span
                      className={`
                        inline-flex
                        px-2
                        py-1
                        rounded-md
                        text-[9px]
                        lg:text-[10px]
                        font-semibold
                        ${
                          filial.status === "ATIVA"
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      {filial.status}
                    </span>

                  </span>

                  {/* AÇÕES */}
                  <div className="relative flex justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        setMenuAberto(
                          menuAberto === filial.id
                            ? null
                            : filial.id
                        )
                      }
                      className="
                        w-7
                        h-7
                        flex
                        items-center
                        justify-center
                        rounded-md
                        hover:bg-slate-200
                        cursor-pointer
                      "
                    >
                      <MoreVertical
                        size={16}
                        className="text-slate-500"
                      />
                    </button>

                    {menuAberto === filial.id && (
                      <div
                        className="
                          absolute
                          right-0
                          top-8
                          z-30
                          w-40
                          bg-white
                          border
                          border-slate-200
                          rounded-lg
                          shadow-lg
                          p-1
                        "
                      >

                        {/* EDITAR */}
                        <button
                          type="button"
                          onClick={() =>
                            abrirEdicao(filial)
                          }
                          className="
                            w-full
                            flex
                            items-center
                            gap-2
                            px-2.5
                            py-2
                            rounded-md
                            text-xs
                            text-slate-700
                            hover:bg-slate-100
                            cursor-pointer
                          "
                        >
                          <Pencil size={15} />
                          Editar
                        </button>

                        {/* ATIVAR / INATIVAR */}
                        <button
                          type="button"
                          onClick={() =>
                            alternarStatus(filial.id)
                          }
                          className="
                            w-full
                            flex
                            items-center
                            gap-2
                            px-2.5
                            py-2
                            rounded-md
                            text-xs
                            text-slate-700
                            hover:bg-slate-100
                            cursor-pointer
                          "
                        >
                          <Power size={15} />

                          {filial.status === "ATIVA"
                            ? "Inativar"
                            : "Ativar"}
                        </button>

                        {/* EXCLUIR */}
                        <button
                          type="button"
                          onClick={() =>
                            excluirFilial(filial.id)
                          }
                          className="
                            w-full
                            flex
                            items-center
                            gap-2
                            px-2.5
                            py-2
                            rounded-md
                            text-xs
                            text-red-600
                            hover:bg-red-50
                            cursor-pointer
                          "
                        >
                          <Trash2 size={15} />
                          Excluir
                        </button>

                      </div>
                    )}

                  </div>

                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">

                <Building2
                  size={32}
                  strokeWidth={1.8}
                />

                <p className="text-sm mt-2">
                  Nenhuma filial encontrada
                </p>

                <p className="text-xs mt-1">
                  Tente pesquisar por outro nome ou cidade.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL */}
      {modalAberto && (
        <BotaoFilial
          filial={filialEditando}
          onFechar={fecharModal}
          onSalvar={salvarFilial}
        />
      )}

    </div>
  );
}

export default Filiais;