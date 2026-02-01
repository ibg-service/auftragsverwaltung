import { saveOrder, generateVorgang } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auftrag-form');
  const vorgangFeld = document.getElementById('vorgang');
  const eingangFeld = document.getElementById('eingangsdatum');
  const arbeitenInput = document.getElementById('arbeiten-input');
  const checkboxContainer = document.getElementById('arbeiten-checkboxes');

  // 1. Vorgangsnummer generieren
  vorgangFeld.value = generateVorgang();

  // 2. Eingangsdatum auf heute setzen
  const heute = new Date().toISOString().split('T')[0];
  eingangFeld.value = heute;

  // 3. Text zu Checkboxen – bei Verlassen des Textfelds
  arbeitenInput.addEventListener('blur', () => {
    const zeilen = arbeitenInput.value.split('\n').map(z => z.trim()).filter(z => z);
    checkboxContainer.innerHTML = ''; // Reset
    zeilen.forEach((text, i) => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" name="task_${i}" data-task="${text}"> ${text}`;
      checkboxContainer.appendChild(label);
    });
  });

  // 4. Zeile zur Ersatzteiltabelle hinzufügen
  window.addErsatzteilRow = function() {
    const tbody = document.querySelector('#ersatzteile-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" name="artikelnummer" /></td>
      <td><input type="text" name="bezeichnung" /></td>
      <td><input type="number" name="anzahl" min="1" value="1" /></td>
      <td><button type="button" onclick="this.closest('tr').remove()">🗑</button></td>
    `;
    tbody.appendChild(row);
  };

  // 5. Formular absenden
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 6. Aufgaben aus Checkboxen
    const aufgaben = [];
    checkboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      const aufgabe = {
        task: checkbox.dataset.task,
        completed: checkbox.checked
      };
      aufgaben.push(aufgabe);
    });

    // 7. Ersatzteile aus Tabelle
    const ersatzteile = [];
    document.querySelectorAll('#ersatzteile-table tbody tr').forEach(row => {
      const inputs = row.querySelectorAll('input');
      ersatzteile.push({
        artikelnummer: inputs[0].value,
        bezeichnung: inputs[1].value,
        anzahl: parseInt(inputs[2].value || 0)
      });
    });

    // 8. Kombiniertes Objekt
    const auftrag = {
      ...data,
      vorgang: vorgangFeld.value,
      aufgaben,
      ersatzteile
    };

    // 9. Speichern & Weiterleiten
    await saveOrder(auftrag);
    alert("✅ Auftrag gespeichert!");
    window.location.href = 'liste.html';
  });
});
