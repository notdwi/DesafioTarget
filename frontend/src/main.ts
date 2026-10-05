import './style.css';
import { renderCommissions, initCommissions } from './components/CommissionsCard';
import { renderInventory, initInventory } from './components/InventoryCard';
import { renderInterest, initInterest } from './components/InterestCard';
import { api } from './api/apiClient';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span style="font-size:1.8rem">Target Dashboard</span>
    </div>
    <div class="nav-item active">Dashboards</div>
    <div class="nav-item">Comissões</div>
    <div class="nav-item">Estoque</div>
    <div class="nav-item">Calculadora Juros</div>
  </aside>

  <main class="main-content">
    <div class="header-bg">
      <h2 style="color:white; font-weight:600">Visão Geral</h2>
    </div>

    <!-- Top Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div>
          <div class="stat-title">Total Vendas</div>
          <div class="stat-value" id="stat-sales">...</div>
        </div>
        <div class="stat-icon icon-danger">📈</div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-title">Itens no Estoque</div>
          <div class="stat-value" id="stat-products">...</div>
        </div>
        <div class="stat-icon icon-info">📦</div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-title">Comissões Pagas</div>
          <div class="stat-value" id="stat-commissions">...</div>
        </div>
        <div class="stat-icon icon-success">💰</div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-title">Status API</div>
          <div class="stat-value" style="color:var(--success)">Online</div>
        </div>
        <div class="stat-icon icon-primary">🚀</div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dashboard-grid">
      ${renderCommissions()}
      ${renderInventory()}
      ${renderInterest()}
    </div>
  </main>
`;

initCommissions();
initInventory();
initInterest();

const loadGlobalStats = async () => {
  try {
    const [commissions, inventory] = await Promise.all([
      api.get('/commissions'),
      api.get('/inventory')
    ]);
    
    let totalSales = 0;
    let totalComm = 0;
    commissions.forEach((c: any) => {
      totalSales += c.totalSales;
      totalComm += c.totalCommission;
    });

    let totalStock = 0;
    inventory.forEach((p: any) => {
      totalStock += p.stock;
    });

    const fMoney = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    document.getElementById('stat-sales')!.textContent = fMoney(totalSales);
    document.getElementById('stat-commissions')!.textContent = fMoney(totalComm);
    document.getElementById('stat-products')!.textContent = totalStock.toString();
  } catch(e) {
    console.error(e);
  }
};

loadGlobalStats();
