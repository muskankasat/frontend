import { useState, useRef, useEffect } from 'react';
// import { aiChatAPI } from './services/Api'; 

function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hi 👋 I'm your ExpenseTracker AI. Need help with budgeting or getting started?", 
      sender: 'ai' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Track New Expense', action: 'track_expense' },
    { label: 'View My Budget', action: 'view_budget' },
    { label: 'Get Spending Tips', action: 'spending_tips' },
    { label: 'Transaction Help', action: 'transaction_help' },
    { label: 'Contact Support / FAQ', action: 'support' }
  ];

  const handleQuickAction = (action) => {
    let response = '';
    switch(action) {
      case 'track_expense':
        response = "To track a new expense, go to 'Add Expenses' page. You can enter amount, category, date, add notes, or even upload a receipt image!";
        break;
      case 'view_budget':
        response = "Your current balance is ₹10,110. Check the Dashboard to see your monthly spending (₹2,340) and income (₹5,200). You're doing great!";
        break;
      case 'spending_tips':
        response = "Based on your patterns: 1) Consider reducing shopping expenses (40% of spending). 2) Your food budget is optimized! 3) Review entertainment subscriptions.";
        break;
      case 'transaction_help':
        response = "Having trouble with transactions? Make sure to: 1) Fill in all required fields. 2) Select a valid category. 3) Check your internet connection. Need more help?";
        break;
      case 'support':
        response = "For support: Email us at support@expensetracker.com or check our FAQ section. Common issues: Login problems, transaction errors, budget calculations.";
        break;
      default:
        response = "How can I help you today?";
    }
    
    setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');

    try {
      const aiResponse = await aiChatAPI.sendMessage(messageToSend);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, couldn't fetch response.", sender: 'ai' }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isOpen 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isOpen 
            ? '0 0 0 0 rgba(102, 126, 234, 0.4)'
            : '0 0 0 20px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s',
          zIndex: 1000,
          animation: isOpen ? 'none' : 'pulse 2s infinite'
        }}
        onMouseOver={(e) => {
          if (!isOpen) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(102, 126, 234, 0.6)';
          }
        }}
        onMouseOut={(e) => {
          if (!isOpen) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 0 20px rgba(102, 126, 234, 0.4)';
          }
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="12" cy="10" r="1.5"/>
            <circle cx="8" cy="10" r="1.5"/>
            <circle cx="16" cy="10" r="1.5"/>
          </svg>
        )}
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '110px',
          right: '2rem',
          width: 'min(420px, calc(100vw - 4rem))',
          maxHeight: 'min(650px, calc(100vh - 160px))',
          background: 'rgba(20, 20, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          overflow: 'hidden',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                ExpenseTracker AI
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
                Your financial assistant
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(15, 15, 25, 0.5)'
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(60, 60, 80, 0.8)',
                  color: 'white',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Quick Action Buttons */}
            {messages.length <= 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '1rem'
              }}>
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.action)}
                    style={{
                      padding: '0.875rem 1.25rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '16px',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '1.25rem',
            background: 'rgba(30, 30, 40, 0.8)',
            borderTop: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: '0.875rem 1.25rem',
                  background: 'rgba(50, 50, 70, 0.6)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: inputValue.trim() 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(102, 126, 234, 0.3)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  if (inputValue.trim()) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
            }
          }
        `}
      </style>
    </>
  );
}

export default FloatingAIChat;