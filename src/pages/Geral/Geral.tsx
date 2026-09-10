import { Droplet, Circle, Sparkles, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

function Geral() {
  const [limite, setLimite] = useState(3);

  useEffect(() => {
    const atualizarLimite = () => {
      if (window.innerWidth < 640) {
        setLimite(2);
      } else if (window.innerWidth < 1024) {
        setLimite(3);
      } else if (window.innerWidth < 1440) {
        setLimite(2);
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

  const combustivel = [
    {
      filial: "Matriz",
      litros: "784,48 L",
      total: 5241.29,
    }
  ];

  const lavagem = [
    {
      filial: "Matriz",
      quantidade: 4,
      total: 210,
    }
  ];

  const totalLitros = 1645.27;
  const totalCombustivel = 11059.8;

  const totalLavagens = 17;
  const totalLavagem = 1030;

  return (
    <div className="ml-10 mr-10 mt-10 pb-10">
      {/* TÍTULO */}
      <div>
        <h1 className="text-[27px] font-bold text-slate-900">
          Visão Geral da Frota
        </h1>

        <p className="text-slate-600 text-sm font-light mt-1">
          Consolidado de despesas e controle operacional de todas as filiais.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 mt-4">

        {/* COMBUSTÍVEL */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center">
            <Droplet
              size={21}
              strokeWidth={2.5}
              className="text-blue-600"
            />
          </div>

          <div className="min-w-0">

            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL COMBUSTÍVEL
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              R$ 11.059,80
            </p>

          </div>

        </div>

        {/* PNEUS */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Circle
              size={21}
              strokeWidth={2.5}
              className="text-yellow-600"
            />
          </div>

          <div className="min-w-0">

            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL PNEUS
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              R$ 15,00
            </p>

          </div>

        </div>

        {/* LAVAGEM */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-teal-100 flex items-center justify-center">
            <Sparkles
              size={21}
              strokeWidth={2.5}
              className="text-teal-600"
            />
          </div>

          <div className="min-w-0">

            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL LAVAGEM
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              R$ 1.030,00
            </p>

          </div>

        </div>

        {/* MANUTENÇÃO */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 xl:p-4 flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-lg bg-red-100 flex items-center justify-center">
            <Wrench
              size={21}
              strokeWidth={2.5}
              className="text-red-600"
            />
          </div>

          <div className="min-w-0">

            <p className="text-[11px] xl:text-xs font-medium text-slate-500 leading-tight">
              TOTAL MANUTENÇÃO
            </p>

            <p className="text-lg xl:text-xl font-bold text-slate-900 mt-0.5 truncate">
              R$ 0,00
            </p>

          </div>

        </div>

      </div>

      {/* TABELAS */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* COMBUSTÍVEL POR FILIAL */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Despesa Combustível por Filial
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Totalizadores acumulados
              </p>
            </div>

            <Droplet size={20} strokeWidth={2.5} className="text-blue-600" />
          </div>

          <div className="mt-4 overflow-hidden rounded-lg">
            <div className="grid grid-cols-3 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              <span>Filial</span>
              <span className="text-right">Litros</span>
              <span className="text-right">Total</span>
            </div>

            {combustivel.slice(0, limite).map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-4 py-3 text-sm border-b border-slate-200"
              >
                <span className="text-slate-800">{item.filial}</span>

                <span className="text-right text-slate-600">{item.litros}</span>

                <span className="text-right font-semibold text-slate-900">
                  {item.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-3 items-center bg-slate-50 px-4 py-3 text-sm font-bold">
              <span className="text-slate-900">Total</span>

              <span className="text-right text-slate-900">
                {totalLitros.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                L
              </span>

              <span className="text-right text-blue-600">
                {totalCombustivel.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* LAVAGEM POR FILIAL */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Despesa Lavagem por Filial
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Frequência e valores mensais
              </p>
            </div>

            <Sparkles size={20} strokeWidth={2.5} className="text-teal-600" />
          </div>

          <div className="mt-4 overflow-hidden rounded-lg">
            <div className="grid grid-cols-3 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              <span>Filial</span>
              <span className="text-right">Qtd</span>
              <span className="text-right">Total</span>
            </div>

            {lavagem.slice(0, limite).map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-4 py-3 text-sm border-b border-slate-200"
              >
                <span className="text-slate-800">{item.filial}</span>

                <span className="text-right text-slate-600">
                  {item.quantidade}
                </span>

                <span className="text-right font-semibold text-slate-900">
                  {item.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-3 items-center bg-slate-50 px-4 py-3 text-sm font-bold">
              <span className="text-slate-900">Total</span>

              <span className="text-right text-slate-900">{totalLavagens}</span>

              <span className="text-right text-teal-600">
                {totalLavagem.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Geral;
