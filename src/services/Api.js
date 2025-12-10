// Your backend URL
const API_BASE_URL = 'https://ai-finance-tracker-backend-gbum.onrender.com';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }
  
  return data;
};

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  signup: async (email, password) => {
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Google sign in - not implemented yet
  googleSignIn: async (googleToken) => {
    throw new Error('Google Sign In is not implemented yet');
  },
};

// MOCK DATA - Replace these with real API endpoints when backend is ready

// Expense APIs
export const expenseAPI = {
  // Get all expenses
  getAllExpenses: async () => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Add new expense
  addExpense: async (expenseData) => {
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/expenses/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    return handleResponse(response);
  },

  // Update expense
  // updateExpense: async (expenseId, expenseData) => {
  //   const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Authorization': `Bearer ${getAuthToken()}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(expenseData),
  //   });
  //   return handleResponse(response);
  // },

  // Delete expense
  // deleteExpense: async (expenseId) => {
  //   const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Authorization': `Bearer ${getAuthToken()}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   return handleResponse(response);
  // },

  // Upload image
  uploadImage: async (file) => {
  const token = getAuthToken();
  console.log('Token present:', !!token);

  if (!token) {
    throw new Error('No authentication token found. Please login first.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch("https://ai-finance-tracker-backend-gbum.onrender.com/api/vision/upload-bill", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`  // ✅ backticks used
    },
    body: formData
  });

  return handleResponse(response);
},

  // Process text entry - MOCK
  processTextEntry: async (text) => {
    console.log('Process text (will be sent to backend):', text);
    // Simple mock processing
    return {
      amount: 50,
      category: 'Others',
      date: new Date().toISOString().split('T')[0],
      notes: text
    };
  },
};

// Dashboard APIs - USING MOCK DATA FOR NOW
export const dashboardAPI = {
  // Get dashboard summary - MOCK
  getSummary: async () => {
    return {
      totalBalance: 12450,
      monthlySpending: 2340,
      spendingChange: -12,
      monthlyIncome: 5200,
      incomeChange: 0,
      currentBalance: 10110
    };
  },

  // Get transactions - MOCK
  getTransactions: async (filters = {}) => {
    const mockTransactions = [
      { _id: '1', name: 'Grocery Shopping', amount: -125.5, date: '2024-12-06', category: 'Shopping' },
      { _id: '2', name: 'Salary Deposit', amount: 5200, date: '2024-12-01', category: 'Income' },
      { _id: '3', name: 'Restaurant', amount: -45.3, date: '2024-12-05', category: 'Food' },
      { _id: '4', name: 'Electric Bill', amount: -89.0, date: '2024-12-04', category: 'Bills' },
      { _id: '5', name: 'Gas Station', amount: -60.0, date: '2024-12-03', category: 'Transport' },
      { _id: '6', name: 'Coffee Shop', amount: -12.5, date: '2024-12-02', category: 'Food' },
      { _id: '7', name: 'Online Shopping', amount: -234.9, date: '2024-11-30', category: 'Shopping' },
      { _id: '8', name: 'Gym Membership', amount: -50.0, date: '2024-11-29', category: 'Entertainment' },
      { _id: '9', name: 'Freelance Payment', amount: 800, date: '2024-11-28', category: 'Income' },
      { _id: '10', name: 'Movie Tickets', amount: -35.0, date: '2024-11-27', category: 'Entertainment' }
    ];

    // Apply filters
    let filtered = mockTransactions;
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    return {
      transactions: filtered
    };
  },
};

// AI Insights APIs - USING MOCK DATA FOR NOW
export const insightsAPI = {
  // Get spending insights - MOCK
  getInsights: async () => {
    return {
      categoryTrends: [
        { month: 'Jul', Travel: 200, Shopping: 350, Food: 180, Entertainment: 120 },
        { month: 'Aug', Travel: 280, Shopping: 420, Food: 220, Entertainment: 150 },
        { month: 'Sep', Travel: 320, Shopping: 380, Food: 250, Entertainment: 180 },
        { month: 'Oct', Travel: 400, Shopping: 450, Food: 280, Entertainment: 200 },
        { month: 'Nov', Travel: 350, Shopping: 500, Food: 300, Entertainment: 180 },
        { month: 'Dec', Travel: 450, Shopping: 600, Food: 320, Entertainment: 220 }
      ],
      dailySpending: [
        { date: '2024-12-01', amount: 45 },
        { date: '2024-12-02', amount: 120 },
        { date: '2024-12-03', amount: 85 },
        { date: '2024-12-04', amount: 200 },
        { date: '2024-12-05', amount: 95 },
        { date: '2024-12-06', amount: 150 },
        { date: '2024-12-07', amount: 70 }
      ]
    };
  },

  // Get category analysis - MOCK
  getCategoryAnalysis: async () => {
    return {
      categoryDistribution: [
        { category: 'Travel', percentage: 31, amount: 930 },
        { category: 'Shopping', percentage: 40, amount: 1200 },
        { category: 'Food', percentage: 22, amount: 660 },
        { category: 'Entertainment', percentage: 15, amount: 450 },
        { category: 'Others', percentage: 7, amount: 210 }
      ]
    };
  },

  // Get recommendations - MOCK
  getRecommendations: async () => {
    return {
      recommendations: [
        {
          title: 'Reduce Shopping Expenses',
          description: 'You spent 40% more on shopping this month. Consider setting a monthly budget.',
          priority: 'high'
        },
        {
          title: 'Food Budget Optimized',
          description: 'Your food expenses are within the healthy range. Keep up the good work!',
          priority: 'low'
        },
        {
          title: 'Entertainment Spike',
          description: 'Entertainment costs increased by 25%. Review subscriptions and one-time expenses.',
          priority: 'medium'
        }
      ]
    };
  },
};

// AI Chat API
export const aiChatAPI = {
  sendMessage: async (message) => {
    const token = getAuthToken();

    const response = await fetch(
      'https://ai-finance-tracker-backend-gbum.onrender.com/llm/query',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: message }),
      }
    );

    return handleResponse(response);
  },
};