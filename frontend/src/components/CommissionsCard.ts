import { api } from '../api/apiClient';
import { formatMoney } from '../utils/formatters';

export const renderCommissions = () => {
  return `
    <div class="card">
      <div class="card-header">
        <h2>Comissões</h2>
        <span class="badge">Vendedores</span>
      </div>
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
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Total Vendas</th>
              <th style="text-align: right;">Comissão</th>
            </tr>
          </thead>
          <tbody>
    `;
    data.forEach((c: any) => {
      html += `
        <tr>
          <td>${c.salesperson}</td>
          <td>${formatMoney(c.totalSales)}</td>
          <td style="color: var(--success); text-align: right;">${formatMoney(c.totalCommission)}</td>
        </tr>
      `;
    });
    container.innerHTML = html + `</tbody></table></div>`;
  } catch (e) {
    container.innerHTML = `<p style="color: var(--danger)">Não foi possível obter os dados de comissão.</p>`;
  }
};
