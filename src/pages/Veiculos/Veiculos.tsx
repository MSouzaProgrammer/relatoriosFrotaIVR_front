import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  CarFront,
} from "lucide-react";

import { useState } from "react";
import BotaoVeiculo from "./botaoVeiculos";

interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  ano: number;
  filial: string;
  motorista: string;
  status: "ATIVO" | "INATIVO";
}

function Veiculos() {
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [veiculoEditando, setVeiculoEditando] =
    useState<Veiculo | null>(null);

  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    {
      id: 1,
      placa: "SMJ-7A36",
      modelo: "Saveiro Robust",
      ano: 2025,
      filial: "Matriz",
      motorista: "João",
      status: "ATIVO",
    },
    {
      id: 2,
      placa: "SMG-3J80",
      modelo: "Saveiro Robust",
      ano: 2025,
      filial: "Jardim",
      motorista: "Rafael",
      status: "ATIVO",
    },
    {
      id: 3,
      placa: "SMJ-1D19",
      modelo: "Hilux CD SRVA",
      ano: 2025,
      filial: "Matriz",
      motorista: "IVRNET",
      status: "ATIVO",
    },
    {
      id: 4,
      placa: "RWE-7D00",
      modelo: "BMW 320I M Sport",
      ano: 2025,
      filial: "Aquidauana",
      motorista: "Henrique",
      status: "INATIVO",
    },
  ]);

  const veiculosFiltrados = veiculos.filter((veiculo) => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return true;
    }

    return (
      veiculo.placa.toLowerCase().includes(termo) ||
      veiculo.modelo.toLowerCase().includes(termo) ||
      veiculo.motorista.toLowerCase().includes(termo) ||
      veiculo.filial.toLowerCase().includes(termo)
    );
  });

  function abrirNovoVeiculo() {
    setVeiculoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(veiculo: Veiculo) {
    setVeiculoEditando(veiculo);
    setModalAberto(true);
    setMenuAberto(null);
  }

  function fecharModal() {
    setModalAberto(false);
    setVeiculoEditando(null);
  }

  function salvarVeiculo(
    dados: Omit<Veiculo, "id">
  ) {
    if (veiculoEditando) {
      setVeiculos((veiculosAtuais) =>
        veiculosAtuais.map((veiculo) =>
          veiculo.id === veiculoEditando.id
            ? {
                ...veiculo,
                ...dados,
              }
            : veiculo
        )
      );
    } else {
      const novoVeiculo: Veiculo = {
        id:
          veiculos.length > 0
            ? Math.max(
                ...veiculos.map((veiculo) => veiculo.id)
              ) + 1
            : 1,
        ...dados,
      };

      setVeiculos((veiculosAtuais) => [
        ...veiculosAtuais,
        novoVeiculo,
      ]);
    }

    fecharModal();
  }

  function alternarStatus(id: number) {
    setVeiculos((veiculosAtuais) =>
      veiculosAtuais.map((veiculo) =>
        veiculo.id === id
          ? {
              ...veiculo,
              status:
                veiculo.status === "ATIVO"
                  ? "INATIVO"
                  : "ATIVO",
            }
          : veiculo
      )
    );

    setMenuAberto(null);
  }

  function excluirVeiculo(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este veículo?"
    );

    if (!confirmar) {
      return;
    }

    setVeiculos((veiculosAtuais) =>
      veiculosAtuais.filter(
        (veiculo) => veiculo.id !== id
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
            Veículos
          </h1>

          <p className="text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-slate-600 font-light mt-0.5">
            Visualize e gerencie os veículos cadastrados na frota.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNovoVeiculo}
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
          Novo veículo
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
              placeholder="Pesquisar veículo..."
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
            {veiculosFiltrados.length}{" "}
            {veiculosFiltrados.length === 1
              ? "veículo"
              : "veículos"}
          </span>

        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">

          <div className="min-w-225">

            {/* CABEÇALHO */}
            <div
              className="
                grid
                grid-cols-[1.1fr_2fr_0.8fr_1.2fr_1.4fr_0.8fr_50px]
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
              <span>Placa</span>
              <span>Veículo</span>
              <span>Ano</span>
              <span>Filial</span>
              <span>Motorista</span>
              <span>Status</span>
              <span></span>
            </div>

            {/* REGISTROS */}
            {veiculosFiltrados.length > 0 ? (
              veiculosFiltrados.map((veiculo) => (
                <div
                  key={veiculo.id}
                  className="
                    grid
                    grid-cols-[1.1fr_2fr_0.8fr_1.2fr_1.4fr_0.8fr_50px]
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

                  {/* PLACA */}
                  <span className="font-semibold">
                    <span className="inline-flex bg-slate-100 px-2 py-1 rounded-md">
                      {veiculo.placa}
                    </span>
                  </span>

                  {/* VEÍCULO */}
                  <span className="truncate pr-3">
                    {veiculo.modelo}
                  </span>

                  {/* ANO */}
                  <span className="text-slate-500">
                    {veiculo.ano}
                  </span>

                  {/* FILIAL */}
                  <span className="truncate pr-3">
                    {veiculo.filial}
                  </span>

                  {/* MOTORISTA */}
                  <span className="text-slate-500 truncate pr-3">
                    {veiculo.motorista}
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
                          veiculo.status === "ATIVO"
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      {veiculo.status}
                    </span>
                  </span>

                  {/* AÇÕES */}
                  <div className="relative flex justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        setMenuAberto(
                          menuAberto === veiculo.id
                            ? null
                            : veiculo.id
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

                    {menuAberto === veiculo.id && (
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
                            abrirEdicao(veiculo)
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

                        {/* INATIVAR / ATIVAR */}
                        <button
                          type="button"
                          onClick={() =>
                            alternarStatus(veiculo.id)
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

                          {veiculo.status === "ATIVO"
                            ? "Inativar"
                            : "Ativar"}
                        </button>

                        {/* EXCLUIR */}
                        <button
                          type="button"
                          onClick={() =>
                            excluirVeiculo(veiculo.id)
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

                <CarFront
                  size={32}
                  strokeWidth={1.8}
                />

                <p className="text-sm mt-2">
                  Nenhum veículo encontrado
                </p>

                <p className="text-xs mt-1">
                  Tente pesquisar por outra placa ou modelo.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL */}
      {modalAberto && (
        <BotaoVeiculo
          veiculo={veiculoEditando}
          onFechar={fecharModal}
          onSalvar={salvarVeiculo}
        />
      )}

    </div>
  );
}

export default Veiculos;