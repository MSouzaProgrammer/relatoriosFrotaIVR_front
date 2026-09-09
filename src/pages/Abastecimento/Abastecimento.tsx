import { Filter, Download } from "lucide-react";
import { useState } from "react";
import BotaoAbastecimento from "./botaoAbastecimento";

function Abastecimento() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pagina, setPagina] = useState(1);

  const registros = [
    {
      placa: "SMJ-7A36",
      veiculo: "Saveiro",
      motorista: "João",
      filial: "Matriz",
      litros: 50,
      data: "02/09/2026",
      valor: 300,
    },
    {
      placa: "ABC-1234",
      veiculo: "Gol",
      motorista: "Carlos",
      filial: "Jardim",
      litros: 45,
      data: "03/09/2026",
      valor: 270,
    },
    {
      placa: "DEF-5678",
      veiculo: "Strada",
      motorista: "Pedro",
      filial: "Aquidauana",
      litros: 60,
      data: "03/09/2026",
      valor: 360,
    },
    {
      placa: "GHI-9012",
      veiculo: "Saveiro",
      motorista: "Lucas",
      filial: "Nioaque",
      litros: 48,
      data: "04/09/2026",
      valor: 288,
    },
    {
      placa: "JKL-3456",
      veiculo: "Fiorino",
      motorista: "Marcos",
      filial: "Bonito",
      litros: 52,
      data: "04/09/2026",
      valor: 312,
    },
    {
      placa: "MNO-7890",
      veiculo: "Saveiro",
      motorista: "Rafael",
      filial: "Matriz",
      litros: 55,
      data: "05/09/2026",
      valor: 330,
    },
    {
      placa: "PQR-1234",
      veiculo: "Strada",
      motorista: "André",
      filial: "Jardim",
      litros: 42,
      data: "05/09/2026",
      valor: 252,
    },
    {
      placa: "STU-5678",
      veiculo: "Gol",
      motorista: "Felipe",
      filial: "Matriz",
      litros: 50,
      data: "06/09/2026",
      valor: 300,
    },
    {
      placa: "VWX-9012",
      veiculo: "Saveiro",
      motorista: "Bruno",
      filial: "Bonito",
      litros: 47,
      data: "06/09/2026",
      valor: 282,
    },
    {
      placa: "YZA-3456",
      veiculo: "Fiorino",
      motorista: "Gustavo",
      filial: "Nioaque",
      litros: 53,
      data: "07/09/2026",
      valor: 318,
    },
    {
      placa: "BCD-7890",
      veiculo: "Strada",
      motorista: "Thiago",
      filial: "Matriz",
      litros: 49,
      data: "07/09/2026",
      valor: 294,
    },
    {
      placa: "EFG-1234",
      veiculo: "Saveiro",
      motorista: "Daniel",
      filial: "Dois irmãos",
      litros: 51,
      data: "08/09/2026",
      valor: 306,
    },
  ];

  const registrosPorPagina = 11;

  const inicio = (pagina - 1) * registrosPorPagina;

  const registrosExibidos = registros.slice(
    inicio,
    inicio + registrosPorPagina
  );

  const totalPaginas = Math.ceil(
    registros.length / registrosPorPagina
  );

  const totalLitrosPagina = registrosExibidos.reduce(
    (total, registro) => total + registro.litros,
    0
  );

  const totalValorPagina = registrosExibidos.reduce(
    (total, registro) => total + registro.valor,
    0
  );

  return (
    <div className="ml-10 mr-10 mt-10">

      {/* TÍTULO */}
      <div className="flex justify-between">

        <div>
          <h1 className="text-[27px] text-slate-900 font-bold">
            Lançamentos de Combustível
          </h1>

          <p className="text-slate-600 text-sm font-light">
            Controle individual de abastecimentos da frota de veículos.
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="w-38 h-10 text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-800 cursor-pointer mr-15"
        >
          + Novo Registro
        </button>

      </div>

      {/* FILTROS */}
      <div className="flex mt-5">

        {/* FILIAL */}
        <div className="flex flex-col">
          <label className="text-slate-800 text-sm mt-1 ml-1">
            FILIAL
          </label>

          <select className="text-slate-800 border-slate-200 border rounded-md w-50 h-10 mr-8 bg-white hover:bg-slate-100 cursor-pointer">
            <option value="matriz">Matriz</option>
            <option value="jardim">Jardim</option>
            <option value="aquidauana">Aquidauana</option>
            <option value="nioaque">Nioaque</option>
            <option value="bonito">Bonito</option>
            <option value="doisIrmaos">Dois irmãos</option>
          </select>
        </div>

        {/* PERÍODO */}
        <div className="flex flex-col text-slate-800 text-sm mt-1 mr-8">

          <label className="ml-1">
            Período
          </label>

          <input
            type="date"
            name="periodo"
            id="data"
            className="w-50 h-10 px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          />

        </div>

        {/* ABASTECIMENTO */}
        <div className="flex flex-col text-slate-800 text-sm mt-1 mr-8">

          <label>
            Abastecimento
          </label>

          <select className="text-slate-700 border-slate-200 border rounded-md w-50 h-10 bg-white hover:bg-slate-100 cursor-pointer">

            <option value="gasolinaNormal">
              Gasolina normal
            </option>

            <option value="gasolinaAditivada">
              Gasolina aditivada
            </option>

            <option value="dieselS10">
              Diesel S10
            </option>

            <option value="alcool">
              Álcool
            </option>

          </select>

        </div>

        {/* MAIS FILTROS */}
        <div className="text-slate-700 border-slate-200 border w-35 rounded-md h-10 mt-6 mr-8 bg-white hover:bg-slate-100">

          <button className="flex items-center pl-2 h-full gap-2 cursor-pointer text-slate-700 text-sm">
            <Filter size={20} strokeWidth={3} />
            Mais Filtros
          </button>

        </div>

        {/* EXPORTAR */}
        <div className="text-slate-700 border-slate-200 border rounded-md w-35 h-10 mt-6 pl-2.5 bg-white hover:bg-slate-100">

          <button className="flex items-center h-full pl-2 gap-2 cursor-pointer text-slate-700 text-sm">
            <Download size={20} strokeWidth={3} />
            Exportar
          </button>

        </div>

      </div>

      {/* TABELA */}
      <div className="border-slate-300 border rounded-md w-full min-h-[calc(100vh-300px)] flex flex-col mt-6 overflow-hidden">

        {/* CABEÇALHO */}
        <div className="grid grid-cols-7 items-center bg-slate-200 h-10 w-full px-4 text-slate-600 text-sm font-medium">

          <span>Placa</span>
          <span>Veículo</span>
          <span>Motorista</span>
          <span>Filial</span>
          <span>Litros</span>
          <span>Data</span>
          <span>Valor pago</span>

        </div>

        {/* REGISTROS */}
        <div className="flex flex-col">

          {registrosExibidos.map((registro, index) => (

            <div
              key={index}
              className="grid grid-cols-7 items-center h-12 w-full px-4 bg-white text-slate-800 text-sm border-b border-slate-200"
            >

              <span>{registro.placa}</span>

              <span>{registro.veiculo}</span>

              <span>{registro.motorista}</span>

              <span>{registro.filial}</span>

              <span>
                {registro.litros.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                L
              </span>

              <span>{registro.data}</span>

              <span>
                {registro.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>

            </div>

          ))}

        </div>

        {/* TOTAIS DA PÁGINA */}
        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-slate-50 text-slate-800 text-sm font-bold border-t border-b border-slate-200">

          <span>Totais</span>

          <span></span>
          <span></span>
          <span></span>

          <span>
            {totalLitrosPagina.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            L
          </span>

          <span></span>

          <span className="text-blue-600">
            {totalValorPagina.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>

        </div>

        {/* PAGINAÇÃO */}
        <div className="flex items-center justify-between mt-auto px-4 py-3 bg-white">

          <span className="text-sm text-slate-500">

            Exibindo{" "}
            {registros.length === 0 ? 0 : inicio + 1}
            -
            {Math.min(
              inicio + registrosPorPagina,
              registros.length
            )}{" "}
            de {registros.length} registros

          </span>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>

            {Array.from(
              { length: totalPaginas },
              (_, index) => index + 1
            ).map((numeroPagina) => (

              <button
                key={numeroPagina}
                onClick={() => setPagina(numeroPagina)}
                className={`
                  w-8 h-8 rounded-md text-sm cursor-pointer
                  ${
                    pagina === numeroPagina
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                {numeroPagina}
              </button>

            ))}

            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Próximo
            </button>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {modalAberto && (
        <BotaoAbastecimento
          onFechar={() => setModalAberto(false)}
        />
      )}

    </div>
  );
}

export default Abastecimento;