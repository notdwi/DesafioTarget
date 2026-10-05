import { api } from '../api/apiClient';
import { formatMoney } from '../utils/formatters';

export const renderInterest = () => {
  return `
    <div class="card">
      <div class="card-header">
        <h2>Calculadora de Juros</h2>
        <span class="badge">Financeiro</span>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.2rem; line-height: 1.4;">
        Cálculo de multa de 2% + juros por atraso com base na data de vencimento.
      </p>
      <form id="interest-form">
        <div class="form-group">
          <label>Valor Original (R$)</label>
          <input type="number" step="0.01" id="int-amount" required placeholder="Ex: 1500.00" value="1000.00">
        </div>
        <div class="form-group">
          <label>Data de Vencimento</label>
          <input type="date" id="int-date" required>
        </div>
        <button type="submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Calcular Montante
        </button>
      </form>
      <div id="int-result"></div>
    </div>
  `;
};

export const initInterest = () => {
  const dateInput = document.getElementById('int-date') as HTMLInputElement;
  if (dateInput) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 10);
    dateInput.value = yesterday.toISOString().split('T')[0];
  }

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
            <div class="title" style="color: var(--danger)">Status: ${data.lateDays} dia(s) em atraso</div>
            <div style="margin-top: 0.8rem; display: flex; justify-content: space-between; font-size: 0.9rem;">
              <span style="color: var(--text-muted)">Multa + Juros:</span>
              <span style="color: var(--danger); font-weight: 700;">+ ${formatMoney(data.interest)}</span>
            </div>
            <div style="margin-top: 0.4rem; padding-top: 0.6rem; border-top: 1px dashed var(--border); display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 800;">
              <span style="color: var(--text-heading)">Total a Pagar:</span>
              <span style="color: var(--primary)">${formatMoney(data.totalAmount)}</span>
            </div>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div class="result-box success">
            <div class="title" style="color: var(--success)">Em Dia / Sem Atraso</div>
            <div class="value" style="color: var(--success)">${formatMoney(amount)}</div>
          </div>
        `;
      }
    } catch (e) {
      resultDiv.innerHTML = `
        <div class="result-box error">
          <div class="title" style="color: var(--danger)">Erro ao calcular juros</div>
        </div>
      `;
    }
  });
};
