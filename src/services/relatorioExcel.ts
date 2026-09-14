import ExcelJS from "exceljs";

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
  despesa: "LAVAGEM" | "MANUTENCAO";
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

const FILIAIS = [
  {
    codigo: "MATRIZ",
    nome: "1 - MATRIZ",
  },
  {
    codigo: "AQUIDAUANA_ANASTACIO",
    nome: "2 - AQUIDAUANA / ANASTÁCIO",
  },
  {
    codigo: "DOIS_IRMAOS_BURITI",
    nome: "3 - D.I.B",
  },
  {
    codigo: "NIOAQUE",
    nome: "4 - NIOAQUE",
  },
  {
    codigo: "JARDIM_GUIA_LOPES",
    nome: "5 - JARDIM / GUIA LOPES",
  },
  {
    codigo: "BONITO",
    nome: "7 - BONITO",
  },
  {
    codigo: "BODOQUENA",
    nome: "15 - BODOQUENA",
  },
];

/* =========================================================
   CONVERSÕES
========================================================= */

function valorReal(
  valor: number | null | undefined
) {
  return Number(valor || 0) / 100;
}

function litrosReal(
  valor: number | null | undefined
) {
  return Number(valor || 0) / 100;
}

function dataReal(data: string) {
  if (!data) {
    return null;
  }

  const [ano, mes, dia] = data
    .split("-")
    .map(Number);

  if (!ano || !mes || !dia) {
    return null;
  }

  return new Date(
    ano,
    mes - 1,
    dia
  );
}

function formatarData(data: string) {
  if (!data) {
    return "";
  }

  const [ano, mes, dia] =
    data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function nomeDaManutencao(
  registro: Manutencao
) {
  if (
    registro.nomeDaManutencao?.trim()
  ) {
    return registro.nomeDaManutencao;
  }

  switch (
    registro.manutencaoTipos
  ) {
    case "PNEU":
      return "Troca de pneu";

    case "OLEO":
      return "Troca de óleo";

    case "MOTOR":
      return "Manutenção no motor";

    case "OUTROS":
      return "Outros";

    default:
      return "";
  }
}

/* =========================================================
   ESTILOS
========================================================= */

const CORES = {
  titulo: "1E3A5F",
  filial: "DCE6F1",
  cabecalho: "E9EFF5",
  total: "EAF2F8",
  branco: "FFFFFF",
  texto: "1F2937",
  azul: "DDEBF7",
  verde: "E2F0D9",
  amarelo: "FFF2CC",
  vermelho: "FCE4D6",
  borda: "D1D5DB",
};

function aplicarBorda(
  cell: ExcelJS.Cell
) {
  cell.border = {
    top: {
      style: "thin",
      color: {
        argb: `FF${CORES.borda}`,
      },
    },
    bottom: {
      style: "thin",
      color: {
        argb: `FF${CORES.borda}`,
      },
    },
    left: {
      style: "thin",
      color: {
        argb: `FF${CORES.borda}`,
      },
    },
    right: {
      style: "thin",
      color: {
        argb: `FF${CORES.borda}`,
      },
    },
  };
}

function aplicarMoeda(
  cell: ExcelJS.Cell
) {
  cell.numFmt =
    '"R$" #,##0.00';
}

function aplicarData(
  cell: ExcelJS.Cell
) {
  cell.numFmt =
    "dd/mm/yyyy";
}

function aplicarTitulo(
  row: ExcelJS.Row,
  quantidadeColunas: number
) {
  row.height = 30;

  for (
    let coluna = 1;
    coluna <= quantidadeColunas;
    coluna++
  ) {
    const cell =
      row.getCell(coluna);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: `FF${CORES.titulo}`,
      },
    };

    cell.font = {
      bold: true,
      size: 14,
      color: {
        argb: `FF${CORES.branco}`,
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    aplicarBorda(cell);
  }
}

function aplicarCabecalho(
  row: ExcelJS.Row,
  quantidadeColunas: number
) {
  row.height = 23;

  for (
    let coluna = 1;
    coluna <= quantidadeColunas;
    coluna++
  ) {
    const cell =
      row.getCell(coluna);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: `FF${CORES.cabecalho}`,
      },
    };

    cell.font = {
      bold: true,
      color: {
        argb: `FF${CORES.texto}`,
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    aplicarBorda(cell);
  }
}

function aplicarFilial(
  row: ExcelJS.Row,
  quantidadeColunas: number
) {
  row.height = 24;

  for (
    let coluna = 1;
    coluna <= quantidadeColunas;
    coluna++
  ) {
    const cell =
      row.getCell(coluna);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: `FF${CORES.filial}`,
      },
    };

    cell.font = {
      bold: true,
      size: 11,
      color: {
        argb: `FF${CORES.texto}`,
      },
    };

    cell.alignment = {
      horizontal:
        coluna === 1
          ? "left"
          : "center",
      vertical: "middle",
    };

    aplicarBorda(cell);
  }
}

function aplicarTotal(
  row: ExcelJS.Row,
  quantidadeColunas: number
) {
  row.height = 24;

  for (
    let coluna = 1;
    coluna <= quantidadeColunas;
    coluna++
  ) {
    const cell =
      row.getCell(coluna);

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: `FF${CORES.total}`,
      },
    };

    cell.font = {
      bold: true,
      color: {
        argb: `FF${CORES.texto}`,
      },
    };

    cell.alignment = {
      horizontal:
        coluna === 1
          ? "left"
          : "right",
      vertical: "middle",
    };

    aplicarBorda(cell);
  }
}

