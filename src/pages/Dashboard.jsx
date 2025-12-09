import { useState } from 'react';
import ChromaGrid from '../components/ChromaGrid';

function Dashboard() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAmount, setFilterAmount] = useState('All');
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const dashboardItems = [
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

  const allTransactions = [
    { name: 'Grocery Shopping', amount: -125.5, date: 'Dec 6, 2025', category: 'Shopping' },
    { name: 'Salary Deposit', amount: 5200, date: 'Dec 1, 2025', category: 'Income' },
    { name: 'Restaurant', amount: -45.3, date: 'Dec 5, 2025', category: 'Food' },
    { name: 'Electric Bill', amount: -89.0, date: 'Dec 4, 2025', category: 'Bills' },
    { name: 'Gas Station', amount: -60.0, date: 'Dec 3, 2025', category: 'Transport' },
    { name: 'Coffee Shop', amount: -12.5, date: 'Dec 2, 2025', category: 'Food' },
    { name: 'Online Shopping', amount: -234.9, date: 'Nov 30, 2025', category: 'Shopping' },
    { name: 'Gym Membership', amount: -50.0, date: 'Nov 29, 2025', category: 'Entertainment' },
    { name: 'Freelance Payment', amount: 800, date: 'Nov 28, 2025', category: 'Income' },
    { name: 'Movie Tickets', amount: -35.0, date: 'Nov 27, 2025', category: 'Entertainment' }
  ];

  const categories = ['All', 'Shopping', 'Food', 'Income', 'Bills', 'Transport', 'Entertainment'];

  const filteredTransactions = allTransactions.filter(tx => {
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
              style={{
                padding: '0.5rem 1.25rem',
                background: showAllTransactions ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none'
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none'
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
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1.5rem'
              }}
            >
              Clear Filters
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {displayedTransactions.length > 0 ? (
              displayedTransactions.map((tx, i) => (
                <div
                  key={i}
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
                      {tx.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {tx.date} • {tx.category}
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
    </div>
  );
}

export default Dashboard;