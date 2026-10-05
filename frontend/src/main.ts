import './style.css';
import { renderCommissions, initCommissions } from './components/CommissionsCard';
import { renderInventory, initInventory } from './components/InventoryCard';
import { renderInterest, initInterest } from './components/InterestCard';
import { api } from './api/apiClient';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <aside class="sidebar">
    <div class="sidebar-logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    </div>
    <div class="nav-links">
      <div class="nav-item active" title="Dashboard">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </div>
      <div class="nav-item" title="Comissões">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      </div>
      <div class="nav-item" title="Inventário">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      </div>
      <div class="nav-item" title="Juros">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      </div>
    </div>
  </aside>

  <main class="main-content">
    <header class="top-header">
      <div class="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8f9bba" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Pesquisar relatórios, dados...">
      </div>
      <div class="status-pill" id="system-status">
        <span class="dot"></span>
        <span id="status-text">Conectando...</span>
      </div>
    </header>

    <section class="hero-grid">
      <div class="hero-card">
        <h1>Target Dashboard</h1>
        <p>Monitoramento e gestão integrada de comissões por vendedor, estoque em tempo real e cálculo financeiro de juros.</p>
      </div>
      <div class="stat-box">
        <div class="icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <h3>Total Comissões Pagas</h3>
        <h2 id="stat-commissions">R$ 0,00</h2>
      </div>
    </section>

    <section class="dashboard-grid">
      ${renderCommissions()}
      ${renderInventory()}
      ${renderInterest()}
    </section>
  </main>
`;

initCommissions();
initInventory();
initInterest();

const updateStatusBadge = () => {
  const statusText = document.getElementById('status-text');
  if (statusText) {
    statusText.textContent = api.isMock() ? 'Modo Cloudflare (Online)' : 'API Backend Online';
  }
};

const loadGlobalStats = async () => {
  try {
    const commissions = await api.get('/commissions');
    let totalComm = 0;
    commissions.forEach((c: any) => totalComm += c.totalCommission);
    const fMoney = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    const statElem = document.getElementById('stat-commissions');
    if (statElem) statElem.textContent = fMoney(totalComm);
  } catch(e) {
    console.error(e);
  } finally {
    updateStatusBadge();
  }
};

loadGlobalStats();
