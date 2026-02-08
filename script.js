const API = 'https://arbitragem-cripto-backend-production.up.railway.app';

async function loadArbitrage() {
  const res = await fetch(`${API}/arbitragem`);
  const data = await res.json();

  const cards = document.getElementById('cards');
  cards.innerHTML = '';

  if (!data.length) {
    cards.innerHTML = '<p>Nenhuma oportunidade no momento.</p>';
    return;
  }

  data.forEach(op => {
    cards.innerHTML += `
      <div class="card">
        <strong>${op.pair}</strong>
        <div class="row">
          <span>${op.buy} → ${op.sell}</span>
        </div>
        <div class="row">
          <span>Compra</span>
          <span>$${op.buyPrice.toFixed(2)}</span>
        </div>
        <div class="row">
          <span>Venda</span>
          <span>$${op.sellPrice.toFixed(2)}</span>
        </div>
        <div class="row profit">
          <span>Lucro</span>
          <span>${op.profit.toFixed(2)}%</span>
        </div>
      </div>
    `;
  });
}

async function loadHistory() {
  const res = await fetch(`${API}/historico`);
  const data = await res.json();

  const history = document.getElementById('history');
  history.innerHTML = '';

  const labels = [];
  const profits = [];

  data.slice(0, 20).reverse().forEach(op => {
    labels.push(op.time.split('T')[1].slice(0,5));
    profits.push(op.profit);

    history.innerHTML += `
      <div class="card">
        <strong>${op.pair}</strong>
        <div class="row">${op.buy} → ${op.sell}</div>
        <div class="row profit">${op.profit.toFixed(2)}%</div>
      </div>
    `;
  });

  renderChart(labels, profits);
}

let chart;
function renderChart(labels, data) {
  const ctx = document.getElementById('profitChart');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Lucro (%)',
        data,
        borderWidth: 2,
        tension: 0.3
      }]
    }
  });
}

// 🔁 Auto refresh
loadArbitrage();
loadHistory();
setInterval(() => {
  loadArbitrage();
  loadHistory();
}, 30000);
