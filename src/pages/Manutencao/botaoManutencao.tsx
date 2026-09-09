import { X } from "lucide-react";

interface BotaoManutencaoProps {
  onFechar: () => void;
}

function BotaoManutencao({
  onFechar,
}: BotaoManutencaoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-143.75 bg-white rounded-2xl shadow-xl p-8">

        {/* TÍTULO */}
        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Novo Registro de Manutenção
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Registre uma manutenção preventiva ou corretiva executada.
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORMULÁRIO */}
        <div className="mt-6 space-y-4">

          {/* VEÍCULO */}
          <div className="flex flex-col">

            <label className="text-sm font-medium text-slate-700 mb-1">
              Veículo / Placa
            </label>

            <select className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-600 cursor-pointer">

              <option value="">
                Selecione o veículo da frota...
              </option>

              <option value="smj-7a36">
                SMJ-7A36 - Saveiro
              </option>

            </select>

          </div>

          {/* VALOR + MOTORISTA */}
          <div className="grid grid-cols-2 gap-4">

            {/* VALOR */}
            <div className="flex flex-col">

              <label className="text-sm font-medium text-slate-700 mb-1">
                Valor da Manutenção (R$)
              </label>

              <input
                type="number"
                placeholder="R$ 0,00"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>

            {/* MOTORISTA */}
            <div className="flex flex-col">

              <label className="text-sm font-medium text-slate-700 mb-1">
                Motorista
              </label>

              <select className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-600 cursor-pointer">

                <option value="">
                  Motorista solicitante...
                </option>

                <option value="joao">
                  João
                </option>

              </select>

            </div>

          </div>

          {/* OBSERVAÇÃO */}
          <div className="flex flex-col">

            <label className="text-sm font-medium text-slate-700 mb-1">
              Observação
            </label>

            <textarea
              placeholder="Descreva os serviços realizados, peças trocadas e observações adicionais..."
              className="w-full h-27 resize-none border border-slate-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onFechar}
            className="px-5 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            className="px-5 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
          >
            Salvar Registro
          </button>

        </div>

      </div>

    </div>
  );
}

export default BotaoManutencao;