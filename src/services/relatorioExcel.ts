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
  manutencaoTipos: "PNEU" | "OLEO" | "MOTOR" | "OUTROS" | null;
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

function valorReal(valor: number | null | undefined) {
  return Number(valor || 0) / 100;
}

function litrosReal(valor: number | null | undefined) {
  return Number(valor || 0) / 100;
}

function dataReal(data: string) {
  if (!data) {
    return null;
  }

  const [ano, mes, dia] = data.split("-").map(Number);

  if (!ano || !mes || !dia) {
    return null;
  }

  return new Date(ano, mes - 1, dia);
}

function formatarData(data: string) {
  if (!data) {
    return "";
  }

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function nomeDaManutencao(registro: Manutencao) {
  if (registro.nomeDaManutencao?.trim()) {
    return registro.nomeDaManutencao;
  }

  switch (registro.manutencaoTipos) {
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

function aplicarBorda(cell: ExcelJS.Cell) {
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

function aplicarMoeda(cell: ExcelJS.Cell) {
  cell.numFmt = '"R$" #,##0.00';
}

function aplicarData(cell: ExcelJS.Cell) {
  cell.numFmt = "dd/mm/yyyy";
}

function aplicarTitulo(row: ExcelJS.Row, quantidadeColunas: number) {
  row.height = 30;

  for (let coluna = 1; coluna <= quantidadeColunas; coluna++) {
    const cell = row.getCell(coluna);

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

function aplicarCabecalho(row: ExcelJS.Row, quantidadeColunas: number) {
  row.height = 23;

  for (let coluna = 1; coluna <= quantidadeColunas; coluna++) {
    const cell = row.getCell(coluna);

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

function aplicarFilial(row: ExcelJS.Row, quantidadeColunas: number) {
  row.height = 24;

  for (let coluna = 1; coluna <= quantidadeColunas; coluna++) {
    const cell = row.getCell(coluna);

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
      horizontal: coluna === 1 ? "left" : "center",
      vertical: "middle",
    };

    aplicarBorda(cell);
  }
}

function aplicarTotal(row: ExcelJS.Row, quantidadeColunas: number) {
  row.height = 24;

  for (let coluna = 1; coluna <= quantidadeColunas; coluna++) {
    const cell = row.getCell(coluna);

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
      horizontal: coluna === 1 ? "left" : "right",
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
  },
>(registros: T[]) {
  const mapa = new Map<string, T[]>();

  FILIAIS.forEach((filial) => {
    mapa.set(filial.codigo, []);
  });

  registros.forEach((registro) => {
    const filial = registro.veiculo?.filial;

    if (!filial) {
      return;
    }

    const lista = mapa.get(filial);

    if (lista) {
      lista.push(registro);
    }
  });

  return mapa;
}

/* =========================================================
   CONFIGURAÇÃO DAS ABAS
========================================================= */

function prepararAba(
  sheet: ExcelJS.Worksheet,
  titulo: string,
  colunas: string[],
  larguras: number[],
) {
  sheet.views = [
    {
      state: "frozen",
      ySplit: 3,
    },
  ];

  sheet.columns = larguras.map((width) => ({
    width,
  }));

  sheet.mergeCells(1, 1, 1, colunas.length);

  const tituloCell = sheet.getCell(1, 1);

  tituloCell.value = titulo;

  aplicarTitulo(sheet.getRow(1), colunas.length);

  sheet.getRow(3).values = colunas;

  aplicarCabecalho(sheet.getRow(3), colunas.length);
}

function criarCabecalhoFilial(
  sheet: ExcelJS.Worksheet,
  linha: number,
  nome: string,
  quantidadeColunas: number,
) {
  sheet.mergeCells(linha, 1, linha, quantidadeColunas);

  const cell = sheet.getCell(linha, 1);

  cell.value = nome;

  aplicarFilial(sheet.getRow(linha), quantidadeColunas);
}

function limparLinha(
  sheet: ExcelJS.Worksheet,
  linha: number,
  quantidadeColunas: number,
) {
  for (let coluna = 1; coluna <= quantidadeColunas; coluna++) {
    sheet.getCell(linha, coluna).value = null;
  }
}

/* =========================================================
   ABA COMBUSTÍVEL
========================================================= */

function criarAbaCombustivel(
  workbook: ExcelJS.Workbook,
  registros: Abastecimento[],
  dataInicial: string,
  dataFinal: string,
) {
  const sheet = workbook.addWorksheet("DESP. COMBUSTÍVEL");

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
    [14, 24, 28, 14, 16, 17, 40],
  );

  let linha = 4;

  const grupos = agruparPorFilial(registros);

  FILIAIS.forEach((filial) => {
    const dados = grupos.get(filial.codigo) || [];

    criarCabecalhoFilial(sheet, linha, filial.nome, 7);

    linha++;

    if (dados.length === 0) {
      sheet.mergeCells(linha, 1, linha, 7);

      const cell = sheet.getCell(linha, 1);

      cell.value = "Nenhum lançamento no período.";

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

    dados.forEach((registro) => {
      const row = sheet.getRow(linha);

      row.getCell(1).value = registro.veiculo?.placa || "";

      row.getCell(2).value = registro.veiculo?.modelosVeiculos || "";

      row.getCell(3).value = registro.motorista?.nome || "";

      row.getCell(4).value = litrosReal(registro.quantLitro);

      row.getCell(5).value = dataReal(registro.data);

      row.getCell(6).value = valorReal(registro.valorTotal);

      row.getCell(7).value = registro.observacao || "";

      aplicarData(row.getCell(5));

      aplicarMoeda(row.getCell(6));

      for (let coluna = 1; coluna <= 7; coluna++) {
        aplicarBorda(row.getCell(coluna));
      }

      totalLitros += litrosReal(registro.quantLitro);

      totalValor += valorReal(registro.valorTotal);

      linha++;
    });

    const totalRow = sheet.getRow(linha);

    sheet.mergeCells(linha, 1, linha, 3);

    totalRow.getCell(1).value = "SUBTOTAL";

    totalRow.getCell(4).value = totalLitros;

    totalRow.getCell(6).value = totalValor;

    aplicarMoeda(totalRow.getCell(6));

    aplicarTotal(totalRow, 7);

    linha += 2;
  });

  return sheet;
}

/* =========================================================
   ABA LAVAGEM
========================================================= */

function criarAbaLavagem(
  workbook: ExcelJS.Workbook,
  registros: Manutencao[],
  dataInicial: string,
  dataFinal: string,
) {
  const sheet = workbook.addWorksheet("DESP. LAVAGEM");

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
    [14, 24, 28, 14, 16, 17, 40],
  );

  let linha = 4;

  const grupos = agruparPorFilial(registros);

  FILIAIS.forEach((filial) => {
    const dados = grupos.get(filial.codigo) || [];

    criarCabecalhoFilial(sheet, linha, filial.nome, 7);

    linha++;

    if (dados.length === 0) {
      sheet.mergeCells(linha, 1, linha, 7);

      sheet.getCell(linha, 1).value = "Nenhum lançamento no período.";

      sheet.getCell(linha, 1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      linha += 2;

      return;
    }

    let totalValor = 0;

    dados.forEach((registro) => {
      const row = sheet.getRow(linha);

      row.getCell(1).value = registro.veiculo?.placa || "";

      row.getCell(2).value = registro.veiculo?.modelosVeiculos || "";

      row.getCell(3).value = registro.motorista?.nome || "";

      row.getCell(4).value = 1;

      row.getCell(5).value = dataReal(registro.data);

      row.getCell(6).value = valorReal(registro.valorTotal);

      row.getCell(7).value = registro.observacao || "";

      aplicarData(row.getCell(5));

      aplicarMoeda(row.getCell(6));

      for (let coluna = 1; coluna <= 7; coluna++) {
        aplicarBorda(row.getCell(coluna));
      }

      totalValor += valorReal(registro.valorTotal);

      linha++;
    });

    const totalRow = sheet.getRow(linha);

    sheet.mergeCells(linha, 1, linha, 3);

    totalRow.getCell(1).value = "SUBTOTAL";

    totalRow.getCell(4).value = dados.length;

    totalRow.getCell(6).value = totalValor;

    aplicarMoeda(totalRow.getCell(6));

    aplicarTotal(totalRow, 7);

    linha += 2;
  });

  return sheet;
}

/* =========================================================
   ABA PNEUS
========================================================= */

function criarAbaPneus(
  workbook: ExcelJS.Workbook,
  registros: Manutencao[],
  dataInicial: string,
  dataFinal: string,
) {
  const sheet = workbook.addWorksheet("DESP. PNEUS");

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
    [14, 24, 28, 14, 16, 17, 40],
  );

  let linha = 4;

  const grupos = agruparPorFilial(registros);

  FILIAIS.forEach((filial) => {
    const dados = grupos.get(filial.codigo) || [];

    criarCabecalhoFilial(sheet, linha, filial.nome, 7);

    linha++;

    if (dados.length === 0) {
      sheet.mergeCells(linha, 1, linha, 7);

      sheet.getCell(linha, 1).value = "Nenhum lançamento no período.";

      sheet.getCell(linha, 1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      linha += 2;

      return;
    }

    let totalValor = 0;

    dados.forEach((registro) => {
      const row = sheet.getRow(linha);

      row.getCell(1).value = registro.veiculo?.placa || "";

      row.getCell(2).value = registro.veiculo?.modelosVeiculos || "";

      row.getCell(3).value = registro.motorista?.nome || "";

      row.getCell(4).value = 1;

      row.getCell(5).value = dataReal(registro.data);

      row.getCell(6).value = valorReal(registro.valorTotal);

      row.getCell(7).value = registro.observacao || "";

      aplicarData(row.getCell(5));

      aplicarMoeda(row.getCell(6));

      for (let coluna = 1; coluna <= 7; coluna++) {
        aplicarBorda(row.getCell(coluna));
      }

      totalValor += valorReal(registro.valorTotal);

      linha++;
    });

    const totalRow = sheet.getRow(linha);

    sheet.mergeCells(linha, 1, linha, 3);

    totalRow.getCell(1).value = "SUBTOTAL";

    totalRow.getCell(4).value = dados.length;

    totalRow.getCell(6).value = totalValor;

    aplicarMoeda(totalRow.getCell(6));

    aplicarTotal(totalRow, 7);

    linha += 2;
  });

  return sheet;
}

/* =========================================================
   ABA MANUTENÇÃO
========================================================= */

function criarAbaManutencao(
  workbook: ExcelJS.Workbook,
  registros: Manutencao[],
  dataInicial: string,
  dataFinal: string,
) {
  const sheet = workbook.addWorksheet("DESP. MANUTENÇÃO");

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
    [14, 24, 28, 15, 16, 32, 17, 40],
  );

  let linha = 4;

  const grupos = agruparPorFilial(registros);

  FILIAIS.forEach((filial) => {
    const dados = grupos.get(filial.codigo) || [];

    criarCabecalhoFilial(sheet, linha, filial.nome, 8);

    linha++;

    if (dados.length === 0) {
      sheet.mergeCells(linha, 1, linha, 8);

      sheet.getCell(linha, 1).value = "Nenhum lançamento no período.";

      sheet.getCell(linha, 1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      linha += 2;

      return;
    }

    let totalValor = 0;

    dados.forEach((registro) => {
      const row = sheet.getRow(linha);

      row.getCell(1).value = registro.veiculo?.placa || "";

      row.getCell(2).value = registro.veiculo?.modelosVeiculos || "";

      row.getCell(3).value = registro.motorista?.nome || "";

      row.getCell(4).value = registro.novoKm || 0;

      row.getCell(5).value = dataReal(registro.data);

      row.getCell(6).value = nomeDaManutencao(registro);

      row.getCell(7).value = valorReal(registro.valorTotal);

      row.getCell(8).value = registro.observacao || "";

      aplicarData(row.getCell(5));

      aplicarMoeda(row.getCell(7));

      for (let coluna = 1; coluna <= 8; coluna++) {
        aplicarBorda(row.getCell(coluna));
      }

      totalValor += valorReal(registro.valorTotal);

      linha++;
    });

    const totalRow = sheet.getRow(linha);

    sheet.mergeCells(linha, 1, linha, 6);

    totalRow.getCell(1).value = "SUBTOTAL";

    totalRow.getCell(7).value = totalValor;

    aplicarMoeda(totalRow.getCell(7));

    aplicarTotal(totalRow, 8);

    linha += 2;
  });

  return sheet;
}

/* =========================================================
   ABA GERAL
========================================================= */

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
  dataFinal: string,
) {
  const sheet = workbook.addWorksheet("GERAL");

  /*
   * Configuração visual
   */
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
    { width: 30 },
    { width: 18 },
    { width: 18 },
  ];

  /*
   * ========================================================
   * NOMES DAS FILIAIS
   * ========================================================
   *
   * Aqui usamos os nomes exatamente como aparecem
   * no modelo da imagem.
   */
  const nomeFilial = new Map<string, string>([
    ["MATRIZ", "MATRIZ"],
    ["AQUIDAUANA_ANASTACIO", "AQUID./ANASTÁCIO"],
    ["DOIS_IRMAOS_BURITI", "DOIS IRMÃOS BURITI"],
    ["NIOAQUE", "NIOAQUE"],
    ["JARDIM_GUIA_LOPES", "JARDIM/GUIA LOPES"],
    ["BONITO", "BONITO"],
    ["BODOQUENA", "BODOQUENA"],
  ]);

  /*
   * ========================================================
   * AGRUPAMENTO POR FILIAL
   * ========================================================
   */

  const gruposCombustivel = agruparPorFilial(abastecimentos);

  const gruposPneus = agruparPorFilial(pneus);

  const gruposLavagem = agruparPorFilial(lavagens);

  const gruposManutencao = agruparPorFilial(manutencoes);

  /*
   * ========================================================
   * FUNÇÃO PARA PEGAR O NOME EXIBIDO
   * ========================================================
   */

  function nomeExibicaoFilial(codigo: string) {
    return nomeFilial.get(codigo) || codigo;
  }

  /*
   * ========================================================
   * FUNÇÃO PARA APLICAR ESTILO NAS LINHAS
   * ========================================================
   */

  function aplicarEstiloLinha(
    row: ExcelJS.Row,
    colunaInicial: number,
    colunaFinal: number,
  ) {
    for (let coluna = colunaInicial; coluna <= colunaFinal; coluna++) {
      const cell = row.getCell(coluna);

      aplicarBorda(cell);

      cell.alignment = {
        vertical: "middle",
        horizontal: coluna === colunaInicial ? "left" : "center",
      };

      if (coluna === colunaInicial) {
        cell.font = {
          italic: true,
        };
      }
    }
  }

  /*
   * ========================================================
   * TÍTULO
   * ========================================================
   */

  function criarTitulo(inicio: string, fim: string, texto: string) {
    sheet.mergeCells(`${inicio}:${fim}`);

    const cell = sheet.getCell(inicio);

    cell.value = texto;

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

    sheet.getRow(1).height = 25;
  }

  /*
   * ========================================================
   * CABEÇALHO
   * ========================================================
   */

  function criarCabecalho(linha: number, colunas: string[]) {
    const row = sheet.getRow(linha);

    colunas.forEach((valor, index) => {
      const cell = row.getCell(index + 1);

      cell.value = valor;

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
    });

    row.height = 22;
  }

  /*
   * ========================================================
   * TOTAL
   * ========================================================
   */

  function estilizarTotal(row: ExcelJS.Row, colunas: number[]) {
    colunas.forEach((coluna) => {
      const cell = row.getCell(coluna);

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
        horizontal: "center",
        vertical: "middle",
      };

      aplicarBorda(cell);
    });
  }

  /*
   * ========================================================
   * 1. CONTROLE DESPESA COMBUSTÍVEL
   * ========================================================
   */

  criarTitulo("A1", "C1", "CONTROLE DESPESA COMBUSTÍVEL");

  criarCabecalho(2, ["LOJAS", "LITROS", "TOTAL"]);

  let linhaCombustivel = 3;

  let totalLitrosCombustivel = 0;
  let totalValorCombustivel = 0;

  FILIAIS.forEach((filial) => {
    const dados = gruposCombustivel.get(filial.codigo) || [];

    const litros = dados.reduce(
      (soma, item) => soma + litrosReal(item.quantLitro),
      0,
    );

    const valor = dados.reduce(
      (soma, item) => soma + valorReal(item.valorTotal),
      0,
    );

    const row = sheet.getRow(linhaCombustivel);

    row.getCell(1).value = nomeExibicaoFilial(filial.codigo);

    row.getCell(2).value = litros > 0 ? litros : "-";

    row.getCell(3).value = valor > 0 ? valor : "-";

    if (valor > 0) {
      aplicarMoeda(row.getCell(3));
    }

    aplicarEstiloLinha(row, 1, 3);

    totalLitrosCombustivel += litros;

    totalValorCombustivel += valor;

    linhaCombustivel++;
  });

  /*
   * Total litros
   */
  const rowTotalLitros = sheet.getRow(linhaCombustivel);

  rowTotalLitros.getCell(1).value = "TOTAL LITROS";

  rowTotalLitros.getCell(2).value =
    totalLitrosCombustivel > 0 ? totalLitrosCombustivel : "-";

  rowTotalLitros.getCell(3).value = "";

  estilizarTotal(rowTotalLitros, [1, 2, 3]);

  /*
   * Total geral
   */
  const rowTotalCombustivel = sheet.getRow(linhaCombustivel + 1);

  rowTotalCombustivel.getCell(2).value = "TOTAL GERAL";

  rowTotalCombustivel.getCell(3).value =
    totalValorCombustivel > 0 ? totalValorCombustivel : "-";

  if (totalValorCombustivel > 0) {
    aplicarMoeda(rowTotalCombustivel.getCell(3));
  }

  estilizarTotal(rowTotalCombustivel, [2, 3]);

  /*
   * Vermelho no valor do total geral,
   * igual ao modelo.
   */
  rowTotalCombustivel.getCell(3).font = {
    bold: true,
    color: {
      argb: `FF${CORES.texto}`,
    },
  };

  /*
   * ========================================================
   * 2. CONTROLE DESPESA PNEUS
   * ========================================================
   */

  criarTitulo("E1", "G1", "CONTROLE DESPESA PNEUS - BORRACHARIA");

  criarCabecalho(2, ["LOJAS", "QUANTIDADE", "TOTAL"]);

  /*
   * O criarCabecalho acima escreve A/B/C.
   * Precisamos copiar para E/F/G.
   */
  ["LOJAS", "QUANTIDADE", "TOTAL"].forEach((valor, index) => {
    const cell = sheet.getRow(2).getCell(index + 5);

    cell.value = valor;

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFB7B7B7",
      },
    };

    cell.font = {
      bold: true,
      color: {
        argb: "FF000000",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    aplicarBorda(cell);
  });

  let linhaPneus = 3;

  let quantidadePneus = 0;
  let totalValorPneus = 0;

  FILIAIS.forEach((filial) => {
    const dados = gruposPneus.get(filial.codigo) || [];

    /*
     * Cada lançamento de PNEU
     * representa uma despesa.
     */
    const quantidade = dados.length;

    const valor = dados.reduce(
      (soma, item) => soma + valorReal(item.valorTotal),
      0,
    );

    const row = sheet.getRow(linhaPneus);

    row.getCell(5).value = nomeExibicaoFilial(filial.codigo);

    row.getCell(6).value = quantidade > 0 ? quantidade : "-";

    row.getCell(7).value = valor > 0 ? valor : "-";

    if (valor > 0) {
      aplicarMoeda(row.getCell(7));
    }

    aplicarEstiloLinha(row, 5, 7);

    quantidadePneus += quantidade;

    totalValorPneus += valor;

    linhaPneus++;
  });

  /*
   * Quantidade total de pneus
   */
  const rowQuantidadePneus = sheet.getRow(linhaPneus);

  rowQuantidadePneus.getCell(5).value = "QUANTIDADE DESPESA PNEU";

  rowQuantidadePneus.getCell(6).value =
    quantidadePneus > 0 ? quantidadePneus : "-";

  rowQuantidadePneus.getCell(7).value = "";

  estilizarTotal(rowQuantidadePneus, [5, 6, 7]);

  /*
   * Total geral pneus
   */
  const rowTotalPneus = sheet.getRow(linhaPneus + 1);

  rowTotalPneus.getCell(6).value = "TOTAL GERAL";

  rowTotalPneus.getCell(7).value = totalValorPneus > 0 ? totalValorPneus : "-";

  if (totalValorPneus > 0) {
    aplicarMoeda(rowTotalPneus.getCell(7));
  }

  estilizarTotal(rowTotalPneus, [6, 7]);

  rowTotalPneus.getCell(7).font = {
    bold: true,
    color: {
      argb: `FF${CORES.texto}`,
    },
  };

  /*
   * ========================================================
   * 3. CONTROLE DESPESA LAVAGEM
   * ========================================================
   */

  criarTitulo("A13", "C13", "CONTROLE DESPESA LAVAGEM");

  criarCabecalho(14, ["LOJAS", "QUANTIDADE", "TOTAL"]);

  let linhaLavagem = 15;

  let quantidadeLavagem = 0;
  let totalValorLavagem = 0;

  FILIAIS.forEach((filial) => {
    const dados = gruposLavagem.get(filial.codigo) || [];

    const quantidade = dados.length;

    const valor = dados.reduce(
      (soma, item) => soma + valorReal(item.valorTotal),
      0,
    );

    const row = sheet.getRow(linhaLavagem);

    row.getCell(1).value = nomeExibicaoFilial(filial.codigo);

    row.getCell(2).value = quantidade > 0 ? quantidade : "-";

    row.getCell(3).value = valor > 0 ? valor : "-";

    if (valor > 0) {
      aplicarMoeda(row.getCell(3));
    }

    aplicarEstiloLinha(row, 1, 3);

    quantidadeLavagem += quantidade;

    totalValorLavagem += valor;

    linhaLavagem++;
  });

  /*
   * Quantidade lavagem
   */
  const rowQuantidadeLavagem = sheet.getRow(linhaLavagem);

  rowQuantidadeLavagem.getCell(1).value = "QUANTIDADE LAVAGEM";

  rowQuantidadeLavagem.getCell(2).value =
    quantidadeLavagem > 0 ? quantidadeLavagem : "-";

  rowQuantidadeLavagem.getCell(3).value = "";

  estilizarTotal(rowQuantidadeLavagem, [1, 2, 3]);

  /*
   * Total geral lavagem
   */
  const rowTotalLavagem = sheet.getRow(linhaLavagem + 1);

  rowTotalLavagem.getCell(2).value = "TOTAL GERAL";

  rowTotalLavagem.getCell(3).value =
    totalValorLavagem > 0 ? totalValorLavagem : "-";

  if (totalValorLavagem > 0) {
    aplicarMoeda(rowTotalLavagem.getCell(3));
  }

  estilizarTotal(rowTotalLavagem, [2, 3]);

  rowTotalLavagem.getCell(3).font = {
    bold: true,
    color: {
      argb: `FF${CORES.texto}`,
    },
  };

  /*
   * ========================================================
   * 4. CONTROLE DESPESA MANUTENÇÃO
   * ========================================================
   */

  criarTitulo("E13", "G13", "CONTROLE DESPESA MANUTENÇÃO");

  /*
   * Cabeçalho E14:G14
   */
  ["LOJAS", "QUANTIDADE", "TOTAL"].forEach((valor, index) => {
    const cell = sheet.getRow(14).getCell(index + 5);

    cell.value = valor;

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFB7B7B7",
      },
    };

    cell.font = {
      bold: true,
      color: {
        argb: "FF000000",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    aplicarBorda(cell);
  });

  let linhaManutencao = 15;

  let quantidadeManutencao = 0;
  let totalValorManutencao = 0;

  FILIAIS.forEach((filial) => {
    const dados = gruposManutencao.get(filial.codigo) || [];

    const quantidade = dados.length;

    const valor = dados.reduce(
      (soma, item) => soma + valorReal(item.valorTotal),
      0,
    );

    const row = sheet.getRow(linhaManutencao);

    row.getCell(5).value = nomeExibicaoFilial(filial.codigo);

    row.getCell(6).value = quantidade > 0 ? quantidade : "-";

    row.getCell(7).value = valor > 0 ? valor : "-";

    if (valor > 0) {
      aplicarMoeda(row.getCell(7));
    }

    aplicarEstiloLinha(row, 5, 7);

    quantidadeManutencao += quantidade;

    totalValorManutencao += valor;

    linhaManutencao++;
  });

  /*
   * Quantidade manutenção
   */
  const rowQuantidadeManutencao = sheet.getRow(linhaManutencao);

  rowQuantidadeManutencao.getCell(5).value = "TOTAL MANUTENÇÃO";

  rowQuantidadeManutencao.getCell(6).value =
    quantidadeManutencao > 0 ? quantidadeManutencao : "-";

  rowQuantidadeManutencao.getCell(7).value = "";

  estilizarTotal(rowQuantidadeManutencao, [5, 6, 7]);

  /*
   * Total geral manutenção
   */
  const rowTotalManutencao = sheet.getRow(linhaManutencao + 1);

  rowTotalManutencao.getCell(6).value = "TOTAL GERAL";

  rowTotalManutencao.getCell(7).value =
    totalValorManutencao > 0 ? totalValorManutencao : "-";

  if (totalValorManutencao > 0) {
    aplicarMoeda(rowTotalManutencao.getCell(7));
  }

  estilizarTotal(rowTotalManutencao, [6, 7]);

  rowTotalManutencao.getCell(7).font = {
    bold: true,
    color: {
      argb: `FF${CORES.texto}`,
    },
  };

  /*
   * ========================================================
   * AJUSTES FINAIS
   * ========================================================
   */

  sheet.getRow(1).height = 25;
  sheet.getRow(2).height = 22;
  sheet.getRow(13).height = 25;
  sheet.getRow(14).height = 22;

  return sheet;
}

/* =========================================================
   MÉDIA KM/L
========================================================= */

/* =========================================================
   MÉDIA KM/L
========================================================= */

function criarAbaMediaKmL(
  workbook: ExcelJS.Workbook,
  abastecimentos: Abastecimento[],
  dataInicial: string,
  dataFinal: string,
) {
  const sheet = workbook.addWorksheet("MÉDIA KM-L");

  prepararAba(
    sheet,
    `MÉDIA KM/L - ${formatarData(dataInicial)} A ${formatarData(dataFinal)}`,
    [
      "PLACA",
      "VEÍCULO",
      "MÉDIA ÚLTIMO ABASTECIMENTO",
      "MÉDIA GERAL DO PERÍODO",
    ],
    [14, 30, 28, 24],
  );

  /*
   * Agrupa todos os abastecimentos por veículo.
   *
   * O motorista não participa do cálculo.
   * O que importa é o veículo.
   */
  const porVeiculo = new Map<number, Abastecimento[]>();

  abastecimentos.forEach((registro) => {
    const id = registro.veiculo?.id;

    if (!id) {
      return;
    }

    const lista = porVeiculo.get(id) || [];

    lista.push(registro);

    porVeiculo.set(id, lista);
  });

  /*
   * Resumo de cada veículo.
   *
   * km:
   * Soma de todos os KM rodados
   * calculáveis no período.
   *
   * litros:
   * Soma de todos os litros utilizados
   * nos abastecimentos calculáveis.
   *
   * mediaUltimoAbastecimento:
   * Média do último abastecimento do período.
   */
  const resumoPorVeiculo = new Map<
    number,
    {
      placa: string;
      veiculo: string;
      km: number;
      litros: number;
      mediaUltimoAbastecimento: number | null;
    }
  >();

  porVeiculo.forEach((lista) => {
    /*
     * Ordena os abastecimentos pela data.
     *
     * Em caso de mesma data,
     * utiliza o ID.
     */
    const ordenados = [...lista].sort((a, b) => {
      const dataA = dataReal(a.data)?.getTime() || 0;

      const dataB = dataReal(b.data)?.getTime() || 0;

      if (dataA !== dataB) {
        return dataA - dataB;
      }

      return a.id - b.id;
    });

    let kmTotal = 0;
    let litrosTotal = 0;

    let mediaUltimoAbastecimento: number | null = null;

    /*
     * Percorre todos os abastecimentos.
     */
    for (let i = 0; i < ordenados.length; i++) {
      const atual = ordenados[i];

      /*
       * Só consideramos como lançamento
       * do relatório os abastecimentos
       * dentro do período selecionado.
       */
      if (atual.data < dataInicial || atual.data > dataFinal) {
        continue;
      }

      /*
       * Precisamos do abastecimento anterior
       * para descobrir quantos KM o veículo
       * percorreu.
       *
       * Ele pode estar fora do período.
       */
      const anterior = i > 0 ? ordenados[i - 1] : null;

      if (!anterior) {
        continue;
      }

      const kmAtual = Number(atual.novoKm || 0);

      const kmAnterior = Number(anterior.novoKm || 0);

      const litros = litrosReal(atual.quantLitro);

      /*
       * Verifica se é possível calcular
       * o consumo desse abastecimento.
       */
      if (
        kmAtual <= 0 ||
        kmAnterior <= 0 ||
        kmAtual <= kmAnterior ||
        litros <= 0
      ) {
        continue;
      }

      /*
       * KM percorridos desde o abastecimento
       * anterior.
       */
      const kmRodado = kmAtual - kmAnterior;

      /*
       * Média desse abastecimento.
       */
      const mediaAtual = kmRodado / litros;

      /*
       * Soma para a média geral do período.
       */
      kmTotal += kmRodado;
      litrosTotal += litros;

      /*
       * Como estamos percorrendo em ordem
       * cronológica, o último valor calculado
       * será automaticamente a média do
       * último abastecimento do período.
       */
      mediaUltimoAbastecimento = mediaAtual;

      /*
       * Cria o resumo do veículo.
       */
      const id = atual.veiculo.id;

      const existente = resumoPorVeiculo.get(id);

      if (existente) {
        existente.km += kmRodado;

        existente.litros += litros;

        existente.mediaUltimoAbastecimento = mediaUltimoAbastecimento;
      } else {
        resumoPorVeiculo.set(id, {
          placa: atual.veiculo?.placa || "",

          veiculo: atual.veiculo?.modelosVeiculos || "",

          km: kmRodado,

          litros: litros,

          mediaUltimoAbastecimento: mediaUltimoAbastecimento,
        });
      }
    }
  });

  /*
   * Ordena os veículos pela placa.
   */
  const resumoOrdenado = [...resumoPorVeiculo.values()].sort((a, b) =>
    a.placa.localeCompare(b.placa),
  );

  let linha = 4;

  /*
   * Totais gerais da frota.
   */
  let totalKmRodado = 0;
  let totalLitros = 0;

  /*
   * UMA LINHA POR VEÍCULO.
   */
  resumoOrdenado.forEach((resumo) => {
    const row = sheet.getRow(linha);

    /*
     * Média geral desse veículo
     * no período selecionado.
     */
    const mediaGeral = resumo.litros > 0 ? resumo.km / resumo.litros : null;

    row.getCell(1).value = resumo.placa;

    row.getCell(2).value = resumo.veiculo;

    row.getCell(3).value = resumo.mediaUltimoAbastecimento;

    row.getCell(4).value = mediaGeral;

    row.getCell(3).numFmt = "0.00";

    row.getCell(4).numFmt = "0.00";

    for (let coluna = 1; coluna <= 4; coluna++) {
      aplicarBorda(row.getCell(coluna));
    }

    totalKmRodado += resumo.km;

    totalLitros += resumo.litros;

    linha++;
  });

  /*
   * Nenhum veículo calculável.
   */
  if (resumoOrdenado.length === 0) {
    sheet.mergeCells(4, 1, 4, 4);

    const cell = sheet.getCell(4, 1);

    cell.value = "Nenhum abastecimento com média calculável no período.";

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

    return sheet;
  }

  /*
   * Média geral da frota.
   *
   * Soma de todos os KM rodados
   * dividida pela soma de todos os litros.
   */
  const mediaGeralFrota = totalLitros > 0 ? totalKmRodado / totalLitros : null;

  const totalRow = sheet.getRow(linha);

  sheet.mergeCells(linha, 1, linha, 3);

  totalRow.getCell(1).value = "MÉDIA GERAL DA FROTA";

  totalRow.getCell(4).value = mediaGeralFrota;

  totalRow.getCell(4).numFmt = "0.00";

  aplicarTotal(totalRow, 4);

  return sheet;
}

/* =========================================================
   GERADOR PRINCIPAL
========================================================= */

export async function gerarRelatorioExcel(
  dataInicial: string,
  dataFinal: string,
  abastecimentos: Abastecimento[],
  manutencoes: Manutencao[],
) {
  if (!dataInicial || !dataFinal) {
    throw new Error("Selecione a data inicial e a data final.");
  }

  if (dataInicial > dataFinal) {
    throw new Error("A data inicial não pode ser maior que a data final.");
  }

  /*
   * FILTRO DO PERÍODO
   */

  const abastecimentosPeriodo = abastecimentos.filter(
    (registro) => registro.data >= dataInicial && registro.data <= dataFinal,
  );

  const manutencoesPeriodo = manutencoes.filter(
    (registro) => registro.data >= dataInicial && registro.data <= dataFinal,
  );

  const pneus = manutencoesPeriodo.filter(
    (registro) =>
      registro.despesa === "MANUTENCAO" && registro.manutencaoTipos === "PNEU",
  );

  const lavagens = manutencoesPeriodo.filter(
    (registro) => registro.despesa === "LAVAGEM",
  );

  const manutencoesNormais = manutencoesPeriodo.filter(
    (registro) =>
      registro.despesa === "MANUTENCAO" && registro.manutencaoTipos !== "PNEU",
  );

  /*
   * CRIA O EXCEL DO ZERO
   *
   * Não usa:
   * workbook.xlsx.load()
   *
   * Portanto não depende de template.
   */

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Sistema de Controle da Frota";

  workbook.created = new Date();

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
    dataFinal,
  );

  criarAbaCombustivel(workbook, abastecimentosPeriodo, dataInicial, dataFinal);

  criarAbaLavagem(workbook, lavagens, dataInicial, dataFinal);

  criarAbaManutencao(workbook, manutencoesNormais, dataInicial, dataFinal);

  criarAbaPneus(workbook, pneus, dataInicial, dataFinal);

  criarAbaMediaKmL(workbook, abastecimentos, dataInicial, dataFinal);

  /*
   * GERA O ARQUIVO
   */

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `Relatorio_Frota_${dataInicial}_a_${dataFinal}.xlsx`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}
