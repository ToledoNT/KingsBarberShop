"use client";

import { TableProps } from "@/app/interfaces/agendamentoInterface";

export default function Table({ columns, data }: TableProps) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="bg-[#0D0D0D]">
          {columns.map(col => (
            <th key={col.accessor} className="p-3 border-b border-[#333]">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-[#1A1A1A]">
            {columns.map(col => (
              <td key={col.accessor} className="p-3 border-b border-[#333]">{row[col.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}