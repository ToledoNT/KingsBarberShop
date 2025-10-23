export const formatarData = (dataString?: Date) => {
  if (!dataString) return "Data não informada";
  return new Date(dataString).toLocaleDateString("pt-BR");
};

export const formatarValor = (valor?: number) => {
  if (valor === undefined) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getStatusClasses = (status?: string) => {
  switch (status) {
    case "Pago":
      return "bg-green-700 text-white";
    default:
      return "bg-yellow-600 text-black";
  }
};