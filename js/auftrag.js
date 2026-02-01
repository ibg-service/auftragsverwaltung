// Speichere als auftrag.js
document.getElementById('work-todo').addEventListener('blur', () => {
  const container = document.getElementById('tasks-checklist');
  container.innerHTML = '';
  const lines = document.getElementById('work-todo').value.split('\n').filter(Boolean);
  lines.forEach((line, index) => {
    const div = document.createElement('div');
    div.className = 'task-checkbox-item';
    div.innerHTML = `
      <input type="checkbox" id="task-${index}" />
      <label for="task-${index}">${line}</label>
    `;
    container.appendChild(div);
  });
});

document.getElementById('add-row-btn').addEventListener('click', () => {
  const tbody = document.getElementById('table-body');
  const row = tbody.insertRow();
  row.innerHTML = `
    <td><input type="text" /></td>
    <td><input type="text" /></td>
    <td><input type="number" min="1" /></td>
  `;
});

document.getElementById('save-btn').addEventListener('click', async () => {
  const data = {
    vorgang: document.getElementById('vorgang').value,
    customer: document.getElementById('customer').value,
    subject: document.getElementById('subject').value,
    name: document.getElementById('name').value,
    workTasks: [],
    parts: [],
  };

  const checkboxes = document.querySelectorAll('#tasks-checklist input[type="checkbox"]');
  checkboxes.forEach((cb, index) => {
    const label = document.querySelector(`label[for="task-${index}"]`);
    data.workTasks.push({
      task: label ? label.textContent : '',
      completed: cb.checked,
    });
  });

  const rows = document.querySelectorAll('#table-body tr');
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    if (inputs[0].value || inputs[1].value || inputs[2].value) {
      data.parts.push({
        articleNumber: inputs[0].value,
        description: inputs[1].value,
        quantity: inputs[2].value,
      });
    }
  });

  try {
    const response = await fetch('HIER_IHRE_GOOGLE_SCRIPT_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.result === 'success') {
      alert('✓ Auftrag erfolgreich gespeichert!');
    } else {
      alert('❌ Fehler beim Speichern: ' + result.message);
    }
  } catch (err) {
    console.error(err);
    alert('❌ Fehler beim Speichern: ' + err.message);
  }
});
