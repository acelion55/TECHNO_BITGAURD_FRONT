import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set, get) => ({
  user: null,
  portfolio: null,
  btcPrice: null,
  taxReport: null,
  aiDecision: null,
  sellSimulation: null,
  loading: false,
  error: null,

  // ── Auth ──────────────────────────────────────────────────────────────────
  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/signup', formData);
      set({ user: data.user, portfolio: data.portfolio, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.error || 'Signup failed', loading: false });
    }
  },

  login: async (email, mpin) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, mpin });
      set({ user: data.user, portfolio: data.portfolio, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.error || 'Invalid email or MPIN', loading: false });
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    set({ user: null, portfolio: null, taxReport: null, aiDecision: null, sellSimulation: null });
  },

  restoreSession: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, portfolio: data.portfolio });
    } catch {
      set({ user: null });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      set({ loading: false });
      return data.message;
    } catch (e) {
      set({ error: e.response?.data?.error || 'Failed', loading: false });
    }
  },

  resetPassword: async (email, otp, newMpin) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newMpin });
      set({ loading: false });
      return data.message;
    } catch (e) {
      set({ error: e.response?.data?.error || 'Reset failed', loading: false });
    }
  },

  // ── Goal ──────────────────────────────────────────────────────────────────
  saveGoal: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/user/goal', formData);
      set({ user: data.user, portfolio: data.portfolio, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.error || 'Failed to save goal', loading: false });
    }
  },

  // ── Price ─────────────────────────────────────────────────────────────────
  fetchPrice: async () => {
    try {
      const { data } = await api.get('/price/btc');
      if (data?.inr && data?.usd) set({ btcPrice: data });
      else if (data?.isFallback) set({ btcPrice: data });
    } catch {}
  },

  // ── Portfolio ─────────────────────────────────────────────────────────────
  fetchPortfolio: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const { data } = await api.get('/portfolio');
      set((state) => ({
        portfolio: data.portfolio,
        btcPrice: { ...state.btcPrice, inr: data.currentPrice }
      }));
    } catch (e) {
      set({ error: e.response?.data?.error });
    }
  },

  // ── DCA ───────────────────────────────────────────────────────────────────
  simulateBuy: async () => {
    const { user } = get();
    if (!user) return;
    set({ loading: true, aiDecision: null });
    try {
      const { data } = await api.post('/dca/simulate-buy');
      set({ aiDecision: data.aiDecision, portfolio: data.portfolio, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.error || 'Simulation failed', loading: false });
    }
  },

  // ── Tax ───────────────────────────────────────────────────────────────────
  fetchTaxReport: async () => {
    const { user } = get();
    if (!user) return;
    set({ loading: true });
    try {
      const { data } = await api.get('/tax/report');
      set({ taxReport: data, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.error, loading: false });
    }
  },

  simulateSellTax: async (btcToSell) => {
    const { user } = get();
    if (!user) return;
    set({ loading: true });
    try {
      const { data } = await api.post('/tax/simulate-sell', { btcToSell });
      set({ sellSimulation: data, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.error || 'Simulation failed', loading: false });
    }
  },

  // ── Chat ──────────────────────────────────────────────────────────────────
  sendChat: async (message, history) => {
    const { user } = get();
    if (!user) return 'User not found';
    try {
      const { data } = await api.post('/chat', { userId: user._id, message, history });
      return data.reply;
    } catch {
      return 'AI is unavailable right now. Please try again.';
    }
  }
}));

export default useStore;
