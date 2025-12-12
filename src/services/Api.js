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

// Expense APIs
export const expenseAPI = {
  // Get all expenses
  getAllExpenses: async () => {
    const response = await fetch(`https://https://ai-finance-tracker-backend-gbum.onrender.com/expenses/list`, {
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


// Dashboard APIs - FIXED VERSION
export const dashboardAPI = {
  // Get dashboard summary
  getSummary: async () => {
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,  // FIXED
        'Content-Type': 'application/json',
      },
      credentials: "include",  // REQUIRED FOR AUTH + CORS
    });
    return handleResponse(response);
  },

  // Get transactions - USING EXPENSES ENDPOINT
  getTransactions: async (filters = {}) => {
    // FIXED: Using /expenses endpoint instead of /dashboard/transactions
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/expenses/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",  // REQUIRED FOR AUTH + CORS
    });
    
    const data = await handleResponse(response);
    
    // Filter on frontend if category filter is applied
    let transactions = data.data || [];
    
    if (filters.category && filters.category !== 'All') {
      transactions = transactions.filter(tx => tx.category === filters.category);
    }
    
    return { transactions };
  },
};

// AI Insights APIs
export const insightsAPI = {
  // Get spending insights
  getInsights: async () => {
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/api/insights`, {
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
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/api/category-analysis`, {
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
    const response = await fetch(`https://ai-finance-tracker-backend-gbum.onrender.com/api/recommendations`, {
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