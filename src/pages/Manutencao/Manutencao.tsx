import {
  Filter,
  Download,
  Trash2,
  Pencil,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import BotaoManutencao from "./botaoManutencao";

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

interface Motorista {
  id: number;
  nome: string;
  cpf: number;
  cnh: number;
}

interface Manutencao {
  id: number;
  nomeDaManutencao: string;
  veiculo: Veiculo;
  motorista: Motorista;
  despesa:
    | "LAVAGEM"
    | "MANUTENCAO";
  data: string;
  manutencaoTipos:
    | "PNEU"
    | "OLEO"
    | "MOTOR"
    | "OUTROS"
    | null;
  novoKm: number;
  valorUnitario: number;
  valorTotal: number;
  observacao: string;
  usuario: string;
}

function Manutencao() {
  const [
    modalAberto,
    setModalAberto,
  ] = useState(false);

  const [
    manutencaoEditando,
    setManutencaoEditando,
  ] = useState<Manutencao | null>(
    null
  );

  const [
    pagina,
    setPagina,
  ] = useState(1);

  const [
    registros,
    setRegistros,
  ] = useState<Manutencao[]>(
    []
  );

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    limite,
    setLimite,
  ] = useState(3);

  const [
    filial,
    setFilial,
  ] = useState("todas");

  const [
    periodo,
    setPeriodo,
  ] = useState("");

  const [
    tipo,
    setTipo,
  ] = useState("todos");

  const [
    erro,
    setErro,
  ] = useState("");

  useEffect(() => {
    carregarManutencoes();
  }, []);

  useEffect(() => {
    const atualizarLimite =
      () => {
        if (
          window.innerWidth <
          640
        ) {
          setLimite(2);
        } else if (
          window.innerWidth <
          1024
        ) {
          setLimite(3);
        } else if (
          window.innerWidth <
          1440
        ) {
          setLimite(3);
        } else if (
          window.innerWidth <
          1601
        ) {
          setLimite(5);
        } else {
          setLimite(10);
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

  async function carregarManutencoes() {
    try {
      setCarregando(true);
      setErro("");

      const dados =
        await api<Manutencao[]>(
          "/manutencoes"
        );

      setRegistros(dados);
      setPagina(1);
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar as manutenções."
      );
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovo() {
    setManutencaoEditando(
      null
    );

    setModalAberto(true);
  }

  function abrirEdicao(
    registro: Manutencao
  ) {
    setManutencaoEditando(
      registro
    );

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);

    setManutencaoEditando(
      null
    );
  }

  async function excluirManutencao(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "Deseja realmente excluir este lançamento?"
      );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");

      await api(
        `/manutencoes/${id}`,
        {
          method: "DELETE",
        }
      );

      await carregarManutencoes();
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível excluir o lançamento."
      );
    }
  }

  const registrosFiltrados =
    registros.filter(
      (registro) => {
        const correspondeData =
          !periodo ||
          registro.data ===
            periodo;

        const correspondeTipo =
          tipo === "todos" ||
          registro.despesa ===
            tipo;

        const correspondeFilial =
          filial === "todas" ||
          registro.veiculo
            ?.filial ===
            filial;

        return (
          correspondeData &&
          correspondeTipo &&
          correspondeFilial
        );
      }
    );

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        registrosFiltrados.length /
          limite
      )
    );

  const paginaAtual =
    Math.min(
      pagina,
      totalPaginas
    );

  const inicio =
    (paginaAtual - 1) *
    limite;

  const registrosExibidos =
    registrosFiltrados.slice(
      inicio,
      inicio + limite
    );

  const totalValorPagina =
    registrosExibidos.reduce(
      (total, registro) =>
        total +
        Number(
          registro.valorTotal ||
            0
        ),
      0
    );

  function formatarMoeda(
    valor: number
  ) {
    return (
      valor / 100
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  function formatarData(
    data: string
  ) {
    if (!data) {
      return "-";
    }

    const [
      ano,
      mes,
      dia,
    ] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  function textoTipo(
    registro: Manutencao
  ) {
    if (
      registro.despesa ===
      "LAVAGEM"
    ) {
      return "Lavagem";
    }

    switch (
      registro.manutencaoTipos
    ) {
      case "PNEU":
        return "Pneu";

      case "OLEO":
        return "Óleo";

      case "MOTOR":
        return "Motor";

      case "OUTROS":
        return (
          registro.nomeDaManutencao ||
          "Outros"
        );

      default:
        return "-";
    }
  }

  function textoManutencao(
    registro: Manutencao
  ) {
    if (
      registro.despesa ===
      "LAVAGEM"
    ) {
      return "Lavagem";
    }

    return (
      registro.nomeDaManutencao ||
      "-"
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 mt-6 lg:mt-10 pb-6">

      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">

          <h1 className="text-2xl sm:text-[27px] text-slate-900 font-bold">
            Controle de Manutenção
          </h1>

          <p className="text-slate-600 text-sm font-light mt-1">
            Manutenções, lavagens e despesas da frota.
          </p>

        </div>

        <button
          onClick={abrirNovo}
          className="w-full sm:w-38 h-10 shrink-0 text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-800 cursor-pointer"
        >
          + Novo Registro
        </button>

      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap items-end gap-4 mt-5">

        {/* FILIAL */}
        <div className="flex flex-col w-full sm:w-50">

          <label className="text-slate-800 text-sm mb-1 ml-1">
            FILIAL
          </label>

          <select
            value={filial}
            onChange={(event) => {
              setFilial(
                event.target.value
              );

              setPagina(1);
            }}
            className="w-full h-10 px-2 text-slate-800 border border-slate-200 rounded-md bg-white hover:bg-slate-100 cursor-pointer"
          >
            <option value="todas">
              Todas
            </option>

            <option value="MATRIZ">
              Matriz
            </option>

            <option value="AQUIDAUANA_ANASTACIO">
              Aquidauana / Anastácio
            </option>

            <option value="DOIS_IRMAOS_BURITI">
              D.I.B
            </option>

            <option value="NIOAQUE">
              Nioaque
            </option>

            <option value="JARDIM_GUIA_LOPES">
              Jardim / Guia Lopes
            </option>

            <option value="BONITO">
              Bonito
            </option>

            <option value="BODOQUENA">
              Bodoquena
            </option>
          </select>

        </div>

        {/* DATA */}
        <div className="flex flex-col w-full sm:w-50">

          <label className="text-slate-800 text-sm mb-1 ml-1">
            Período
          </label>

          <input
            type="date"
            value={periodo}
            onChange={(event) => {
              setPeriodo(
                event.target.value
              );

              setPagina(1);
            }}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          />

        </div>

        {/* TIPO */}
        <div className="flex flex-col w-full sm:w-50">

          <label className="text-slate-800 text-sm mb-1 ml-1">
            TIPO
          </label>

          <select
            value={tipo}
            onChange={(event) => {
              setTipo(
                event.target.value
              );

              setPagina(1);
            }}
            className="w-full h-10 px-2 text-slate-800 border border-slate-200 rounded-md bg-white hover:bg-slate-100 cursor-pointer"
          >
            <option value="todos">
              Todos
            </option>

            <option value="LAVAGEM">
              Lavagem
            </option>

            <option value="MANUTENCAO">
              Manutenção
            </option>
          </select>

        </div>

        <button
          type="button"
          className="w-full sm:w-35 h-10 flex items-center justify-center gap-2 border border-slate-200 rounded-md bg-white text-slate-700 text-sm hover:bg-slate-100 cursor-pointer"
        >
          <Filter
            size={20}
            strokeWidth={3}
          />

          Mais Filtros
        </button>

        <button
          type="button"
          className="w-full sm:w-35 h-10 flex items-center justify-center gap-2 border border-slate-200 rounded-md bg-white text-slate-700 text-sm hover:bg-slate-100 cursor-pointer"
        >
          <Download
            size={20}
            strokeWidth={3}
          />

          Exportar
        </button>

      </div>

      {/* ERRO */}
      {erro && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      {/* TABELA */}
      <div className="mt-6 w-full overflow-x-auto rounded-md border border-slate-300">

        <div className="min-w-[1150px]">

          <div className="grid grid-cols-9 items-center bg-slate-200 h-10 px-4 text-slate-600 text-sm font-medium">

            <span>
              Placa
            </span>

            <span>
              Veículo
            </span>

            <span>
              Motorista
            </span>

            <span>
              Lançamento
            </span>

            <span>
              Tipo
            </span>

            <span>
              KM
            </span>

            <span>
              Data
            </span>

            <span>
              Valor Pago
            </span>

            <span className="text-center">
              Ações
            </span>

          </div>

          <div className="flex flex-col">

            {carregando && (
              <div className="h-20 flex items-center justify-center bg-white text-sm text-slate-500">
                Carregando registros...
              </div>
            )}

            {!carregando &&
              registrosExibidos.length ===
                0 && (
                <div className="h-20 flex items-center justify-center bg-white text-sm text-slate-500">
                  Nenhum registro encontrado.
                </div>
              )}

            {!carregando &&
              registrosExibidos.map(
                (registro) => (
                  <div
                    key={registro.id}
                    className="grid grid-cols-9 items-center min-h-12 px-4 bg-white text-slate-800 text-sm border-b border-slate-200"
                  >

                    {/* PLACA */}
                    <span>
                      <span className="inline-flex bg-slate-200 px-3 py-1 rounded-md font-semibold">
                        {
                          registro.veiculo
                            ?.placa ||
                          "-"
                        }
                      </span>
                    </span>

                    {/* VEÍCULO */}
                    <span className="truncate pr-3">
                      {
                        registro.veiculo
                          ?.modelosVeiculos ||
                        "-"
                      }
                    </span>

                    {/* MOTORISTA */}
                    <span className="truncate pr-3">
                      {
                        registro.motorista
                          ?.nome ||
                        "-"
                      }
                    </span>

                    {/* LANÇAMENTO */}
                    <span>
                      {
                        textoManutencao(
                          registro
                        )
                      }
                    </span>

                    {/* TIPO */}
                    <span>
                      {
                        textoTipo(
                          registro
                        )
                      }
                    </span>

                    {/* KM */}
                    <span>
                      {registro.novoKm !=
                      null
                        ? registro.novoKm.toLocaleString(
                            "pt-BR"
                          )
                        : "-"}
                    </span>

                    {/* DATA */}
                    <span>
                      {
                        formatarData(
                          registro.data
                        )
                      }
                    </span>

                    {/* VALOR */}
                    <span>
                      {
                        formatarMoeda(
                          registro.valorTotal
                        )
                      }
                    </span>

                    {/* AÇÕES */}
                    <span className="flex justify-center gap-1">

                      <button
                        type="button"
                        onClick={() =>
                          abrirEdicao(
                            registro
                          )
                        }
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 cursor-pointer"
                        title="Editar"
                      >
                        <Pencil
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          excluirManutencao(
                            registro.id
                          )
                        }
                        className="p-2 rounded-md text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>

                    </span>

                  </div>
                )
              )}

          </div>

          {/* TOTAL */}
          <div className="grid grid-cols-9 items-center h-12 px-4 bg-slate-50 text-slate-800 text-sm font-bold border-b border-slate-200">

            <span>
              Total
            </span>

            <span />
            <span />
            <span />
            <span />
            <span />
            <span />

            <span className="text-red-600">
              {
                formatarMoeda(
                  totalValorPagina
                )
              }
            </span>

            <span />

          </div>

          {/* PAGINAÇÃO */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white">

            <span className="text-sm text-slate-500">
              Exibindo{" "}
              {
                registrosFiltrados.length ===
                0
                  ? 0
                  : inicio + 1
              }
              -
              {Math.min(
                inicio +
                  limite,
                registrosFiltrados.length
              )}{" "}
              de{" "}
              {
                registrosFiltrados.length
              }{" "}
              registros
            </span>

            <div className="flex items-center gap-2 flex-wrap">

              <button
                onClick={() =>
                  setPagina(
                    Math.max(
                      1,
                      paginaAtual -
                        1
                    )
                  )
                }
                disabled={
                  paginaAtual ===
                  1
                }
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>

              {Array.from(
                {
                  length:
                    totalPaginas,
                },
                (_, index) =>
                  index + 1
              ).map(
                (numero) => (
                  <button
                    key={numero}
                    onClick={() =>
                      setPagina(
                        numero
                      )
                    }
                    className={`
                      w-8 h-8 rounded-md text-sm cursor-pointer
                      ${
                        paginaAtual ===
                        numero
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    {numero}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setPagina(
                    Math.min(
                      totalPaginas,
                      paginaAtual +
                        1
                    )
                  )
                }
                disabled={
                  paginaAtual ===
                  totalPaginas
                }
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Próximo
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <BotaoManutencao
          manutencao={
            manutencaoEditando
          }
          onFechar={
            fecharModal
          }
          onSalvo={
            carregarManutencoes
          }
        />
      )}

    </div>
  );
}

export default Manutencao;