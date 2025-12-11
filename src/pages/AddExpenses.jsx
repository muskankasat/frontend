import { useState } from 'react';
import { expenseAPI } from '../services/Api';

const AddExpenses = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [textEntry, setTextEntry] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Travel',
    'Shopping',
    'Food',
    'Entertainment',
    'Others'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExpense = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let imageUrl = null;
      let extractedData = null;

      // Upload image if selected and extract data
      if (imageFile) {
        const imageResponse = await expenseAPI.uploadImage(imageFile);
        imageUrl = imageResponse.imageUrl;
        extractedData = imageResponse.extractedData || {}; // Get extracted data from image
      }

      // Priority 1: Image upload (if image exists, use extracted data)
      if (imageFile && extractedData) {
        const expenseData = {
          amount: extractedData.amount || parseFloat(amount) || 0,
          category: extractedData.category || category || 'Others',
          date: extractedData.date ? new Date(extractedData.date).toISOString() : new Date().toISOString(),
          notes: extractedData.notes || notes || 'Expense from uploaded receipt',
          imageUrl
        };
        await expenseAPI.addExpense(expenseData);
      }
      // Priority 2: Text entry (AI processing)
      else if (textEntry && !amount && !imageFile) {
        const processedData = await expenseAPI.processTextEntry(textEntry);
        const expenseData = {
          amount: processedData.amount || 0,
          category: processedData.category || 'Others',
          date: processedData.date ? new Date(processedData.date).toISOString() : new Date().toISOString(),
          notes: processedData.notes || textEntry,
          imageUrl: null
        };
        await expenseAPI.addExpense(expenseData);
      }
      // Priority 3: Manual entry
      else if (amount && category && date) {
        // Convert date to ISO timestamp
        const isoDate = new Date(date).toISOString();

        const expenseData = {
          amount: parseFloat(amount),
          category,
          date: isoDate,
          notes,
          imageUrl
        };
        await expenseAPI.addExpense(expenseData);
      }
      // No valid input
      else {
        setError('Please either: (1) Upload an image, (2) Enter text description, or (3) Fill in amount, category, and date manually');
        setLoading(false);
        return;
      }

      setSuccess('Expense added successfully!');
      
      // Immediately reset form (no delay)
      setAmount('');
      setCategory('');
      setDate('');
      setNotes('');
      setTextEntry('');
      setSelectedImage(null);
      setImageFile(null);
      
      // Clear file input
      const fileInput = document.getElementById('imageUpload');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-container-narrow">
        
        <div className="section-spacing">
          <h1 className="heading-xl" style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            New Entry
          </h1>
          <p className="text-body" style={{ color: '#94a3b8' }}>
            Add a new expense to track your spending
          </p>
        </div>

        <div className="card">
          <h2 className="heading-md" style={{
            color: 'white',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)'
          }}>
            Add New Expense
          </h2>

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '0.875rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              color: '#10b981',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
              fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.875rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#ef4444',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
              fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="grid-2" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <div>
              <label className="text-small" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#e2e8f0',
                fontWeight: '500'
              }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1
                }}
              />
            </div>

            <div>
              <label className="text-small" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#e2e8f0',
                fontWeight: '500'
              }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  color: category ? 'white' : '#94a3b8',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <option value="" disabled>Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0f172a' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <label className="text-small" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                outline: 'none',
                boxSizing: 'border-box',
                colorScheme: 'dark',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
            <label className="text-small" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>
              Notes
            </label>
            <textarea
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={loading}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: 'clamp(1.5rem, 3vw, 2rem) 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)' }}></div>
            <span style={{ padding: '0 1rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)' }}></div>
          </div>

          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <label className="text-small" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>
              Add text entry (AI will process)
            </label>
            <textarea
              placeholder="Describe your expense in detail..."
              value={textEntry}
              onChange={(e) => setTextEntry(e.target.value)}
              rows={4}
              disabled={loading}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: 'clamp(1.5rem, 3vw, 2rem) 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)' }}></div>
            <span style={{ padding: '0 1rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.2)' }}></div>
          </div>

          <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
            <label className="text-small" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>
              Upload Image
            </label>
            <div style={{
              border: '2px dashed rgba(148, 163, 184, 0.3)',
              borderRadius: '10px',
              padding: '2rem',
              textAlign: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              background: selectedImage ? 'rgba(15, 23, 42, 0.3)' : 'rgba(15, 23, 42, 0.5)',
              opacity: loading ? 0.6 : 1
            }}
            onClick={() => !loading && document.getElementById('imageUpload').click()}
            >
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                style={{ display: 'none' }}
              />
              {selectedImage ? (
                <div>
                  <img src={selectedImage} alt="Preview" style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }} />
                  <p style={{ color: '#10b981' }}>Image uploaded successfully!</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
                  <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                    Click to upload image
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Receipt, bill, or expense photo
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddExpense}
            disabled={loading}
            style={{
              width: '100%',
              padding: 'clamp(0.875rem, 2.5vw, 1rem)',
              background: loading ? 'rgba(59, 130, 246, 0.3)' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              marginTop: '1rem',
              opacity: loading ? 0.6 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Adding Expense...' : 'Add Expense'}
          </button>

          {/* Clear Form Button */}
          {(amount || category || date || notes || textEntry || selectedImage) && !loading && (
            <button
              onClick={() => {
                setAmount('');
                setCategory('');
                setDate('');
                setNotes('');
                setTextEntry('');
                setSelectedImage(null);
                setImageFile(null);
                const fileInput = document.getElementById('imageUpload');
                if (fileInput) fileInput.value = '';
                setError('');
                setSuccess('');
              }}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 2vw, 0.875rem)',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '10px',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '0.75rem'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Clear Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExpenses;