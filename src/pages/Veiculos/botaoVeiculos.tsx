import { useEffect, useState } from "react";
import { Car, X } from "lucide-react";

import api from "../../services/api";

interface Veiculo {
  id?: number;
  placa: string;
  modelosVeiculos: string;
  marca: string;
  ano: number;
  km: number;
  filial: string;
  status: string;
}

interface BotaoVeiculosProps {
  veiculoSelecionado: Veiculo | null;
  onFechar: () => void;
  onSalvo: () => void;
}

const marcas = [
  "FORD",
  "CHEVROLET",
  "TOYOTA",
  "VOLKSWAGEN",
  "FIAT",
];

const modelos = [
  "SAVEIRO",
  "STRADA",
  "RANGER",
  "S10",
  "HILUX",
  "GOL",
];

const filiais = [
  {
    valor: "MATRIZ",
    descricao: "1 - MATRIZ",
  },
  {
    valor: "AQUIDAUANA_ANASTACIO",
    descricao: "2 - AQUIDAUANA/ANASTACIO",
  },
  {
    valor: "DOIS_IRMAOS_BURITI",
    descricao: "3 - D.I.B",
  },
  {
    valor: "NIOAQUE",
    descricao: "4 - NIOAQUE",
  },
  {
    valor: "JARDIM_GUIA_LOPES",
    descricao: "5 - JARDIM/GUIA LOPES",
  },
  {
    valor: "BONITO",
    descricao: "7 - BONITO",
  },
  {
    valor: "BODOQUENA",
    descricao: "15 - BODOQUENA",
  },
];

const statusOptions = [
  "ATIVO",
  "INATIVO",
];

export default function BotaoVeiculos({
  veiculoSelecionado,
  onFechar,
  onSalvo,
}: BotaoVeiculosProps) {

  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [filial, setFilial] = useState("");
  const [status, setStatus] = useState("ATIVO");

  const [salvando, setSalvando] =
    useState(false);

  const editando =
    veiculoSelecionado !== null;

  /*
   * CARREGA OS DADOS NO FORMULÁRIO
   */
  useEffect(() => {
    if (veiculoSelecionado) {

      setPlaca(
        veiculoSelecionado.placa ?? ""
      );

      setModelo(
        veiculoSelecionado.modelosVeiculos ??
          ""
      );

      setMarca(
        veiculoSelecionado.marca ?? ""
      );

      setAno(
        String(veiculoSelecionado.ano ?? "")
      );

      setKm(
        String(veiculoSelecionado.km ?? "")
      );

      setFilial(
        veiculoSelecionado.filial ?? ""
      );

      setStatus(
        veiculoSelecionado.status ??
          "ATIVO"
      );

    } else {

      setPlaca("");
      setModelo("");
      setMarca("");
      setAno("");
      setKm("");
      setFilial("");
      setStatus("ATIVO");

    }

  }, [veiculoSelecionado]);

  /*
   * FORMATA PLACA
   */
  function formatarPlaca(valor: string) {
    return valor
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 7);
  }

  /*
   * FORMATA KM
   */
  function formatarKm(valor: string) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 7);
  }

  /*
   * SALVAR
   */
  async function salvar() {

    const placaLimpa =
      placa.trim().toUpperCase();

    if (!placaLimpa) {
      alert("Informe a placa do veículo.");
      return;
    }

    if (placaLimpa.length < 7) {
      alert("Informe uma placa válida.");
      return;
    }

    if (!marca) {
      alert("Selecione a marca.");
      return;
    }

    if (!modelo) {
      alert("Selecione o modelo.");
      return;
    }

    if (!ano) {
      alert("Informe o ano do veículo.");
      return;
    }

    if (!km) {
      alert("Informe a quilometragem.");
      return;
    }

    if (!filial) {
      alert("Selecione a filial.");
      return;
    }

    if (!status) {
      alert("Selecione o status.");
      return;
    }

    const anoNumero = Number(ano);
    const kmNumero = Number(km);

    if (
      Number.isNaN(anoNumero) ||
      anoNumero < 1900
    ) {
      alert("Informe um ano válido.");
      return;
    }

    if (
      Number.isNaN(kmNumero) ||
      kmNumero < 0
    ) {
      alert("Informe uma quilometragem válida.");
      return;
    }

    const payload = {
      placa: placaLimpa,
      modelosVeiculos: modelo,
      marca,
      ano: anoNumero,
      km: kmNumero,
      filial,
      status,
    };

    try {

      setSalvando(true);

      if (
        editando &&
        veiculoSelecionado?.id
      ) {

        await api(
          `/veiculos/${veiculoSelecionado.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

      } else {

        await api("/veiculos", {
          method: "POST",
          body: JSON.stringify(payload),
        });

      }

      onSalvo();
      onFechar();

    } catch (erro) {

      console.error(
        "Erro ao salvar veículo:",
        erro
      );

      if (erro instanceof Error) {
        alert(
          `Erro ao salvar veículo: ${erro.message}`
        );
      } else {
        alert("Erro ao salvar veículo.");
      }

    } finally {

      setSalvando(false);

    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onFechar();
        }
      }}
    >

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <Car
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {editando
                  ? "Editar veículo"
                  : "Novo veículo"}
              </h2>

              <p className="text-sm text-slate-500">
                {editando
                  ? "Atualize os dados do veículo."
                  : "Cadastre um novo veículo no sistema."}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onFechar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORMULÁRIO */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* PLACA */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Placa
              </label>

              <input
                type="text"
                value={placa}
                onChange={(e) =>
                  setPlaca(
                    formatarPlaca(
                      e.target.value
                    )
                  )
                }
                placeholder="ABC1D23"
                maxLength={7}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium uppercase text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* MARCA */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Marca
              </label>

              <select
                value={marca}
                onChange={(e) =>
                  setMarca(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Selecione a marca
                </option>

                {marcas.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* MODELO */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Modelo
              </label>

              <select
                value={modelo}
                onChange={(e) =>
                  setModelo(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Selecione o modelo
                </option>

                {modelos.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* ANO */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ano
              </label>

              <input
                type="number"
                value={ano}
                onChange={(e) =>
                  setAno(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                  )
                }
                placeholder="2025"
                min="1900"
                max="2100"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* KM */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Quilometragem
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={km}
                onChange={(e) =>
                  setKm(
                    formatarKm(
                      e.target.value
                    )
                  )
                }
                placeholder="50000"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* FILIAL */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Filial
              </label>

              <select
                value={filial}
                onChange={(e) =>
                  setFilial(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Selecione a filial
                </option>

                {filiais.map((item) => (
                  <option
                    key={item.valor}
                    value={item.valor}
                  >
                    {item.descricao}
                  </option>
                ))}

              </select>

            </div>

            {/* STATUS */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >

                {statusOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item === "ATIVO"
                        ? "Ativo"
                        : "Inativo"}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </div>

        {/* RODAPÉ */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando
              ? "Salvando..."
              : editando
              ? "Salvar alterações"
              : "Cadastrar veículo"}
          </button>

        </div>

      </div>

    </div>
  );
}