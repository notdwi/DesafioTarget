import './style.css';
import logoUrl from './assets/logo.svg';
import { api } from './api/apiClient';
import { formatMoney } from './utils/formatters';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Navigation State
type ViewType = 'overview' | 'commercial' | 'logistics' | 'financial';

// Cached Data
let cachedCommissions: any[] = [];
let cachedInventory: any[] = [];

app.innerHTML = `
  <aside class="sidebar">
    <div class="sidebar-logo-icon" data-view="overview" title="Target Sistemas">
      <img src="${logoUrl}" alt="Target Sistemas Logo" />
    </div>
    <div class="nav-links">
      <div class="nav-item active" data-view="overview" title="Visão Geral">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </div>
      <div class="nav-item" data-view="commercial" title="Comercial (Comissões)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      </div>
      <div class="nav-item" data-view="logistics" title="Logística (Estoque)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      </div>
      <div class="nav-item" data-view="financial" title="Fiscal / Financeiro">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      </div>
    </div>
  </aside>

  <main class="main-content">
    <div class="page-wrapper">
      
      <!-- Top Navbar with Target Branding & Interactive Category Pills -->
      <header class="top-navbar">
        <div class="brand-header">
          <img src="${logoUrl}" alt="Target Sistemas" class="brand-logo-img" />
          <div class="brand-divider"></div>
          <span class="brand-title">ERP & Gestão de Distribuição</span>
        </div>
        
        <nav class="filter-pills">
          <button class="pill-btn active" data-view="overview">gestão</button>
          <button class="pill-btn" data-view="commercial">comercial</button>
          <button class="pill-btn" data-view="logistics">logística</button>
          <button class="pill-btn" data-view="financial">fiscal / financeiro</button>
        </nav>
      </header>

      <!-- KPI Overview Bar -->
      <section class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div class="kpi-info">
            <h4>Total Comissões</h4>
            <h2 id="kpi-commissions">...</h2>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          </div>
          <div class="kpi-info">
            <h4>Itens em Estoque</h4>
            <h2 id="kpi-stock-count">...</h2>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="kpi-info">
            <h4>Taxa de Juros por Atraso</h4>
            <h2>2,5% ao dia</h2>
          </div>
        </div>
      </section>

      <!-- VIEW 1: OVERVIEW / GESTÃO -->
      <div id="view-overview" class="view-section active">
        <section class="target-hero" style="margin-bottom: 1.5rem;">
          <div class="hero-text">
            <span class="hero-tag">Tecnologia Especialista</span>
            <h1>Gestão que sustenta.<br>Decisão que projeta.</h1>
            <p>Soluções integradas de inteligência comercial, controle de inventário em tempo real e regras financeiras seguras.</p>
          </div>
        </section>

        <div class="overview-grid">
          <!-- Left: Summary Commissions -->
          <div class="target-card">
            <div class="card-header-clean">
              <div class="card-title-group">
                <h3>Comissões de Vendas</h3>
                <p>Resumo de apuração por equipe</p>
              </div>
              <span class="card-badge">Comercial</span>
            </div>
            <div id="overview-commissions-table">
              <div class="loader"></div>
            </div>
          </div>

          <!-- Right: Summary Inventory -->
          <div class="target-card">
            <div class="card-header-clean">
              <div class="card-title-group">
                <h3>Estoque Atual</h3>
                <p>Posição consolidada de itens</p>
              </div>
              <span class="card-badge">Logística</span>
            </div>
            <div id="overview-inventory-table">
              <div class="loader"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: COMERCIAL / COMISSÕES -->
      <div id="view-commercial" class="view-section">
        <div class="target-card">
          <div class="card-header-clean">
            <div class="card-title-group">
              <h3>Painel Comercial de Comissões</h3>
              <p>Cálculo progressivo automático por faixa de faturamento individual</p>
            </div>
            <span class="card-badge">Módulo Comercial</span>
          </div>

          <div style="margin-bottom: 1.2rem; display: flex; gap: 1rem;">
            <input type="text" id="salesperson-search" placeholder="🔍 Filtrar por nome do vendedor..." style="max-width: 350px;">
          </div>

          <div id="commercial-full-table">
            <div class="loader"></div>
          </div>
        </div>
      </div>

      <!-- VIEW 3: LOGÍSTICA / ESTOQUE -->
      <div id="view-logistics" class="view-section">
        <div class="overview-grid">
          <!-- Inventory List -->
          <div class="target-card">
            <div class="card-header-clean">
              <div class="card-title-group">
                <h3>Inventário de Produtos</h3>
                <p>Consulta de saldo e disponibilidade</p>
              </div>
              <span class="card-badge">Estoque</span>
            </div>
            <div id="logistics-full-table">
              <div class="loader"></div>
            </div>
          </div>

          <!-- Movement Form -->
          <div class="target-card">
            <div class="card-header-clean">
              <div class="card-title-group">
                <h3>Lançar Movimentação</h3>
                <p>Entrada de reposição ou saída de mercadoria</p>
              </div>
              <span class="card-badge">Operacional</span>
            </div>

            <form id="stock-form">
              <div class="form-group">
                <label>Produto</label>
                <select id="stock-product-select" required>
                  <option value="">Selecione o produto...</option>
                </select>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Tipo de Operação</label>
                  <select id="stock-type-select" required>
                    <option value="1">Entrada (+)</option>
                    <option value="2">Saída (-)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Quantidade</label>
                  <input type="number" id="stock-qty-input" min="1" required placeholder="Ex: 10">
                </div>
              </div>
              <div class="form-group">
                <label>Descrição / Justificativa</label>
                <input type="text" id="stock-desc-input" required placeholder="Ex: Compra NF 1042">
              </div>
              <button type="submit" class="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Confirmar Movimento
              </button>
            </form>
            <div id="stock-result-box"></div>
          </div>
        </div>
      </div>

      <!-- VIEW 4: FISCAL / FINANCEIRO (JUROS) -->
      <div id="view-financial" class="view-section">
        <div class="overview-grid">
          <div class="target-card">
            <div class="card-header-clean">
              <div class="card-title-group">
                <h3>Calculadora de Juros e Multas</h3>
                <p>Simulação e cálculo diário conforme data de vencimento</p>
              </div>
              <span class="card-badge">Financeiro</span>
            </div>

            <form id="interest-calculator-form">
              <div class="form-group">
                <label>Valor Original do Boleto / Título (R$)</label>
                <input type="number" step="0.01" id="fin-amount" required placeholder="1000.00" value="1000.00">
              </div>
              <div class="form-group">
                <label>Data de Vencimento</label>
                <input type="date" id="fin-due-date" required>
              </div>
              <button type="submit" class="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Calcular Débito
              </button>
            </form>
            <div id="fin-result-box"></div>
          </div>

          <div class="target-card">
            <div class="card-header-clean">
              <div class="card-title-group">
                <h3>Regras Financeiras Aplicadas</h3>
                <p>Parâmetros do sistema</p>
              </div>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-dark); line-height: 1.6;">
              <p style="margin-bottom: 0.8rem;">
                📌 <strong>Multa e Juros por Atraso:</strong><br>
                Aplicação de taxa de <strong>2,5% ao dia</strong> sobre o montante original com base no atraso em dias corridos calculados a partir da data de vencimento.
              </p>
              <p style="margin-bottom: 0.8rem;">
                📌 <strong>Títulos em Dia:</strong><br>
                Pagamentos realizados até a data limite não sofrem encargos ou taxas adicionais.
              </p>
              <p>
                📌 <strong>Auditoria e Integridade:</strong><br>
                Todos os cálculos são computados com precisão monetária de alta integridade (padrão BRL).
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
`;

