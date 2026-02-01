import { loadOrders } from './shared.js';

let orders = [];

document.addEventListener('DOMContentLoaded', async () => {
  orders = await loadOrders();
  renderTable(orders);

  document.getElementById('filter-vorgang').addEventListener('input', applyFilters);
  document.getElementById('filter-customer').addEventListener('input', applyFilters);
});

function applyFilters() {
  const vorgang = document.getElementById('filter-vorgang').value.toLowerCase();
  const customer = document.getElementById('filter-customer').value.toLowerCase();

  const filtered = orders.filter(o =>
    (!vorgang || o.vorgang?.toLowerCase().includes(vorgang)) &&
    (!customer || o.customer?.toLowerCase().includes(customer))
  );

  renderTable(filtered);
}

function renderTable(data) {
  const body = document.getElementById('orders-body');
  body.innerHTML = '';

  data.forEach(order => {
    const tr = document.createElement('tr');

    const done = order.workTasks?.filter(t => t.completed).length || 0;
    const total = order.workTasks?.length || 0;
    const pct = total ? Math.round((done / total) * 100) : 0;

    tr.innerHTML = `
      <td>${order.vorgang}</td>
      <td>${order.customer}</td>
      <td>${order.subject}</td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${pct}%;"><small>${pct}%</small></div>
        </div>
      </td>
      <td><button onclick="location.href='auftrag.html?vorgang=${order.vorgang}'">Bearbeiten</button></td>
    `;

    body.appendChild(tr);
  });
}
