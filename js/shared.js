const SHEET_URL = 'https://script.google.com/macros/s/AKfycbywUnQEwRdTXnozlCK1-PJlIlfLKbHYtsy14HQPA9qZFKxcUYU2MaNq4MMnmzH4Qhr7/exec';

export async function loadOrders() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function saveOrder(order) {
  await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(order)
  });
}

export function generateVorgang(orders) {
  const year = new Date().getFullYear();
  const existing = orders
    .map(o => o.vorgang)
    .filter(v => v?.startsWith(`${year}-`))
    .map(v => parseInt(v.split('-')[1]))
    .filter(n => !isNaN(n));
  const next = Math.max(...existing, 0) + 1;
  return `${year}-${String(next).padStart(3, '0')}`;
}