// Navigation Switcher Function
const switchView = (view: ViewType) => {
  
  // Update sidebar active icons
  document.querySelectorAll('.sidebar .nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-view') === view);
  });

  // Update top pills active state
  document.querySelectorAll('.filter-pills .pill-btn').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-view') === view);
  });

  // Update view visibility
  document.querySelectorAll('.view-section').forEach(el => {
    el.classList.toggle('active', el.id === `view-${view}`);
  });
};

// Bind Navigation Events
document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', () => {
    const target = el.getAttribute('data-view') as ViewType;
    if (target) switchView(target);
  });
});

// Load & Render Data
const loadAllData = async () => {
  try {
    const [commissions, inventory] = await Promise.all([
      api.get('/commissions'),
      api.get('/inventory')
    ]);

    cachedCommissions = commissions;
    cachedInventory = inventory;

    renderCommissionsTables();
    renderInventoryTables();
    updateKPIs();
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

const updateKPIs = () => {
  let totalComm = 0;
  cachedCommissions.forEach(c => totalComm += c.totalCommission);
  
  let totalStock = 0;
  cachedInventory.forEach(i => totalStock += i.stock);

  const kpiComm = document.getElementById('kpi-commissions');
  const kpiStock = document.getElementById('kpi-stock-count');

  if (kpiComm) kpiComm.textContent = formatMoney(totalComm);
  if (kpiStock) kpiStock.textContent = `${totalStock} unidades`;
};

const renderCommissionsTables = () => {
  const overviewContainer = document.getElementById('overview-commissions-table');
  const fullContainer = document.getElementById('commercial-full-table');

  const getTableHtml = (data: any[]) => `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Vendas Realizadas</th>
            <th style="text-align: right;">Comissão Devida</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(c => `
            <tr>
              <td><strong>${c.salesperson}</strong></td>
              <td>${formatMoney(c.totalSales)}</td>
              <td style="color: var(--brand-red); font-weight: 800; text-align: right;">${formatMoney(c.totalCommission)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  if (overviewContainer) overviewContainer.innerHTML = getTableHtml(cachedCommissions);
  if (fullContainer) fullContainer.innerHTML = getTableHtml(cachedCommissions);
};

const renderInventoryTables = () => {
  const overviewContainer = document.getElementById('overview-inventory-table');
  const fullContainer = document.getElementById('logistics-full-table');
  const select = document.getElementById('stock-product-select') as HTMLSelectElement;

  const getTableHtml = (data: any[]) => `
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Cód</th>
            <th>Produto</th>
            <th style="text-align: right;">Estoque Atual</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(i => `
            <tr>
              <td>#${i.code}</td>
              <td>${i.description}</td>
              <td style="text-align: right;">
                <span class="stock-tag ${i.stock < 20 ? 'low' : 'ok'}">${i.stock} unidades</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  if (overviewContainer) overviewContainer.innerHTML = getTableHtml(cachedInventory);
  if (fullContainer) fullContainer.innerHTML = getTableHtml(cachedInventory);

  if (select) {
    select.innerHTML = `<option value="">Selecione o produto...</option>` +
      cachedInventory.map(i => `<option value="${i.code}">#${i.code} - ${i.description} (${i.stock} unidades)</option>`).join('');
  }
};

// Search Filter in Commercial View
document.getElementById('salesperson-search')?.addEventListener('input', (e) => {
  const query = (e.target as HTMLInputElement).value.toLowerCase();
  const filtered = cachedCommissions.filter(c => c.salesperson.toLowerCase().includes(query));
  const fullContainer = document.getElementById('commercial-full-table');
  if (fullContainer) {
    fullContainer.innerHTML = `
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Vendas Realizadas</th>
              <th style="text-align: right;">Comissão Devida</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length > 0 ? filtered.map(c => `
              <tr>
                <td><strong>${c.salesperson}</strong></td>
                <td>${formatMoney(c.totalSales)}</td>
                <td style="color: var(--brand-red); font-weight: 800; text-align: right;">${formatMoney(c.totalCommission)}</td>
              </tr>
            `).join('') : '<tr><td colspan="3" style="text-align:center; padding: 1.5rem;">Nenhum vendedor encontrado.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }
});

// Stock Movement Form Submission
document.getElementById('stock-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const productSelect = document.getElementById('stock-product-select') as HTMLSelectElement;
  const typeSelect = document.getElementById('stock-type-select') as HTMLSelectElement;
  const qtyInput = document.getElementById('stock-qty-input') as HTMLInputElement;
  const descInput = document.getElementById('stock-desc-input') as HTMLInputElement;
  const resultDiv = document.getElementById('stock-result-box')!;

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
        <div class="result-card success">
          <strong style="color: var(--success);">✓ Movimentação Concluída</strong>
          <p style="font-size: 0.9rem; margin-top: 0.2rem;">Saldo final atualizado: <strong>${data.finalStock} unidades</strong></p>
        </div>
      `;
      qtyInput.value = '';
      descInput.value = '';
      
      // Refresh inventory
      cachedInventory = await api.get('/inventory');
      renderInventoryTables();
      updateKPIs();
    } else {
      resultDiv.innerHTML = `
        <div class="result-card error">
          <strong style="color: var(--danger);">✕ Não foi possível processar</strong>
          <p style="font-size: 0.9rem; margin-top: 0.2rem;">${data.message}</p>
        </div>
      `;
    }
  } catch (err) {
    resultDiv.innerHTML = `
      <div class="result-card error">
        <strong style="color: var(--danger);">✕ Erro de comunicação</strong>
      </div>
    `;
  }
});

// Interest Calculator Form Submission
const initInterestForm = () => {
  const dateInput = document.getElementById('fin-due-date') as HTMLInputElement;
  if (dateInput) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    dateInput.value = pastDate.toISOString().split('T')[0];
  }

  document.getElementById('interest-calculator-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amountInput = document.getElementById('fin-amount') as HTMLInputElement;
    const dateInput = document.getElementById('fin-due-date') as HTMLInputElement;
    const resultDiv = document.getElementById('fin-result-box')!;

    const amount = parseFloat(amountInput.value);
    const dueDate = dateInput.value;

    try {
      const data = await api.post('/interest', { amount, dueDate });
      if (data.lateDays > 0) {
        resultDiv.innerHTML = `
          <div class="result-card" style="border-left: 4px solid var(--brand-red);">
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Dias em Atraso:</span>
              <strong style="color: var(--danger);">${data.lateDays} dias</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Total de Encargos (2,5% ao dia):</span>
              <strong style="color: var(--danger);">+ ${formatMoney(data.interest)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top: 0.6rem; border-top: 1px dashed var(--border-color); font-size: 1.1rem;">
              <strong>Total a Pagar:</strong>
              <strong style="color: var(--brand-red);">${formatMoney(data.totalAmount)}</strong>
            </div>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div class="result-card success">
            <strong style="color: var(--success);">✓ Pagamento em Dia</strong>
            <p style="font-size: 0.9rem; margin-top: 0.2rem;">Sem incidência de encargos. Valor a pagar: <strong>${formatMoney(amount)}</strong></p>
          </div>
        `;
      }
    } catch (err) {
      resultDiv.innerHTML = `
        <div class="result-card error">
          <strong style="color: var(--danger);">✕ Erro ao calcular juros</strong>
        </div>
      `;
    }
  });
};

initInterestForm();
loadAllData();
