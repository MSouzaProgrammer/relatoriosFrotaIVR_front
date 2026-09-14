import { Filter, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

interface Veiculo {
  id: number;
  placa: string;
  modelosVeiculos?: string;
  marca?: string;
  filial?: string | {
    descricao?: string;
    name?: string;
  };
}

interface Motorista {
  id: number;
  nome: string;
}

interface Abastecimento {
  id: number;
  veiculo: Veiculo;
  motorista?: Motorista;
  data: string;
  novoKm: number;
  quantLitro: number;
  valorTotal: number;
}

interface RegistroMedia {
  placa: string;
  veiculo: string;
  motorista: string;
  mediaKmL: number;
  mediaGeral: number;
  totalKm: number;
  totalLitros: number;
  abastecimentosCalculados: number;
}

interface AbastecimentoCalculado {
  id: number;
  veiculoId: number;
  placa: string;
  veiculo: string;
  motorista: string;
  filial: string;
  data: string;
  kmAnterior: number | null;
  kmAtual: number;
  kmRodado: number | null;
  litros: number;
  kmL: number | null;
}

function Media() {
  const [pagina, setPagina] = useState(1);

  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>(
    []
  );

  const [carregando, setCarregando] = useState(true);

  const [filialSelecionada, setFilialSelecionada] = useState("todas");

  const [periodo, setPeriodo] = useState(() => {
    const hoje = new Date();

    return `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  const [limite, setLimite] = useState(10);

  useEffect(() => {
    const carregarAbastecimentos = async () => {
      try {
        setCarregando(true);

        const dados = await api<Abastecimento[]>("/combustiveis");

        setAbastecimentos(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error("Erro ao carregar abastecimentos:", error);
        setAbastecimentos([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarAbastecimentos();
  }, []);

  useEffect(() => {
    const atualizarLimite = () => {
      if (window.innerWidth < 640) {
        setLimite(2);
      } else if (window.innerWidth < 1024) {
        setLimite(3);
      } else if (window.innerWidth < 1440) {
        setLimite(3);
      } else if (window.innerWidth < 1601) {
        setLimite(5);
      } else {
        setLimite(10);
      }
    };

    atualizarLimite();

    window.addEventListener("resize", atualizarLimite);

    return () => {
      window.removeEventListener("resize", atualizarLimite);
    };
  }, []);

  /*
   * ============================================================
   * FUNÇÕES AUXILIARES
   * ============================================================
   */

  const obterNomeFilial = (veiculo?: Veiculo) => {
    if (!veiculo?.filial) {
      return "";
    }

    if (typeof veiculo.filial === "string") {
      return veiculo.filial;
    }

    return (
      veiculo.filial.descricao ||
      veiculo.filial.name ||
      ""
    );
  };

  const normalizarFilial = (filial: string) => {
    return filial
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const obterNomeVeiculo = (veiculo?: Veiculo) => {
    if (!veiculo) {
      return "";
    }

    const modelo = veiculo.modelosVeiculos
      ? veiculo.modelosVeiculos.replaceAll("_", " ")
      : "";

    const marca = veiculo.marca
      ? veiculo.marca.replaceAll("_", " ")
      : "";

    if (modelo && marca) {
      return `${marca} ${modelo}`;
    }

    return modelo || marca || "Veículo";
  };

  const formatarData = (data: string) => {
    if (!data) {
      return "-";
    }

    const [ano, mes, dia] = data.split("-");

    if (!ano || !mes || !dia) {
      return data;
    }

    return `${dia}/${mes}/${ano}`;
  };

  const formatarNumero = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  /*
   * ============================================================
   * CALCULA OS ABASTECIMENTOS
   *
   * Para cada veículo:
   *
   * KM rodado = KM atual - KM anterior
   *
   * KM/L = KM rodado / litros do abastecimento atual
   *
   * Importante:
   * buscamos o abastecimento anterior mesmo que ele esteja
   * fora do mês selecionado.
   * ============================================================
   */

  const abastecimentosCalculados = useMemo(() => {
    const todos = [...abastecimentos];

    todos.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();

      if (dataA !== dataB) {
        return dataA - dataB;
      }

      return a.id - b.id;
    });

    const porVeiculo = new Map<number, Abastecimento[]>();

    todos.forEach((abastecimento) => {
      const veiculoId = abastecimento.veiculo?.id;

      if (!veiculoId) {
        return;
      }

      if (!porVeiculo.has(veiculoId)) {
        porVeiculo.set(veiculoId, []);
      }

      porVeiculo.get(veiculoId)!.push(abastecimento);
    });

    const resultado: AbastecimentoCalculado[] = [];

    porVeiculo.forEach((lista) => {
      for (let i = 0; i < lista.length; i++) {
        const atual = lista[i];
        const anterior = i > 0 ? lista[i - 1] : null;

        const kmAtual = Number(atual.novoKm || 0);

        /*
         * O backend salva quantLitro multiplicado por 100.
         *
         * Exemplo:
         * 35 litros = 3500
         *
         * Portanto:
         * litros = quantLitro / 100
         */
        const litros = Number(atual.quantLitro || 0) / 100;

        let kmAnterior: number | null = null;
        let kmRodado: number | null = null;
        let kmL: number | null = null;

        if (anterior) {
          const kmAnteriorCalculado = Number(
            anterior.novoKm || 0
          );

          if (
            kmAnteriorCalculado > 0 &&
            kmAtual > 0 &&
            kmAtual > kmAnteriorCalculado &&
            litros > 0
          ) {
            kmAnterior = kmAnteriorCalculado;

            kmRodado = kmAtual - kmAnteriorCalculado;

            kmL = kmRodado / litros;
          }
        }

        resultado.push({
          id: atual.id,
          veiculoId: atual.veiculo.id,
          placa: atual.veiculo.placa,
          veiculo: obterNomeVeiculo(atual.veiculo),
          motorista: atual.motorista?.nome || "Não informado",
          filial: obterNomeFilial(atual.veiculo),
          data: atual.data,
          kmAnterior,
          kmAtual,
          kmRodado,
          litros,
          kmL,
        });
      }
    });

    return resultado;
  }, [abastecimentos]);

  /*
   * ============================================================
   * FILTRO POR PERÍODO E FILIAL
   * ============================================================
   */

  const registrosFiltrados = useMemo(() => {
    if (!periodo) {
      return [];
    }

    const resultado = abastecimentosCalculados.filter((registro) => {
      const correspondePeriodo =
        registro.data.startsWith(periodo);

      if (!correspondePeriodo) {
        return false;
      }

      if (filialSelecionada === "todas") {
        return true;
      }

      const filial = normalizarFilial(registro.filial);

      return filial.includes(
        normalizarFilial(filialSelecionada)
      );
    });

    return resultado;
  }, [
    abastecimentosCalculados,
    periodo,
    filialSelecionada,
  ]);

  /*
   * ============================================================
   * AGRUPA POR VEÍCULO
   *
   * A média não é simplesmente:
   *
   * (12 + 10 + 14) / 3
   *
   * O correto para consolidar é:
   *
   * total KM / total litros
   *
   * Assim a média representa o consumo real acumulado.
   * ============================================================
   */

  const registros = useMemo<RegistroMedia[]>(() => {
    const grupos = new Map<
      number,
      AbastecimentoCalculado[]
    >();

    registrosFiltrados.forEach((registro) => {
      /*
       * Abastecimentos sem KM anterior não conseguem
       * calcular consumo.
       */
      if (
        registro.kmRodado === null ||
        registro.kmL === null ||
        registro.litros <= 0
      ) {
        return;
      }

      if (!grupos.has(registro.veiculoId)) {
        grupos.set(registro.veiculoId, []);
      }

      grupos.get(registro.veiculoId)!.push(registro);
    });

    const resultado: RegistroMedia[] = [];

    grupos.forEach((lista) => {
      const primeiro = lista[0];

      const totalKm = lista.reduce(
        (total, registro) =>
          total + (registro.kmRodado || 0),
        0
      );

      const totalLitros = lista.reduce(
        (total, registro) =>
          total + registro.litros,
        0
      );

      const mediaKmL =
        totalLitros > 0
          ? totalKm / totalLitros
          : 0;

      /*
       * Média Geral aqui representa a mesma média
       * consolidada do veículo.
       */
      const mediaGeral = mediaKmL;

      resultado.push({
        placa: primeiro.placa,
        veiculo: primeiro.veiculo,
        motorista: primeiro.motorista,
        mediaKmL,
        mediaGeral,
        totalKm,
        totalLitros,
        abastecimentosCalculados: lista.length,
      });
    });

    resultado.sort((a, b) =>
      a.placa.localeCompare(b.placa)
    );

    return resultado;
  }, [registrosFiltrados]);

  /*
   * ============================================================
   * MÉDIA DA FROTA
   *
   * Também usamos:
   *
   * total KM da frota / total litros da frota
   *
   * e não a média simples das médias dos veículos.
   * ============================================================
   */

  const totaisFrota = useMemo(() => {
    const totalKm = registros.reduce(
      (total, registro) =>
        total + registro.totalKm,
      0
    );

    const totalLitros = registros.reduce(
      (total, registro) =>
        total + registro.totalLitros,
      0
    );

    const media =
      totalLitros > 0
        ? totalKm / totalLitros
        : 0;

    return {
      totalKm,
      totalLitros,
      media,
    };
  }, [registros]);

  /*
   * ============================================================
   * PAGINAÇÃO
   * ============================================================
   */

  const registrosPorPagina = limite;

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      registros.length / registrosPorPagina
    )
  );

  const paginaAtual = Math.min(
    pagina,
    totalPaginas
  );

  const inicio =
    (paginaAtual - 1) * registrosPorPagina;

  const registrosExibidos = registros.slice(
    inicio,
    inicio + registrosPorPagina
  );

  useEffect(() => {
    setPagina(1);
  }, [
    periodo,
    filialSelecionada,
    limite,
  ]);

  /*
   * ============================================================
   * COR DA MÉDIA
   * ============================================================
   */

  const obterCorMedia = (mediaKmL: number) => {
    if (mediaKmL < 6.5) {
      return "bg-red-100 text-red-600";
    }

    if (mediaKmL > 6.8) {
      return "bg-green-100 text-green-600";
    }

    return "bg-yellow-100 text-yellow-600";
  };

  /*
   * ============================================================
   * EXPORTAÇÃO
   * ============================================================
   */

  const exportarCSV = () => {
    if (registros.length === 0) {
      return;
    }

    const cabecalho = [
      "Placa",
      "Veículo",
      "Motorista",
      "Total KM",
      "Total Litros",
      "Média KM/L",
      "Abastecimentos Calculados",
    ];

    const linhas = registros.map((registro) => [
      registro.placa,
      registro.veiculo,
      registro.motorista,
      registro.totalKm.toFixed(2),
      registro.totalLitros.toFixed(2),
      registro.mediaKmL.toFixed(2),
      registro.abastecimentosCalculados,
    ]);

    const csv = [
      cabecalho,
      ...linhas,
    ]
      .map((linha) =>
        linha
          .map((valor) => `"${valor}"`)
          .join(";")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `media-km-l-${periodo}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 mt-6 lg:mt-10 pb-6">

      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl sm:text-[27px] text-slate-900 font-bold">
          Média KM/L da Frota
        </h1>

        <p className="text-slate-600 text-sm font-light mt-1 max-w-3xl">
          Relatório de desempenho e consumo real de combustível por veículo.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap items-end gap-4 mt-5">

        {/* FILIAL */}
        <div className="flex flex-col w-full sm:w-50">
          <label className="text-slate-800 text-sm mb-1 ml-1">
            FILIAL
          </label>

          <select
            value={filialSelecionada}
            onChange={(e) =>
              setFilialSelecionada(e.target.value)
            }
            className="w-full h-10 px-2 text-slate-800 border border-slate-200 rounded-md bg-white hover:bg-slate-100 cursor-pointer"
          >
            <option value="todas">
              Todas
            </option>

            <option value="matriz">
              Matriz
            </option>

            <option value="jardim">
              Jardim
            </option>

            <option value="aquidauana">
              Aquidauana/Anastacio
            </option>

            <option value="nioaque">
              Nioaque
            </option>

            <option value="bonito">
              Bonito
            </option>

            <option value="dois irmaos">
              Dois Irmãos
            </option>

            <option value="bodoquena">
              Bodoquena
            </option>
          </select>
        </div>

        {/* PERÍODO */}
        <div className="flex flex-col w-full sm:w-50">
          <label className="text-slate-800 text-sm mb-1 ml-1">
            Período
          </label>

          <input
            type="month"
            name="periodo"
            id="periodo"
            value={periodo}
            onChange={(e) =>
              setPeriodo(e.target.value)
            }
            className="
              w-full
              h-10
              px-3
              border border-slate-200
              rounded-lg
              bg-white
              hover:bg-slate-100
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-500
              cursor-pointer
            "
          />
        </div>

        {/* MAIS FILTROS */}
        <button
          type="button"
          className="
            w-full sm:w-35
            h-10
            flex items-center justify-center
            gap-2
            border border-slate-200
            rounded-md
            bg-white
            text-slate-700
            text-sm
            hover:bg-slate-100
            cursor-pointer
          "
        >
          <Filter
            size={20}
            strokeWidth={3}
          />

          Mais Filtros
        </button>

        {/* EXPORTAR */}
        <button
          type="button"
          onClick={exportarCSV}
          disabled={registros.length === 0}
          className="
            w-full sm:w-35
            h-10
            flex items-center justify-center
            gap-2
            border border-slate-200
            rounded-md
            bg-white
            text-slate-700
            text-sm
            hover:bg-slate-100
            disabled:opacity-40
            disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <Download
            size={20}
            strokeWidth={3}
          />

          Exportar
        </button>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

        <div className="border border-slate-200 rounded-lg bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">
            Veículos
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {registros.length}
          </p>
        </div>

        <div className="border border-slate-200 rounded-lg bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">
            KM Rodados
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totaisFrota.totalKm.toLocaleString(
              "pt-BR",
              {
                maximumFractionDigits: 0,
              }
            )}{" "}
            km
          </p>
        </div>

        <div className="border border-slate-200 rounded-lg bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">
            Média da Frota
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatarNumero(
              totaisFrota.media
            )}{" "}
            km/l
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="mt-6 w-full overflow-x-auto rounded-md border border-slate-300">

        <div className="min-w-[950px]">

          {/* CABEÇALHO */}
          <div className="grid grid-cols-7 items-center bg-slate-200 h-10 px-4 text-slate-600 text-sm font-medium">

            <span>Placa</span>

            <span>Veículo</span>

            <span>Motorista</span>

            <span>KM Rodado</span>

            <span>Litros</span>

            <span>Média KM/L</span>

            <span>Abastecimentos</span>

          </div>

          {/* CARREGANDO */}
          {carregando && (
            <div className="h-24 flex items-center justify-center bg-white text-slate-500 text-sm">
              Carregando dados de abastecimento...
            </div>
          )}

          {/* SEM REGISTROS */}
          {!carregando &&
            registros.length === 0 && (
              <div className="h-24 flex items-center justify-center bg-white text-slate-500 text-sm">
                Nenhum consumo calculado para o período selecionado.
              </div>
            )}

          {/* REGISTROS */}
          {!carregando &&
            registrosExibidos.map(
              (registro, index) => (
                <div
                  key={`${registro.placa}-${index}`}
                  className="grid grid-cols-7 items-center min-h-12 px-4 bg-white text-slate-800 text-sm border-b border-slate-200"
                >

                  {/* PLACA */}
                  <span className="flex items-center">
                    <span className="bg-slate-200 px-3 py-1 rounded-md font-semibold">
                      {registro.placa}
                    </span>
                  </span>

                  {/* VEÍCULO */}
                  <span className="truncate pr-4">
                    {registro.veiculo}
                  </span>

                  {/* MOTORISTA */}
                  <span className="text-slate-500 truncate pr-4">
                    {registro.motorista}
                  </span>

                  {/* KM */}
                  <span>
                    {registro.totalKm.toLocaleString(
                      "pt-BR",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}{" "}
                    km
                  </span>

                  {/* LITROS */}
                  <span>
                    {formatarNumero(
                      registro.totalLitros
                    )}{" "}
                    L
                  </span>

                  {/* MÉDIA KM/L */}
                  <span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-lg font-semibold ${obterCorMedia(
                        registro.mediaKmL
                      )}`}
                    >
                      {formatarNumero(
                        registro.mediaKmL
                      )}{" "}
                      km/l
                    </span>
                  </span>

                  {/* ABASTECIMENTOS */}
                  <span className="text-slate-500">
                    {registro.abastecimentosCalculados}
                  </span>
                </div>
              )
            )}

          {/* TOTAL */}
          {!carregando &&
            registros.length > 0 && (
              <div className="grid grid-cols-7 items-center min-h-12 px-4 bg-slate-50 text-slate-800 text-sm font-bold border-b border-slate-200">

                <span>
                  Média da Frota
                </span>

                <span />

                <span />

                <span>
                  {totaisFrota.totalKm.toLocaleString(
                    "pt-BR",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}{" "}
                  km
                </span>

                <span>
                  {formatarNumero(
                    totaisFrota.totalLitros
                  )}{" "}
                  L
                </span>

                <span className="text-blue-600">
                  {formatarNumero(
                    totaisFrota.media
                  )}{" "}
                  km/l
                </span>

                <span>
                  {registros.reduce(
                    (total, registro) =>
                      total +
                      registro.abastecimentosCalculados,
                    0
                  )}
                </span>

              </div>
            )}

          {/* PAGINAÇÃO */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white">

            <span className="text-sm text-slate-500">
              Exibindo{" "}
              {registros.length === 0
                ? 0
                : inicio + 1}
              -
              {Math.min(
                inicio + registrosPorPagina,
                registros.length
              )}{" "}
              de {registros.length} registros
            </span>

            <div className="flex items-center gap-2 flex-wrap">

              <button
                onClick={() =>
                  setPagina(
                    Math.max(1, paginaAtual - 1)
                  )
                }
                disabled={paginaAtual === 1}
                className="
                  px-3 py-1.5
                  text-sm
                  border border-slate-300
                  rounded-md
                  text-slate-600
                  hover:bg-slate-100
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
              >
                Anterior
              </button>

              {Array.from(
                { length: totalPaginas },
                (_, index) => index + 1
              ).map((numeroPagina) => (
                <button
                  key={numeroPagina}
                  onClick={() =>
                    setPagina(numeroPagina)
                  }
                  className={`
                    w-8 h-8
                    rounded-md
                    text-sm
                    cursor-pointer
                    ${
                      paginaAtual === numeroPagina
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  {numeroPagina}
                </button>
              ))}

              <button
                onClick={() =>
                  setPagina(
                    Math.min(
                      totalPaginas,
                      paginaAtual + 1
                    )
                  )
                }
                disabled={
                  paginaAtual === totalPaginas
                }
                className="
                  px-3 py-1.5
                  text-sm
                  border border-slate-300
                  rounded-md
                  text-slate-600
                  hover:bg-slate-100
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
              >
                Próximo
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Media;

