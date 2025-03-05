export function formatDateToDMY(date: string): string {
    const parsedDate = new Date(date);
    
    const day = String(parsedDate.getDate()).padStart(2, '0'); // Día con 2 dígitos
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Mes (los meses son 0-indexed, por eso sumamos 1)
    const year = parsedDate.getFullYear(); // Año completo
  
    return `${day}-${month}-${year}`;
  }
  