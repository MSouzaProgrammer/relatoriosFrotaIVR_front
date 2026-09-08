import { Filter, Download } from "lucide-react";
import { useState } from "react";



function Abastecimento() {
  return (
    <div className="justify-between ml-10 mr-10 mt-10">
      <div className="flex justify-between ">
        <div>
          <h1 className="text-[27px] text-slate-900 font-bold">
            Lançamentos de Combustível
          </h1>
          <p className="text-slate-600 text-sm font-light">
            Controle individual de abastecimentos da frota de veículos.
          </p>
        </div>
        <button className="w-38 h-10 text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-800 cursor-pointer mr-15">
          + Novo Registro
        </button>
      </div>

      <div className="flex mt-5">
        <div className="flex flex-col">
          <label className="text-slate-500 text-sm mt-1 ml-1 ">FILIAL</label>
          <select className="text-slate-900 border-slate-200 border rounded-md w-50 h-10 mr-8 hover:bg-slate-200 cursor-pointer">
            <option className="text-slate-600" value="matriz">
              Matriz
            </option>
            <option className="text-slate-600" value="jardim">
              Jardim
            </option>
            <option className="text-slate-600" value="aquidauana">
              Aquidauna
            </option>
            <option className="text-slate-600" value="nioaque">
              Nioaque
            </option>
            <option className="text-slate-600" value="bonito">
              Bonito
            </option>
            <option className="text-slate-600" value="doisIrmaos">
              Dois irmãos
            </option>
          </select>
        </div>

        <div className="flex flex-col text-slate-500 text-sm mt-1 border-slate-700 mr-8">
          <label className="ml-1 ">Período</label>
          <input
            type="date"
            name="periodo"
            id="data"
            className="w-50 h-10 px-3 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-slate-200 cursor-pointer"
          />
        </div>

        <div className="flex flex-col text-slate-500 text-sm mt-1 mr-8">
          <label>Abastecimento</label>
          <select className="text-slate-700 border-slate-200 border rounded-md w-50 h-10 hover:bg-slate-200 cursor-pointer">
            <option value="gasolinaNormal">Gasolina normal</option>
            <option value="gasolinaAditivada">Gasolina aditivada</option>
            <option value="diselS10">Disel S10</option>
            <option value="alcool">Alcool</option>
          </select>
        </div>

        <div className="text-slate-700 border-slate-200 border w-35 rounded-md h-10 mt-6 mr-8 hover:bg-slate-200">
          <button className="flex pl-2 pt-2 gap-2 cursor-pointer text-slate-500 text-sm">
            <Filter size={20} strokeWidth={3} />
            Mais Filtros
          </button>
        </div>

        <div className="text-slate-700 border-slate-200 border rounded-md w-35 h-10 mt-6 pl-2.5 hover:bg-slate-200">
          <button className="flex pl-2 pt-2 gap-2 cursor-pointer text-slate-500 text-sm">
            <Download size={20} strokeWidth={3} />
            Exportar
          </button>
        </div>
      </div>

      <div className="border-slate-300 border rounded-md w-full min-h-[calc(100vh-300px)] flex flex-col mt-6">

        {/* Cabeçalho */}
        <div className="grid grid-cols-7 items-center bg-slate-200 h-10 w-full px-4 text-slate-600 text-sm font-medium">
          <span>Placa</span>
          <span>Veículo</span>
          <span>Motorista</span>
          <span>Filial</span>
          <span>Litros</span>
          <span>Data</span>
          <span>Valor pago</span>
        </div>

        {/* Registro */}
        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>

        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200">
          <span className="">SMJ-7A36</span>
          <span>Saveiro</span>
          <span>João</span>
          <span>Matriz</span>
          <span>50 L</span>
          <span>26/08/2026</span>
          <span>R$ 300,00</span>
        </div>
        
      </div>
    </div>
  );
}

export default Abastecimento;
