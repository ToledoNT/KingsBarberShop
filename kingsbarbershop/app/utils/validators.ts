export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}
export function trimField(value: string): string {
  return value.trim();
}
export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  } else if (cleaned.length === 11) {
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }

  return value;
};

export const formatarDataBrasileira = (dataString: string) => {
  if (!dataString) return "Data inválida";
  const date = new Date(dataString);
  if (isNaN(date.getTime())) return "Data inválida";
  date.setHours(date.getHours() - 3); // Ajusta para UTC-3 (Brasília)
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const formatarHorarioBrasileiro = (inicio?: string, fim?: string) => {
  if (!inicio && !fim) return "Hora indisponível";
  if (!inicio) return `- ${fim}`;
  if (!fim) return `${inicio} -`;
  return `${inicio} - ${fim}`;
};