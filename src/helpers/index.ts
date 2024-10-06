export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount);
}

export function formatDate(dateStr: string) : string {
    const dateObj = new Date(dateStr)
    const options : Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Intl.DateTimeFormat('es-ES', options).format(dateObj)
}