/* =========================================================
   AGRUPAMENTO
========================================================= */

function agruparPorFilial<
  T extends {
    veiculo?: {
      filial?: string;
    };
  }
>(registros: T[]) {
  const mapa =
    new Map<string, T[]>();

  FILIAIS.forEach(
    (filial) => {
      mapa.set(
        filial.codigo,
        []
      );
    }
  );

  registros.forEach(
    (registro) => {
      const filial =
        registro.veiculo?.filial;

      if (!filial) {
        return;
      }

      const lista =
        mapa.get(filial);

      if (lista) {
        lista.push(registro);
      }
    }
  );

  return mapa;
}

/* =========================================================
   CONFIGURAÇÃO DAS ABAS
========================================================= */

function prepararAba(
  sheet: ExcelJS.Worksheet,
  titulo: string,
  colunas: string[],
  larguras: number[]
) {
  sheet.views = [
    {
      state: "frozen",
      ySplit: 3,
    },
  ];

  sheet.columns =
    larguras.map(
      (width) => ({
        width,
      })
    );

  sheet.mergeCells(
    1,
    1,
    1,
    colunas.length
  );

  const tituloCell =
    sheet.getCell(1, 1);

  tituloCell.value =
    titulo;

  aplicarTitulo(
    sheet.getRow(1),
    colunas.length
  );

  sheet.getRow(3).values =
    colunas;

  aplicarCabecalho(
    sheet.getRow(3),
    colunas.length
  );
}

function criarCabecalhoFilial(
  sheet: ExcelJS.Worksheet,
  linha: number,
  nome: string,
  quantidadeColunas: number
) {
  sheet.mergeCells(
    linha,
    1,
    linha,
    quantidadeColunas
  );

  const cell =
    sheet.getCell(
      linha,
      1
    );

  cell.value = nome;

  aplicarFilial(
    sheet.getRow(linha),
    quantidadeColunas
  );
}

function limparLinha(
  sheet: ExcelJS.Worksheet,
  linha: number,
  quantidadeColunas: number
) {
  for (
    let coluna = 1;
    coluna <= quantidadeColunas;
    coluna++
  ) {
    sheet.getCell(
      linha,
      coluna
    ).value = null;
  }
}

/* =========================================================
   ABA COMBUSTÍVEL
========================================================= */

function criarAbaCombustivel(
  workbook: ExcelJS.Workbook,
  registros: Abastecimento[],
  dataInicial: string,
  dataFinal: string
) {
  const sheet =
    workbook.addWorksheet(
      "DESP. COMBUSTÍVEL"
    );

  prepararAba(
    sheet,
    `CONTROLE DESPESAS COMBUSTÍVEL - ${formatarData(dataInicial)} A ${formatarData(dataFinal)}`,
    [
      "PLACA",
      "VEÍCULO",
      "MOTORISTA",
      "LITROS",
      "DATA DESPESA",
      "VALOR PAGO",
      "OBSERVAÇÃO",
    ],
    [
      14,
      24,
      28,
      14,
      16,
      17,
      40,
    ]
  );

  let linha = 4;

  const grupos =
    agruparPorFilial(
      registros
    );

  FILIAIS.forEach(
    (filial) => {
      const dados =
        grupos.get(
          filial.codigo
        ) || [];

      criarCabecalhoFilial(
        sheet,
        linha,
        filial.nome,
        7
      );

      linha++;

      if (dados.length === 0) {
        sheet.mergeCells(
          linha,
          1,
          linha,
          7
        );

        const cell =
          sheet.getCell(
            linha,
            1
          );

        cell.value =
          "Nenhum lançamento no período.";

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.font = {
          italic: true,
          color: {
            argb: "FF6B7280",
          },
        };

        linha += 2;

        return;
      }

      let totalLitros = 0;
      let totalValor = 0;

      dados.forEach(
        (registro) => {
          const row =
            sheet.getRow(linha);

          row.getCell(1).value =
            registro.veiculo?.placa ||
            "";

          row.getCell(2).value =
            registro.veiculo
              ?.modelosVeiculos ||
            "";

          row.getCell(3).value =
            registro.motorista?.nome ||
            "";

          row.getCell(4).value =
            litrosReal(
              registro.quantLitro
            );

          row.getCell(5).value =
            dataReal(
              registro.data
            );

          row.getCell(6).value =
            valorReal(
              registro.valorTotal
            );

          row.getCell(7).value =
            registro.observacao ||
            "";

          aplicarData(
            row.getCell(5)
          );

          aplicarMoeda(
            row.getCell(6)
          );

          for (
            let coluna = 1;
            coluna <= 7;
            coluna++
          ) {
            aplicarBorda(
              row.getCell(coluna)
            );
          }

          totalLitros +=
            litrosReal(
              registro.quantLitro
            );

          totalValor +=
            valorReal(
              registro.valorTotal
            );

          linha++;
        }
      );

      const totalRow =
        sheet.getRow(linha);

      sheet.mergeCells(
        linha,
        1,
        linha,
        3
      );

      totalRow.getCell(1).value =
        "SUBTOTAL";

      totalRow.getCell(4).value =
        totalLitros;

      totalRow.getCell(6).value =
        totalValor;

      aplicarMoeda(
        totalRow.getCell(6)
      );

      aplicarTotal(
        totalRow,
        7
      );

      linha += 2;
    }
  );

  return sheet;
}

