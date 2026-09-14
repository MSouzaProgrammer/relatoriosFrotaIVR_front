import { useEffect, useState } from "react";
import api from "../../services/api";
import { Fuel, X } from "lucide-react";

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

interface Abastecimento {
  id?: number;
  veiculo: Veiculo;
  motorista?: Motorista | null;
  despesa: string;
  data: string;
  novoKm: number;
  valorUnitario: number;
  valorTotal: number;
  quantLitro: number;
  observacao: string;
}

interface BotaoAbastecimentoProps {
  abastecimento: Abastecimento | null;
  onFechar: () => void;
  onSalvo: () => void;
}

export default function BotaoAbastecimento({
  abastecimento,
  onFechar,
  onSalvo,
}: BotaoAbastecimentoProps) {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);

  const [veiculoId, setVeiculoId] = useState("");
  const [motoristaId, setMotoristaId] = useState("");

  const [data, setData] = useState("");
  const [km, setKm] = useState("");
  const [litros, setLitros] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [observacao, setObservacao] = useState("");

  const [salvando, setSalvando] = useState(false);

  const editando = abastecimento !== null;

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
    if (abastecimento) {
      setVeiculoId(String(abastecimento.veiculo?.id ?? ""));

      setMotoristaId(
        abastecimento.motorista?.id
          ? String(abastecimento.motorista.id)
          : ""
      );

      setData(abastecimento.data ?? "");

      setKm(
        abastecimento.novoKm !== undefined &&
        abastecimento.novoKm !== null
          ? String(abastecimento.novoKm)
          : ""
      );

      setLitros(
        abastecimento.quantLitro !== undefined &&
        abastecimento.quantLitro !== null
          ? String(abastecimento.quantLitro / 100)
          : ""
      );

      setValorTotal(
        abastecimento.valorTotal !== undefined &&
        abastecimento.valorTotal !== null
          ? (abastecimento.valorTotal / 100).toFixed(2)
          : ""
      );

      setObservacao(abastecimento.observacao ?? "");
    } else {
      setVeiculoId("");
      setMotoristaId("");
      setData(new Date().toISOString().split("T")[0]);
      setKm("");
      setLitros("");
      setValorTotal("");
      setObservacao("");
    }
  }, [abastecimento]);

  function formatarValor(valor: string) {
    let numero = valor.replace(",", ".").replace(/[^0-9.]/g, "");

    const partes = numero.split(".");

    if (partes.length > 2) {
      numero = `${partes[0]}.${partes.slice(1).join("")}`;
    }

    return numero;
  }

  function motoristasDisponiveis() {
    return motoristas.filter(
      (motorista) =>
        motorista.ativo !== false ||
        motorista.id === Number(motoristaId)
    );
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
      alert("Informe a data do abastecimento.");
      return;
    }

    if (!km || Number(km) < 0) {
      alert("Informe o KM atual.");
      return;
    }

    if (!litros || Number(litros) <= 0) {
      alert("Informe a quantidade de litros.");
      return;
    }

    if (!valorTotal || Number(valorTotal) <= 0) {
      alert("Informe o valor total.");
      return;
    }

    try {
      setSalvando(true);

      const total = Number(valorTotal);
      const quantidadeLitros = Number(litros);

      const valorUnitario = Math.round(
        (total / quantidadeLitros) * 100
      );

      const payload = {
        veiculoId: Number(veiculoId),
        motoristaId: Number(motoristaId),
        despesa: "ABASTECIMENTO",
        data,
        novoKm: Number(km),
        valorUnitario,
        valorTotal: Math.round(total * 100),
        quantLitro: Math.round(quantidadeLitros * 100),
        observacao: observacao.trim(),
      };

      if (editando && abastecimento?.id) {
        await api(`/combustiveis/${abastecimento.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/combustiveis", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      onSalvo();
      onFechar();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o abastecimento.");
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
              <Fuel size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                {editando
                  ? "Editar abastecimento"
                  : "Novo abastecimento"}
              </h2>

              <p className="text-xs text-slate-500">
                {editando
                  ? "Atualize os dados do abastecimento."
                  : "Informe os dados do abastecimento realizado."}
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
                    <option key={veiculo.id} value={veiculo.id}>
                      {veiculo.placa} - {veiculo.modelosVeiculos}
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

          {/* LITROS + VALOR */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Quantidade de litros
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={litros}
                onChange={(e) => setLitros(e.target.value)}
                placeholder="Ex.: 45.50"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Valor total
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  R$
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorTotal}
                  onChange={(e) =>
                    setValorTotal(formatarValor(e.target.value))
                  }
                  placeholder="0,00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

          </div>

          {/* PREÇO POR LITRO */}
          {Number(litros) > 0 && Number(valorTotal) > 0 && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-blue-700">
                  Valor por litro
                </span>

                <span className="font-bold text-blue-700">
                  R${" "}
                  {(Number(valorTotal) / Number(litros)).toFixed(2)}
                </span>

              </div>
            </div>
          )}

          {/* OBSERVAÇÃO */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Observação
            </label>

            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
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
              : "Lançar abastecimento"}
          </button>

        </div>

      </div>
    </div>
  );
}