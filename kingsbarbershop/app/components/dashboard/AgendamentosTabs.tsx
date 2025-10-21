// components/AgendamentosTable.tsx
import Table from "@/app/components/ui/Table";
import { useState, useMemo } from "react";

interface Agendamento {
  nome: string;
  telefone: string;
  profissionalNome: string;
  data: string;
  inicio: string;
  fim: string;
  servicoNome: string;
  servicoPreco: number;
  status: string;
}

interface AgendamentosTableProps {
  agendamentos: Agendamento[];
}

// Formata data UTC → DD/MM/YYYY
const formatarDataBrasileira = (dataString: string) => {
  if (!dataString) return "Data inválida";
  const date = new Date(dataString);
  if (isNaN(date.getTime())) return "Data inválida";
  date.setHours(date.getHours() - 3); // Ajusta para UTC-3 (Brasília)
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// Formata horário brasileiro
const formatarHorarioBrasileiro = (inicio?: string, fim?: string) => {
  if (!inicio && !fim) return "Hora indisponível";
  if (!inicio) return `- ${fim}`;
  if (!fim) return `${inicio} -`;
  return `${inicio} - ${fim}`;
};

const AgendamentosTable = ({ agendamentos }: AgendamentosTableProps) => {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [busca, setBusca] = useState("");

  // Filtra os agendamentos
  const agendamentosFiltrados = useMemo(() => {
    let filtrados = agendamentos;

    if (filtroStatus !== "todos") {
      filtrados = filtrados.filter(a => a.status === filtroStatus);
    }

    if (busca) {
      const termo = busca.toLowerCase();
      filtrados = filtrados.filter(a =>
        a.nome.toLowerCase().includes(termo) ||
        a.telefone.includes(termo) ||
        a.profissionalNome.toLowerCase().includes(termo) ||
        a.servicoNome.toLowerCase().includes(termo)
      );
    }

    return filtrados;
  }, [agendamentos, filtroStatus, busca]);

  const columns = [
    {
      header: "Cliente",
      accessor: "nome",
      cell: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {value.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-white">{value}</span>
        </div>
      ),
    },
    {
      header: "Telefone",
      accessor: "telefone",
      cell: (value: string) => (
        <span className="font-mono text-sm text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      header: "Profissional",
      accessor: "profissionalNome",
      cell: (value: string) => (
        <span className="text-gray-200">{value}</span>
      ),
    },
    {
      header: "Data",
      accessor: "data",
      cell: (value: string) => (
        <span className="text-white font-semibold text-sm">
          {formatarDataBrasileira(value)}
        </span>
      ),
    },
    {
      header: "Horário",
      accessor: "inicio",
      cell: (_: string, row: Agendamento) => (
        <span className="font-mono text-amber-300 bg-amber-500/10 px-2 py-1 rounded text-sm">
          {formatarHorarioBrasileiro(row.inicio, row.fim)}
        </span>
      ),
    },
    {
      header: "Serviço",
      accessor: "servicoNome",
      cell: (value: string) => (
        <span className="text-gray-200 bg-gray-700/30 px-3 py-1 rounded-full text-sm">
          {value}
        </span>
      ),
    },
    {
      header: "Valor",
      accessor: "servicoPreco",
      cell: (value: number) => (
        <span className="font-bold text-amber-400 text-lg">
          R$ {value?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value: string) => {
        const map = {
          Cancelado: {
            bg: "bg-red-600/20",
            color: "text-red-300",
            border: "border-red-500/30",
          },
          "Não Compareceu": {
            bg: "bg-yellow-600/20",
            color: "text-yellow-300",
            border: "border-yellow-500/30",
          },
          Agendado: {
            bg: "bg-blue-600/20",
            color: "text-blue-300",
            border: "border-blue-500/30",
          },
          Concluído: {
            bg: "bg-green-600/20",
            color: "text-green-300",
            border: "border-green-500/30",
          },
        }[value] || {
          bg: "bg-gray-700/20",
          color: "text-gray-400",
          border: "border-gray-500/30",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${map.bg} ${map.color} ${map.border}`}
          >
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              📋
            </div>
            <h2 className="text-2xl font-bold text-white">
              Agendamentos
              <span className="ml-2 text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg">
                {agendamentosFiltrados.length}
              </span>
            </h2>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar agendamentos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 w-full lg:w-64"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
            >
              <option value="todos">Todos os status</option>
              <option value="Agendado">Agendados</option>
              <option value="Cancelado">Cancelados</option>
              <option value="Não Compareceu">Não Compareceu</option>
              <option value="Concluído">Concluídos</option>
            </select>
          </div>
        </div>

        {/* Tabela com scroll */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scroll scroll-smooth max-h-[450px]">
          {agendamentosFiltrados.length > 0 ? (
            <Table columns={columns} data={agendamentosFiltrados} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-400">
                {busca || filtroStatus !== "todos"
                  ? "Tente ajustar os filtros ou termos de busca"
                  : "Não há agendamentos no momento"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollbar estilizada */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
        }
      `}</style>
    </div>
  );
};

export default AgendamentosTable;