/* =========================================================
   ABA LAVAGEM
========================================================= */

function criarAbaLavagem(
  workbook: ExcelJS.Workbook,
  registros: Manutencao[],
  dataInicial: string,
  dataFinal: string
) {
  const sheet =
    workbook.addWorksheet(
      "DESP. LAVAGEM"
    );

  prepararAba(
    sheet,
    `CONTROLE DESPESAS LAVAGEM - ${formatarData(dataInicial)} A ${formatarData(dataFinal)}`,
    [
      "PLACA",
      "VEÍCULO",
      "MOTORISTA",
      "QUANTIDADE",
      "DATA DESPESA",
      "VALOR PAGO",
      "OBSERVAÇÃO",
    ],
    [
      14,
      24,
      28,
      14,
      16,
      17,
      40,
    ]
  );

  let linha = 4;

  const grupos =
    agruparPorFilial(
      registros
    );

  FILIAIS.forEach(
    (filial) => {
      const dados =
        grupos.get(
          filial.codigo
        ) || [];

      criarCabecalhoFilial(
        sheet,
        linha,
        filial.nome,
        7
      );

      linha++;

      if (dados.length === 0) {
        sheet.mergeCells(
          linha,
          1,
          linha,
          7
        );

        sheet.getCell(
          linha,
          1
        ).value =
          "Nenhum lançamento no período.";

        sheet.getCell(
          linha,
          1
        ).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        linha += 2;

        return;
      }

      let totalValor = 0;

      dados.forEach(
        (registro) => {
          const row =
            sheet.getRow(linha);

          row.getCell(1).value =
            registro.veiculo?.placa ||
            "";

          row.getCell(2).value =
            registro.veiculo
              ?.modelosVeiculos ||
            "";

          row.getCell(3).value =
            registro.motorista?.nome ||
            "";

          row.getCell(4).value = 1;

          row.getCell(5).value =
            dataReal(
              registro.data
            );

          row.getCell(6).value =
            valorReal(
              registro.valorTotal
            );

          row.getCell(7).value =
            registro.observacao ||
            "";

          aplicarData(
            row.getCell(5)
          );

          aplicarMoeda(
            row.getCell(6)
          );

          for (
            let coluna = 1;
            coluna <= 7;
            coluna++
          ) {
            aplicarBorda(
              row.getCell(coluna)
            );
          }

          totalValor +=
            valorReal(
              registro.valorTotal
            );

          linha++;
        }
      );

      const totalRow =
        sheet.getRow(linha);

      sheet.mergeCells(
        linha,
        1,
        linha,
        3
      );

      totalRow.getCell(1).value =
        "SUBTOTAL";

      totalRow.getCell(4).value =
        dados.length;

      totalRow.getCell(6).value =
        totalValor;

      aplicarMoeda(
        totalRow.getCell(6)
      );

      aplicarTotal(
        totalRow,
        7
      );

      linha += 2;
    }
  );

  return sheet;
}

/* =========================================================
   ABA PNEUS
========================================================= */

function criarAbaPneus(
  workbook: ExcelJS.Workbook,
  registros: Manutencao[],
  dataInicial: string,
  dataFinal: string
) {
  const sheet =
    workbook.addWorksheet(
      "DESP. PNEUS"
    );

  prepararAba(
    sheet,
    `CONTROLE DESPESAS PNEUS - ${formatarData(dataInicial)} A ${formatarData(dataFinal)}`,
    [
      "PLACA",
      "VEÍCULO",
      "MOTORISTA",
      "QUANTIDADE",
      "DATA DESPESA",
      "VALOR PAGO",
      "OBSERVAÇÃO",
    ],
    [
      14,
      24,
      28,
      14,
      16,
      17,
      40,
    ]
  );

  let linha = 4;

  const grupos =
    agruparPorFilial(
      registros
    );

  FILIAIS.forEach(
    (filial) => {
      const dados =
        grupos.get(
          filial.codigo
        ) || [];

      criarCabecalhoFilial(
        sheet,
        linha,
        filial.nome,
        7
      );

      linha++;

      if (dados.length === 0) {
        sheet.mergeCells(
          linha,
          1,
          linha,
          7
        );

        sheet.getCell(
          linha,
          1
        ).value =
          "Nenhum lançamento no período.";

        sheet.getCell(
          linha,
          1
        ).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        linha += 2;

        return;
      }

      let totalValor = 0;

      dados.forEach(
        (registro) => {
          const row =
            sheet.getRow(linha);

          row.getCell(1).value =
            registro.veiculo?.placa ||
            "";

          row.getCell(2).value =
            registro.veiculo
              ?.modelosVeiculos ||
            "";

          row.getCell(3).value =
            registro.motorista?.nome ||
            "";

          row.getCell(4).value = 1;

          row.getCell(5).value =
            dataReal(
              registro.data
            );

          row.getCell(6).value =
            valorReal(
              registro.valorTotal
            );

          row.getCell(7).value =
            registro.observacao ||
            "";

          aplicarData(
            row.getCell(5)
          );

          aplicarMoeda(
            row.getCell(6)
          );

          for (
            let coluna = 1;
            coluna <= 7;
            coluna++
          ) {
            aplicarBorda(
              row.getCell(coluna)
            );
          }

          totalValor +=
            valorReal(
              registro.valorTotal
            );

          linha++;
        }
      );

      const totalRow =
        sheet.getRow(linha);

      sheet.mergeCells(
        linha,
        1,
        linha,
        3
      );

      totalRow.getCell(1).value =
        "SUBTOTAL";

      totalRow.getCell(4).value =
        dados.length;

      totalRow.getCell(6).value =
        totalValor;

      aplicarMoeda(
        totalRow.getCell(6)
      );

      aplicarTotal(
        totalRow,
        7
      );

      linha += 2;
    }
  );

  return sheet;
}

