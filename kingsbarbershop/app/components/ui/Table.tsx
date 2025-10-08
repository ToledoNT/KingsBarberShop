"use client";
import { TableProps } from "@/app/interfaces/agendamentoInterface";

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#333]">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-[#141414]">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="p-3 border-b border-[#333] text-gray-300 font-semibold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-[#1F1F1F] transition-colors duration-200"
            >
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="p-3 border-b border-[#333] text-gray-200"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}