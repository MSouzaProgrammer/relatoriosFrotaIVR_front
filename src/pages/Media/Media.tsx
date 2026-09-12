import { Filter, Download } from "lucide-react";
import { useEffect, useState } from "react";

function Media() {
  const [pagina, setPagina] = useState(1);

  const registros = [
    {
      placa: "SMG-3J80",
      veiculo: "SAVEIRO ROBUST 2025",
      motorista: "RAFAEL",
      mediaKmL: 6.6,
      mediaGeral: 6.6,
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

  const mediaDaFrota =
    registros.length > 0
      ? registros.reduce(
          (total, registro) => total + registro.mediaKmL,
          0
        ) / registros.length
      : 0;

  const mediaGeral =
    registros.length > 0
      ? registros.reduce(
          (total, registro) => total + registro.mediaGeral,
          0
        ) / registros.length
      : 0;

  const obterCorMedia = (mediaKmL: number) => {
    if (mediaKmL < 6.5) {
      return "bg-red-100 text-red-600";
    }

    if (mediaKmL > 6.8) {
      return "bg-green-100 text-green-600";
    }

    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 mt-6 lg:mt-10 pb-6">

      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl sm:text-[27px] text-slate-900 font-bold">
          Média KM/L da Frota
        </h1>

        <p className="text-slate-600 text-sm font-light mt-1 max-w-3xl">
          Relatório de desempenho e consumo de combustível médio por veículo.
        </p>
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
            type="month"
            name="periodo"
            id="periodo"
            defaultValue="2026-08"
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

        <div className="min-w-212.5">

          {/* CABEÇALHO */}
          <div className="grid grid-cols-5 items-center bg-slate-200 h-10 px-4 text-slate-600 text-sm font-medium">

            <span>Placa</span>
            <span>Veículo</span>
            <span>Motorista</span>
            <span>Média KM/L</span>
            <span>Média Geral</span>

          </div>

          {/* REGISTROS */}
          <div className="flex flex-col">

            {registrosExibidos.map((registro, index) => (

              <div
                key={index}
                className="grid grid-cols-5 items-center h-12 px-4 bg-white text-slate-800 text-sm border-b border-slate-200"
              >

                {/* PLACA */}
                <span className="flex items-center">
                  <span className="bg-slate-200 px-3 py-1 rounded-md font-semibold">
                    {registro.placa}
                  </span>
                </span>

                {/* VEÍCULO */}
                <span className="truncate pr-4">
                  {registro.veiculo}
                </span>

                {/* MOTORISTA */}
                <span className="text-slate-500 truncate pr-4">
                  {registro.motorista}
                </span>

                {/* MÉDIA KM/L */}
                <span>

                  <span
                    className={`inline-flex px-3 py-1 rounded-lg font-semibold ${obterCorMedia(
                      registro.mediaKmL
                    )}`}
                  >
                    {registro.mediaKmL.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    km/l
                  </span>

                </span>

                {/* MÉDIA GERAL */}
                <span className="text-slate-500">
                  {registro.mediaGeral.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  km/l
                </span>

              </div>

            ))}

          </div>

          {/* TOTAL */}
          <div className="grid grid-cols-5 items-center h-12 px-4 bg-slate-50 text-slate-800 text-sm font-bold border-b border-slate-200">

            <span>
              Média da Frota
            </span>

            <span />
            <span />

            <span className="text-blue-600">
              {mediaDaFrota.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              km/l
            </span>

            <span className="text-slate-500">
              {mediaGeral.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              km/l
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

    </div>
  );
}

export default Media;