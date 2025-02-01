// frontend/src/components/PaperPage.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function PaperPage() {
  const location = useLocation();
  const { paper } = location.state || {};
  const [userAnswers, setUserAnswers] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  if (!paper) {
    return <div className="container">No paper found. Please generate a paper first.</div>;
  }

  // Export the paper as a text file
  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([paper], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'mock_test_paper.txt';
    document.body.appendChild(element);
    element.click();
  };

  // Handle file upload of answered paper
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserAnswers(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Process the answers by sending them to the backend
  const handleProcessAnswers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/process-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paper,
          userAnswers
        })
      });
      const data = await response.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error processing answers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Generated Mock Test Paper</h1>
      <pre>{paper}</pre>
      <button onClick={handleExport}>Export Paper</button>

      <h2>Enter Your Answers</h2>
      <textarea
        value={userAnswers}
        onChange={(e) => setUserAnswers(e.target.value)}
        placeholder="Enter your answers here..."
        style={{ width: '100%', height: '200px' }}
      />
      <div>
        <label>Or Upload your answered paper (TXT file): </label>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
      <button onClick={handleProcessAnswers} disabled={loading}>
        {loading ? 'Processing...' : 'Process Answers'}
      </button>
      {feedback && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Feedback</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
}

export default PaperPage;
