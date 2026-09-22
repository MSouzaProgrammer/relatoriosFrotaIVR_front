import { Filter, Download, Fuel, Gauge } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

interface Veiculo {
  id: number;
  placa: string;
  modelosVeiculos?: string;
  marca?: string;
  filial?: string | { descricao?: string; name?: string };
  status?: string;
}

interface Abastecimento {
  id: number;
  veiculo: Veiculo;
  data: string;
  novoKm: number;
  quantLitro: number;
  valorTotal: number;
}

interface AbastecimentoCalculado {
  id: number;
  veiculoId: number;

  placa: string;
  veiculo: string;
  filial: string;

  data: string;
  mes: string;

  kmAnterior: number | null;
  kmAtual: number;
  kmRodado: number | null;

  litros: number;
  kmL: number | null;
}

interface RegistroMedia {
  veiculoId: number;

  placa: string;
  veiculo: string;
  filial: string;

  mediaUltimoAbastecimento: number | null;
  mediaMes: number | null;

  mesReferencia: string | null;

  totalKmMes: number;
  totalLitrosMes: number;

  quantidadeAbastecimentosMes: number;
}

function Media() {
  const [pagina, setPagina] = useState(1);

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [abastecimentos, setAbastecimentos] =
    useState<Abastecimento[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filialSelecionada, setFilialSelecionada] =
    useState("todas");

  /*
   * Vazio = todos os abastecimentos válidos.
   */
  const [periodo, setPeriodo] = useState("");

  const [limite, setLimite] = useState(10);

  /*
   * ==========================================
   * CARREGAR DADOS
   * ==========================================
   */

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro("");

        const [
          dadosVeiculos,
          dadosAbastecimentos,
        ] = await Promise.all([
          api<Veiculo[]>("/veiculos"),
          api<Abastecimento[]>("/combustiveis"),
        ]);

        setVeiculos(
          Array.isArray(dadosVeiculos)
            ? dadosVeiculos
            : []
        );

        setAbastecimentos(
          Array.isArray(dadosAbastecimentos)
            ? dadosAbastecimentos
            : []
        );
      } catch (error) {
        console.error(
          "Erro ao carregar média KM/L:",
          error
        );

        setErro(
          "Não foi possível carregar os veículos e abastecimentos."
        );

        setVeiculos([]);
        setAbastecimentos([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  /*
   * ==========================================
   * PAGINAÇÃO RESPONSIVA
   * ==========================================
   */

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
   * FILIAL
   * ==========================================
   */

  const obterNomeFilial = (
    veiculo?: Veiculo
  ) => {
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

  const normalizarFilial = (
    filial: string
  ) => {
    return filial
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  /*
   * ==========================================
   * NOME DO VEÍCULO
   * ==========================================
   */

  const obterNomeVeiculo = (
    veiculo?: Veiculo
  ) => {
    if (!veiculo) {
      return "Veículo";
    }

    const modelo =
      veiculo.modelosVeiculos
        ? veiculo.modelosVeiculos.replaceAll(
            "_",
            " "
          )
        : "";

    const marca =
      veiculo.marca
        ? veiculo.marca.replaceAll(
            "_",
            " "
          )
        : "";

    if (marca && modelo) {
      return `${marca} ${modelo}`;
    }

    return (
      modelo ||
      marca ||
      "Veículo"
    );
  };

  /*
   * ==========================================
   * FORMATAÇÃO
   * ==========================================
   */

  const formatarNumero = (
    valor: number
  ) => {
    return valor.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const formatarMes = (
    mes: string | null
  ) => {
    if (!mes) {
      return "Todos os meses";
    }

    const [ano, numeroMes] =
      mes.split("-");

    const data = new Date(
      Number(ano),
      Number(numeroMes) - 1,
      1
    );

    return data.toLocaleDateString(
      "pt-BR",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  /*
   * ==========================================
   * MESES DISPONÍVEIS
   * ==========================================
   */

  const periodosDisponiveis =
    useMemo(() => {
      return Array.from(
        new Set(
          abastecimentos
            .map(
              (item) =>
                item.data?.slice(
                  0,
                  7
                )
            )
            .filter(
              (
                mes
              ): mes is string =>
                Boolean(mes)
            )
        )
      ).sort((a, b) =>
        b.localeCompare(a)
      );
    }, [abastecimentos]);

  /*
   * ==========================================
   * ORGANIZAR ABASTECIMENTOS POR VEÍCULO
   *
   * Cada abastecimento atual é relacionado
   * somente ao abastecimento anterior
   * do MESMO veículo.
   * ==========================================
   */

  const abastecimentosCalculados =
    useMemo(() => {
      const todos = [
        ...abastecimentos,
      ].sort((a, b) => {
        const dataA =
          new Date(a.data).getTime();

        const dataB =
          new Date(b.data).getTime();

        if (dataA !== dataB) {
          return dataA - dataB;
        }

        return a.id - b.id;
      });

      const porVeiculo =
        new Map<
          number,
          Abastecimento[]
        >();

      todos.forEach((item) => {
        const veiculoId =
          item.veiculo?.id;

        if (!veiculoId) {
          return;
        }

        if (
          !porVeiculo.has(
            veiculoId
          )
        ) {
          porVeiculo.set(
            veiculoId,
            []
          );
        }

        porVeiculo
          .get(veiculoId)!
          .push(item);
      });

      const resultado: AbastecimentoCalculado[] =
        [];

      porVeiculo.forEach(
        (lista) => {
          for (
            let i = 0;
            i < lista.length;
            i++
          ) {
            const atual =
              lista[i];

            const anterior =
              i > 0
                ? lista[i - 1]
                : null;

            const kmAtual =
              Number(
                atual.novoKm || 0
              );

            /*
             * O backend armazena:
             *
             * 2550 = 25,50 litros
             */
            const litros =
              Number(
                atual.quantLitro || 0
              ) / 100;

            let kmAnterior:
              | number
              | null = null;

            let kmRodado:
              | number
              | null = null;

            let kmL:
              | number
              | null = null;

            /*
             * O primeiro abastecimento
             * não possui intervalo.
             */
            if (anterior) {
              const kmAnteriorCalculado =
                Number(
                  anterior.novoKm || 0
                );

              if (
                kmAnteriorCalculado > 0 &&
                kmAtual >
                  kmAnteriorCalculado &&
                litros > 0
              ) {
                kmAnterior =
                  kmAnteriorCalculado;

                kmRodado =
                  kmAtual -
                  kmAnteriorCalculado;

                kmL =
                  kmRodado /
                  litros;
              }
            }

            resultado.push({
              id: atual.id,

              veiculoId:
                atual.veiculo.id,

              placa:
                atual.veiculo.placa,

              veiculo:
                obterNomeVeiculo(
                  atual.veiculo
                ),

              filial:
                obterNomeFilial(
                  atual.veiculo
                ),

              data: atual.data,

              mes:
                atual.data?.slice(
                  0,
                  7
                ) || "",

              kmAnterior,

              kmAtual,

              kmRodado,

              litros,

              kmL,
            });
          }
        }
      );

      return resultado;
    }, [abastecimentos]);

  /*
   * ==========================================
   * MÉDIAS POR VEÍCULO
   *
   * ÚLTIMO ABASTECIMENTO:
   *
   * (KM último - KM penúltimo)
   * / litros do último abastecimento
   *
   *
   * MÉDIA DO MÊS:
   *
   * Soma dos KM dos intervalos
   * / soma dos litros dos intervalos
   *
   * O primeiro abastecimento NÃO entra,
   * pois ele não possui KM anterior.
   * ==========================================
   */

  const registros =
    useMemo<RegistroMedia[]>(
      () => {
        const resultado: RegistroMedia[] =
          [];

        veiculos.forEach(
          (veiculo) => {
            const historico =
              abastecimentosCalculados
                .filter(
                  (item) =>
                    item.veiculoId ===
                    veiculo.id
                )
                .sort(
                  (a, b) => {
                    const dataA =
                      new Date(
                        a.data
                      ).getTime();

                    const dataB =
                      new Date(
                        b.data
                      ).getTime();

                    if (
                      dataA !==
                      dataB
                    ) {
                      return (
                        dataA -
                        dataB
                      );
                    }

                    return (
                      a.id -
                      b.id
                    );
                  }
                );

            /*
             * ==================================
             * MÉDIA DO ÚLTIMO ABASTECIMENTO
             * ==================================
             */

            let mediaUltimoAbastecimento:
              | number
              | null = null;

            if (
              historico.length >=
              2
            ) {
              const ultimo =
                historico[
                  historico.length -
                    1
                ];

              const penultimo =
                historico[
                  historico.length -
                    2
                ];

              const kmRodado =
                ultimo.kmAtual -
                penultimo.kmAtual;

              const litrosUltimo =
                ultimo.litros;

              if (
                kmRodado > 0 &&
                litrosUltimo > 0
              ) {
                mediaUltimoAbastecimento =
                  kmRodado /
                  litrosUltimo;
              }
            }

            /*
             * ==================================
             * INTERVALOS DO PERÍODO
             * ==================================
             *
             * Cada item abaixo já representa:
             *
             * KM atual - KM anterior
             *
             * com os litros DO ABASTECIMENTO
             * atual.
             */

            const registrosConsiderados =
              (
                periodo
                  ? historico.filter(
                      (item) =>
                        item.mes ===
                        periodo
                    )
                  : historico
              ).filter(
                (item) =>
                  item.kmRodado !==
                    null &&
                  item.kmRodado >
                    0 &&
                  item.litros >
                    0
              );

            /*
             * KM TOTAL DOS INTERVALOS
             */

            const totalKmMes =
              registrosConsiderados.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  (item.kmRodado ||
                    0),
                0
              );

            /*
             * LITROS TOTAL DOS INTERVALOS
             *
             * O primeiro abastecimento
             * não chega aqui.
             */

            const totalLitrosMes =
              registrosConsiderados.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  item.litros,
                0
              );

            /*
             * MÉDIA
             */

            const mediaMes =
              totalLitrosMes >
                0 &&
              totalKmMes >
                0
                ? totalKmMes /
                  totalLitrosMes
                : null;

            resultado.push({
              veiculoId:
                veiculo.id,

              placa:
                veiculo.placa,

              veiculo:
                obterNomeVeiculo(
                  veiculo
                ),

              filial:
                obterNomeFilial(
                  veiculo
                ),

              mediaUltimoAbastecimento,

              mediaMes,

              mesReferencia:
                periodo ||
                null,

              totalKmMes,

              totalLitrosMes,

              quantidadeAbastecimentosMes:
                registrosConsiderados.length,
            });
          }
        );

        /*
         * ==================================
         * ORDENAÇÃO
         *
         * Mais econômico primeiro.
         *
         * Maior KM/L = mais econômico.
         * ==================================
         */

        resultado.sort(
          (a, b) => {
            /*
             * Sem média ficam por último.
             */

            if (
              a.mediaMes ===
                null &&
              b.mediaMes ===
                null
            ) {
              return a.placa.localeCompare(
                b.placa
              );
            }

            if (
              a.mediaMes ===
              null
            ) {
              return 1;
            }

            if (
              b.mediaMes ===
              null
            ) {
              return -1;
            }

            /*
             * Maior média primeiro.
             */

            if (
              a.mediaMes !==
              b.mediaMes
            ) {
              return (
                b.mediaMes -
                a.mediaMes
              );
            }

            /*
             * Empate:
             * usa média do último.
             */

            if (
              a.mediaUltimoAbastecimento ===
                null &&
              b.mediaUltimoAbastecimento ===
                null
            ) {
              return a.placa.localeCompare(
                b.placa
              );
            }

            if (
              a.mediaUltimoAbastecimento ===
              null
            ) {
              return 1;
            }

            if (
              b.mediaUltimoAbastecimento ===
              null
            ) {
              return -1;
            }

            return (
              b.mediaUltimoAbastecimento -
              a.mediaUltimoAbastecimento
            );
          }
        );

        return resultado;
      },
      [
        veiculos,
        abastecimentosCalculados,
        periodo,
      ]
    );

  /*
   * ==========================================
   * FILTRO POR FILIAL
   * ==========================================
   */

  const registrosFiltrados =
    useMemo(() => {
      if (
        filialSelecionada ===
        "todas"
      ) {
        return registros;
      }

      const filtro =
        normalizarFilial(
          filialSelecionada
        );

      return registros.filter(
        (registro) =>
          normalizarFilial(
            registro.filial
          ).includes(filtro)
      );
    }, [
      registros,
      filialSelecionada,
    ]);

  /*
   * ==========================================
   * MÉDIA GERAL DA FROTA
   *
   * Mesma regra dos veículos:
   *
   * soma dos intervalos KM
   * /
   * soma dos litros dos intervalos
   * ==========================================
   */

  const totaisFrota =
    useMemo(() => {
      const registrosValidos =
        abastecimentosCalculados.filter(
          (item) => {
            if (
              item.kmRodado ===
                null ||
              item.kmRodado <=
                0 ||
              item.litros <=
                0
            ) {
              return false;
            }

            if (
              periodo &&
              item.mes !==
                periodo
            ) {
              return false;
            }

            return true;
          }
        );

      const totalKm =
        registrosValidos.reduce(
          (
            total,
            item
          ) =>
            total +
            (item.kmRodado ||
              0),
          0
        );

      const totalLitros =
        registrosValidos.reduce(
          (
            total,
            item
          ) =>
            total +
            item.litros,
          0
        );

      return {
        totalKm,

        totalLitros,

        media:
          totalLitros > 0 &&
          totalKm > 0
            ? totalKm /
              totalLitros
            : null,
      };
    }, [
      abastecimentosCalculados,
      periodo,
    ]);

  /*
   * ==========================================
   * PAGINAÇÃO
   * ==========================================
   */

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

  useEffect(() => {
    setPagina(1);
  }, [
    filialSelecionada,
    periodo,
    limite,
  ]);

  /*
   * ==========================================
   * COR DA MÉDIA
   * ==========================================
   */

  const obterCorMedia = (
    media: number | null
  ) => {
    if (
      media === null
    ) {
      return "bg-slate-100 text-slate-500";
    }

    if (
      media < 6.5
    ) {
      return "bg-red-100 text-red-600";
    }

    if (
      media > 6.8
    ) {
      return "bg-green-100 text-green-600";
    }

    return "bg-yellow-100 text-yellow-600";
  };

  /*
   * ==========================================
   * EXPORTAR CSV
   * ==========================================
   */

  const exportarCSV = () => {
    if (
      registrosFiltrados.length ===
      0
    ) {
      return;
    }

    const cabecalho = [
      "Placa",
      "Veículo",
      "Filial",
      "Média Último Abastecimento",
      "Média do Mês",
      "KM Considerados",
      "Litros Considerados",
      "Quantidade de Abastecimentos",
      "Período",
    ];

    const linhas =
      registrosFiltrados.map(
        (registro) => [
          registro.placa,

          registro.veiculo,

          registro.filial,

          registro.mediaUltimoAbastecimento !==
          null
            ? registro.mediaUltimoAbastecimento.toFixed(
                2
              )
            : "",

          registro.mediaMes !==
          null
            ? registro.mediaMes.toFixed(
                2
              )
            : "",

          registro.totalKmMes.toFixed(
            2
          ),

          registro.totalLitrosMes.toFixed(
            2
          ),

          String(
            registro.quantidadeAbastecimentosMes
          ),

          registro.mesReferencia ||
            "Todos os meses",
        ]
      );

    const csv =
      [
        cabecalho,
        ...linhas,
      ]
        .map(
          (linha) =>
            linha
              .map(
                (valor) =>
                  `"${valor}"`
              )
              .join(";")
        )
        .join("\n");

    const blob =
      new Blob(
        [
          "\uFEFF" +
            csv,
        ],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `media-km-l${
        periodo
          ? `-${periodo}`
          : "-geral"
      }.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  };

  /*
   * ==========================================
   * TELA
   * ==========================================
   */

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 mt-6 lg:mt-10 pb-8">

      {/* CABEÇALHO */}

      <div>
        <h1 className="text-2xl sm:text-[27px] text-slate-900 font-bold">
          Média KM/L da Frota
        </h1>

        <p className="text-slate-600 text-sm font-light mt-1 max-w-4xl">
          Acompanhe a média do último abastecimento e a média de consumo de cada veículo.
        </p>
      </div>

      {/* ERRO */}

      {erro && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      {/* FILTROS */}

      <div className="flex flex-wrap items-end gap-4 mt-5">

        {/* FILIAL */}

        <div className="flex flex-col w-full sm:w-52">
          <label className="text-slate-800 text-sm mb-1 ml-1">
            FILIAL
          </label>

          <select
            value={
              filialSelecionada
            }
            onChange={(e) =>
              setFilialSelecionada(
                e.target.value
              )
            }
            className="w-full h-10 px-2 text-slate-800 border border-slate-200 rounded-md bg-white hover:bg-slate-100 cursor-pointer"
          >
            <option value="todas">
              Todas
            </option>

            <option value="matriz">
              Matriz
            </option>

            <option value="aquidauana">
              Aquidauana/Anastácio
            </option>

            <option value="dois irmaos">
              Dois Irmãos do Buriti
            </option>

            <option value="nioaque">
              Nioaque
            </option>

            <option value="jardim">
              Jardim/Guia Lopes
            </option>

            <option value="bonito">
              Bonito
            </option>

            <option value="bodoquena">
              Bodoquena
            </option>
          </select>
        </div>

        {/* MÊS */}

        <div className="flex flex-col w-full sm:w-52">
          <label className="text-slate-800 text-sm mb-1 ml-1">
            MÊS DA MÉDIA
          </label>

          <select
            value={periodo}
            onChange={(e) =>
              setPeriodo(
                e.target.value
              )
            }
            className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">
              Sem filtro mensal
            </option>

            {periodosDisponiveis.map(
              (mes) => (
                <option
                  key={mes}
                  value={mes}
                >
                  {formatarMes(
                    mes
                  )}
                </option>
              )
            )}
          </select>
        </div>

        {/* LIMPAR */}

        <button
          type="button"
          onClick={() => {
            setFilialSelecionada(
              "todas"
            );

            setPeriodo("");
          }}
          className="w-full sm:w-36 h-10 flex items-center justify-center gap-2 border border-slate-200 rounded-md bg-white text-slate-700 text-sm hover:bg-slate-100 cursor-pointer"
        >
          <Filter
            size={20}
            strokeWidth={3}
          />

          Limpar
        </button>

        {/* EXPORTAR */}

        <button
          type="button"
          onClick={
            exportarCSV
          }
          disabled={
            registrosFiltrados.length ===
            0
          }
          className="w-full sm:w-36 h-10 flex items-center justify-center gap-2 border border-slate-200 rounded-md bg-white text-slate-700 text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Download
            size={20}
            strokeWidth={3}
          />

          Exportar
        </button>
      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

        {/* VEÍCULOS */}

        <div className="border border-slate-200 rounded-lg bg-white p-4">
          <div className="flex items-center gap-2">
            <Fuel
              size={18}
              className="text-blue-600"
            />

            <p className="text-xs text-slate-500 uppercase">
              Veículos
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {
              registrosFiltrados.length
            }
          </p>
        </div>

        {/* KM */}

        <div className="border border-slate-200 rounded-lg bg-white p-4">
          <div className="flex items-center gap-2">
            <Gauge
              size={18}
              className="text-slate-600"
            />

            <p className="text-xs text-slate-500 uppercase">
              KM considerados
            </p>
          </div>

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

        {/* MÉDIA DA FROTA */}

        <div className="border border-slate-200 rounded-lg bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">
            Média da Frota
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {totaisFrota.media ===
            null
              ? "-"
              : `${formatarNumero(
                  totaisFrota.media
                )} km/l`}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {periodo
              ? formatarMes(
                  periodo
                )
              : "Todos os abastecimentos válidos"}
          </p>
        </div>
      </div>

      {/* TABELA */}

      <div className="mt-6 w-full overflow-x-auto rounded-md border border-slate-300">
        <div className="min-w-[1200px]">

          {/* CABEÇALHO */}

          <div className="grid grid-cols-[1.05fr_1.9fr_1.15fr_1.6fr_1.5fr_1.2fr] items-center bg-slate-200 min-h-12 px-4 text-slate-600 text-sm font-medium">

            <span>
              Placa
            </span>

            <span>
              Veículo
            </span>

            <span>
              Filial
            </span>

            <span>
              Último abastecimento
            </span>

            <span>
              Média do mês
            </span>

            <span>
              Referência
            </span>
          </div>

          {/* CARREGANDO */}

          {carregando && (
            <div className="h-24 flex items-center justify-center bg-white text-slate-500 text-sm">
              Carregando veículos e abastecimentos...
            </div>
          )}

          {/* VAZIO */}

          {!carregando &&
            registrosFiltrados.length ===
              0 && (
              <div className="h-24 flex items-center justify-center bg-white text-slate-500 text-sm">
                Nenhum veículo encontrado.
              </div>
            )}

          {/* REGISTROS */}

          {!carregando &&
            registrosExibidos.map(
              (registro) => (
                <div
                  key={
                    registro.veiculoId
                  }
                  className="grid grid-cols-[1.05fr_1.9fr_1.15fr_1.6fr_1.5fr_1.2fr] items-center min-h-16 px-4 bg-white text-slate-800 text-sm border-b border-slate-200"
                >

                  {/* PLACA */}

                  <span className="flex items-center">
                    <span className="bg-slate-200 px-3 py-1 rounded-md font-semibold">
                      {
                        registro.placa
                      }
                    </span>
                  </span>

                  {/* VEÍCULO */}

                  <span className="truncate pr-4">
                    {
                      registro.veiculo
                    }
                  </span>

                  {/* FILIAL */}

                  <span className="text-slate-500 truncate pr-4">
                    {
                      registro.filial ||
                      "-"
                    }
                  </span>

                  {/* ÚLTIMO */}

                  <span>
                    {
                      registro.mediaUltimoAbastecimento ===
                      null ? (
                        <span className="text-slate-400">
                          Sem dados
                        </span>
                      ) : (
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg font-semibold ${obterCorMedia(
                            registro.mediaUltimoAbastecimento
                          )}`}
                        >
                          {
                            formatarNumero(
                              registro.mediaUltimoAbastecimento
                            )
                          }{" "}
                          km/l
                        </span>
                      )
                    }
                  </span>

                  {/* MÉDIA DO MÊS */}

                  <span>
                    {
                      registro.mediaMes ===
                      null ? (
                        <span className="text-slate-400">
                          Sem dados
                        </span>
                      ) : (
                        <>
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg font-semibold ${obterCorMedia(
                              registro.mediaMes
                            )}`}
                          >
                            {
                              formatarNumero(
                                registro.mediaMes
                              )
                            }{" "}
                            km/l
                          </span>

                          <span className="block text-xs text-slate-400 mt-1">
                            {
                              formatarNumero(
                                registro.totalKmMes
                              )
                            }{" "}
                            km /{" "}
                            {
                              formatarNumero(
                                registro.totalLitrosMes
                              )
                            }{" "}
                            L
                          </span>
                        </>
                      )
                    }
                  </span>

                  {/* REFERÊNCIA */}

                  <span className="text-slate-500 capitalize">
                    {
                      registro.mesReferencia
                        ? formatarMes(
                            registro.mesReferencia
                          )
                        : "Todos os meses"
                    }
                  </span>
                </div>
              )
            )}

          {/* MÉDIA DA FROTA */}

          {!carregando &&
            registrosFiltrados.length >
              0 && (
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 bg-slate-50 text-sm border-b border-slate-200">

                <div className="font-bold text-slate-800">
                  Média da frota
                </div>

                <div className="text-blue-600 font-bold">
                  {
                    totaisFrota.media ===
                    null
                      ? "-"
                      : `${formatarNumero(
                          totaisFrota.media
                        )} km/l`
                  }
                </div>
              </div>
            )}

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
              veículos
            </span>

            <div className="flex items-center gap-2 flex-wrap">

              {/* ANTERIOR */}

              <button
                type="button"
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

              {/* PÁGINAS */}

              {Array.from(
                {
                  length:
                    totalPaginas,
                },
                (_, index) =>
                  index + 1
              ).map(
                (
                  numeroPagina
                ) => (
                  <button
                    type="button"
                    key={
                      numeroPagina
                    }
                    onClick={() =>
                      setPagina(
                        numeroPagina
                      )
                    }
                    className={`w-8 h-8 rounded-md text-sm cursor-pointer ${
                      paginaAtual ===
                      numeroPagina
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {
                      numeroPagina
                    }
                  </button>
                )
              )}

              {/* PRÓXIMO */}

              <button
                type="button"
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
    </div>
  );
}

export default Media;