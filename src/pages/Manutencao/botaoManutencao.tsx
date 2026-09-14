import { useEffect, useState } from "react";
import api from "../../services/api";
import { Wrench, X } from "lucide-react";

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
  manutencaoTipos?: "PNEU" | "OLEO" | "MOTOR" | "OUTROS" | null;
  novoKm: number;
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
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);

  const [veiculoId, setVeiculoId] = useState("");
  const [motoristaId, setMotoristaId] = useState("");

  const [despesa, setDespesa] = useState<
    "LAVAGEM" | "MANUTENCAO"
  >("MANUTENCAO");

  const [manutencaoTipos, setManutencaoTipos] = useState<
    "PNEU" | "OLEO" | "MOTOR" | "OUTROS" | ""
  >("");

  const [nomeDaManutencao, setNomeDaManutencao] = useState("");
  const [data, setData] = useState("");
  const [km, setKm] = useState("");
  const [valor, setValor] = useState("");
  const [observacao, setObservacao] = useState("");

  const [salvando, setSalvando] = useState(false);

  const editando = manutencao !== null;

  async function carregarDados() {
    try {
      const [veiculosDados, motoristasDados] = await Promise.all([
        api<Veiculo[]>("/veiculos"),
        api<Motorista[]>("/motoristas"),
      ]);

      setVeiculos(veiculosDados);
      setMotoristas(motoristasDados);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar veículos e motoristas.");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (manutencao) {
      setVeiculoId(String(manutencao.veiculo?.id ?? ""));

      setMotoristaId(
        manutencao.motorista?.id
          ? String(manutencao.motorista.id)
          : ""
      );

      setDespesa(
        manutencao.despesa === "LAVAGEM"
          ? "LAVAGEM"
          : "MANUTENCAO"
      );

      setManutencaoTipos(
        manutencao.manutencaoTipos ?? ""
      );

      setNomeDaManutencao(
        manutencao.nomeDaManutencao ?? ""
      );

      setData(manutencao.data ?? "");

      setKm(
        manutencao.novoKm !== undefined &&
        manutencao.novoKm !== null
          ? String(manutencao.novoKm)
          : ""
      );

      setValor(
        manutencao.valorTotal !== undefined &&
        manutencao.valorTotal !== null
          ? (manutencao.valorTotal / 100).toFixed(2)
          : ""
      );

      setObservacao(manutencao.observacao ?? "");
    } else {
      setVeiculoId("");
      setMotoristaId("");
      setDespesa("MANUTENCAO");
      setManutencaoTipos("");
      setNomeDaManutencao("");
      setData(new Date().toISOString().split("T")[0]);
      setKm("");
      setValor("");
      setObservacao("");
    }
  }, [manutencao]);

  function motoristasDisponiveis() {
    return motoristas.filter(
      (motorista) =>
        motorista.ativo !== false ||
        motorista.id === Number(motoristaId)
    );
  }

  function formatarValor(valorDigitado: string) {
    let numero = valorDigitado
      .replace(",", ".")
      .replace(/[^0-9.]/g, "");

    const partes = numero.split(".");

    if (partes.length > 2) {
      numero = `${partes[0]}.${partes.slice(1).join("")}`;
    }

    return numero;
  }

  function alterarDespesa(
    novoValor: "LAVAGEM" | "MANUTENCAO"
  ) {
    setDespesa(novoValor);

    if (novoValor === "LAVAGEM") {
      setManutencaoTipos("");
      setNomeDaManutencao("");
    }
  }

  function nomeFinal() {
    if (despesa === "LAVAGEM") {
      return "Lavagem";
    }

    if (manutencaoTipos === "PNEU") {
      return "Pneu";
    }

    if (manutencaoTipos === "OLEO") {
      return "Óleo";
    }

    if (manutencaoTipos === "MOTOR") {
      return "Motor";
    }

    if (manutencaoTipos === "OUTROS") {
      return nomeDaManutencao.trim();
    }

    return "";
  }

  async function salvar() {
    if (!veiculoId) {
      alert("Selecione o veículo.");
      return;
    }

    if (!motoristaId) {
      alert("Selecione o motorista.");
      return;
    }

    if (!data) {
      alert("Informe a data.");
      return;
    }

    if (despesa === "MANUTENCAO" && !manutencaoTipos) {
      alert("Selecione o tipo de manutenção.");
      return;
    }

    if (
      despesa === "MANUTENCAO" &&
      manutencaoTipos === "OUTROS" &&
      !nomeDaManutencao.trim()
    ) {
      alert("Informe qual foi a manutenção.");
      return;
    }

    if (!km || Number(km) < 0) {
      alert("Informe o KM atual.");
      return;
    }

    if (!valor || Number(valor) <= 0) {
      alert("Informe o valor.");
      return;
    }

    const nome = nomeFinal();

    if (!nome) {
      alert("Informe o tipo da manutenção.");
      return;
    }

    try {
      setSalvando(true);

      const valorCentavos = Math.round(
        Number(valor) * 100
      );

      const payload = {
        veiculoId: Number(veiculoId),
        motoristaId: Number(motoristaId),
        nomeDaManutencao: nome,
        despesa,
        data,
        manutencaoTipos:
          despesa === "MANUTENCAO"
            ? manutencaoTipos
            : null,
        novoKm: Number(km),
        valorUnitario: valorCentavos,
        valorTotal: valorCentavos,
        observacao: observacao.trim(),
      };

      if (editando && manutencao?.id) {
        await api(`/manutencoes/${manutencao.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/manutencoes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      onSalvo();
      onFechar();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o lançamento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Wrench size={21} />
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
            onClick={onFechar}
            disabled={salvando}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>

        </div>

        {/* FORMULÁRIO */}
        <div className="space-y-5 p-6">

          {/* VEÍCULO + MOTORISTA */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Veículo
              </label>

              <select
                value={veiculoId}
                onChange={(e) => setVeiculoId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Selecione o veículo
                </option>

                {veiculos
                  .filter(
                    (veiculo) =>
                      veiculo.status === "ATIVO" ||
                      veiculo.id === Number(veiculoId)
                  )
                  .map((veiculo) => (
                    <option
                      key={veiculo.id}
                      value={veiculo.id}
                    >
                      {veiculo.placa} -{" "}
                      {veiculo.modelosVeiculos}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Motorista
              </label>

              <select
                value={motoristaId}
                onChange={(e) => setMotoristaId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Selecione o motorista
                </option>

                {motoristasDisponiveis().map((motorista) => (
                  <option
                    key={motorista.id}
                    value={motorista.id}
                  >
                    {motorista.nome}
                    {motorista.ativo === false
                      ? " (Inativo)"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* TIPO DO LANÇAMENTO */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tipo do lançamento
            </label>

            <select
              value={despesa}
              onChange={(e) =>
                alterarDespesa(
                  e.target.value as
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
          {despesa === "MANUTENCAO" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de manutenção
              </label>

              <select
                value={manutencaoTipos}
                onChange={(e) =>
                  setManutencaoTipos(
                    e.target.value as
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
          {despesa === "MANUTENCAO" &&
            manutencaoTipos === "OUTROS" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Qual manutenção?
                </label>

                <input
                  type="text"
                  value={nomeDaManutencao}
                  onChange={(e) =>
                    setNomeDaManutencao(e.target.value)
                  }
                  placeholder="Ex.: Freio, suspensão, bateria..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

          {/* DATA + KM */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Data
              </label>

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                KM atual
              </label>

              <input
                type="number"
                min="0"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="Ex.: 125000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

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
                value={valor}
                onChange={(e) =>
                  setValor(formatarValor(e.target.value))
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
              value={observacao}
              onChange={(e) =>
                setObservacao(e.target.value)
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
            onClick={onFechar}
            disabled={salvando}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            disabled={salvando}
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