/* =========================================================
   ABA MANUTENÇÃO
========================================================= */

function criarAbaManutencao(
  workbook: ExcelJS.Workbook,
  registros: Manutencao[],
  dataInicial: string,
  dataFinal: string
) {
  const sheet =
    workbook.addWorksheet(
      "DESP. MANUTENÇÃO"
    );

  prepararAba(
    sheet,
    `CONTROLE DESPESAS MANUTENÇÃO - ${formatarData(dataInicial)} A ${formatarData(dataFinal)}`,
    [
      "PLACA",
      "VEÍCULO",
      "MOTORISTA",
      "KM",
      "DATA DESPESA",
      "MANUTENÇÃO",
      "VALOR PAGO",
      "OBSERVAÇÃO",
    ],
    [
      14,
      24,
      28,
      15,
      16,
      32,
      17,
      40,
    ]
  );

  let linha = 4;

  const grupos =
    agruparPorFilial(
      registros
    );

  FILIAIS.forEach(
    (filial) => {
      const dados =
        grupos.get(
          filial.codigo
        ) || [];

      criarCabecalhoFilial(
        sheet,
        linha,
        filial.nome,
        8
      );

      linha++;

      if (dados.length === 0) {
        sheet.mergeCells(
          linha,
          1,
          linha,
          8
        );

        sheet.getCell(
          linha,
          1
        ).value =
          "Nenhum lançamento no período.";

        sheet.getCell(
          linha,
          1
        ).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        linha += 2;

        return;
      }

      let totalValor = 0;

      dados.forEach(
        (registro) => {
          const row =
            sheet.getRow(linha);

          row.getCell(1).value =
            registro.veiculo?.placa ||
            "";

          row.getCell(2).value =
            registro.veiculo
              ?.modelosVeiculos ||
            "";

          row.getCell(3).value =
            registro.motorista?.nome ||
            "";

          row.getCell(4).value =
            registro.novoKm || 0;

          row.getCell(5).value =
            dataReal(
              registro.data
            );

          row.getCell(6).value =
            nomeDaManutencao(
              registro
            );

          row.getCell(7).value =
            valorReal(
              registro.valorTotal
            );

          row.getCell(8).value =
            registro.observacao ||
            "";

          aplicarData(
            row.getCell(5)
          );

          aplicarMoeda(
            row.getCell(7)
          );

          for (
            let coluna = 1;
            coluna <= 8;
            coluna++
          ) {
            aplicarBorda(
              row.getCell(coluna)
            );
          }

          totalValor +=
            valorReal(
              registro.valorTotal
            );

          linha++;
        }
      );

      const totalRow =
        sheet.getRow(linha);

      sheet.mergeCells(
        linha,
        1,
        linha,
        6
      );

      totalRow.getCell(1).value =
        "SUBTOTAL";

      totalRow.getCell(7).value =
        totalValor;

      aplicarMoeda(
        totalRow.getCell(7)
      );

      aplicarTotal(
        totalRow,
        8
      );

      linha += 2;
    }
  );

  return sheet;
}

/* =========================================================
   ABA GERAL
========================================================= */

