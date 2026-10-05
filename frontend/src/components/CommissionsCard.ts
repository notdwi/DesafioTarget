import { api } from '../api/apiClient';
import { formatMoney } from '../utils/formatters';

export const renderCommissions = () => {
  return `
    <div class="card">
      <h2>Comissões</h2>
      <div id="commissions-content">
        <div class="loader"></div>
      </div>
    </div>
  `;
};

export const initCommissions = async () => {
  const container = document.getElementById('commissions-content');
  if (!container) return;

  try {
    const data = await api.get('/commissions');
    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Vendas</th>
            <th>Comissão</th>
          </tr>
        </thead>
        <tbody>
    `;
    data.forEach((c: any) => {
      html += `
        <tr>
          <td>${c.salesperson}</td>
          <td class="money">${formatMoney(c.totalSales)}</td>
          <td class="money" style="color: var(--success);">${formatMoney(c.totalCommission)}</td>
        </tr>
      `;
    });
    container.innerHTML = html + `</tbody></table>`;
  } catch (e) {
    container.innerHTML = `<p style="color: var(--danger)">Erro ao carregar comissões.</p>`;
  }
};
