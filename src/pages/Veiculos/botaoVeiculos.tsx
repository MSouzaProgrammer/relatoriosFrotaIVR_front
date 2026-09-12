import {  useEffect, useState, type FormEvent } from "react";

import { X, CarFront } from "lucide-react";

interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  ano: number;
  filial: string;
  motorista: string;
  status: "ATIVO" | "INATIVO";
}

interface BotaoVeiculoProps {
  veiculo: Veiculo | null;
  onFechar: () => void;
  onSalvar: (dados: Omit<Veiculo, "id">) => void;
}

function BotaoVeiculo({
  veiculo,
  onFechar,
  onSalvar,
}: BotaoVeiculoProps) {
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [filial, setFilial] = useState("");
  const [motorista, setMotorista] = useState("");
  const [status, setStatus] = useState<
    "ATIVO" | "INATIVO"
  >("ATIVO");

  useEffect(() => {
    if (veiculo) {
      setPlaca(veiculo.placa);
      setModelo(veiculo.modelo);
      setAno(String(veiculo.ano));
      setFilial(veiculo.filial);
      setMotorista(veiculo.motorista);
      setStatus(veiculo.status);
    } else {
      setPlaca("");
      setModelo("");
      setAno("");
      setFilial("");
      setMotorista("");
      setStatus("ATIVO");
    }
  }, [veiculo]);

  function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !placa.trim() ||
      !modelo.trim() ||
      !ano ||
      !filial ||
      !motorista
    ) {
      return;
    }

    onSalvar({
      placa: placa.trim().toUpperCase(),
      modelo: modelo.trim(),
      ano: Number(ano),
      filial,
      motorista,
      status,
    });
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
      "
    >

      {/* CARD */}
      <div
        className="
          w-full
          max-w-130
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-xl
          shadow-2xl
        "
      >

        {/* CABEÇALHO */}
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            px-5
            py-4
            border-b
            border-slate-200
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-blue-100
                flex
                items-center
                justify-center
              "
            >
              <CarFront
                size={19}
                className="text-blue-600"
              />
            </div>

            <div>

              <h2 className="text-base lg:text-lg font-bold text-slate-900">
                {veiculo
                  ? "Editar veículo"
                  : "Novo veículo"}
              </h2>

              <p className="text-[11px] lg:text-xs text-slate-500 mt-0.5">
                {veiculo
                  ? "Altere as informações do veículo."
                  : "Cadastre um novo veículo na frota."}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onFechar}
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-md
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-700
              cursor-pointer
            "
          >
            <X size={18} />
          </button>

        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={salvar}>

          <div className="p-5 space-y-3">

            {/* PLACA */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Placa
              </label>

              <input
                type="text"
                value={placa}
                onChange={(event) =>
                  setPlaca(event.target.value)
                }
                placeholder="Ex: SMJ-7A36"
                maxLength={8}
                required
                className="
                  w-full
                  h-9
                  lg:h-10
                  px-3
                  border
                  border-slate-300
                  rounded-lg
                  text-xs
                  lg:text-sm
                  text-slate-700
                  uppercase
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />
            </div>

            {/* MODELO */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Modelo
              </label>

              <input
                type="text"
                value={modelo}
                onChange={(event) =>
                  setModelo(event.target.value)
                }
                placeholder="Ex: Saveiro Robust"
                required
                className="
                  w-full
                  h-9
                  lg:h-10
                  px-3
                  border
                  border-slate-300
                  rounded-lg
                  text-xs
                  lg:text-sm
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />
            </div>

            {/* ANO / STATUS */}
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                  Ano
                </label>

                <input
                  type="number"
                  value={ano}
                  onChange={(event) =>
                    setAno(event.target.value)
                  }
                  placeholder="2025"
                  min="1900"
                  max="2100"
                  required
                  className="
                    w-full
                    h-9
                    lg:h-10
                    px-3
                    border
                    border-slate-300
                    rounded-lg
                    text-xs
                    lg:text-sm
                    text-slate-700
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                  "
                />
              </div>

              <div>
                <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | "ATIVO"
                        | "INATIVO"
                    )
                  }
                  className="
                    w-full
                    h-9
                    lg:h-10
                    px-3
                    border
                    border-slate-300
                    rounded-lg
                    text-xs
                    lg:text-sm
                    text-slate-700
                    bg-white
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    cursor-pointer
                  "
                >
                  <option value="ATIVO">
                    Ativo
                  </option>

                  <option value="INATIVO">
                    Inativo
                  </option>
                </select>
              </div>

            </div>

            {/* FILIAL */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Filial
              </label>

              <select
                value={filial}
                onChange={(event) =>
                  setFilial(event.target.value)
                }
                required
                className="
                  w-full
                  h-9
                  lg:h-10
                  px-3
                  border
                  border-slate-300
                  rounded-lg
                  text-xs
                  lg:text-sm
                  text-slate-700
                  bg-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                  cursor-pointer
                "
              >
                <option value="">
                  Selecione uma filial
                </option>

                <option value="Matriz">
                  Matriz
                </option>

                <option value="Jardim">
                  Jardim
                </option>

                <option value="Aquidauana / Anastácio">
                  Aquidauana / Anastácio
                </option>

                <option value="Nioaque">
                  Nioaque
                </option>

                <option value="Bonito">
                  Bonito
                </option>

                <option value="Dois Irmãos do Buriti">
                  Dois Irmãos do Buriti
                </option>

                <option value="Bodoquena">
                  Bodoquena
                </option>
              </select>
            </div>

            {/* MOTORISTA */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Motorista principal
              </label>

              <select
                value={motorista}
                onChange={(event) =>
                  setMotorista(event.target.value)
                }
                required
                className="
                  w-full
                  h-9
                  lg:h-10
                  px-3
                  border
                  border-slate-300
                  rounded-lg
                  text-xs
                  lg:text-sm
                  text-slate-700
                  bg-white
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                  cursor-pointer
                "
              >
                <option value="">
                  Selecione um motorista
                </option>

                <option value="João">
                  João
                </option>

                <option value="Rafael">
                  Rafael
                </option>

                <option value="Henrique">
                  Henrique
                </option>

                <option value="IVRNET">
                  IVRNET
                </option>
              </select>
            </div>

          </div>

          {/* RODAPÉ */}
          <div
            className="
              flex
              justify-end
              gap-2
              px-5
              py-4
              border-t
              border-slate-200
              bg-slate-50
            "
          >

            <button
              type="button"
              onClick={onFechar}
              className="
                px-3
                lg:px-4
                py-2
                border
                border-slate-300
                rounded-lg
                text-xs
                lg:text-sm
                text-slate-600
                hover:bg-white
                cursor-pointer
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="
                px-3
                lg:px-4
                py-2
                bg-blue-600
                hover:bg-blue-700
                rounded-lg
                text-xs
                lg:text-sm
                text-white
                font-medium
                cursor-pointer
              "
            >
              {veiculo
                ? "Salvar alterações"
                : "Cadastrar veículo"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default BotaoVeiculo;