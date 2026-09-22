import { useEffect, useState } from "react";
import api from "../../services/api";
import { UserRound, X } from "lucide-react";

interface Motorista {
  id?: number;
  nome: string;
  cpf: string;
  cnh: string;
  ativo?: boolean;
}

interface BotaoMotoristaProps {
  motorista: Motorista | null;
  onFechar: () => void;
  onSalvo: () => void;
}

export default function BotaoMotorista({
  motorista,
  onFechar,
  onSalvo,
}: BotaoMotoristaProps) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [salvando, setSalvando] = useState(false);

  const editando = motorista !== null;

  useEffect(() => {
    if (motorista) {
      setNome(motorista.nome ?? "");
      setCpf(String(motorista.cpf ?? ""));
      setCnh(String(motorista.cnh ?? ""));
    } else {
      setNome("");
      setCpf("");
      setCnh("");
    }
  }, [motorista]);

  function formatarCPF(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 3) {
      return numeros;
    }

    if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    }

    if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(
        3,
        6
      )}.${numeros.slice(6)}`;
    }

    return `${numeros.slice(0, 3)}.${numeros.slice(
      3,
      6
    )}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
  }

  function formatarCNH(valor: string) {
    return valor.replace(/\D/g, "").slice(0, 11);
  }

  async function salvar() {
    if (!nome.trim()) {
      alert("Informe o nome do motorista.");
      return;
    }

    const cpfNumeros = cpf.replace(/\D/g, "");
    const cnhNumeros = cnh.replace(/\D/g, "");

    if (cpfNumeros.length !== 11) {
      alert("Informe um CPF válido.");
      return;
    }

    if (!cnhNumeros) {
      alert("Informe a CNH.");
      return;
    }

    try {
      setSalvando(true);

      // CPF e CNH permanecem como STRING
      // para preservar zeros à esquerda.
      const payload = {
        nome: nome.trim(),
        cpf: cpfNumeros,
        cnh: cnhNumeros,
      };

      if (editando && motorista?.id) {
        await api(`/motoristas/${motorista.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/motoristas", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      onSalvo();
      onFechar();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar motorista.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                {editando ? "Editar motorista" : "Novo motorista"}
              </h2>

              <p className="text-xs text-slate-500">
                {editando
                  ? "Atualize os dados do motorista."
                  : "Preencha os dados para realizar o cadastro."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* FORMULÁRIO */}
        <div className="space-y-5 p-6">
          {/* NOME */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nome completo
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              disabled={salvando}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* CPF + CNH */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* CPF */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                CPF
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={14}
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                placeholder="000.000.000-00"
                disabled={salvando}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* CNH */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                CNH
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={cnh}
                onChange={(e) => setCnh(formatarCNH(e.target.value))}
                placeholder="Número da CNH"
                disabled={salvando}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : editando
              ? "Salvar alterações"
              : "Cadastrar motorista"}
          </button>
        </div>
      </div>
    </div>
  );
}