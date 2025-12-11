import { useState, useEffect } from 'react';
import ChromaGrid from '../components/ChromaGrid';
import { dashboardAPI, expenseAPI } from '../services/Api';

function Dashboard() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAmount, setFilterAmount] = useState('All');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Income management states
  const [currentIncome, setCurrentIncome] = useState(0);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');
  const [savingIncome, setSavingIncome] = useState(false);
  
  // Dashboard summary data
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const categories = ['All', 'Shopping', 'Food', 'Income', 'Bills', 'Transport', 'Entertainment'];

  // Fetch all data on component mount and when refreshKey changes
  useEffect(() => {
    console.log('🔄 Fetching dashboard data...');
    fetchDashboardData();
    fetchTransactions();
  }, [refreshKey]);

  // Refetch when filters change
  useEffect(() => {
    fetchTransactions();
  }, [filterCategory, filterAmount]);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Calling /dashboard/summary...');
      const data = await dashboardAPI.getSummary();
      console.log('✅ Dashboard data received:', data);
      setDashboardData(data);
      setCurrentIncome(data.monthlyIncome || 0);
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterCategory !== 'All') filters.category = filterCategory;
      if (filterAmount !== 'All') filters.amountRange = filterAmount;

      console.log('📋 Fetching transactions with filters:', filters);
      const data = await dashboardAPI.getTransactions(filters);
      console.log('✅ Transactions received:', data);
      setTransactions(data.transactions || []);
      setError('');
    } catch (err) {
      console.error('❌ Transactions error:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeSubmit = async () => {
    const amount = parseFloat(incomeInput);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    setSavingIncome(true);
    try {
      console.log('💰 Adding income:', amount);
      
      // Prepare income data
      const incomeData = {
        amount: amount,
        category: 'Income',
        description: 'Monthly Income',
        name: 'Income',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Sending income data:', incomeData);
      
      // Add income using expenseAPI
      const response = await expenseAPI.addExpense(incomeData);
      console.log('✅ Income added successfully:', response);
      
      // Close modal and reset
      setShowIncomeModal(false);
      setIncomeInput('');
      
      // Force refresh by updating key
      console.log('🔄 Triggering refresh...');
      setRefreshKey(prev => prev + 1);
      
      // Show success message
      alert('Income added successfully!');
      
    } catch (err) {
      console.error('❌ Failed to save income:', err);
      alert(err.message || 'Failed to save income. Please check console for details.');
    } finally {
      setSavingIncome(false);
    }
  };

  // Dashboard items with data from backend
  const dashboardItems = dashboardData ? [
    {
      title: 'Monthly Income',
      value: `₹${(dashboardData.monthlyIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Your current income',
      borderColor: '#3b82f6',
      gradient: 'linear-gradient(145deg, #1e3a8a, #000)'
    },
    {
      title: 'Monthly Spending',
      value: `₹${(dashboardData.monthlySpending || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${dashboardData.spendingChange >= 0 ? '↑' : '↓'} ${Math.abs(dashboardData.spendingChange || 0).toFixed(1)}% from last month`,
      borderColor: '#ef4444',
      gradient: 'linear-gradient(145deg, #dc2626, #000)'
    },
    {
      title: 'Savings This Month',
      value: `₹${((dashboardData.monthlyIncome || 0) - (dashboardData.monthlySpending || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Income - Expenses',
      borderColor: '#10b981',
      gradient: 'linear-gradient(145deg, #059669, #000)'
    },
    {
      title: 'Total Balance',
      value: `₹${(dashboardData.totalBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: dashboardData.totalBalance >= 0 ? 'All time balance' : 'In deficit',
      borderColor: dashboardData.totalBalance >= 0 ? '#8b5cf6' : '#f59e0b',
      gradient: dashboardData.totalBalance >= 0 
        ? 'linear-gradient(145deg, #7c3aed, #000)'
        : 'linear-gradient(145deg, #d97706, #000)'
    }
  ] : [
    {
      title: 'Monthly Income',
      value: '₹0.00',
      subtitle: 'Loading...',
      borderColor: '#3b82f6',
      gradient: 'linear-gradient(145deg, #1e3a8a, #000)'
    },
    {
      title: 'Monthly Spending',
      value: '₹0.00',
      subtitle: 'Loading...',
      borderColor: '#ef4444',
      gradient: 'linear-gradient(145deg, #dc2626, #000)'
    },
    {
      title: 'Savings This Month',
      value: '₹0.00',
      subtitle: 'Loading...',
      borderColor: '#10b981',
      gradient: 'linear-gradient(145deg, #059669, #000)'
    },
    {
      title: 'Total Balance',
      value: '₹0.00',
      subtitle: 'Loading...',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
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
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  setRefreshKey(prev => prev + 1);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid #8b5cf6',
                  borderRadius: '12px',
                  color: '#8b5cf6',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                }}
              >
                🔄 Refresh
              </button>
              
              <button
                onClick={() => setShowIncomeModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                Add Income
              </button>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove this in production */}
        {dashboardData && (
          <div style={{
            padding: '1rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            marginBottom: '1rem',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontSize: '0.85rem',
            color: '#94a3b8'
          }}>
            <strong style={{ color: '#3b82f6' }}>Debug Info:</strong> Last Updated: {new Date().toLocaleTimeString()} | 
            Income: ₹{dashboardData.monthlyIncome} | 
            Spending: ₹{dashboardData.monthlySpending} | 
            Balance: ₹{dashboardData.totalBalance} | 
            Refresh Key: {refreshKey}
          </div>
        )}

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
                        {tx.name || tx.description || 'Transaction'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {new Date(tx.date || tx.timestamp).toLocaleDateString('en-IN', { 
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
                  No transactions found. Add your first transaction to get started!
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

      {/* Income Modal */}
      {showIncomeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}
        onClick={() => setShowIncomeModal(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Add Income
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              Record your income to track your finances accurately
            </p>

            {currentIncome > 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Current Month Income
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  ₹{currentIncome.toLocaleString('en-IN')}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#94a3b8',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Income Amount (₹)
              </label>
              <input
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowIncomeModal(false);
                  setIncomeInput('');
                }}
                disabled={savingIncome}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '12px',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: savingIncome ? 'not-allowed' : 'pointer',
                  opacity: savingIncome ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleIncomeSubmit}
                disabled={savingIncome || !incomeInput || parseFloat(incomeInput) <= 0}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: (savingIncome || !incomeInput || parseFloat(incomeInput) <= 0)
                    ? 'rgba(59, 130, 246, 0.3)' 
                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (savingIncome || !incomeInput || parseFloat(incomeInput) <= 0) ? 'not-allowed' : 'pointer',
                  opacity: (savingIncome || !incomeInput || parseFloat(incomeInput) <= 0) ? 0.5 : 1
                }}
              >
                {savingIncome ? 'Saving...' : 'Add Income'}
              </button>
            </div>
          </div>
        </div>
      )}

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