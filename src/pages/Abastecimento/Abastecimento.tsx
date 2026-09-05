function Abastecimento() {
  return (
    <div className="flex justify-between items-center ml-10 mr-10 mt-10">
      
      <div>
        <h1 className="text-2xl font-bold">
          Lançamentos de Combustível
        </h1>

        <p className="text-slate-600 text-sm mt-1">
          Controle individual de abastecimentos da frota de veículos
        </p>
      </div>

      <button className="w-32 h-10 text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-500 cursor-pointer mr-15">
        + Novo Registro
      </button>

    </div>
  );
}

export default Abastecimento;