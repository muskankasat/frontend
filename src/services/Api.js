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

  // Process text entry - calls backend NLP/vision processor
  processTextEntry: async (paragraph) => {
    console.log('Process text (will be sent to backend):', paragraph);
    const token = getAuthToken();

    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/api/auto-categorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ "paragraph": paragraph }),
    });

    // Expect the backend to return a JSON object like:
    // { amount, category, description, timestamp, ... }
    return handleResponse(response);
  },
};

// Dashboard APIs
export const dashboardAPI = {
  // Get dashboard summary
  getSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Get transactions
  getTransactions: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'All') {
      queryParams.append('category', filters.category);
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/transactions?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};

// AI Insights APIs
export const insightsAPI = {
  // Get spending insights
  getInsights: async () => {
    const response = await fetch(`${API_BASE_URL}/insights/spending-trends`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Get category analysis
  getCategoryAnalysis: async () => {
    const response = await fetch(`${API_BASE_URL}/insights/category-analysis`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Get recommendations
  getRecommendations: async () => {
    const response = await fetch(`${API_BASE_URL}/insights/recommendations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
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