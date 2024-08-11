export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    const yyyy = date.getFullYear();
    let m = date.getMonth() + 1; // Months start at 0!
    let d = date.getDate();

    let mm = "";
    let dd = "";

    dd = ((d < 10) ? '0' : '') + d;
    mm = ((m < 10) ? '0' : '') + m;

    return dd + '/' + mm + '/' + yyyy;
}