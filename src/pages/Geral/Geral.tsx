import {
  Droplet,
  Circle,
  Sparkles,
  Wrench,
  FileSpreadsheet,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import api from "../../services/api";

import {
  gerarRelatorioExcel,
} from "../../services/relatorioExcel";

interface Veiculo {
  id: number;
  placa: string;
  modelosVeiculos: string;
  marca: string;
  ano: number;
  km: number;
  filial: string;
  status: string;
}

interface Motorista {
  id: number;
  nome: string;
  cpf: number;
  cnh: number;
}

interface Abastecimento {
  id: number;
  veiculo: Veiculo;
  motorista: Motorista;
  despesa: string;
  data: string;
  novoKm: number;
  valorUnitario: number;
  valorTotal: number;
  quantLitro: number;
  observacao: string;
  usuario: string;
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

interface CombustivelPorVeiculo {
  placa: string;
  veiculo: string;
  litros: number;
  total: number;
}

interface LavagemPorVeiculo {
  placa: string;
  veiculo: string;
  quantidade: number;
  total: number;
}

function Geral() {
  const [
    abastecimentos,
    setAbastecimentos,
  ] = useState<Abastecimento[]>([]);

  const [
    manutencoes,
    setManutencoes,
  ] = useState<Manutencao[]>([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState("");

  const [
    limite,
    setLimite,
  ] = useState(3);

  const [
    dataInicial,
    setDataInicial,
  ] = useState("");

  const [
    dataFinal,
    setDataFinal,
  ] = useState("");

  const [
    gerandoRelatorio,
    setGerandoRelatorio,
  ] = useState(false);

  const [
    erroRelatorio,
    setErroRelatorio,
  ] = useState("");

  useEffect(() => {
    carregarDados();
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
          setLimite(2);
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

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [
        dadosAbastecimentos,
        dadosManutencoes,
      ] = await Promise.all([
        api<Abastecimento[]>(
          "/combustiveis"
        ),
        api<Manutencao[]>(
          "/manutencoes"
        ),
      ]);

      setAbastecimentos(
        dadosAbastecimentos
      );

      setManutencoes(
        dadosManutencoes
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar os dados da visão geral."
      );
    } finally {
      setCarregando(false);
    }
  }

  /* =====================================================
     TOTAIS
  ===================================================== */

  const totalCombustivelCentavos =
    abastecimentos.reduce(
      (total, registro) =>
        total +
        Number(
          registro.valorTotal ||
            0
        ),
      0
    );

  const totalLitrosCentilitros =
    abastecimentos.reduce(
      (total, registro) =>
        total +
        Number(
          registro.quantLitro ||
            0
        ),
      0
    );

  const lavagens =
    manutencoes.filter(
      (registro) =>
        registro.despesa ===
        "LAVAGEM"
    );

  const manutencoesReais =
    manutencoes.filter(
      (registro) =>
        registro.despesa ===
        "MANUTENCAO"
    );

  const totalLavagemCentavos =
    lavagens.reduce(
      (total, registro) =>
        total +
        Number(
          registro.valorTotal ||
            0
        ),
      0
    );

  const totalManutencaoCentavos =
    manutencoesReais.reduce(
      (total, registro) =>
        total +
        Number(
          registro.valorTotal ||
            0
        ),
      0
    );

  const totalPneusCentavos =
    manutencoesReais
      .filter(
        (registro) =>
          registro.manutencaoTipos ===
          "PNEU"
      )
      .reduce(
        (total, registro) =>
          total +
          Number(
            registro.valorTotal ||
              0
          ),
        0
      );

  /* =====================================================
     COMBUSTÍVEL POR VEÍCULO
  ===================================================== */

  const combustivelMap =
    new Map<
      string,
      CombustivelPorVeiculo
    >();

  abastecimentos.forEach(
    (registro) => {
      const id = String(
        registro.veiculo?.id
      );

      const existente =
        combustivelMap.get(
          id
        );

      const litros =
        Number(
          registro.quantLitro ||
            0
        );

      const total =
        Number(
          registro.valorTotal ||
            0
        );

      if (existente) {
        existente.litros +=
          litros;

        existente.total +=
          total;
      } else {
        combustivelMap.set(
          id,
          {
            placa:
              registro.veiculo
                ?.placa ||
              "-",

            veiculo:
              registro.veiculo
                ?.modelosVeiculos ||
              "-",

            litros,

            total,
          }
        );
      }
    }
  );

  const combustivelPorVeiculo =
    Array.from(
      combustivelMap.values()
    );

  /* =====================================================
     LAVAGEM POR VEÍCULO
  ===================================================== */

  const lavagemMap =
    new Map<
      string,
      LavagemPorVeiculo
    >();

  lavagens.forEach(
    (registro) => {
      const id = String(
        registro.veiculo?.id
      );

      const existente =
        lavagemMap.get(id);

      const total =
        Number(
          registro.valorTotal ||
            0
        );

      if (existente) {
        existente.quantidade += 1;

        existente.total +=
          total;
      } else {
        lavagemMap.set(
          id,
          {
            placa:
              registro.veiculo
                ?.placa ||
              "-",

            veiculo:
              registro.veiculo
                ?.modelosVeiculos ||
              "-",

            quantidade: 1,

            total,
          }
        );
      }
    }
  );

  const lavagemPorVeiculo =
    Array.from(
      lavagemMap.values()
    );

  /* =====================================================
     FORMATADORES
  ===================================================== */

  function formatarMoedaCentavos(
    valor: number
  ) {
    return (
      Number(valor || 0) /
      100
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  function formatarLitros(
    valor: number
  ) {
    return (
      Number(valor || 0) /
      100
    ).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  /* =====================================================
     GERAR EXCEL
  ===================================================== */

  async function gerarExcel() {
    setErroRelatorio("");

    if (
      !dataInicial ||
      !dataFinal
    ) {
      setErroRelatorio(
        "Selecione a data inicial e a data final."
      );

      return;
    }

    if (
      dataInicial >
      dataFinal
    ) {
      setErroRelatorio(
        "A data inicial não pode ser maior que a data final."
      );

      return;
    }

    try {
      setGerandoRelatorio(
        true
      );

      await gerarRelatorioExcel(
        dataInicial,
        dataFinal,
        abastecimentos,
        manutencoes
      );
    } catch (error) {
      console.error(error);

      setErroRelatorio(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o relatório."
      );
    } finally {
      setGerandoRelatorio(
        false
      );
    }
  }

  return (
    <div className="ml-4 mr-4 sm:ml-6 sm:mr-6 lg:ml-10 lg:mr-10 mt-6 lg:mt-10 pb-10">

      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl xl:text-[27px] font-bold text-slate-900">
          Visão Geral da Frota
        </h1>

        <p className="text-slate-600 text-sm font-light mt-1">
          Consolidado de despesas e controle operacional da frota.
        </p>
      </div>

      {/* ERRO */}
      {erro && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 mt-4">

        {/* COMBUSTÍVEL */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center">
            <Droplet
              size={21}
              strokeWidth={2.5}
              className="text-blue-600"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL COMBUSTÍVEL
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              {carregando
                ? "..."
                : formatarMoedaCentavos(
                    totalCombustivelCentavos
                  )}
            </p>
          </div>

        </div>

        {/* PNEUS */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Circle
              size={21}
              strokeWidth={2.5}
              className="text-yellow-600"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL PNEUS
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              {carregando
                ? "..."
                : formatarMoedaCentavos(
                    totalPneusCentavos
                  )}
            </p>
          </div>

        </div>

        {/* LAVAGEM */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-teal-100 flex items-center justify-center">
            <Sparkles
              size={21}
              strokeWidth={2.5}
              className="text-teal-600"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL LAVAGEM
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              {carregando
                ? "..."
                : formatarMoedaCentavos(
                    totalLavagemCentavos
                  )}
            </p>
          </div>

        </div>

        {/* MANUTENÇÃO */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-red-100 flex items-center justify-center">
            <Wrench
              size={21}
              strokeWidth={2.5}
              className="text-red-600"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL MANUTENÇÃO
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              {carregando
                ? "..."
                : formatarMoedaCentavos(
                    totalManutencaoCentavos
                  )}
            </p>
          </div>

        </div>

      </div>

      {/* RELATÓRIO */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 xl:p-6">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <FileSpreadsheet
                  size={20}
                  className="text-green-600"
                />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Relatório Geral
              </h2>

            </div>

            <p className="text-sm text-slate-500 mt-2">
              Gere um relatório completo separado por filial.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <div className="flex flex-col">

              <label className="text-sm font-medium text-slate-700 mb-1">
                Data inicial
              </label>

              <input
                type="date"
                value={dataInicial}
                onChange={(event) =>
                  setDataInicial(
                    event.target.value
                  )
                }
                className="
                  h-10
                  px-3
                  border border-slate-200
                  rounded-lg
                  bg-white
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                  cursor-pointer
                "
              />

            </div>

            <div className="flex flex-col">

              <label className="text-sm font-medium text-slate-700 mb-1">
                Data final
              </label>

              <input
                type="date"
                value={dataFinal}
                onChange={(event) =>
                  setDataFinal(
                    event.target.value
                  )
                }
                className="
                  h-10
                  px-3
                  border border-slate-200
                  rounded-lg
                  bg-white
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                  cursor-pointer
                "
              />

            </div>

            <button
              type="button"
              onClick={
                gerarExcel
              }
              disabled={
                gerandoRelatorio ||
                carregando
              }
              className="
                h-10
                px-5
                flex
                items-center
                justify-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
                text-sm
                font-medium
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
                mt-6
              "
            >

              <FileSpreadsheet
                size={18}
              />

              {gerandoRelatorio
                ? "Gerando..."
                : "Gerar Excel"}

            </button>

          </div>

        </div>

        {erroRelatorio && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {erroRelatorio}
          </div>
        )}

      </div>

      {/* TABELAS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        {/* COMBUSTÍVEL */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 xl:p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Despesa Combustível por Veículo
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Totalizadores acumulados
              </p>
            </div>

            <Droplet
              size={20}
              strokeWidth={2.5}
              className="text-blue-600"
            />

          </div>

          <div className="mt-4 overflow-x-auto rounded-lg">

            <div className="min-w-125">

              <div className="grid grid-cols-4 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">

                <span>
                  Placa
                </span>

                <span>
                  Veículo
                </span>

                <span className="text-right">
                  Litros
                </span>

                <span className="text-right">
                  Total
                </span>

              </div>

              {carregando ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  Carregando...
                </div>
              ) : combustivelPorVeiculo.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  Nenhum abastecimento encontrado.
                </div>
              ) : (
                combustivelPorVeiculo
                  .slice(0, limite)
                  .map(
                    (item) => (
                      <div
                        key={
                          item.placa +
                          item.veiculo
                        }
                        className="grid grid-cols-4 items-center px-4 py-3 text-sm border-b border-slate-200"
                      >

                        <span className="font-semibold text-slate-800">
                          {item.placa}
                        </span>

                        <span className="text-slate-800 truncate pr-2">
                          {item.veiculo}
                        </span>

                        <span className="text-right text-slate-600">
                          {formatarLitros(
                            item.litros
                          )}{" "}
                          L
                        </span>

                        <span className="text-right font-semibold text-slate-900">
                          {formatarMoedaCentavos(
                            item.total
                          )}
                        </span>

                      </div>
                    )
                  )
              )}

              <div className="grid grid-cols-4 items-center bg-slate-50 px-4 py-3 text-sm font-bold">

                <span>
                  Total
                </span>

                <span />

                <span className="text-right">
                  {formatarLitros(
                    totalLitrosCentilitros
                  )}{" "}
                  L
                </span>

                <span className="text-right text-blue-600">
                  {formatarMoedaCentavos(
                    totalCombustivelCentavos
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* LAVAGEM */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 xl:p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Despesa Lavagem por Veículo
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Frequência e valores acumulados
              </p>
            </div>

            <Sparkles
              size={20}
              strokeWidth={2.5}
              className="text-teal-600"
            />

          </div>

          <div className="mt-4 overflow-x-auto rounded-lg">

            <div className="min-w-125">

              <div className="grid grid-cols-4 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">

                <span>
                  Placa
                </span>

                <span>
                  Veículo
                </span>

                <span className="text-right">
                  Qtd
                </span>

                <span className="text-right">
                  Total
                </span>

              </div>

              {carregando ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  Carregando...
                </div>
              ) : lavagemPorVeiculo.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  Nenhuma lavagem encontrada.
                </div>
              ) : (
                lavagemPorVeiculo
                  .slice(0, limite)
                  .map(
                    (item) => (
                      <div
                        key={
                          item.placa +
                          item.veiculo
                        }
                        className="grid grid-cols-4 items-center px-4 py-3 text-sm border-b border-slate-200"
                      >

                        <span className="font-semibold text-slate-800">
                          {item.placa}
                        </span>

                        <span className="text-slate-800 truncate pr-2">
                          {item.veiculo}
                        </span>

                        <span className="text-right text-slate-600">
                          {item.quantidade}
                        </span>

                        <span className="text-right font-semibold text-slate-900">
                          {formatarMoedaCentavos(
                            item.total
                          )}
                        </span>

                      </div>
                    )
                  )
              )}

              <div className="grid grid-cols-4 items-center bg-slate-50 px-4 py-3 text-sm font-bold">

                <span>
                  Total
                </span>

                <span />

                <span className="text-right">
                  {lavagens.length}
                </span>

                <span className="text-right text-teal-600">
                  {formatarMoedaCentavos(
                    totalLavagemCentavos
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RESUMO EXTRA */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        {/* PNEUS */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 xl:p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Despesa com Pneus
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manutenções classificadas como pneu.
              </p>
            </div>

            <Circle
              size={20}
              strokeWidth={2.5}
              className="text-yellow-600"
            />

          </div>

          <div className="mt-6">

            <p className="text-3xl font-bold text-slate-900">
              {formatarMoedaCentavos(
                totalPneusCentavos
              )}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {
                manutencoesReais.filter(
                  (registro) =>
                    registro.manutencaoTipos ===
                    "PNEU"
                ).length
              }{" "}
              lançamento(s)
            </p>

          </div>

        </div>

        {/* MANUTENÇÃO */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 xl:p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Resumo de Manutenção
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Quantidade e valor das manutenções.
              </p>
            </div>

            <Wrench
              size={20}
              strokeWidth={2.5}
              className="text-red-600"
            />

          </div>

          <div className="mt-6">

            <p className="text-3xl font-bold text-slate-900">
              {manutencoesReais.length}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              lançamento(s) ·{" "}
              {formatarMoedaCentavos(
                totalManutencaoCentavos
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Geral;