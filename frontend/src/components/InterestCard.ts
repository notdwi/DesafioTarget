import { api } from '../api/apiClient';
import { formatMoney } from '../utils/formatters';

export const renderInterest = () => {
  return `
    <div class="card">
      <h2>Calculadora de Juros</h2>
      <form id="interest-form">
        <div class="form-group">
          <label>Valor Original (R$)</label>
          <input type="number" step="0.01" id="int-amount" required placeholder="1000.00">
        </div>
        <div class="form-group">
          <label>Data de Vencimento</label>
          <input type="date" id="int-date" required>
        </div>
        <button type="submit">Calcular</button>
      </form>
      <div id="int-result"></div>
    </div>
  `;
};

export const initInterest = () => {
  document.getElementById('interest-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('int-result')!;
    
    const amount = parseFloat((document.getElementById('int-amount') as HTMLInputElement).value);
    const dateStr = (document.getElementById('int-date') as HTMLInputElement).value;
    
    try {
      const data = await api.post('/interest', { amount, dueDate: dateStr });
      
      if (data.lateDays > 0) {
        resultDiv.innerHTML = `
          <div class="result-box">
            <div class="result-title">Atraso: ${data.lateDays} dias</div>
            <div style="margin-top:0.5rem; display:flex; justify-content:space-between">
              <span>Juros:</span>
              <span class="money" style="color:var(--danger)">+ ${formatMoney(data.interest)}</span>
            </div>
            <div style="margin-top:0.5rem; display:flex; justify-content:space-between; font-weight:bold">
              <span>Total:</span>
              <span class="money">${formatMoney(data.totalAmount)}</span>
            </div>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div class="result-box success">
            <div class="result-title">Sem Atraso</div>
            <div class="result-value">${formatMoney(amount)}</div>
          </div>
        `;
      }
    } catch (e) {
      resultDiv.innerHTML = `<div class="result-box error">Erro de conexão</div>`;
    }
  });
};