function criarAbaGeral(
  workbook: ExcelJS.Workbook,
  abastecimentos: Abastecimento[],
  pneus: Manutencao[],
  lavagens: Manutencao[],
  manutencoes: Manutencao[],
  dataInicial: string,
  dataFinal: string
) {
  const sheet =
    workbook.addWorksheet(
      "GERAL"
    );

  sheet.views = [
    {
      showGridLines: false,
    },
  ];

  sheet.columns = [
    { width: 30 },
    { width: 18 },
    { width: 18 },
    { width: 4 },
    { width: 18 },
    { width: 18 },
    { width: 20 },
  ];

  sheet.mergeCells(
    "A1:G1"
  );

  sheet.getCell(
    "A1"
  ).value =
    "RELATÓRIO GERAL DA FROTA";

  aplicarTitulo(
    sheet.getRow(1),
    7
  );

  sheet.mergeCells(
    "A2:G2"
  );

  sheet.getCell(
    "A2"
  ).value =
    `Período: ${formatarData(dataInicial)} a ${formatarData(dataFinal)}`;

  sheet.getCell(
    "A2"
  ).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  sheet.getCell(
    "A2"
  ).font = {
    bold: true,
    size: 11,
    color: {
      argb: `FF${CORES.texto}`,
    },
  };

  /*
   * TOTAIS
   */

  const totalCombustivel =
    abastecimentos.reduce(
      (soma, item) =>
        soma +
        valorReal(
          item.valorTotal
        ),
      0
    );

  const totalLavagem =
    lavagens.reduce(
      (soma, item) =>
        soma +
        valorReal(
          item.valorTotal
        ),
      0
    );

  const totalPneus =
    pneus.reduce(
      (soma, item) =>
        soma +
        valorReal(
          item.valorTotal
        ),
      0
    );

  const totalManutencao =
    manutencoes.reduce(
      (soma, item) =>
        soma +
        valorReal(
          item.valorTotal
        ),
      0
    );

  const totalGeral =
    totalCombustivel +
    totalLavagem +
    totalPneus +
    totalManutencao;

  /*
   * CARDS
   */

  const cards = [
    {
      coluna: 1,
      titulo: "COMBUSTÍVEL",
      valor: totalCombustivel,
      cor: CORES.azul,
    },
    {
      coluna: 2,
      titulo: "LAVAGEM",
      valor: totalLavagem,
      cor: CORES.verde,
    },
    {
      coluna: 3,
      titulo: "PNEUS",
      valor: totalPneus,
      cor: CORES.amarelo,
    },
    {
      coluna: 5,
      titulo: "MANUTENÇÃO",
      valor: totalManutencao,
      cor: CORES.vermelho,
    },
  ];

  cards.forEach(
    (card) => {
      const titulo =
        sheet.getCell(
          4,
          card.coluna
        );

      const valor =
        sheet.getCell(
          5,
          card.coluna
        );

      titulo.value =
        card.titulo;

      valor.value =
        card.valor;

      titulo.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: `FF${card.cor}`,
        },
      };

      valor.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: `FF${card.cor}`,
        },
      };

      titulo.font = {
        bold: true,
        color: {
          argb: `FF${CORES.texto}`,
        },
      };

      valor.font = {
        bold: true,
        size: 14,
        color: {
          argb: `FF${CORES.texto}`,
        },
      };

      valor.alignment = {
        horizontal: "right",
      };

      aplicarMoeda(valor);

      aplicarBorda(titulo);
      aplicarBorda(valor);
    }
  );

  sheet.getCell(
    4,
    6
  ).value =
    "TOTAL GERAL";

  sheet.getCell(
    5,
    6
  ).value =
    totalGeral;

  for (
    const cell of [
      sheet.getCell(4, 6),
      sheet.getCell(5, 6),
    ]
  ) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: `FF${CORES.titulo}`,
      },
    };

    cell.font = {
      bold: true,
      color: {
        argb: `FF${CORES.branco}`,
      },
    };

    aplicarBorda(cell);
  }

  sheet.getCell(
    5,
    6
  ).font = {
    bold: true,
    size: 14,
    color: {
      argb: `FF${CORES.branco}`,
    },
  };

  aplicarMoeda(
    sheet.getCell(5, 6)
  );

  /*
   * RESUMO POR FILIAL
   */

  sheet.mergeCells(
    "A8:G8"
  );

  sheet.getCell(
    "A8"
  ).value =
    "RESUMO POR FILIAL";

  aplicarFilial(
    sheet.getRow(8),
    7
  );

  sheet.getRow(9).values = [
    "FILIAL",
    "COMBUSTÍVEL",
    "LAVAGEM",
    "",
    "PNEUS",
    "MANUTENÇÃO",
    "TOTAL",
  ];

  aplicarCabecalho(
    sheet.getRow(9),
    7
  );

  const gruposCombustivel =
    agruparPorFilial(
      abastecimentos
    );

  const gruposLavagem =
    agruparPorFilial(
      lavagens
    );

  const gruposPneus =
    agruparPorFilial(
      pneus
    );

  const gruposManutencao =
    agruparPorFilial(
      manutencoes
    );

  let linha = 10;

  FILIAIS.forEach(
    (filial) => {
      const combustivel =
        gruposCombustivel.get(
          filial.codigo
        ) || [];

      const lavagem =
        gruposLavagem.get(
          filial.codigo
        ) || [];

      const pneu =
        gruposPneus.get(
          filial.codigo
        ) || [];

      const manutencao =
        gruposManutencao.get(
          filial.codigo
        ) || [];

      const valorCombustivel =
        combustivel.reduce(
          (soma, item) =>
            soma +
            valorReal(
              item.valorTotal
            ),
          0
        );

      const valorLavagem =
        lavagem.reduce(
          (soma, item) =>
            soma +
            valorReal(
              item.valorTotal
            ),
          0
        );

      const valorPneu =
        pneu.reduce(
          (soma, item) =>
            soma +
            valorReal(
              item.valorTotal
            ),
          0
        );

      const valorManutencao =
        manutencao.reduce(
          (soma, item) =>
            soma +
            valorReal(
              item.valorTotal
            ),
          0
        );

      const total =
        valorCombustivel +
        valorLavagem +
        valorPneu +
        valorManutencao;

      const row =
        sheet.getRow(linha);

      row.getCell(1).value =
        filial.nome;

      row.getCell(2).value =
        valorCombustivel;

      row.getCell(3).value =
        valorLavagem;

      row.getCell(5).value =
        valorPneu;

      row.getCell(6).value =
        valorManutencao;

      row.getCell(7).value =
        total;

      for (
        const coluna of [
          2,
          3,
          5,
          6,
          7,
        ]
      ) {
        aplicarMoeda(
          row.getCell(coluna)
        );
      }

      for (
        let coluna = 1;
        coluna <= 7;
        coluna++
      ) {
        aplicarBorda(
          row.getCell(coluna)
        );
      }

      linha++;
    }
  );

  const totalRow =
    sheet.getRow(linha);

  totalRow.getCell(1).value =
    "TOTAL GERAL";

  totalRow.getCell(2).value =
    totalCombustivel;

  totalRow.getCell(3).value =
    totalLavagem;

  totalRow.getCell(5).value =
    totalPneus;

  totalRow.getCell(6).value =
    totalManutencao;

  totalRow.getCell(7).value =
    totalGeral;

  for (
    const coluna of [
      2,
      3,
      5,
      6,
      7,
    ]
  ) {
    aplicarMoeda(
      totalRow.getCell(
        coluna
      )
    );
  }

  aplicarTotal(
    totalRow,
    7
  );

  /*
   * QUANTIDADES
   */

  const linhaQuantidade =
    linha + 3;

  sheet.mergeCells(
    linhaQuantidade,
    1,
    linhaQuantidade,
    7
  );

  sheet.getCell(
    linhaQuantidade,
    1
  ).value =
    "QUANTIDADE DE LANÇAMENTOS";

  aplicarFilial(
    sheet.getRow(
      linhaQuantidade
    ),
    7
  );

  const labelsRow =
    sheet.getRow(
      linhaQuantidade + 1
    );

  labelsRow.values = [
    "ABASTECIMENTOS",
    "",
    "LAVAGENS",
    "",
    "PNEUS",
    "",
    "MANUTENÇÕES",
  ];

  aplicarCabecalho(
    labelsRow,
    7
  );

  const valuesRow =
    sheet.getRow(
      linhaQuantidade + 2
    );

  valuesRow.values = [
    abastecimentos.length,
    "",
    lavagens.length,
    "",
    pneus.length,
    "",
    manutencoes.length,
  ];

  for (
    let coluna = 1;
    coluna <= 7;
    coluna++
  ) {
    aplicarBorda(
      valuesRow.getCell(
        coluna
      )
    );
  }

  return sheet;
}

