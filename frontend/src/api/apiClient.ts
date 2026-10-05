const API_URL = 'http://localhost:5068/api';

// Mock state for Cloudflare Pages / Offline fallback
let mockInventory = [
  { code: 101, description: 'Notebook Dell XPS 13', stock: 15 },
  { code: 102, description: 'Monitor UltraWide 29"', stock: 24 },
  { code: 103, description: 'Teclado Mecânico RGB', stock: 42 },
  { code: 104, description: 'Mouse Sem Fio Ergonômico', stock: 38 },
  { code: 105, description: 'Headset Pro Noise Cancelling', stock: 19 }
];

const mockCommissions = [
  { salesperson: 'Carlos Silva', totalSales: 48500.00, totalCommission: 4850.00 },
  { salesperson: 'Ana Paula Souza', totalSales: 62300.00, totalCommission: 6230.00 },
  { salesperson: 'Mariana Costa', totalSales: 35900.00, totalCommission: 3590.00 },
  { salesperson: 'Roberto Albuquerque', totalSales: 51200.00, totalCommission: 5120.00 }
];

let isUsingMock = false;

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 2000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const api = {
  isMock: () => isUsingMock,

  get: async (endpoint: string) => {
    try {
      const res = await fetchWithTimeout(`${API_URL}${endpoint}`);
      if (!res.ok) throw new Error('API Error');
      isUsingMock = false;
      return await res.json();
    } catch (e) {
      isUsingMock = true;
      if (endpoint === '/commissions') {
        return mockCommissions;
      }
      if (endpoint === '/inventory') {
        return [...mockInventory];
      }
      throw e;
    }
  },

  post: async (endpoint: string, body: any) => {
    try {
      const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('API Error');
      isUsingMock = false;
      return await res.json();
    } catch (e) {
      isUsingMock = true;
      if (endpoint === '/inventory/movement') {
        const item = mockInventory.find(i => i.code === body.productCode);
        if (!item) return { succeeded: false, message: 'Produto não encontrado' };
        
        if (body.type === 2 && item.stock < body.quantity) {
          return { succeeded: false, message: 'Estoque insuficiente para esta saída.' };
        }
        
        if (body.type === 1) item.stock += body.quantity;
        else if (body.type === 2) item.stock -= body.quantity;

        return { succeeded: true, finalStock: item.stock, message: 'Movimentação realizada com sucesso.' };
      }

      if (endpoint === '/interest') {
        const amount = Number(body.amount);
        const due = new Date(body.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - due.getTime();
        const lateDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

        if (lateDays > 0) {
          // Multa fixa 2.5% + juros simples de 0.1% ao dia
          const fine = amount * 0.025;
          const interest = amount * (0.001 * lateDays);
          const totalInterest = fine + interest;
          return {
            lateDays,
            fine,
            dailyInterest: interest,
            interest: totalInterest,
            totalAmount: amount + totalInterest
          };
        } else {
          return {
            lateDays: 0,
            fine: 0,
            dailyInterest: 0,
            interest: 0,
            totalAmount: amount
          };
        }
      }
      throw e;
    }
  }
};
