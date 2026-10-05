import { api } from '../api/apiClient';

export const renderInventory = () => {
  return `
    <div class="card">
      <h2>Estoque</h2>
      <div id="inventory-content">
        <div class="loader"></div>
      </div>
      <hr style="border:0; border-top:1px solid #e9edf7; margin: 1.5rem 0;">
      <h3 style="color: var(--text-heading); font-size:1.1rem; margin-bottom:1rem">Nova Movimentação</h3>
      <form id="movement-form">
        <div class="form-group">
          <label>Produto</label>
          <select id="mov-product" required></select>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select id="mov-type" required>
            <option value="1">Entrada</option>
            <option value="2">Saída</option>
          </select>
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <input type="text" id="mov-desc" required placeholder="Ex: Compra de lote">
        </div>
        <div class="form-group">
          <label>Quantidade</label>
          <input type="number" id="mov-qty" min="1" required placeholder="Ex: 10">
        </div>
        <button type="submit">Processar Movimentação</button>
      </form>
      <div id="mov-result"></div>
    </div>
  `;
};

export const initInventory = async () => {
  await loadInventoryData();
  
  document.getElementById('movement-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('mov-result')!;
    
    const payload = {
      productCode: parseInt((document.getElementById('mov-product') as HTMLSelectElement).value),
      type: parseInt((document.getElementById('mov-type') as HTMLSelectElement).value),
      description: (document.getElementById('mov-desc') as HTMLInputElement).value,
      quantity: parseInt((document.getElementById('mov-qty') as HTMLInputElement).value)
    };

    try {
      const data = await api.post('/inventory/movement', payload);
      if (data.succeeded) {
        resultDiv.innerHTML = `
          <div class="result-box">
            <div class="title" style="color: #2dce89">Sucesso</div>
            <div class="value" style="color: #2dce89">Estoque Final: ${data.finalStock}</div>
          </div>
        `;
        await loadInventoryData();
      } else {
        resultDiv.innerHTML = `
          <div class="result-box">
            <div class="title" style="color: #f5365c">Erro</div>
            <div class="value" style="color: #f5365c; font-size: 1rem">${data.message}</div>
          </div>
        `;
      }
    } catch (e) {
      resultDiv.innerHTML = `<div class="result-box"><div class="title" style="color:#f5365c">Erro de conexão</div></div>`;
    }
  });
};

const loadInventoryData = async () => {
  const container = document.getElementById('inventory-content');
  const select = document.getElementById('mov-product') as HTMLSelectElement;
  if (!container || !select) return;

  try {
    const data = await api.get('/inventory');
    let html = `
      <table>
        <thead>
          <tr>
            <th>Cód</th>
            <th>Produto</th>
            <th>Qtd</th>
          </tr>
        </thead>
        <tbody>
    `;
    let options = `<option value="">Selecione...</option>`;
    
    data.forEach((p: any) => {
      html += `<tr><td>${p.code}</td><td>${p.description}</td><td style="color:var(--primary)">${p.stock}</td></tr>`;
      options += `<option value="${p.code}">${p.description}</option>`;
    });
    
    container.innerHTML = html + `</tbody></table>`;
    select.innerHTML = options;
  } catch (e) {
    container.innerHTML = `<p style="color: #f5365c">Erro ao carregar estoque.</p>`;
  }
};
