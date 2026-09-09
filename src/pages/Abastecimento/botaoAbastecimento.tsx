import { X } from "lucide-react";

interface BotaoAbastecimentoProps {
  onFechar: () => void;
}

function BotaoAbastecimento({
  onFechar,
}: BotaoAbastecimentoProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center bg-black/40">

      <div className="w-137.5 bg-white rounded-2xl shadow-xl p-8">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Novo Registro de Combustível
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Insira os dados do abastecimento realizado para o veículo.
            </p>
          </div>

          <button
            onClick={onFechar}
            className="text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X size={20} />
          </button>

        </div>

        <div className="mt-6 space-y-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">
              Placa / Veículo
            </label>

            <select className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-600 cursor-pointer">
              <option>
                Selecione um veículo da frota...
              </option>

              <option>
                SMJ-7A36 - Saveiro
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">
              Motorista
            </label>

            <select className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-600 cursor-pointer">
              <option>
                Selecione o motorista responsável...
              </option>

              <option>
                João
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-1">
                Quantidade abastecida (L)
              </label>

              <input
                type="number"
                placeholder="0,00"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-1">
                Valor Total (R$)
              </label>

              <input
                type="number"
                placeholder="0,00"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">
              KM Atual
            </label>

            <input
              type="number"
              placeholder="Ex: 145230"
              className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onFechar}
            className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            className="px-5 py-2 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700 cursor-pointer"
          >
            Salvar Lançamento
          </button>

        </div>

      </div>

    </div>
  );
}

export default BotaoAbastecimento;