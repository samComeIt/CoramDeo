import api from './apiService';

const transactionService = {
  getAllTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  getTransactionsByDate: async (date) => {
    const response = await api.get(`/transactions/date/${date}`);
    return response.data;
  },

  getTransactionsByType: async (type) => {
    const response = await api.get(`/transactions/type/${type}`);
    return response.data;
  },

  getTransactionsByPaymentMethod: async (method) => {
    const response = await api.get(`/transactions/method/${method}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/transactions/summary');
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};

export default transactionService;