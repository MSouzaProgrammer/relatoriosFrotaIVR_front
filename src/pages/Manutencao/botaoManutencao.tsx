import { useEffect, useMemo, useRef, useState } from "react";

import api from "../../services/api";

import {
  Check,
  ChevronDown,
  Search,
  Wrench,
  X,
} from "lucide-react";

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
  ativo?: boolean;
}

interface Manutencao {
  id?: number;
  nomeDaManutencao: string;
  veiculo: Veiculo;
  motorista?: Motorista | null;
  despesa: "LAVAGEM" | "MANUTENCAO";
  data: string;
  manutencaoTipos?:
    | "PNEU"
    | "OLEO"
    | "MOTOR"
    | "OUTROS"
    | null;
  novoKm: number | null;
  valorUnitario: number;
  valorTotal: number;
  observacao: string;
}

interface BotaoManutencaoProps {
  manutencao: Manutencao | null;
  onFechar: () => void;
  onSalvo: () => void;
}

export default function BotaoManutencao({
  manutencao,
  onFechar,
  onSalvo,
}: BotaoManutencaoProps) {
  const [veiculos, setVeiculos] =
    useState<Veiculo[]>([]);

  const [motoristas, setMotoristas] =
    useState<Motorista[]>([]);

  const [veiculoId, setVeiculoId] =
    useState("");

  const [motoristaId, setMotoristaId] =
    useState("");

  /*
   * Campos de pesquisa.
   */
  const [buscaVeiculo, setBuscaVeiculo] =
    useState("");

  const [buscaMotorista, setBuscaMotorista] =
    useState("");

  const [veiculoAberto, setVeiculoAberto] =
    useState(false);

  const [motoristaAberto, setMotoristaAberto] =
    useState(false);

  const veiculoRef =
    useRef<HTMLDivElement>(null);

  const motoristaRef =
    useRef<HTMLDivElement>(null);

  const [despesa, setDespesa] =
    useState<
      "LAVAGEM" | "MANUTENCAO"
    >("MANUTENCAO");

  const [manutencaoTipos, setManutencaoTipos] =
    useState<
      | "PNEU"
      | "OLEO"
      | "MOTOR"
      | "OUTROS"
      | ""
    >("");

  const [nomeDaManutencao, setNomeDaManutencao] =
    useState("");

  const [data, setData] =
    useState("");

  const [km, setKm] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [observacao, setObservacao] =
    useState("");

  const [salvando, setSalvando] =
    useState(false);

  const editando =
    manutencao !== null;

  /*
   * ==========================================
   * CARREGAR VEÍCULOS E MOTORISTAS
   * ==========================================
   */

  async function carregarDados() {
    try {
      const [
        veiculosDados,
        motoristasDados,
      ] = await Promise.all([
        api<Veiculo[]>("/veiculos"),
        api<Motorista[]>("/motoristas"),
      ]);

      setVeiculos(
        Array.isArray(veiculosDados)
          ? veiculosDados
          : []
      );

      setMotoristas(
        Array.isArray(motoristasDados)
          ? motoristasDados
          : []
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao carregar veículos e motoristas."
      );
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  /*
   * ==========================================
   * FECHAR DROPDOWNS AO CLICAR FORA
   * ==========================================
   */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      const alvo =
        event.target as Node;

      if (
        veiculoRef.current &&
        !veiculoRef.current.contains(
          alvo
        )
      ) {
        setVeiculoAberto(false);
      }

      if (
        motoristaRef.current &&
        !motoristaRef.current.contains(
          alvo
        )
      ) {
        setMotoristaAberto(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * ==========================================
   * CARREGAR DADOS DA EDIÇÃO
   * ==========================================
   */

  useEffect(() => {
    if (manutencao) {
      const idVeiculo =
        manutencao.veiculo?.id
          ? String(
              manutencao.veiculo.id
            )
          : "";

      const idMotorista =
        manutencao.motorista?.id
          ? String(
              manutencao.motorista.id
            )
          : "";

      setVeiculoId(
        idVeiculo
      );

      setMotoristaId(
        idMotorista
      );

      /*
       * Preenche os campos de pesquisa
       * com o item selecionado.
       */

      setBuscaVeiculo("");

      setBuscaMotorista("");

      setDespesa(
        manutencao.despesa ===
          "LAVAGEM"
          ? "LAVAGEM"
          : "MANUTENCAO"
      );

      setManutencaoTipos(
        manutencao.manutencaoTipos ??
          ""
      );

      setNomeDaManutencao(
        manutencao.nomeDaManutencao ??
          ""
      );

      setData(
        manutencao.data ?? ""
      );

      /*
       * Lavagem não possui KM.
       */

      setKm(
        manutencao.novoKm !==
          undefined &&
        manutencao.novoKm !==
          null
          ? String(
              manutencao.novoKm
            )
          : ""
      );

      setValor(
        manutencao.valorTotal !==
          undefined &&
        manutencao.valorTotal !==
          null
          ? (
              manutencao.valorTotal /
              100
            ).toFixed(2)
          : ""
      );

      setObservacao(
        manutencao.observacao ??
          ""
      );
    } else {
      setVeiculoId("");
      setMotoristaId("");

      setBuscaVeiculo("");
      setBuscaMotorista("");

      setVeiculoAberto(false);
      setMotoristaAberto(false);

      setDespesa(
        "MANUTENCAO"
      );

      setManutencaoTipos("");

      setNomeDaManutencao("");

      setData(
        new Date()
          .toISOString()
          .split("T")[0]
      );

      setKm("");

      setValor("");

      setObservacao("");
    }
  }, [manutencao]);

  /*
   * ==========================================
   * MOTORISTAS DISPONÍVEIS
   * ==========================================
   */

  function motoristasDisponiveis() {
    return motoristas.filter(
      (motorista) =>
        motorista.ativo !== false ||
        motorista.id ===
          Number(motoristaId)
    );
  }

  /*
   * ==========================================
   * VEÍCULOS DISPONÍVEIS
   * ==========================================
   */

  const veiculosDisponiveis =
    useMemo(() => {
      return veiculos.filter(
        (veiculo) =>
          veiculo.status ===
            "ATIVO" ||
          veiculo.id ===
            Number(veiculoId)
      );
    }, [
      veiculos,
      veiculoId,
    ]);

  /*
   * ==========================================
   * VEÍCULOS FILTRADOS
   * ==========================================
   */

  const veiculosFiltrados =
    useMemo(() => {
      const termo =
        buscaVeiculo
          .trim()
          .toLowerCase();

      if (!termo) {
        return veiculosDisponiveis;
      }

      return veiculosDisponiveis.filter(
        (veiculo) => {
          const placa =
            String(
              veiculo.placa ??
                ""
            ).toLowerCase();

          const modelo =
            String(
              veiculo.modelosVeiculos ??
                ""
            ).toLowerCase();

          const marca =
            String(
              veiculo.marca ??
                ""
            ).toLowerCase();

          const ano =
            String(
              veiculo.ano ??
                ""
            ).toLowerCase();

          return (
            placa.includes(
              termo
            ) ||
            modelo.includes(
              termo
            ) ||
            marca.includes(
              termo
            ) ||
            ano.includes(
              termo
            )
          );
        }
      );
    }, [
      buscaVeiculo,
      veiculosDisponiveis,
    ]);

  /*
   * ==========================================
   * MOTORISTAS FILTRADOS
   * ==========================================
   */

  const motoristasFiltrados =
    useMemo(() => {
      const termo =
        buscaMotorista
          .trim()
          .toLowerCase();

      const disponiveis =
        motoristasDisponiveis();

      if (!termo) {
        return disponiveis;
      }

      return disponiveis.filter(
        (motorista) =>
          motorista.nome
            .toLowerCase()
            .includes(termo)
      );
    }, [
      buscaMotorista,
      motoristas,
      motoristaId,
    ]);

  /*
   * ==========================================
   * SELECIONADOS
   * ==========================================
   */

  const veiculoSelecionado =
    veiculos.find(
      (veiculo) =>
        veiculo.id ===
        Number(veiculoId)
    );

  const motoristaSelecionado =
    motoristas.find(
      (motorista) =>
        motorista.id ===
        Number(motoristaId)
    );

  /*
   * ==========================================
   * SELECIONAR VEÍCULO
   * ==========================================
   */

  function selecionarVeiculo(
    veiculo: Veiculo
  ) {
    setVeiculoId(
      String(veiculo.id)
    );

    setBuscaVeiculo("");

    setVeiculoAberto(false);
  }

  /*
   * ==========================================
   * SELECIONAR MOTORISTA
   * ==========================================
   */

  function selecionarMotorista(
    motorista: Motorista
  ) {
    setMotoristaId(
      String(motorista.id)
    );

    setBuscaMotorista("");

    setMotoristaAberto(false);
  }

  /*
   * ==========================================
   * FORMATAR VEÍCULO
   * ==========================================
   */

  function nomeVeiculo(
    veiculo: Veiculo
  ) {
    const marca =
      veiculo.marca
        ? veiculo.marca.replaceAll(
            "_",
            " "
          )
        : "";

    const modelo =
      veiculo.modelosVeiculos
        ? veiculo.modelosVeiculos.replaceAll(
            "_",
            " "
          )
        : "";

    if (
      marca &&
      modelo
    ) {
      return `${marca} ${modelo}`;
    }

    return (
      modelo ||
      marca ||
      "Veículo"
    );
  }

  /*
   * ==========================================
   * FORMATAR VALOR
   * ==========================================
   */

  function formatarValor(
    valorDigitado: string
  ) {
    let numero =
      valorDigitado
        .replace(",", ".")
        .replace(
          /[^0-9.]/g,
          ""
        );

    const partes =
      numero.split(".");

    if (
      partes.length > 2
    ) {
      numero = `${partes[0]}.${partes
        .slice(1)
        .join("")}`;
    }

    return numero;
  }

  /*
   * ==========================================
   * ALTERAR TIPO DA DESPESA
   * ==========================================
   */

  function alterarDespesa(
    novoValor:
      | "LAVAGEM"
      | "MANUTENCAO"
  ) {
    setDespesa(
      novoValor
    );

    if (
      novoValor ===
      "LAVAGEM"
    ) {
      setManutencaoTipos("");
      setNomeDaManutencao("");
      setKm("");
    }
  }

  /*
   * ==========================================
   * NOME FINAL DA MANUTENÇÃO
   * ==========================================
   */

  function nomeFinal() {
    if (
      despesa ===
      "LAVAGEM"
    ) {
      return "Lavagem";
    }

    if (
      manutencaoTipos ===
      "PNEU"
    ) {
      return "Pneu";
    }

    if (
      manutencaoTipos ===
      "OLEO"
    ) {
      return "Óleo";
    }

    if (
      manutencaoTipos ===
      "MOTOR"
    ) {
      return "Motor";
    }

    if (
      manutencaoTipos ===
      "OUTROS"
    ) {
      return nomeDaManutencao.trim();
    }

    return "";
  }

  /*
   * ==========================================
   * SALVAR
   * ==========================================
   */

  async function salvar() {
    if (!veiculoId) {
      alert(
        "Selecione o veículo."
      );

      return;
    }

    if (!motoristaId) {
      alert(
        "Selecione o motorista."
      );

      return;
    }

    if (!data) {
      alert(
        "Informe a data."
      );

      return;
    }

    if (
      despesa ===
        "MANUTENCAO" &&
      !manutencaoTipos
    ) {
      alert(
        "Selecione o tipo de manutenção."
      );

      return;
    }

    if (
      despesa ===
        "MANUTENCAO" &&
      manutencaoTipos ===
        "OUTROS" &&
      !nomeDaManutencao.trim()
    ) {
      alert(
        "Informe qual foi a manutenção."
      );

      return;
    }

    /*
     * KM obrigatório somente
     * para manutenção.
     */

    if (
      despesa ===
        "MANUTENCAO" &&
      (!km ||
        Number(km) < 0)
    ) {
      alert(
        "Informe o KM atual."
      );

      return;
    }

    if (
      !valor ||
      Number(valor) <= 0
    ) {
      alert(
        "Informe o valor."
      );

      return;
    }

    const nome =
      nomeFinal();

    if (!nome) {
      alert(
        "Informe o tipo da manutenção."
      );

      return;
    }

    try {
      setSalvando(true);

      const valorCentavos =
        Math.round(
          Number(valor) *
            100
        );

      const payload = {
        veiculoId:
          Number(veiculoId),

        motoristaId:
          Number(motoristaId),

        nomeDaManutencao:
          nome,

        despesa,

        data,

        manutencaoTipos:
          despesa ===
          "MANUTENCAO"
            ? manutencaoTipos
            : null,

        /*
         * Lavagem não possui KM.
         */

        novoKm:
          despesa ===
          "MANUTENCAO"
            ? Number(km)
            : null,

        valorUnitario:
          valorCentavos,

        valorTotal:
          valorCentavos,

        observacao:
          observacao.trim(),
      };

      if (
        editando &&
        manutencao?.id
      ) {
        await api(
          `/manutencoes/${manutencao.id}`,
          {
            method: "PUT",
            body: JSON.stringify(
              payload
            ),
          }
        );
      } else {
        await api(
          "/manutencoes",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      onSalvo();
      onFechar();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao salvar o lançamento."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-visible rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* CABEÇALHO */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Wrench
                size={21}
              />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                {editando
                  ? "Editar lançamento"
                  : "Novo lançamento"}
              </h2>

              <p className="text-xs text-slate-500">
                {editando
                  ? "Atualize os dados do lançamento."
                  : "Informe os dados da despesa realizada."}
              </p>
            </div>
          </div>

          <button
            onClick={
              onFechar
            }
            disabled={
              salvando
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X
              size={19}
            />
          </button>
        </div>

        {/* FORMULÁRIO */}

        <div className="space-y-5 p-6">

          {/* VEÍCULO + MOTORISTA */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* ================================
                VEÍCULO
            ================================= */}

            <div
              ref={
                veiculoRef
              }
              className="relative"
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Veículo
              </label>

              <div className="relative">

                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={
                    veiculoAberto
                      ? buscaVeiculo
                      : veiculoSelecionado
                      ? `${veiculoSelecionado.placa} - ${nomeVeiculo(
                          veiculoSelecionado
                        )}`
                      : ""
                  }
                  onChange={(e) => {
                    setBuscaVeiculo(
                      e.target
                        .value
                    );

                    setVeiculoId(
                      ""
                    );

                    setVeiculoAberto(
                      true
                    );
                  }}
                  onFocus={() =>
                    setVeiculoAberto(
                      true
                    )
                  }
                  placeholder="Pesquisar placa ou veículo..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <ChevronDown
                  size={17}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition ${
                    veiculoAberto
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </div>

              {veiculoAberto && (
                <div className="absolute left-0 right-0 top-full z-70 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">

                  {veiculosFiltrados.length ===
                  0 ? (
                    <div className="px-4 py-4 text-center text-sm text-slate-500">
                      Nenhum veículo encontrado.
                    </div>
                  ) : (
                    veiculosFiltrados.map(
                      (
                        veiculo
                      ) => {
                        const selecionado =
                          Number(
                            veiculoId
                          ) ===
                          veiculo.id;

                        return (
                          <button
                            type="button"
                            key={
                              veiculo.id
                            }
                            onClick={() =>
                              selecionarVeiculo(
                                veiculo
                              )
                            }
                            className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-blue-50 ${
                              selecionado
                                ? "bg-blue-50"
                                : ""
                            }`}
                          >
                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <span className="rounded-md bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700">
                                  {
                                    veiculo.placa
                                  }
                                </span>

                                <span className="truncate text-sm font-semibold text-slate-700">
                                  {nomeVeiculo(
                                    veiculo
                                  )}
                                </span>
                              </div>

                              <span className="mt-1 block text-xs text-slate-400">
                                Ano:{" "}
                                {
                                  veiculo.ano
                                }
                              </span>
                            </div>

                            {selecionado && (
                              <Check
                                size={
                                  18
                                }
                                className="shrink-0 text-blue-600"
                              />
                            )}
                          </button>
                        );
                      }
                    )
                  )}
                </div>
              )}
            </div>

            {/* ================================
                MOTORISTA
            ================================= */}

            <div
              ref={
                motoristaRef
              }
              className="relative"
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Motorista
              </label>

              <div className="relative">

                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={
                    motoristaAberto
                      ? buscaMotorista
                      : motoristaSelecionado
                      ? motoristaSelecionado.nome
                      : ""
                  }
                  onChange={(e) => {
                    setBuscaMotorista(
                      e.target
                        .value
                    );

                    setMotoristaId(
                      ""
                    );

                    setMotoristaAberto(
                      true
                    );
                  }}
                  onFocus={() =>
                    setMotoristaAberto(
                      true
                    )
                  }
                  placeholder="Pesquisar motorista..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <ChevronDown
                  size={17}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition ${
                    motoristaAberto
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </div>

              {motoristaAberto && (
                <div className="absolute left-0 right-0 top-full z-70 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">

                  {motoristasFiltrados.length ===
                  0 ? (
                    <div className="px-4 py-4 text-center text-sm text-slate-500">
                      Nenhum motorista encontrado.
                    </div>
                  ) : (
                    motoristasFiltrados.map(
                      (
                        motorista
                      ) => {
                        const selecionado =
                          Number(
                            motoristaId
                          ) ===
                          motorista.id;

                        return (
                          <button
                            type="button"
                            key={
                              motorista.id
                            }
                            onClick={() =>
                              selecionarMotorista(
                                motorista
                              )
                            }
                            className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-blue-50 ${
                              selecionado
                                ? "bg-blue-50"
                                : ""
                            }`}
                          >
                            <div className="min-w-0">

                              <span className="block truncate text-sm font-semibold text-slate-700">
                                {
                                  motorista.nome
                                }
                              </span>

                              <span className="mt-1 block text-xs text-slate-400">
                                {motorista.ativo ===
                                false
                                  ? "Motorista inativo"
                                  : "Motorista ativo"}
                              </span>
                            </div>

                            {selecionado && (
                              <Check
                                size={
                                  18
                                }
                                className="shrink-0 text-blue-600"
                              />
                            )}
                          </button>
                        );
                      }
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TIPO DO LANÇAMENTO */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tipo do lançamento
            </label>

            <select
              value={
                despesa
              }
              onChange={(e) =>
                alterarDespesa(
                  e.target
                    .value as
                    | "LAVAGEM"
                    | "MANUTENCAO"
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="MANUTENCAO">
                Manutenção
              </option>

              <option value="LAVAGEM">
                Lavagem
              </option>
            </select>
          </div>

          {/* TIPO DE MANUTENÇÃO */}

          {despesa ===
            "MANUTENCAO" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de manutenção
              </label>

              <select
                value={
                  manutencaoTipos
                }
                onChange={(e) =>
                  setManutencaoTipos(
                    e.target
                      .value as
                      | "PNEU"
                      | "OLEO"
                      | "MOTOR"
                      | "OUTROS"
                      | ""
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Selecione o tipo
                </option>

                <option value="PNEU">
                  Pneu
                </option>

                <option value="OLEO">
                  Óleo
                </option>

                <option value="MOTOR">
                  Motor
                </option>

                <option value="OUTROS">
                  Outros
                </option>
              </select>
            </div>
          )}

          {/* QUAL MANUTENÇÃO */}

          {despesa ===
            "MANUTENCAO" &&
            manutencaoTipos ===
              "OUTROS" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Qual manutenção?
                </label>

                <input
                  type="text"
                  value={
                    nomeDaManutencao
                  }
                  onChange={(e) =>
                    setNomeDaManutencao(
                      e.target
                        .value
                    )
                  }
                  placeholder="Ex.: Freio, suspensão, bateria..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

          {/* DATA + KM */}

          <div
            className={
              despesa ===
              "MANUTENCAO"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                : "grid grid-cols-1 gap-4"
            }
          >

            {/* DATA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Data
              </label>

              <input
                type="date"
                value={
                  data
                }
                onChange={(e) =>
                  setData(
                    e.target
                      .value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* KM */}

            {despesa ===
              "MANUTENCAO" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  KM atual
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    km
                  }
                  onChange={(e) =>
                    setKm(
                      e.target
                        .value
                    )
                  }
                  placeholder="Ex.: 125000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>

          {/* VALOR */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Valor
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                R$
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  valor
                }
                onChange={(e) =>
                  setValor(
                    formatarValor(
                      e.target
                        .value
                    )
                  )
                }
                placeholder="0,00"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* OBSERVAÇÃO */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Observação
            </label>

            <textarea
              value={
                observacao
              }
              onChange={(e) =>
                setObservacao(
                  e.target
                    .value
                )
              }
              placeholder="Digite alguma observação..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* RODAPÉ */}

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            onClick={
              onFechar
            }
            disabled={
              salvando
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={
              salvar
            }
            disabled={
              salvando
            }
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : editando
              ? "Salvar alterações"
              : "Lançar despesa"}
          </button>

        </div>
      </div>
    </div>
  );
}