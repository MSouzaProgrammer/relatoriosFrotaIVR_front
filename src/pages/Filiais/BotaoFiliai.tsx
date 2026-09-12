import { useEffect, useState, type FormEvent } from "react";

import {
  X,
  Building2,
} from "lucide-react";

interface Filial {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
  status: "ATIVA" | "INATIVA";
}

interface BotaoFilialProps {
  filial: Filial | null;
  onFechar: () => void;
  onSalvar: (dados: Omit<Filial, "id">) => void;
}

function BotaoFilial({
  filial,
  onFechar,
  onSalvar,
}: BotaoFilialProps) {

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("MS");
  const [responsavel, setResponsavel] = useState("");
  const [status, setStatus] = useState<
    "ATIVA" | "INATIVA"
  >("ATIVA");

  useEffect(() => {

    if (filial) {

      setNome(filial.nome);
      setCidade(filial.cidade);
      setEstado(filial.estado);
      setResponsavel(filial.responsavel);
      setStatus(filial.status);

    } else {

      setNome("");
      setCidade("");
      setEstado("MS");
      setResponsavel("");
      setStatus("ATIVA");

    }

  }, [filial]);

  function salvar(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    if (
      !nome.trim() ||
      !cidade.trim() ||
      !estado ||
      !responsavel.trim()
    ) {
      return;
    }

    onSalvar({
      nome: nome.trim(),
      cidade: cidade.trim(),
      estado,
      responsavel: responsavel.trim(),
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
          max-w-125
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
                bg-green-100
                flex
                items-center
                justify-center
              "
            >
              <Building2
                size={19}
                className="text-green-600"
              />
            </div>

            <div>

              <h2 className="text-base lg:text-lg font-bold text-slate-900">
                {filial
                  ? "Editar filial"
                  : "Nova filial"}
              </h2>

              <p className="text-[11px] lg:text-xs text-slate-500 mt-0.5">
                {filial
                  ? "Altere as informações da filial."
                  : "Cadastre uma nova filial no sistema."}
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

            {/* NOME */}
            <div>

              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Nome da filial
              </label>

              <input
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Ex: Matriz"
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

            {/* CIDADE + ESTADO */}
            <div className="grid grid-cols-[1fr_90px] gap-3">

              <div>

                <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                  Cidade
                </label>

                <input
                  type="text"
                  value={cidade}
                  onChange={(event) =>
                    setCidade(event.target.value)
                  }
                  placeholder="Ex: Sidrolândia"
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
                  UF
                </label>

                <select
                  value={estado}
                  onChange={(event) =>
                    setEstado(event.target.value)
                  }
                  className="
                    w-full
                    h-9
                    lg:h-10
                    px-2
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
                  <option value="MS">MS</option>
                  <option value="SP">SP</option>
                  <option value="PR">PR</option>
                  <option value="GO">GO</option>
                  <option value="MT">MT</option>
                  <option value="MG">MG</option>
                  <option value="RJ">RJ</option>
                  <option value="SC">SC</option>
                  <option value="RS">RS</option>
                  <option value="BA">BA</option>
                </select>

              </div>

            </div>

            {/* RESPONSÁVEL */}
            <div>

              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Responsável
              </label>

              <input
                type="text"
                value={responsavel}
                onChange={(event) =>
                  setResponsavel(event.target.value)
                }
                placeholder="Nome do responsável"
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

            {/* STATUS */}
            <div>

              <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "ATIVA"
                      | "INATIVA"
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
                <option value="ATIVA">
                  Ativa
                </option>

                <option value="INATIVA">
                  Inativa
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
              {filial
                ? "Salvar alterações"
                : "Cadastrar filial"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default BotaoFilial;