import { api } from '../api/apiClient';

export const renderInventory = () => {
  return `
    <div class="card">
      <div class="card-header">
        <h2>Estoque de Produtos</h2>
        <span class="badge">Inventário</span>
      </div>
      <div id="inventory-content">
        <div class="loader"></div>
      </div>
      
      <div style="margin-top: 1.5rem; padding-top: 1.2rem; border-top: 1px solid var(--border);">
        <h3 style="color: var(--text-heading); font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Nova Movimentação</h3>
        <form id="movement-form">
          <div class="form-group">
            <label>Produto</label>
            <select id="mov-product" required>
              <option value="">Carregando produtos...</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
            <div class="form-group">
              <label>Tipo</label>
              <select id="mov-type" required>
                <option value="1">Entrada (+)</option>
                <option value="2">Saída (-)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantidade</label>
              <input type="number" id="mov-qty" min="1" required placeholder="Qtd">
            </div>
          </div>
          <div class="form-group">
            <label>Descrição do Movimento</label>
            <input type="text" id="mov-desc" required placeholder="Ex: Reposição de estoque">
          </div>
          <button type="submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Lançar Movimento
          </button>
        </form>
        <div id="mov-result"></div>
      </div>
    </div>
  `;
};

export const initInventory = async () => {
  await loadInventoryData();
  
  document.getElementById('movement-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('mov-result')!;
    const productSelect = document.getElementById('mov-product') as HTMLSelectElement;
    const typeSelect = document.getElementById('mov-type') as HTMLSelectElement;
    const descInput = document.getElementById('mov-desc') as HTMLInputElement;
    const qtyInput = document.getElementById('mov-qty') as HTMLInputElement;

    const payload = {
      productCode: parseInt(productSelect.value),
      type: parseInt(typeSelect.value),
      description: descInput.value,
      quantity: parseInt(qtyInput.value)
    };

    try {
      const data = await api.post('/inventory/movement', payload);
      if (data.succeeded) {
        resultDiv.innerHTML = `
          <div class="result-box success">
            <div class="title" style="color: var(--success)">Movimentação Realizada</div>
            <div class="value" style="color: var(--success); font-size: 1.05rem;">Estoque Atualizado: ${data.finalStock} unidades</div>
          </div>
        `;
        qtyInput.value = '';
        descInput.value = '';
        await loadInventoryData();
      } else {
        resultDiv.innerHTML = `
          <div class="result-box error">
            <div class="title" style="color: var(--danger)">Operação Não Permitida</div>
            <div class="value" style="color: var(--danger); font-size: 0.95rem;">${data.message}</div>
          </div>
        `;
      }
    } catch (e) {
      resultDiv.innerHTML = `
        <div class="result-box error">
          <div class="title" style="color: var(--danger)">Erro de Comunicação</div>
        </div>
      `;
    }
  });
};

const loadInventoryData = async () => {
  const container = document.getElementById('inventory-content');
  const select = document.getElementById('mov-product') as HTMLSelectElement;
  if (!container) return;

  try {
    const data = await api.get('/inventory');
    let html = `
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Cód</th>
              <th>Descrição</th>
              <th style="text-align: right;">Estoque</th>
            </tr>
          </thead>
          <tbody>
    `;
    let options = `<option value="">Selecione um produto...</option>`;
    
    data.forEach((p: any) => {
      html += `
        <tr>
          <td>#${p.code}</td>
          <td>${p.description}</td>
          <td style="color: var(--primary); font-weight: 800; text-align: right;">${p.stock} un</td>
        </tr>
      `;
      options += `<option value="${p.code}">#${p.code} - ${p.description} (${p.stock} un)</option>`;
    });
    
    container.innerHTML = html + `</tbody></table></div>`;
    if (select) select.innerHTML = options;
  } catch (e) {
    container.innerHTML = `<p style="color: var(--danger)">Não foi possível obter o inventário.</p>`;
  }
};
