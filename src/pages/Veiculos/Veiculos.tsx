import { useEffect, useMemo, useState } from "react";
import {
  Car,
  Search,
  Plus,
  Pencil,
  Power,
  PowerOff,
} from "lucide-react";

import api from "../../services/api";
import BotaoVeiculos from "./botaoVeiculos";
import Paginacao from "../../components/Paginacao";

interface Veiculo {
  id?: number;
  placa: string;
  modelosVeiculos: string;
  marca: string;
  ano: number;
  km: number;
  filial: string;
  status: string;
}

export default function Veiculos() {
  const [veiculos, setVeiculos] =
    useState<Veiculo[]>([]);

  const [busca, setBusca] =
    useState("");

  const [paginaAtual, setPaginaAtual] =
    useState(1);

  const [limite, setLimite] =
    useState(10);

  const [modalAberto, setModalAberto] =
    useState(false);

  const [veiculoSelecionado, setVeiculoSelecionado] =
    useState<Veiculo | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  /*
   * ==========================================
   * LIMITE RESPONSIVO
   * ==========================================
   */

  useEffect(() => {
    const atualizarLimite = () => {
      if (window.innerWidth < 640) {
        setLimite(2);
      } else if (window.innerWidth < 1024) {
        setLimite(1);
      } else if (window.innerWidth < 1440) {
        setLimite(1);
      } else if (window.innerWidth < 1601) {
        setLimite(2);
      } else {
        setLimite(5);
      }
    };

    atualizarLimite();

    window.addEventListener(
      "resize",
      atualizarLimite
    );

    return () => {
      window.removeEventListener(
        "resize",
        atualizarLimite
      );
    };
  }, []);

  /*
   * ==========================================
   * CARREGAR VEÍCULOS
   * ==========================================
   */

  async function carregarVeiculos() {
    try {
      setCarregando(true);

      const resposta =
        await api<Veiculo[]>("/veiculos");

      setVeiculos(resposta);
    } catch (erro) {
      console.error(
        "Erro ao carregar veículos:",
        erro
      );

      alert(
        "Erro ao carregar os veículos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarVeiculos();
  }, []);

  /*
   * ==========================================
   * FILTRO
   * ==========================================
   */

  const veiculosFiltrados = useMemo(() => {
    const texto =
      busca.trim().toLowerCase();

    if (!texto) {
      return veiculos;
    }

    return veiculos.filter(
      (veiculo) => {

        const placa =
          veiculo.placa
            ?.toLowerCase() ?? "";

        const marca =
          veiculo.marca
            ?.toLowerCase() ?? "";

        const modelo =
          veiculo.modelosVeiculos
            ?.toLowerCase() ?? "";

        const filial =
          veiculo.filial
            ?.toLowerCase() ?? "";

        const ano =
          String(
            veiculo.ano ?? ""
          );

        return (
          placa.includes(texto) ||
          marca.includes(texto) ||
          modelo.includes(texto) ||
          filial.includes(texto) ||
          ano.includes(texto)
        );
      }
    );
  }, [
    veiculos,
    busca,
  ]);

  /*
   * ==========================================
   * PAGINAÇÃO
   * ==========================================
   */

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      veiculosFiltrados.length /
        limite
    )
  );

  const veiculosPaginados = useMemo(() => {
    const inicio =
      (paginaAtual - 1) *
      limite;

    const fim =
      inicio + limite;

    return veiculosFiltrados.slice(
      inicio,
      fim
    );
  }, [
    veiculosFiltrados,
    paginaAtual,
    limite,
  ]);

  /*
   * ==========================================
   * CARDS
   * ==========================================
   */

  const total =
    veiculos.length;

  const ativos =
    veiculos.filter(
      (veiculo) =>
        veiculo.status
          ?.toUpperCase() ===
        "ATIVO"
    ).length;

  const inativos =
    veiculos.filter(
      (veiculo) =>
        veiculo.status
          ?.toUpperCase() !==
        "ATIVO"
    ).length;

  /*
   * ==========================================
   * RESETAR PAGINAÇÃO
   * ==========================================
   */

  useEffect(() => {
    setPaginaAtual(1);
  }, [
    busca,
    limite,
  ]);

  /*
   * ==========================================
   * EVITAR PÁGINA INEXISTENTE
   * ==========================================
   */

  useEffect(() => {
    if (
      paginaAtual > totalPaginas
    ) {
      setPaginaAtual(
        totalPaginas
      );
    }
  }, [
    paginaAtual,
    totalPaginas,
  ]);

  /*
   * ==========================================
   * NOVO
   * ==========================================
   */

  function abrirNovoVeiculo() {
    setVeiculoSelecionado(null);
    setModalAberto(true);
  }

  /*
   * ==========================================
   * EDIÇÃO
   * ==========================================
   */

  function abrirEdicao(
    veiculo: Veiculo
  ) {
    setVeiculoSelecionado(
      veiculo
    );

    setModalAberto(true);
  }

  /*
   * ==========================================
   * ALTERAR STATUS
   * ==========================================
   */

  async function alterarStatus(
    veiculo: Veiculo
  ) {
    if (!veiculo.id) {
      return;
    }

    const ativo =
      veiculo.status
        ?.toUpperCase() ===
      "ATIVO";

    const novoStatus =
      ativo
        ? "INATIVO"
        : "ATIVO";

    const mensagem = ativo
      ? `Deseja realmente inativar o veículo ${veiculo.placa}?`
      : `Deseja realmente ativar o veículo ${veiculo.placa}?`;

    if (!confirm(mensagem)) {
      return;
    }

    try {
      await api(
        `/veiculos/${veiculo.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            placa: veiculo.placa,
            modelosVeiculos:
              veiculo.modelosVeiculos,
            marca: veiculo.marca,
            ano: veiculo.ano,
            km: veiculo.km,
            filial: veiculo.filial,
            status: novoStatus,
          }),
        }
      );

      await carregarVeiculos();
    } catch (erro) {
      console.error(
        "Erro ao alterar status:",
        erro
      );

      alert(
        "Erro ao alterar o status do veículo."
      );
    }
  }

  /*
   * ==========================================
   * FORMATAÇÕES
   * ==========================================
   */

  function formatarPlaca(
    placa: string
  ) {
    if (!placa) {
      return "";
    }

    return placa.toUpperCase();
  }

  function formatarKm(
    km: number
  ) {
    return new Intl.NumberFormat(
      "pt-BR"
    ).format(
      km ?? 0
    );
  }

  /*
   * ==========================================
   * TELA
   * ==========================================
   */

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6">

      {/* CABEÇALHO */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

            <Car
              size={23}
              className="text-blue-600"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Veículos
            </h1>

            <p className="text-sm text-slate-500">
              Cadastre e gerencie os veículos da empresa.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={
            abrirNovoVeiculo
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >

          <Plus size={18} />

          Novo veículo

        </button>

      </div>

      {/* CARDS */}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

              <Car
                size={23}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Total
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {total}
              </p>

            </div>

          </div>

        </div>

        {/* ATIVOS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">

              <Power
                size={23}
                className="text-emerald-600"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Ativos
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {ativos}
              </p>

            </div>

          </div>

        </div>

        {/* INATIVOS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

              <PowerOff
                size={23}
                className="text-red-600"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Inativos
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {inativos}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* BUSCA */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={busca}
            onChange={(e) =>
              setBusca(
                e.target.value
              )
            }
            placeholder="Buscar por placa, marca, modelo, filial ou ano..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* TABELA */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>

            <h2 className="font-semibold text-slate-900">
              Lista de veículos
            </h2>

            <p className="text-xs text-slate-500">
              Veículos cadastrados no sistema
            </p>

          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {veiculosFiltrados.length} registros
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-275">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50 text-left">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Veículo
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Placa
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Marca
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ano
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  KM
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Filial
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ações
                </th>

              </tr>

            </thead>

            <tbody>

              {/* CARREGANDO */}

              {carregando ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Carregando veículos...
                  </td>

                </tr>

              ) : veiculosPaginados.length === 0 ? (

                /* VAZIO */

                <tr>

                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

                        <Car
                          size={22}
                          className="text-slate-400"
                        />

                      </div>

                      <p className="font-medium text-slate-700">
                        Nenhum veículo encontrado
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Tente alterar a busca.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                /* REGISTROS */

                veiculosPaginados.map(
                  (veiculo) => {

                    const ativo =
                      veiculo.status
                        ?.toUpperCase() ===
                      "ATIVO";

                    return (

                      <tr
                        key={
                          veiculo.id
                        }
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        {/* VEÍCULO */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">

                              <Car
                                size={19}
                                className="text-blue-600"
                              />

                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {
                                  veiculo.modelosVeiculos
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                ID #
                                {
                                  veiculo.id
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PLACA */}

                        <td className="px-6 py-4">

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">

                            {formatarPlaca(
                              veiculo.placa
                            )}

                          </span>

                        </td>

                        {/* MARCA */}

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {
                            veiculo.marca
                          }

                        </td>

                        {/* ANO */}

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {
                            veiculo.ano
                          }

                        </td>

                        {/* KM */}

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {
                            formatarKm(
                              veiculo.km
                            )
                          } km

                        </td>

                        {/* FILIAL */}

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {
                            veiculo.filial
                          }

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {ativo ? (

                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">

                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              Ativo

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">

                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                              Inativo

                            </span>

                          )}

                        </td>

                        {/* AÇÕES */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              title="Editar veículo"
                              onClick={() =>
                                abrirEdicao(
                                  veiculo
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                            >

                              <Pencil
                                size={17}
                              />

                            </button>

                            <button
                              type="button"
                              title={
                                ativo
                                  ? "Inativar veículo"
                                  : "Ativar veículo"
                              }
                              onClick={() =>
                                alterarStatus(
                                  veiculo
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                                ativo
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >

                              {ativo ? (
                                <PowerOff
                                  size={17}
                                />
                              ) : (
                                <Power
                                  size={17}
                                />
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINAÇÃO */}

        {!carregando && (
          <Paginacao
            paginaAtual={
              paginaAtual
            }
            totalPaginas={
              totalPaginas
            }
            totalRegistros={
              veiculosFiltrados.length
            }
            itensPorPagina={
              limite
            }
            onPaginaChange={
              setPaginaAtual
            }
            nomeRegistro="veículos"
          />
        )}

      </div>

      {/* MODAL */}

      {modalAberto && (

        <BotaoVeiculos
          veiculoSelecionado={
            veiculoSelecionado
          }
          onFechar={() => {
            setModalAberto(false);
            setVeiculoSelecionado(
              null
            );
          }}
          onSalvo={() => {
            carregarVeiculos();
          }}
        />

      )}

    </div>
  );
}