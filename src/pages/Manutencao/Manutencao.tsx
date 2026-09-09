import { Filter, Download } from "lucide-react";
import { useState } from "react";
import BotaoManutencao from "./botaoManutencao";

function Manutencao() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pagina, setPagina] = useState(1);

  const registros = [
  {
    placa: "SMJ-7A36",
    veiculo: "Saveiro",
    motorista: "João",
    quantidade: 1,
    data: "02/09/2026",
    descricao: "Troca de óleo",
    valor: 300,
  },
  {
    placa: "ABC-1234",
    veiculo: "Gol",
    motorista: "Carlos",
    quantidade: 2,
    data: "03/09/2026",
    descricao: "Troca de pastilhas",
    valor: 450,
  },
  {
    placa: "DEF-5678",
    veiculo: "Strada",
    motorista: "Pedro",
    quantidade: 1,
    data: "04/09/2026",
    descricao: "Alinhamento",
    valor: 180,
  },
  {
    placa: "GHI-9012",
    veiculo: "Saveiro",
    motorista: "Lucas",
    quantidade: 1,
    data: "05/09/2026",
    descricao: "Troca de filtro de ar",
    valor: 120,
  },
  {
    placa: "JKL-3456",
    veiculo: "Fiorino",
    motorista: "Marcos",
    quantidade: 4,
    data: "06/09/2026",
    descricao: "Troca de pneus",
    valor: 1600,
  },
  {
    placa: "MNO-7890",
    veiculo: "Strada",
    motorista: "Rafael",
    quantidade: 1,
    data: "07/09/2026",
    descricao: "Balanceamento",
    valor: 150,
  },
  {
    placa: "PQR-1234",
    veiculo: "Gol",
    motorista: "André",
    quantidade: 1,
    data: "08/09/2026",
    descricao: "Troca de bateria",
    valor: 580,
  },
  {
    placa: "STU-5678",
    veiculo: "Saveiro",
    motorista: "Felipe",
    quantidade: 2,
    data: "09/09/2026",
    descricao: "Troca de amortecedores",
    valor: 850,
  },
  {
    placa: "VWX-9012",
    veiculo: "Fiorino",
    motorista: "Bruno",
    quantidade: 1,
    data: "10/09/2026",
    descricao: "Revisão preventiva",
    valor: 400,
  },
  {
    placa: "YZA-3456",
    veiculo: "Strada",
    motorista: "Gustavo",
    quantidade: 3,
    data: "11/09/2026",
    descricao: "Troca de correia",
    valor: 720,
  },
  {
    placa: "BCD-7890",
    veiculo: "Saveiro",
    motorista: "Thiago",
    quantidade: 1,
    data: "12/09/2026",
    descricao: "Reparo no sistema de freios",
    valor: 650,
  },
  {
    placa: "EFG-1234",
    veiculo: "Gol",
    motorista: "Daniel",
    quantidade: 2,
    data: "13/09/2026",
    descricao: "Troca de lâmpadas",
    valor: 90,
  },
];

  const registrosPorPagina = 10;

  const inicio = (pagina - 1) * registrosPorPagina;

  const registrosExibidos = registros.slice(
    inicio,
    inicio + registrosPorPagina
  );

  const totalPaginas = Math.ceil(
    registros.length / registrosPorPagina
  );

  const totalQuantidadePagina = registrosExibidos.reduce(
    (total, registro) => total + registro.quantidade,
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
            Controle de Manutenção
          </h1>

          <p className="text-slate-600 text-sm font-light">
            Manutenções preventivas, corretivas e aquisições de peças.
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
            <option value="todas">
              Todas
            </option>

            <option value="matriz">
              Matriz
            </option>

            <option value="jardim">
              Jardim
            </option>

            <option value="aquidauana">
              Aquidauana
            </option>

            <option value="nioaque">
              Nioaque
            </option>

            <option value="bonito">
              Bonito
            </option>

            <option value="doisIrmaos">
              Dois irmãos
            </option>
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
          <span>Quantidade</span>
          <span>Data</span>
          <span>Descrição</span>
          <span>Valor Pago</span>

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

              <span>{registro.quantidade}</span>

              <span>{registro.data}</span>

              <span>{registro.descricao}</span>

              <span>
                {registro.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>

            </div>

          ))}

        </div>

        {/* TOTAIS */}
        <div className="grid grid-cols-7 items-center h-12 w-full px-4 bg-slate-50 text-slate-800 text-sm font-bold border-t border-b border-slate-200">

          <span>Total</span>

          <span></span>

          <span></span>

          <span>
            {totalQuantidadePagina}
          </span>

          <span></span>

          <span></span>

          <span className="text-red-600">
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
        <BotaoManutencao
          onFechar={() => setModalAberto(false)}
        />
      )}

    </div>
  );
}

export default Manutencao;