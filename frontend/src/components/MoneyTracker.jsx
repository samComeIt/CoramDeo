import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';
import authService from '../services/authService';
import './MoneyTracker.css';

function MoneyTracker() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    paymentMethod: 'CARD',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, summaryData] = await Promise.all([
        transactionService.getAllTransactions(),
        transactionService.getSummary()
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingTransaction(null);
    setFormData({
      amount: '',
      type: 'EXPENSE',
      paymentMethod: 'CARD',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      paymentMethod: transaction.paymentMethod,
      date: transaction.date,
      description: transaction.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      amount: '',
      type: 'EXPENSE',
      paymentMethod: 'CARD',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction.transactionId, data);
      } else {
        await transactionService.createTransaction(data);
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      CARD: 'Card',
      CASH: 'Cash',
      DEBIT_CARD: 'Debit Card'
    };
    return labels[method] || method;
  };

  return (
    <div className="money-tracker-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Money Tracker</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {admin?.name}</span>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Dashboard
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="money-tracker-content">
        <div className="summary-cards">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <p className="amount">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div className="summary-card expense">
            <h3>Total Expense</h3>
            <p className="amount">{formatCurrency(summary.totalExpense)}</p>
          </div>
          <div className="summary-card balance">
            <h3>Balance</h3>
            <p className="amount">{formatCurrency(summary.balance)}</p>
          </div>
        </div>

        <div className="transactions-header">
          <div>
            <h1>Transactions</h1>
            <p>Track your income and expenses</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            + Add Transaction
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to get started</p>
            <button onClick={openCreateModal} className="create-button">
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type === 'INCOME' ? '+' : '-'} {transaction.type}
                      </span>
                    </td>
                    <td className={`amount ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td>{getPaymentMethodLabel(transaction.paymentMethod)}</td>
                    <td className="description">
                      {transaction.description || <span className="no-description">-</span>}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="edit-btn"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.transactionId)}
                          className="delete-btn"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
                <button onClick={closeModal} className="close-button">
                  x
                </button>
              </div>

              <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <div className="type-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${formData.type === 'INCOME' ? 'active income' : ''}`}
                      onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                    >
                      + Income
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${formData.type === 'EXPENSE' ? 'active expense' : ''}`}
                      onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                    >
                      - Expense
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount *</label>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    min="1"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method *</label>
                  <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    required
                  >
                    <option value="CARD">Card</option>
                    <option value="CASH">Cash</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter description (optional)"
                    maxLength="255"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingTransaction ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoneyTracker;