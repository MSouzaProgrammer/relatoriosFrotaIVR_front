import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  itensPorPagina: number;
  onPaginaChange: (pagina: number) => void;
  nomeRegistro?: string;
}

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  totalRegistros,
  itensPorPagina,
  onPaginaChange,
  nomeRegistro = "registros",
}: PaginacaoProps) {
  if (totalRegistros === 0) {
    return (
      <div className="flex items-center justify-center border-t border-slate-200 px-6 py-4">
        <span className="text-sm text-slate-500">
          Nenhum {nomeRegistro} encontrado
        </span>
      </div>
    );
  }

  const primeiroRegistro =
    (paginaAtual - 1) * itensPorPagina + 1;

  const ultimoRegistro = Math.min(
    paginaAtual * itensPorPagina,
    totalRegistros
  );

  function gerarPaginas() {
    const paginas: (number | string)[] = [];

    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }

      return paginas;
    }

    paginas.push(1);

    if (paginaAtual > 4) {
      paginas.push("...");
    }

    const inicio = Math.max(2, paginaAtual - 1);
    const fim = Math.min(totalPaginas - 1, paginaAtual + 1);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    if (paginaAtual < totalPaginas - 3) {
      paginas.push("...");
    }

    paginas.push(totalPaginas);

    return paginas;
  }

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-500">
        Mostrando{" "}
        <span className="font-semibold text-slate-700">
          {primeiroRegistro}
        </span>{" "}
        até{" "}
        <span className="font-semibold text-slate-700">
          {ultimoRegistro}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-slate-700">
          {totalRegistros}
        </span>{" "}
        {nomeRegistro}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={paginaAtual === 1}
          onClick={() => onPaginaChange(paginaAtual - 1)}
          className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {gerarPaginas().map((pagina, index) => {
            if (pagina === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                >
                  ...
                </span>
              );
            }

            const paginaNumero = pagina as number;

            return (
              <button
                key={paginaNumero}
                type="button"
                onClick={() => onPaginaChange(paginaNumero)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                  paginaAtual === paginaNumero
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                {paginaNumero}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={paginaAtual === totalPaginas}
          onClick={() => onPaginaChange(paginaAtual + 1)}
          className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}