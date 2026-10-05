import './style.css';
import { renderCommissions, initCommissions } from './components/CommissionsCard';
import { renderInventory, initInventory } from './components/InventoryCard';
import { renderInterest, initInterest } from './components/InterestCard';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <header>
    <h1><span>❖</span> Target Dashboard</h1>
  </header>
  
  <div class="dashboard-grid">
    ${renderCommissions()}
    ${renderInventory()}
    ${renderInterest()}
  </div>
`;

// Initialize dynamic behavior
initCommissions();
initInventory();
initInterest();
