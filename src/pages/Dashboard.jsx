import { useState, useEffect } from 'react';
import ChromaGrid from '../components/ChromaGrid';
import { dashboardAPI } from '../services/Api';

function Dashboard() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAmount, setFilterAmount] = useState('All');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Shopping', 'Food', 'Income', 'Bills', 'Transport', 'Entertainment'];

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchTransactions();
  }, []);

  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
  }, [filterCategory, filterAmount]);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardAPI.getSummary();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterCategory !== 'All') filters.category = filterCategory;
      if (filterAmount !== 'All') filters.amountRange = filterAmount;

      const data = await dashboardAPI.getTransactions(filters);
      setTransactions(data.transactions || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      console.error('Transactions error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if API fails
  const dashboardItems = dashboardData ? [
    {
      title: 'Total Balance',
      value: `₹${dashboardData.totalBalance?.toLocaleString() || '0'}`,
      subtitle: 'Across all accounts',
      borderColor: '#3b82f6',
      gradient: 'linear-gradient(145deg, #1e3a8a, #000)'
    },
    {
      title: 'Monthly Spending',
      value: `₹${dashboardData.monthlySpending?.toLocaleString() || '0'}`,
      subtitle: `${dashboardData.spendingChange >= 0 ? '↑' : '↓'} ${Math.abs(dashboardData.spendingChange || 0)}% from last month`,
      borderColor: '#ef4444',
      gradient: 'linear-gradient(145deg, #dc2626, #000)'
    },
    {
      title: 'Monthly Income',
      value: `₹${dashboardData.monthlyIncome?.toLocaleString() || '0'}`,
      subtitle: dashboardData.incomeChange === 0 ? '→ Same as last month' : `${dashboardData.incomeChange >= 0 ? '↑' : '↓'} ${Math.abs(dashboardData.incomeChange || 0)}% from last month`,
      borderColor: '#10b981',
      gradient: 'linear-gradient(145deg, #059669, #000)'
    },
    {
      title: 'Current Balance',
      value: `₹${dashboardData.currentBalance?.toLocaleString() || '0'}`,
      subtitle: 'Available funds',
      borderColor: '#8b5cf6',
      gradient: 'linear-gradient(145deg, #7c3aed, #000)'
    }
  ] : [
    {
      title: 'Total Balance',
      value: '₹12,450',
      subtitle: 'Across all accounts',
      borderColor: '#3b82f6',
      gradient: 'linear-gradient(145deg, #1e3a8a, #000)'
    },
    {
      title: 'Monthly Spending',
      value: '₹2,340',
      subtitle: '↓ 12% from last month',
      borderColor: '#ef4444',
      gradient: 'linear-gradient(145deg, #dc2626, #000)'
    },
    {
      title: 'Monthly Income',
      value: '₹5,200',
      subtitle: '→ Same as last month',
      borderColor: '#10b981',
      gradient: 'linear-gradient(145deg, #059669, #000)'
    },
    {
      title: 'Current Balance',
      value: '₹10,110',
      subtitle: 'Available funds',
      borderColor: '#8b5cf6',
      gradient: 'linear-gradient(145deg, #7c3aed, #000)'
    }
  ];

  const filteredTransactions = transactions.filter(tx => {
    const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
    const matchesAmount = 
      filterAmount === 'All' ||
      (filterAmount === 'Under ₹50' && Math.abs(tx.amount) < 50) ||
      (filterAmount === '₹50 - ₹100' && Math.abs(tx.amount) >= 50 && Math.abs(tx.amount) <= 100) ||
      (filterAmount === 'Over ₹100' && Math.abs(tx.amount) > 100);
    
    return matchesCategory && matchesAmount;
  });

  const displayedTransactions = showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 5);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        
        <div className="section-spacing">
          <h1 className="heading-xl" style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Dashboard
          </h1>
          <p className="text-body" style={{ color: '#94a3b8' }}>
            Welcome back! Here's your financial overview
          </p>
        </div>

        <div className="section-spacing">
          <ChromaGrid items={dashboardItems} radius={250} />
        </div>

        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 className="heading-md" style={{ color: 'white', marginBottom: '0.5rem' }}>
                My Account
              </h2>
              <h3 className="text-body" style={{ color: '#94a3b8' }}>
                Recent Transactions
              </h3>
            </div>
            
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              disabled={loading}
              style={{
                padding: '0.5rem 1.25rem',
                background: showAllTransactions ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: loading ? 0.6 : 1
              }}
            >
              {showAllTransactions ? 'Show Less' : 'View All Transactions'}
            </button>
          </div>

          <div className="grid-2" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <div>
              <label className="text-small" style={{
                display: 'block',
                color: '#94a3b8',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#0f172a' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-small" style={{
                display: 'block',
                color: '#94a3b8',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Filter by Amount
              </label>
              <select
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <option value="All" style={{ background: '#0f172a' }}>All Amounts</option>
                <option value="Under ₹50" style={{ background: '#0f172a' }}>Under ₹50</option>
                <option value="₹50 - ₹100" style={{ background: '#0f172a' }}>₹50 - ₹100</option>
                <option value="Over ₹100" style={{ background: '#0f172a' }}>Over ₹100</option>
              </select>
            </div>
          </div>

          {(filterCategory !== 'All' || filterAmount !== 'All') && (
            <button
              onClick={() => {
                setFilterCategory('All');
                setFilterAmount('All');
              }}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1.5rem',
                opacity: loading ? 0.6 : 1
              }}
            >
              Clear Filters
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#ef4444',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#64748b'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(59, 130, 246, 0.3)',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              Loading transactions...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((tx, i) => (
                  <div
                    key={tx._id || i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '12px',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {tx.name || tx.description || 'Expense'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {new Date(tx.date).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })} • {tx.category}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: tx.amount > 0 ? '#10b981' : '#ef4444'
                    }}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#64748b'
                }}>
                  No transactions match your filters
                </div>
              )}
            </div>
          )}

          <div style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.85rem'
          }}>
            Showing {displayedTransactions.length} of {filteredTransactions.length} transactions
          </div>
        </div>
      </div>

      {/* Add keyframe animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;