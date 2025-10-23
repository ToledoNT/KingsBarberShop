// Corrige erro de Fuso Horario
export const formatarDataBR = (isoString: string) => {
  if (!isoString) return "Data inválida";
  const partes = isoString.split("T")[0].split("-");
  if (partes.length !== 3) return "Data inválida";
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
};

/*
  ✅ Formata horário brasileiro — aceita tanto "20:30" quanto "2025-10-20T20:30:00.000Z"
*/
export const formatarHorarioBR = (valor?: string) => {
  if (!valor) return "Hora inválida";

  if (/^\d{2}:\d{2}$/.test(valor)) return valor;

  const data = new Date(valor);
  if (isNaN(data.getTime())) return "Hora inválida";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};