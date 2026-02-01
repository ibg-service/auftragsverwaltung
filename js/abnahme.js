import { loadOrders, saveOrder } from './shared.js';

let selectedOrder = null;

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch(`https://script.google.com/macros/s/AKfycbywUnQEwRdTXnozlCK1-PJlIlfLKbHYtsy14HQPA9qZFKxcUYU2MaNq4MMnmzH4Qhr7/exec?mode=abnahme`);
  const orders = await res.json();

  const ul = document.getElementById('ready-orders');
  if (!orders.length) {
    ul.innerHTML = '<li>Keine fertigen Aufträge</li>';
    return;
  }

  orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `${order.vorgang} – ${order.customer}`;
    li.style.cursor = 'pointer';
    li.onclick = () => startAbnahme(order);
    ul.appendChild(li);
  });

  document.getElementById('save-abnahme-btn').addEventListener('click', async () => {
    if (!selectedOrder) return;

    selectedOrder.abnahme = {
      pruefer: document.getElementById('abnahme-pruefer').value,
      datum: document.getElementById('abnahme-datum').value,
      anmerkung: document.getElementById('abnahme-anmerkung').value
    };

    await saveOrder(selectedOrder);
    alert('Abnahme gespeichert!');
    location.reload();
  });
});

function startAbnahme(order) {
  selectedOrder = order;
  document.getElementById('abnahme-vorgang').textContent = order.vorgang;
  document.getElementById('form-section').style.display = 'block';
}