/* =========================================================
   MÉDIA KM/L
========================================================= */

function criarAbaMediaKmL(
  workbook: ExcelJS.Workbook,
  abastecimentos: Abastecimento[],
  dataInicial: string,
  dataFinal: string
) {
  const sheet =
    workbook.addWorksheet(
      "MÉDIA KM-L"
    );

  prepararAba(
    sheet,
    `MÉDIA KM/L - ${formatarData(dataInicial)} A ${formatarData(dataFinal)}`,
    [
      "PLACA",
      "VEÍCULO",
      "MOTORISTA",
      "DATA",
      "KM ANTERIOR",
      "KM ATUAL",
      "KM RODADO",
      "LITROS",
      "MÉDIA KM/L",
    ],
    [
      14,
      24,
      28,
      14,
      16,
      16,
      16,
      14,
      18,
    ]
  );

  /*
   * IMPORTANTE:
   * Usamos TODOS os abastecimentos para encontrar o abastecimento
   * anterior de cada veículo, inclusive quando o anterior está
   * fora do período selecionado.
   *
   * Depois de calcular o consumo, mostramos somente os abastecimentos
   * cuja data está dentro do período do relatório.
   *
   * Fórmula:
   * KM rodado = KM atual - KM anterior
   * KM/L = KM rodado / litros do abastecimento atual
   */

  const porVeiculo =
    new Map<number, Abastecimento[]>();

  abastecimentos.forEach(
    (registro) => {
      const id =
        registro.veiculo?.id;

      if (!id) {
        return;
      }

      const lista =
        porVeiculo.get(id) || [];

      lista.push(registro);

      porVeiculo.set(
        id,
        lista
      );
    }
  );

  const calculados: Array<{
    registro: Abastecimento;
    anterior: Abastecimento | null;
    kmAnterior: number | null;
    kmAtual: number;
    kmRodado: number | null;
    litros: number;
    mediaKmL: number | null;
  }> = [];

  porVeiculo.forEach(
    (lista) => {
      /*
       * Ordenação correta:
       * primeiro pela DATA e, em caso de empate, pelo ID.
       *
       * Não devemos ordenar pelo KM, porque o histórico precisa
       * respeitar a sequência real dos abastecimentos.
       */
      const ordenados =
        [...lista].sort(
          (a, b) => {
            const dataA =
              dataReal(a.data)?.getTime() || 0;

            const dataB =
              dataReal(b.data)?.getTime() || 0;

            if (dataA !== dataB) {
              return dataA - dataB;
            }

            return a.id - b.id;
          }
        );

      for (
        let i = 0;
        i < ordenados.length;
        i++
      ) {
        const atual =
          ordenados[i];

        const anterior =
          i > 0
            ? ordenados[i - 1]
            : null;

        const kmAtual =
          Number(
            atual.novoKm || 0
          );

        const litros =
          litrosReal(
            atual.quantLitro
          );

        let kmAnterior:
          number | null = null;

        let kmRodado:
          number | null = null;

        let mediaKmL:
          number | null = null;

        if (anterior) {
          const kmAnteriorReal =
            Number(
              anterior.novoKm || 0
            );

          /*
           * Só calculamos quando:
           * - existe abastecimento anterior;
           * - os dois KM são válidos;
           * - o KM atual é maior;
           * - existem litros abastecidos.
           */
          if (
            kmAnteriorReal > 0 &&
            kmAtual > 0 &&
            kmAtual > kmAnteriorReal &&
            litros > 0
          ) {
            kmAnterior =
              kmAnteriorReal;

            kmRodado =
              kmAtual -
              kmAnteriorReal;

            mediaKmL =
              kmRodado /
              litros;
          }
        }

        /*
         * Só entra na aba o abastecimento cuja data
         * pertence ao período selecionado.
         */
        if (
          atual.data >= dataInicial &&
          atual.data <= dataFinal
        ) {
          calculados.push({
            registro: atual,
            anterior,
            kmAnterior,
            kmAtual,
            kmRodado,
            litros,
            mediaKmL,
          });
        }
      }
    }
  );

  /*
   * Ordena a apresentação por filial, placa e data.
   */
  calculados.sort(
    (a, b) => {
      const filialA =
        a.registro.veiculo?.filial || "";

      const filialB =
        b.registro.veiculo?.filial || "";

      if (filialA !== filialB) {
        return filialA.localeCompare(
          filialB
        );
      }

      const placaA =
        a.registro.veiculo?.placa || "";

      const placaB =
        b.registro.veiculo?.placa || "";

      if (placaA !== placaB) {
        return placaA.localeCompare(
          placaB
        );
      }

      const dataA =
        dataReal(
          a.registro.data
        )?.getTime() || 0;

      const dataB =
        dataReal(
          b.registro.data
        )?.getTime() || 0;

      if (dataA !== dataB) {
        return dataA - dataB;
      }

      return (
        a.registro.id -
        b.registro.id
      );
    }
  );

  let linha = 4;

  /*
   * Totais gerais da aba.
   */
  let totalKmRodado = 0;
  let totalLitros = 0;

  /*
   * Controle dos veículos que tiveram pelo menos um
   * abastecimento calculável.
   */
  const veiculosComCalculo =
    new Set<number>();

  /*
   * Mostra cada abastecimento do período e seu consumo.
   */
  calculados.forEach(
    (item) => {
      const row =
        sheet.getRow(linha);

      const registro =
        item.registro;

      row.getCell(1).value =
        registro.veiculo?.placa ||
        "";

      row.getCell(2).value =
        registro.veiculo
          ?.modelosVeiculos ||
        "";

      row.getCell(3).value =
        registro.motorista?.nome ||
        "";

      row.getCell(4).value =
        dataReal(
          registro.data
        );

      row.getCell(5).value =
        item.kmAnterior;

      row.getCell(6).value =
        item.kmAtual || 0;

      row.getCell(7).value =
        item.kmRodado;

      row.getCell(8).value =
        item.litros;

      row.getCell(9).value =
        item.mediaKmL;

      aplicarData(
        row.getCell(4)
      );

      row.getCell(9).numFmt =
        "0.00";

      for (
        let coluna = 1;
        coluna <= 9;
        coluna++
      ) {
        aplicarBorda(
          row.getCell(coluna)
        );
      }

      if (
        item.kmRodado !== null &&
        item.mediaKmL !== null &&
        item.litros > 0
      ) {
        totalKmRodado +=
          item.kmRodado;

        totalLitros +=
          item.litros;

        veiculosComCalculo.add(
          registro.veiculo.id
        );
      }

      linha++;
    }
  );

  /*
   * Caso não exista nenhum abastecimento no período.
   */
  if (calculados.length === 0) {
    sheet.mergeCells(
      4,
      1,
      4,
      9
    );

    const cell =
      sheet.getCell(4, 1);

    cell.value =
      "Nenhum abastecimento encontrado no período.";

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.font = {
      italic: true,
      color: {
        argb: "FF6B7280",
      },
    };
  } else {
    /*
     * Linha de total da frota.
     *
     * A média geral é:
     * total de KM rodados / total de litros
     *
     * e não a média simples das médias individuais.
     */
    const totalRow =
      sheet.getRow(linha);

    sheet.mergeCells(
      linha,
      1,
      linha,
      6
    );

    totalRow.getCell(1).value =
      "MÉDIA DA FROTA";

    totalRow.getCell(7).value =
      totalKmRodado;

    totalRow.getCell(8).value =
      totalLitros;

    totalRow.getCell(9).value =
      totalLitros > 0
        ? totalKmRodado /
          totalLitros
        : null;

    totalRow.getCell(9).numFmt =
      "0.00";

    aplicarTotal(
      totalRow,
      9
    );

    linha += 2;

    /*
     * Resumo consolidado por veículo.
     */
    sheet.mergeCells(
      linha,
      1,
      linha,
      9
    );

    sheet.getCell(
      linha,
      1
    ).value =
      "RESUMO POR VEÍCULO";

    aplicarFilial(
      sheet.getRow(linha),
      9
    );

    linha++;

    const cabecalhoResumo =
      sheet.getRow(linha);

    cabecalhoResumo.values = [
      "PLACA",
      "VEÍCULO",
      "MOTORISTA",
      "ABASTECIMENTOS",
      "KM RODADO",
      "LITROS",
      "",
      "",
      "MÉDIA KM/L",
    ];

    aplicarCabecalho(
      cabecalhoResumo,
      9
    );

    linha++;

    const resumoPorVeiculo =
      new Map<
        number,
        {
          placa: string;
          veiculo: string;
          motorista: string;
          abastecimentos: number;
          km: number;
          litros: number;
        }
      >();

    calculados.forEach(
      (item) => {
        if (
          item.kmRodado === null ||
          item.mediaKmL === null ||
          item.litros <= 0
        ) {
          return;
        }

        const id =
          item.registro.veiculo.id;

        const atual =
          resumoPorVeiculo.get(id);

        if (atual) {
          atual.abastecimentos += 1;
          atual.km +=
            item.kmRodado;
          atual.litros +=
            item.litros;
        } else {
          resumoPorVeiculo.set(
            id,
            {
              placa:
                item.registro
                  .veiculo?.placa ||
                "",
              veiculo:
                item.registro
                  .veiculo
                  ?.modelosVeiculos ||
                "",
              motorista:
                item.registro
                  .motorista?.nome ||
                "",
              abastecimentos: 1,
              km: item.kmRodado,
              litros:
                item.litros,
            }
          );
        }
      }
    );

    const resumoOrdenado =
      [...resumoPorVeiculo.values()]
        .sort((a, b) =>
          a.placa.localeCompare(
            b.placa
          )
        );

    resumoOrdenado.forEach(
      (resumo) => {
        const row =
          sheet.getRow(linha);

        const media =
          resumo.litros > 0
            ? resumo.km /
              resumo.litros
            : null;

        row.getCell(1).value =
          resumo.placa;

        row.getCell(2).value =
          resumo.veiculo;

        row.getCell(3).value =
          resumo.motorista;

        row.getCell(4).value =
          resumo.abastecimentos;

        row.getCell(5).value =
          resumo.km;

        row.getCell(6).value =
          resumo.litros;

        row.getCell(9).value =
          media;

        row.getCell(9).numFmt =
          "0.00";

        for (
          let coluna = 1;
          coluna <= 9;
          coluna++
        ) {
          aplicarBorda(
            row.getCell(coluna)
          );
        }

        linha++;
      }
    );

    /*
     * Caso nenhum abastecimento tenha um abastecimento anterior
     * válido para cálculo.
     */
    if (
      resumoOrdenado.length === 0
    ) {
      sheet.mergeCells(
        linha,
        1,
        linha,
        9
      );

      const cell =
        sheet.getCell(
          linha,
          1
        );

      cell.value =
        "Não há abastecimentos consecutivos suficientes para calcular o consumo no período.";

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.font = {
        italic: true,
        color: {
          argb: "FF6B7280",
        },
      };
    }
  }

  return sheet;
}

