import { Agendamento, AgendamentosSectionProps } from "@/app/interfaces/agendamentoInterface";
import Table from "../ui/Table";

export default function AgendamentosSection({ agendamentos }: AgendamentosSectionProps) {
  const columns = [
    { header: "Cliente", accessor: "nome" },
    { header: "Barbeiro", accessor: "barbeiro" },
    { header: "Data", accessor: "data" },
    { header: "Hora", accessor: "hora" },
    { header: "Serviço", accessor: "servico" },
  ];

  return (
    <section className="bg-[#1B1B1B] p-6 rounded-xl shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Agendamentos</h2>
      <Table columns={columns} data={agendamentos} />
    </section>
  );
}