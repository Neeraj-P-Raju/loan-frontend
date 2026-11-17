// Central settings for the frontend.
// When a real backend is ready, set USE_MOCK to false and
// fill in API_BASE_URL (for example a FastAPI server).

export const config = {
  APP_NAME: 'LoanPredict',
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};

// Money is shown in rupees with Indian digit grouping.
export function formatCurrency(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '-';
  return '₹' + n.toLocaleString('en-IN');
}

// Dates are shown as 03 Nov 2026.
export function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const style = { day: '2-digit', month: 'short', year: 'numeric' };
  return d.toLocaleDateString('en-GB', style);
}
