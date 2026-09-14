import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import BotaoMotorista from "../Motoristas/BotaoMotorista";

import {
  UserRound,
  Users,
  Search,
  Plus,
  Pencil,
  UserX,
  UserCheck,
} from "lucide-react";

interface Motorista {
  id: number;
  nome: string;
  cpf: number;
  cnh: number;
  ativo?: boolean;
}

type FiltroStatus = "TODOS" | "ATIVOS" | "INATIVOS";

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState<FiltroStatus>("ATIVOS");

  const [modalAberto, setModalAberto] = useState(false);

  const [motoristaSelecionado, setMotoristaSelecionado] =
    useState<Motorista | null>(null);

  const [carregando, setCarregando] = useState(true);

  async function carregarMotoristas() {
    try {
      setCarregando(true);

      const dados = await api<Motorista[]>("/motoristas");

      setMotoristas(dados);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os motoristas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMotoristas();
  }, []);

  function abrirNovo() {
    setMotoristaSelecionado(null);
    setModalAberto(true);
  }

  function abrirEditar(motorista: Motorista) {
    setMotoristaSelecionado(motorista);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setMotoristaSelecionado(null);
  }

  function motoristaAtivo(motorista: Motorista) {
    // Motoristas antigos que possuem ativo = null
    // serão considerados ativos.
    return motorista.ativo !== false;
  }

  async function alterarStatus(motorista: Motorista) {
    const ativo = motoristaAtivo(motorista);

    const mensagem = ativo
      ? `Deseja desativar o motorista "${motorista.nome}"?`
      : `Deseja reativar o motorista "${motorista.nome}"?`;

    if (!window.confirm(mensagem)) {
      return;
    }

    try {
      await api(`/motoristas/${motorista.id}/status`, {
        method: "PUT",
        body: JSON.stringify(!ativo),
      });

      await carregarMotoristas();
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar o status do motorista.");
    }
  }

  function formatarCPF(cpf: number | string) {
    const numeros = String(cpf).replace(/\D/g, "");

    if (numeros.length !== 11) {
      return String(cpf);
    }

    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
      6,
      9
    )}-${numeros.slice(9, 11)}`;
  }

  const motoristasFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    const numerosBusca = busca.replace(/\D/g, "");

    return motoristas.filter((motorista) => {
      const ativo = motoristaAtivo(motorista);

      if (filtroStatus === "ATIVOS" && !ativo) {
        return false;
      }

      if (filtroStatus === "INATIVOS" && ativo) {
        return false;
      }

      if (!termo) {
        return true;
      }

      const nome = motorista.nome.toLowerCase();
      const cpf = String(motorista.cpf);
      const cnh = String(motorista.cnh);

      return (
        nome.includes(termo) ||
        (!!numerosBusca && cpf.includes(numerosBusca)) ||
        (!!numerosBusca && cnh.includes(numerosBusca))
      );
    });
  }, [motoristas, busca, filtroStatus]);

  const totalAtivos = motoristas.filter(motoristaAtivo).length;

  const totalInativos = motoristas.length - totalAtivos;

  return (
    <div className="min-h-full bg-slate-50 p-6">

      {/* CABEÇALHO */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <UserRound size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Motoristas
            </h1>

            <p className="text-sm text-slate-500">
              Cadastre e gerencie os motoristas da empresa.
            </p>
          </div>

        </div>

        <button
          onClick={abrirNovo}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Novo motorista
        </button>

      </div>

      {/* RESUMO */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={23} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {motoristas.length}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck size={23} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Ativos
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {totalAtivos}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <UserX size={23} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Inativos
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {totalInativos}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* BUSCA + FILTRO */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, CPF ou CNH..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div className="flex rounded-xl bg-slate-100 p-1">

            <button
              onClick={() => setFiltroStatus("ATIVOS")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filtroStatus === "ATIVOS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Ativos
            </button>

            <button
              onClick={() => setFiltroStatus("INATIVOS")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filtroStatus === "INATIVOS"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Inativos
            </button>

            <button
              onClick={() => setFiltroStatus("TODOS")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filtroStatus === "TODOS"
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

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-slate-800">
                Lista de motoristas
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Motoristas cadastrados no sistema
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {motoristasFiltrados.length}{" "}
              {motoristasFiltrados.length === 1
                ? "registro"
                : "registros"}
            </span>

          </div>

        </div>

        {carregando ? (

          <div className="flex min-h-[220px] items-center justify-center">
            <span className="text-sm text-slate-500">
              Carregando motoristas...
            </span>
          </div>

        ) : motoristasFiltrados.length === 0 ? (

          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <UserRound size={26} />
            </div>

            <h3 className="font-semibold text-slate-700">
              Nenhum motorista encontrado
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {busca
                ? "Tente alterar os termos da busca."
                : "Não existem motoristas nessa categoria."}
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Motorista
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    CPF
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    CNH
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Ações
                  </th>

                </tr>
              </thead>

              <tbody>

                {motoristasFiltrados.map((motorista) => {

                  const ativo = motoristaAtivo(motorista);

                  return (
                    <tr
                      key={motorista.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              ativo
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <UserRound size={19} />
                          </div>

                          <div>

                            <p
                              className={`font-semibold ${
                                ativo
                                  ? "text-slate-800"
                                  : "text-slate-500"
                              }`}
                            >
                              {motorista.nome}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID #{motorista.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {formatarCPF(motorista.cpf)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {motorista.cnh}
                        </span>
                      </td>

                      <td className="px-6 py-4">

                        {ativo ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Inativo
                          </span>
                        )}

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => abrirEditar(motorista)}
                            title="Editar motorista"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                          >
                            <Pencil size={17} />
                          </button>

                          {ativo ? (
                            <button
                              onClick={() => alterarStatus(motorista)}
                              title="Desativar motorista"
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                            >
                              <UserX size={17} />
                            </button>
                          ) : (
                            <button
                              onClick={() => alterarStatus(motorista)}
                              title="Reativar motorista"
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                            >
                              <UserCheck size={17} />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <div className="mt-4 px-1 text-sm text-slate-500">
        Exibindo{" "}
        <span className="font-semibold text-slate-700">
          {motoristasFiltrados.length}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-slate-700">
          {motoristas.length}
        </span>{" "}
        motoristas.
      </div>

      {modalAberto && (
        <BotaoMotorista
          motorista={motoristaSelecionado}
          onFechar={fecharModal}
          onSalvo={carregarMotoristas}
        />
      )}

    </div>
  );
}