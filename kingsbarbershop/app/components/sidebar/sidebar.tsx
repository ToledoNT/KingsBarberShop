"use client";

import Button from "../../components/ui/Button";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#1B1B1B] p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Admin</h2>
      <Button variant="secondary">Agendamentos</Button>
      <Button variant="secondary">Procedimentos</Button>
      <Button variant="secondary">Valores</Button>
      <Button variant="secondary">Relatórios</Button>
    </aside>
  );
}