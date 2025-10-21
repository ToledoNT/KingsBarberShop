// // components/dashboard/DashBoardCard.tsx

// export interface DashboardCardProps {
//   title: string;
//   value: string | number;
//   color?: string;
//   icon?: string;
//   max?: number;
//   chart?: React.ReactNode;
//   subTitle?: string; // ✅ Adicionado
//   subMetrics?: Record<string, any>; // ✅ Adicional para múltiplos indicadores
// }

// export default function DashboardCard({
//   title,
//   value,
//   color,
//   icon,
//   max,
//   chart,
//   subTitle,
//   subMetrics,
// }: DashboardCardProps) {
//   return (
//     <div className={`bg-gradient-to-br from-${color}-600 to-${color}-800 rounded-2xl p-6 text-white`}>
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-sm font-medium">{title}</h3>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//           {subTitle && <p className="text-xs mt-1">{subTitle}</p>}
//         </div>
//         {icon && <div className="text-3xl">{icon}</div>}
//       </div>

//       {chart && <div className="mt-4">{chart}</div>}

//       {subMetrics && (
//         <div className="mt-4 space-y-1 text-xs">
//           {Object.entries(subMetrics).map(([k, v]) => (
//             <div key={k} className="flex justify-between">
//               <span>{k}</span>
//               <span className="font-bold">{v}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {max && <div className="mt-2"><div className="w-full bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full ${color}-300`} style={{ width: `${(value as number / max) * 100}%` }}></div></div></div>}
//     </div>
//   );
// }
