import { Filter, Download } from "lucide-react";
import { useEffect, useState } from "react";
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
    }
  ];

   const [limite, setLimite] = useState(3);

  useEffect(() => {
    const atualizarLimite = () => {
      if (window.innerWidth < 640) {
        setLimite(2);
      } else if (window.innerWidth < 1024) {
        setLimite(3);
      } else if (window.innerWidth < 1440) {
        setLimite(3);
      } else if(window.innerWidth < 1601){
        setLimite(5);
      } else {
        setLimite(10);
      }
    };

    atualizarLimite();

    window.addEventListener("resize", atualizarLimite);

    return () => {
      window.removeEventListener("resize", atualizarLimite);
    };
  }, []);
  
  const registrosPorPagina = limite;

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
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 mt-6 lg:mt-10 pb-6">

      {/* TÍTULO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[27px] text-slate-900 font-bold">
            Controle de Manutenção
          </h1>

          <p className="text-slate-600 text-sm font-light mt-1">
            Manutenções preventivas, corretivas e aquisições de peças.
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="
            w-full sm:w-38
            h-10
            shrink-0
            text-white text-sm
            bg-blue-600
            rounded-lg
            hover:bg-blue-800
            cursor-pointer
          "
        >
          + Novo Registro
        </button>

      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap items-end gap-4 mt-5">

        {/* FILIAL */}
        <div className="flex flex-col w-full sm:w-50">

          <label className="text-slate-800 text-sm mb-1 ml-1">
            FILIAL
          </label>

          <select className="w-full h-10 px-2 text-slate-800 border border-slate-200 rounded-md bg-white hover:bg-slate-100 cursor-pointer">

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
        <div className="flex flex-col w-full sm:w-50">

          <label className="text-slate-800 text-sm mb-1 ml-1">
            Período
          </label>

          <input
            type="date"
            name="periodo"
            id="data"
            className="
              w-full
              h-10
              px-3
              border border-slate-200
              rounded-lg
              bg-white
              hover:bg-slate-100
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-500
              cursor-pointer
            "
          />

        </div>

        {/* MAIS FILTROS */}
        <button
          type="button"
          className="
            w-full sm:w-35
            h-10
            flex items-center justify-center
            gap-2
            border border-slate-200
            rounded-md
            bg-white
            text-slate-700
            text-sm
            hover:bg-slate-100
            cursor-pointer
          "
        >
          <Filter size={20} strokeWidth={3} />
          Mais Filtros
        </button>

        {/* EXPORTAR */}
        <button
          type="button"
          className="
            w-full sm:w-35
            h-10
            flex items-center justify-center
            gap-2
            border border-slate-200
            rounded-md
            bg-white
            text-slate-700
            text-sm
            hover:bg-slate-100
            cursor-pointer
          "
        >
          <Download size={20} strokeWidth={3} />
          Exportar
        </button>

      </div>

      {/* TABELA */}
      <div className="mt-6 w-full overflow-x-auto rounded-md border border-slate-300">

        <div className="min-w-237.5">

          {/* CABEÇALHO */}
          <div className="grid grid-cols-7 items-center bg-slate-200 h-10 px-4 text-slate-600 text-sm font-medium">

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
                className="grid grid-cols-7 items-center h-12 px-4 bg-white text-slate-800 text-sm border-b border-slate-200"
              >

                <span className="bg-slate-200 px-3 py-1 w-23.5 rounded-md font-semibold">{registro.placa}</span>

                <span>{registro.veiculo}</span>

                <span>{registro.motorista}</span>

                <span>{registro.quantidade}</span>

                <span>{registro.data}</span>

                <span className="truncate pr-4">
                  {registro.descricao}
                </span>

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
          <div className="grid grid-cols-7 items-center h-12 px-4 bg-slate-50 text-slate-800 text-sm font-bold border-b border-slate-200">

            <span>Total</span>

            <span />
            <span />

            <span>
              {totalQuantidadePagina}
            </span>

            <span />
            <span />

            <span className="text-red-600">
              {totalValorPagina.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>

          </div>

          {/* PAGINAÇÃO */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white">

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

            <div className="flex items-center gap-2 flex-wrap">

              <button
                onClick={() => setPagina(pagina - 1)}
                disabled={pagina === 1}
                className="
                  px-3 py-1.5
                  text-sm
                  border border-slate-300
                  rounded-md
                  text-slate-600
                  hover:bg-slate-100
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
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
                    w-8 h-8
                    rounded-md
                    text-sm
                    cursor-pointer
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
                className="
                  px-3 py-1.5
                  text-sm
                  border border-slate-300
                  rounded-md
                  text-slate-600
                  hover:bg-slate-100
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
              >
                Próximo
              </button>

            </div>

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