/* =========================================================
   GERADOR PRINCIPAL
========================================================= */

export async function gerarRelatorioExcel(
  dataInicial: string,
  dataFinal: string,
  abastecimentos: Abastecimento[],
  manutencoes: Manutencao[]
) {
  if (
    !dataInicial ||
    !dataFinal
  ) {
    throw new Error(
      "Selecione a data inicial e a data final."
    );
  }

  if (
    dataInicial > dataFinal
  ) {
    throw new Error(
      "A data inicial não pode ser maior que a data final."
    );
  }

  /*
   * FILTRO DO PERÍODO
   */

  const abastecimentosPeriodo =
    abastecimentos.filter(
      (registro) =>
        registro.data >=
          dataInicial &&
        registro.data <=
          dataFinal
    );

  const manutencoesPeriodo =
    manutencoes.filter(
      (registro) =>
        registro.data >=
          dataInicial &&
        registro.data <=
          dataFinal
    );

  const pneus =
    manutencoesPeriodo.filter(
      (registro) =>
        registro.despesa ===
          "MANUTENCAO" &&
        registro.manutencaoTipos ===
          "PNEU"
    );

  const lavagens =
    manutencoesPeriodo.filter(
      (registro) =>
        registro.despesa ===
        "LAVAGEM"
    );

  const manutencoesNormais =
    manutencoesPeriodo.filter(
      (registro) =>
        registro.despesa ===
          "MANUTENCAO" &&
        registro.manutencaoTipos !==
          "PNEU"
    );

  /*
   * CRIA O EXCEL DO ZERO
   *
   * Não usa:
   * workbook.xlsx.load()
   *
   * Portanto não depende de template.
   */

  const workbook =
    new ExcelJS.Workbook();

  workbook.creator =
    "Sistema de Controle da Frota";

  workbook.created =
    new Date();

  /*
   * ORDEM EXATA DAS ABAS
   *
   * A ordem será a ordem em que
   * addWorksheet() for chamado.
   */

  criarAbaGeral(
    workbook,
    abastecimentosPeriodo,
    pneus,
    lavagens,
    manutencoesNormais,
    dataInicial,
    dataFinal
  );

  criarAbaCombustivel(
    workbook,
    abastecimentosPeriodo,
    dataInicial,
    dataFinal
  );

  criarAbaLavagem(
    workbook,
    lavagens,
    dataInicial,
    dataFinal
  );

  criarAbaManutencao(
    workbook,
    manutencoesNormais,
    dataInicial,
    dataFinal
  );

  criarAbaPneus(
    workbook,
    pneus,
    dataInicial,
    dataFinal
  );

  criarAbaMediaKmL(
    workbook,
    abastecimentos,
    dataInicial,
    dataFinal
  );

  /*
   * GERA O ARQUIVO
   */

  const buffer =
    await workbook.xlsx.writeBuffer();

  const blob =
    new Blob(
      [buffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  const url =
    window.URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    `Relatorio_Frota_${dataInicial}_a_${dataFinal}.xlsx`;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  window.URL.revokeObjectURL(
    url
  );
}