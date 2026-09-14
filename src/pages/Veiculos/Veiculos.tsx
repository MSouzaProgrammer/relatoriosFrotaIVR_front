import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  CarFront,
} from "lucide-react";

import { useEffect, useState } from "react";

import BotaoVeiculo from "./botaoVeiculos";
import api from "../../services/api";

interface Veiculo {
  id: number;
  placa: string;
  modelosVeiculos: string;
  marca: string;
  ano: number;
  km: number;
  filial: string;
  status: "ATIVO" | "INATIVO";
}

function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(
    []
  );

  const [busca, setBusca] = useState("");

  const [menuAberto, setMenuAberto] =
    useState<number | null>(null);

  const [modalAberto, setModalAberto] =
    useState(false);

  const [veiculoEditando, setVeiculoEditando] =
    useState<Veiculo | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarVeiculos();
  }, []);

  async function carregarVeiculos() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await api<Veiculo[]>(
        "/veiculos"
      );

      setVeiculos(dados);
    } catch (error) {
      console.error(
        "Erro ao buscar veículos:",
        error
      );

      setErro(
        "Não foi possível carregar os veículos."
      );
    } finally {
      setCarregando(false);
    }
  }

  const veiculosFiltrados =
    veiculos.filter((veiculo) => {
      const termo = busca
        .toLowerCase()
        .trim();

      if (!termo) {
        return true;
      }

      return (
        veiculo.placa
          ?.toLowerCase()
          .includes(termo) ||
        veiculo.marca
          ?.toLowerCase()
          .includes(termo) ||
        veiculo.modelosVeiculos
          ?.toLowerCase()
          .includes(termo) ||
        veiculo.filial
          ?.toLowerCase()
          .includes(termo) ||
        String(veiculo.ano).includes(termo)
      );
    });

  function abrirNovoVeiculo() {
    setVeiculoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(
    veiculo: Veiculo
  ) {
    setVeiculoEditando(veiculo);
    setModalAberto(true);
    setMenuAberto(null);
  }

  function fecharModal() {
    setModalAberto(false);
    setVeiculoEditando(null);
  }

  async function salvarVeiculo(
    dados: Omit<Veiculo, "id">
  ) {
    try {
      setErro("");

      if (veiculoEditando) {
        await api(
          `/veiculos/${veiculoEditando.id}`,
          {
            method: "PUT",
            body: JSON.stringify(dados),
          }
        );
      } else {
        await api("/veiculos", {
          method: "POST",
          body: JSON.stringify(dados),
        });
      }

      await carregarVeiculos();

      fecharModal();
    } catch (error) {
      console.error(
        "Erro ao salvar veículo:",
        error
      );

      setErro(
        "Não foi possível salvar o veículo."
      );
    }
  }

  async function alternarStatus(
    id: number
  ) {
    const veiculo = veiculos.find(
      (item) => item.id === id
    );

    if (!veiculo) {
      return;
    }

    try {
      setErro("");
      setMenuAberto(null);

      await api(`/veiculos/${id}`, {
        method: "PUT",

        body: JSON.stringify({
          placa: veiculo.placa,

          modelosVeiculos:
            veiculo.modelosVeiculos,

          marca: veiculo.marca,

          ano: veiculo.ano,

          km: veiculo.km,

          filial: veiculo.filial,

          status:
            veiculo.status === "ATIVO"
              ? "INATIVO"
              : "ATIVO",
        }),
      });

      await carregarVeiculos();

    } catch (error) {
      console.error(
        "Erro ao alterar status:",
        error
      );

      setErro(
        "Não foi possível alterar o status do veículo."
      );
    }
  }

  async function excluirVeiculo(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "Tem certeza que deseja excluir este veículo?"
      );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");
      setMenuAberto(null);

      await api(`/veiculos/${id}`, {
        method: "DELETE",
      });

      await carregarVeiculos();

    } catch (error) {
      console.error(
        "Erro ao excluir veículo:",
        error
      );

      setErro(
        "Não foi possível excluir o veículo."
      );
    }
  }

  function nomeFilial(
    filial: string
  ) {
    switch (filial) {
      case "MATRIZ":
        return "Matriz";

      case "AQUIDAUANA_ANASTACIO":
        return "Aquidauana / Anastácio";

      case "DOIS_IRMAOS_BURITI":
        return "D.I.B";

      case "NIOAQUE":
        return "Nioaque";

      case "JARDIM_GUIA_LOPES":
        return "Jardim / Guia Lopes";

      case "BONITO":
        return "Bonito";

      case "BODOQUENA":
        return "Bodoquena";

      default:
        return filial || "-";
    }
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
          Novo veículo
        </button>

      </div>

      {/* ERRO */}
      {erro && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

          <span className="text-sm text-red-600">
            {erro}
          </span>

          <button
            type="button"
            onClick={() => setErro("")}
            className="text-xs text-red-600 hover:underline cursor-pointer"
          >
            Fechar
          </button>

        </div>
      )}

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
              placeholder="Pesquisar placa, marca, modelo ou filial..."
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

          <div className="min-w-262.5">

            {/* CABEÇALHO */}
            <div
              className="
                grid
                grid-cols-[1.1fr_1fr_1.7fr_0.8fr_1fr_1.5fr_0.9fr_50px]
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
              <span>Marca</span>
              <span>Modelo</span>
              <span>Ano</span>
              <span>KM</span>
              <span>Filial</span>
              <span>Status</span>
              <span></span>

            </div>

            {/* CARREGANDO */}
            {carregando ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400">

                <CarFront
                  size={32}
                  strokeWidth={1.8}
                />

                <p className="text-sm mt-2">
                  Carregando veículos...
                </p>

              </div>

            ) : veiculosFiltrados.length > 0 ? (

              veiculosFiltrados.map(
                (veiculo) => (
                  <div
                    key={veiculo.id}
                    className="
                      grid
                      grid-cols-[1.1fr_1fr_1.7fr_0.8fr_1fr_1.5fr_0.9fr_50px]
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

                    {/* MARCA */}
                    <span className="truncate pr-3">
                      {veiculo.marca}
                    </span>

                    {/* MODELO */}
                    <span className="truncate pr-3">
                      {veiculo.modelosVeiculos}
                    </span>

                    {/* ANO */}
                    <span className="text-slate-500">
                      {veiculo.ano}
                    </span>

                    {/* KM */}
                    <span className="text-slate-500">
                      {veiculo.km?.toLocaleString(
                        "pt-BR"
                      )}{" "}
                      km
                    </span>

                    {/* FILIAL */}
                    <span className="truncate pr-3">
                      {nomeFilial(
                        veiculo.filial
                      )}
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
                            veiculo.status ===
                            "ATIVO"
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
                            menuAberto ===
                              veiculo.id
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

                      {menuAberto ===
                        veiculo.id && (
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
                              abrirEdicao(
                                veiculo
                              )
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

                          {/* STATUS */}
                          <button
                            type="button"
                            onClick={() =>
                              alternarStatus(
                                veiculo.id
                              )
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

                            {veiculo.status ===
                            "ATIVO"
                              ? "Inativar"
                              : "Ativar"}
                          </button>

                          {/* EXCLUIR */}
                          <button
                            type="button"
                            onClick={() =>
                              excluirVeiculo(
                                veiculo.id
                              )
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
                )
              )

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
                  Cadastre um veículo ou pesquise novamente.
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