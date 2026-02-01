import { loadOrders, saveOrder, generateVorgang } from './shared.js';

let vorgang = '';
let existingOrder = null;

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  vorgang = params.get('vorgang');

  const vorgangLabel = document.getElementById('vorgang-label');
  const orders = await loadOrders();

  if (!vorgang) {
    vorgang = generateVorgang(orders);
  } else {
    existingOrder = orders.find(o => o.vorgang === vorgang);
  }

  vorgangLabel.textContent = vorgang;

  if (existingOrder) {
    fillForm(existingOrder);
  }

  document.getElementById('save-btn').addEventListener('click', async () => {
    const data = collectData();
    await saveOrder(data);
    alert('✅ Auftrag gespeichert!');
    location.href = './liste.html';
  });

  document.getElementById('work-todo').addEventListener('input', renderTasks);
});

function fillForm(order) {
  document.getElementById('customer').value = order.customer;
  document.getElementById('subject').value = order.subject;
  document.getElementById('error-description').value = order.errorDescription;
  document.getElementById('work-todo').value = order.workTodo;
  renderTasks();
}

function renderTasks() {
  const container = document.getElementById('tasks-checklist-container');
  container.innerHTML = '';
  const lines = document.getElementById('work-todo').value.split('\n').filter(l => l.trim());

  lines.forEach((task, i) => {
    const div = document.createElement('div');
    div.className = 'task-checkbox-item';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `task-${i}`;
    input.checked = existingOrder?.workTasks?.[i]?.completed || false;

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = task;

    div.appendChild(input);
    div.appendChild(label);
    container.appendChild(div);
  });
}

function collectData() {
  const lines = document.getElementById('work-todo').value.split('\n').filter(l => l.trim());
  const workTasks = lines.map((task, i) => ({
    task: task,
    completed: document.getElementById(`task-${i}`)?.checked || false
  }));

  const allDone = workTasks.every(t => t.completed);

  return {
    vorgang,
    customer: document.getElementById('customer').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    errorDescription: document.getElementById('error-description').value.trim(),
    workTodo: document.getElementById('work-todo').value.trim(),
    workTasks,
    status: {
      alleAufgabenErledigt: allDone
    }
  };
}
