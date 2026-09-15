import { useEffect, useMemo, useState } from "react";
import {
  UserRound,
  Users,
  Search,
  Plus,
  Pencil,
  UserX,
  UserCheck,
} from "lucide-react";

import api from "../../services/api";
import BotaoMotorista from "./BotaoMotorista";
import Paginacao from "../../components/Paginacao";

interface Motorista {
  id?: number;
  nome: string;
  cpf: number | string;
  cnh: number | string;
  ativo?: boolean;
}

type FiltroStatus = "TODOS" | "ATIVOS" | "INATIVOS";

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);

  const [busca, setBusca] = useState("");

  const [filtroStatus, setFiltroStatus] =
    useState<FiltroStatus>("TODOS");

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [limite, setLimite] = useState(10);

  const [motoristaSelecionado, setMotoristaSelecionado] =
    useState<Motorista | null>(null);

  const [modalAberto, setModalAberto] = useState(false);

  const [carregando, setCarregando] = useState(true);

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
   * CARREGAR MOTORISTAS
   * ==========================================
   */

  async function carregarMotoristas() {
    try {
      setCarregando(true);

      const resposta =
        await api<Motorista[]>("/motoristas");

      setMotoristas(resposta);
    } catch (erro) {
      console.error(
        "Erro ao carregar motoristas:",
        erro
      );

      alert(
        "Erro ao carregar os motoristas."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMotoristas();
  }, []);

  /*
   * ==========================================
   * FILTRO
   * ==========================================
   */

  const motoristasFiltrados = useMemo(() => {
    const texto =
      busca.trim().toLowerCase();

    return motoristas.filter((motorista) => {
      const ativo =
        motorista.ativo !== false;

      if (
        filtroStatus === "ATIVOS" &&
        !ativo
      ) {
        return false;
      }

      if (
        filtroStatus === "INATIVOS" &&
        ativo
      ) {
        return false;
      }

      if (!texto) {
        return true;
      }

      const nome =
        motorista.nome?.toLowerCase() ?? "";

      const cpf =
        String(motorista.cpf ?? "");

      const cnh =
        String(motorista.cnh ?? "");

      return (
        nome.includes(texto) ||
        cpf.includes(texto) ||
        cnh.includes(texto)
      );
    });
  }, [
    motoristas,
    busca,
    filtroStatus,
  ]);

  /*
   * ==========================================
   * PAGINAÇÃO
   * ==========================================
   */

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      motoristasFiltrados.length /
        limite
    )
  );

  const motoristasPaginados = useMemo(() => {
    const inicio =
      (paginaAtual - 1) *
      limite;

    const fim =
      inicio + limite;

    return motoristasFiltrados.slice(
      inicio,
      fim
    );
  }, [
    motoristasFiltrados,
    paginaAtual,
    limite,
  ]);

  /*
   * ==========================================
   * QUANTIDADES DOS CARDS
   * ==========================================
   */

  const total =
    motoristas.length;

  const ativos =
    motoristas.filter(
      (motorista) =>
        motorista.ativo !== false
    ).length;

  const inativos =
    motoristas.filter(
      (motorista) =>
        motorista.ativo === false
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
    filtroStatus,
    limite,
  ]);

  /*
   * ==========================================
   * CORRIGIR PÁGINA INEXISTENTE
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
   * FORMATAR CPF
   * ==========================================
   */

  function formatarCPF(
    cpf: number | string
  ) {
    const numeros =
      String(cpf ?? "")
        .replace(/\D/g, "");

    if (
      numeros.length !== 11
    ) {
      return String(cpf ?? "");
    }

    return numeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
  }

  /*
   * ==========================================
   * NOVO MOTORISTA
   * ==========================================
   */

  function abrirNovoMotorista() {
    setMotoristaSelecionado(null);
    setModalAberto(true);
  }

  /*
   * ==========================================
   * EDITAR MOTORISTA
   * ==========================================
   */

  function abrirEdicao(
    motorista: Motorista
  ) {
    setMotoristaSelecionado(
      motorista
    );

    setModalAberto(true);
  }

  /*
   * ==========================================
   * ATIVAR / INATIVAR
   * ==========================================
   */

  async function alterarStatus(
    motorista: Motorista
  ) {
    if (!motorista.id) {
      return;
    }

    const ativoAtual =
      motorista.ativo !== false;

    const mensagem = ativoAtual
      ? `Deseja realmente desativar o motorista "${motorista.nome}"?`
      : `Deseja realmente reativar o motorista "${motorista.nome}"?`;

    if (!confirm(mensagem)) {
      return;
    }

    try {
      await api(
        `/motoristas/${motorista.id}/status`,
        {
          method: "PUT",
          body: JSON.stringify(
            !ativoAtual
          ),
        }
      );

      await carregarMotoristas();
    } catch (erro) {
      console.error(
        "Erro ao alterar status:",
        erro
      );

      alert(
        "Erro ao alterar o status do motorista."
      );
    }
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
            <UserRound
              size={23}
              className="text-blue-600"
            />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Motoristas
            </h1>

            <p className="text-sm text-slate-500">
              Cadastre e gerencie os motoristas da empresa.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={
            abrirNovoMotorista
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Novo motorista
        </button>

      </div>

      {/* CARDS */}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Users
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <UserCheck
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <UserX
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

      {/* BUSCA + FILTROS */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">

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
              placeholder="Buscar por nome, CPF ou CNH..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div className="flex rounded-xl bg-slate-100 p-1">

            <button
              type="button"
              onClick={() =>
                setFiltroStatus(
                  "ATIVOS"
                )
              }
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                filtroStatus ===
                "ATIVOS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Ativos
            </button>

            <button
              type="button"
              onClick={() =>
                setFiltroStatus(
                  "INATIVOS"
                )
              }
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                filtroStatus ===
                "INATIVOS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Inativos
            </button>

            <button
              type="button"
              onClick={() =>
                setFiltroStatus(
                  "TODOS"
                )
              }
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                filtroStatus ===
                "TODOS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Todos
            </button>

          </div>

        </div>

      </div>

      {/* TABELA */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>

            <h2 className="font-semibold text-slate-900">
              Lista de motoristas
            </h2>

            <p className="text-xs text-slate-500">
              Motoristas cadastrados no sistema
            </p>

          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {motoristasFiltrados.length} registros
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50 text-left">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Motorista
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CPF
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CNH
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

              {carregando ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Carregando motoristas...
                  </td>

                </tr>

              ) : motoristasPaginados.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

                        <UserRound
                          size={22}
                          className="text-slate-400"
                        />

                      </div>

                      <p className="font-medium text-slate-700">
                        Nenhum motorista encontrado
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Tente alterar os filtros ou a busca.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                motoristasPaginados.map(
                  (motorista) => {

                    const ativo =
                      motorista.ativo !== false;

                    return (

                      <tr
                        key={
                          motorista.id
                        }
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">

                              <UserRound
                                size={19}
                                className="text-blue-600"
                              />

                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {
                                  motorista.nome
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                ID #
                                {
                                  motorista.id
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {formatarCPF(
                            motorista.cpf
                          )}

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">

                          {
                            motorista.cnh
                          }

                        </td>

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

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              title="Editar motorista"
                              onClick={() =>
                                abrirEdicao(
                                  motorista
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
                                  ? "Desativar motorista"
                                  : "Reativar motorista"
                              }
                              onClick={() =>
                                alterarStatus(
                                  motorista
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                                ativo
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >

                              {ativo ? (
                                <UserX
                                  size={17}
                                />
                              ) : (
                                <UserCheck
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

        {!carregando && (
          <Paginacao
            paginaAtual={
              paginaAtual
            }
            totalPaginas={
              totalPaginas
            }
            totalRegistros={
              motoristasFiltrados.length
            }
            itensPorPagina={
              limite
            }
            onPaginaChange={
              setPaginaAtual
            }
            nomeRegistro="motoristas"
          />
        )}

      </div>

      {modalAberto && (

        <BotaoMotorista
          motorista={
            motoristaSelecionado
          }
          onFechar={() => {
            setModalAberto(false);
            setMotoristaSelecionado(
              null
            );
          }}
          onSalvo={() => {
            carregarMotoristas();
          }}
        />

      )}

    </div>
  );
}