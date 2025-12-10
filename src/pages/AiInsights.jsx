import { useRef, useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { insightsAPI } from '../services/Api';

const SpotlightCard = ({ children, spotlightColor = 'rgba(59, 130, 246, 0.25)' }) => {
  const divRef = useRef(null);

  const handleMouseMove = e => {
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div 
      ref={divRef} 
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        borderRadius: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        background: 'rgba(30, 41, 59, 0.5)',
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        overflow: 'hidden',
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--spotlight-color': spotlightColor
      }}
    >
      <div style={{
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%)',
        opacity: 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
        zIndex: 0
      }}
      onMouseEnter={(e) => e.target.style.opacity = '0.6'}
      onMouseLeave={(e) => e.target.style.opacity = '0'}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

const AiInsights = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryTrendData, setCategoryTrendData] = useState([]);
  const [dailySpendingData, setDailySpendingData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all insights data on component mount
  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      // Fetch all insights data
      const [insights, categoryAnalysis, recommendationsData] = await Promise.all([
        insightsAPI.getInsights(),
        insightsAPI.getCategoryAnalysis(),
        insightsAPI.getRecommendations()
      ]);

      // Set category distribution data
      if (categoryAnalysis.categoryDistribution) {
        setCategoryData(categoryAnalysis.categoryDistribution.map(cat => ({
          name: cat.category,
          value: cat.percentage,
          color: getCategoryColor(cat.category)
        })));
      }

      // Set category trend data
      if (insights.categoryTrends) {
        setCategoryTrendData(insights.categoryTrends);
      }

      // Set daily spending data
      if (insights.dailySpending) {
        setDailySpendingData(insights.dailySpending.map(day => ({
          date: new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          amount: day.amount
        })));
      }

      // Set recommendations
      if (recommendationsData.recommendations) {
        setRecommendations(recommendationsData.recommendations.map(rec => ({
          icon: getPriorityIcon(rec.priority),
          title: rec.title,
          description: rec.description,
          priority: rec.priority
        })));
      }

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load insights');
      console.error('Insights error:', err);
      // Use fallback data on error
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': '#3b82f6',
      'Shopping': '#ef4444',
      'Food': '#f59e0b',
      'Entertainment': '#8b5cf6',
      'Others': '#10b981',
      'Bills': '#06b6d4',
      'Transport': '#ec4899'
    };
    return colors[category] || '#64748b';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'high': '💡',
      'medium': '⚠️',
      'low': '🎯'
    };
    return icons[priority] || '💡';
  };

  const useFallbackData = () => {
    // Fallback data if API fails
    setCategoryData([
      { name: 'Travel', value: 31, color: '#3b82f6' },
      { name: 'Shopping', value: 40, color: '#ef4444' },
      { name: 'Food', value: 22, color: '#f59e0b' },
      { name: 'Entertainment', value: 15, color: '#8b5cf6' },
      { name: 'Others', value: 7, color: '#10b981' }
    ]);

    setCategoryTrendData([
      { month: 'Jul', Travel: 200, Shopping: 350, Food: 180, Entertainment: 120 },
      { month: 'Aug', Travel: 280, Shopping: 420, Food: 220, Entertainment: 150 },
      { month: 'Sep', Travel: 320, Shopping: 380, Food: 250, Entertainment: 180 },
      { month: 'Oct', Travel: 400, Shopping: 450, Food: 280, Entertainment: 200 },
      { month: 'Nov', Travel: 350, Shopping: 500, Food: 300, Entertainment: 180 },
      { month: 'Dec', Travel: 450, Shopping: 600, Food: 320, Entertainment: 220 }
    ]);

    setDailySpendingData([
      { date: 'Dec 1', amount: 45 },
      { date: 'Dec 2', amount: 120 },
      { date: 'Dec 3', amount: 85 },
      { date: 'Dec 4', amount: 200 },
      { date: 'Dec 5', amount: 95 },
      { date: 'Dec 6', amount: 150 },
      { date: 'Dec 7', amount: 70 }
    ]);

    setRecommendations([
      {
        icon: '💡',
        title: 'Reduce Shopping Expenses',
        description: 'You spent 40% more on shopping this month. Consider setting a monthly budget.',
        priority: 'high'
      },
      {
        icon: '🎯',
        title: 'Food Budget Optimized',
        description: 'Your food expenses are within the healthy range. Keep up the good work!',
        priority: 'low'
      },
      {
        icon: '⚠️',
        title: 'Entertainment Spike',
        description: 'Entertainment costs increased by 25%. Review subscriptions and one-time expenses.',
        priority: 'medium'
      }
    ]);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-container-wide">
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: '#64748b'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(59, 130, 246, 0.3)',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }}></div>
            <p style={{ fontSize: '1.1rem' }}>Loading AI insights...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container-wide">
        
        <div className="section-spacing">
          <h1 className="heading-xl" style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Insights
          </h1>
          <p className="text-body" style={{ color: '#94a3b8' }}>
            Smart analysis of your spending patterns
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#ef4444',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error} - Showing sample data
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.2)">
            <h3 className="heading-md" style={{
              color: 'white',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              Spending by Category
            </h3>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1e293b', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '1rem',
                  justifyContent: 'center'
                }}>
                  {categoryData.map((cat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: cat.color
                      }}></div>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No category data available
              </div>
            )}
          </SpotlightCard>

          <SpotlightCard spotlightColor="rgba(139, 92, 246, 0.2)">
            <h3 className="heading-md" style={{
              color: 'white',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              Category Breakdown
            </h3>
            {categoryTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={categoryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e293b', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Travel" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Shopping" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Food" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Entertainment" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No trend data available
              </div>
            )}
          </SpotlightCard>
        </div>

        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)">
            <h3 className="heading-md" style={{
              color: 'white',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              Daily Spending Trend
            </h3>
            {dailySpendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailySpendingData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e293b', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No daily spending data available
              </div>
            )}
          </SpotlightCard>
        </div>

        <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)">
          <h3 className="heading-md" style={{
            color: 'white',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
          }}>
            Smart Recommendations
          </h3>
          {recommendations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '12px',
                    border: `1px solid ${
                      rec.priority === 'high' ? '#ef4444' :
                      rec.priority === 'medium' ? '#f59e0b' : '#10b981'
                    }`,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{rec.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <h4 style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                        {rec.title}
                      </h4>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: rec.priority === 'high' ? '#ef4444' :
                                   rec.priority === 'medium' ? '#f59e0b' : '#10b981',
                        color: 'white'
                      }}>
                        {rec.priority}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No recommendations available yet. Add more expenses to get insights!
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AiInsights;