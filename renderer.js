let data = [];

async function loadData() {
  const res = await fetch('data.json');
  data = await res.json();
}

function formatSteps(steps) {
  const stepsWrapper = document.getElementById('stepsWrapper');
  stepsWrapper.innerHTML = '';
  steps.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `
      <div class="icon">${i + 1}</div>
      <p>${s}</p>
    `;
    stepsWrapper.appendChild(div);
  });
}

function fillTimeline(percent) {
  const timelineDots = document.getElementById('timelineDots');
  timelineDots.innerHTML = '';
  const inner = document.createElement('div');
  inner.style.height = '6px';
  inner.style.background = '#1f2243';
  inner.style.width = percent + '%';
  inner.style.borderRadius = '6px';
  timelineDots.appendChild(inner);
}

function renderHistory(history) {
  const historyBody = document.getElementById('historyBody');
  historyBody.innerHTML = '';
  history.forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${h.datetime}</td><td>${h.status}</td><td>${h.desc}<br/><a href="#" style="font-size:12px;color:#f2b736">Prueba de entrega</a></td><td>${h.location}</td>`;
    historyBody.appendChild(tr);
  });
}

function showResult(item) {
  document.getElementById('notFound').style.display = 'none';
  document.getElementById('searchView').style.display = 'none';
  document.getElementById('resultView').style.display = 'block';

  document.getElementById('statusTitle').textContent = item.status;
  document.getElementById('orderNumber').textContent = item.orderNumber;
  document.getElementById('destCity').innerHTML = `<strong>${item.destination.city}</strong><br/><span style="color:#f2b736">${item.destination.department}</span>`;

  formatSteps(item.steps);

  const lastIndex = item.status === 'Entregado' ? item.steps.length : Math.floor(item.steps.length / 2);
  const percent = Math.round((lastIndex / item.steps.length) * 100);
  fillTimeline(percent);

  renderHistory(item.history);
}

document.getElementById('trackBtn').addEventListener('click', () => {
  const code = (document.getElementById('codeInput').value || '').trim();
  if (!code) return;
  const found = data.find(d => d.code.toLowerCase() === code.toLowerCase());
  if (!found) {
    document.getElementById('notFound').style.display = 'block';
    return;
  }
  showResult(found);
});

document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('codeInput').value = '';
  document.getElementById('searchView').style.display = 'block';
  document.getElementById('resultView').style.display = 'none';
  document.getElementById('notFound').style.display = 'none';
});

document.getElementById('codeInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('trackBtn').click();
});

loadData();
