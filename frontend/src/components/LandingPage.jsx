// frontend/src/components/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionStyle, setQuestionStyle] = useState('Multiple Choice');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [pastPaper, setPastPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPastPaper(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('difficulty', difficulty);
    formData.append('questionStyle', questionStyle);
    formData.append('additionalDetails', additionalDetails);
    if (pastPaper) {
      formData.append('pastPaper', pastPaper);
    }

    try {
      const response = await fetch('http://localhost:5000/api/generate-paper', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.paper) {
        // Navigate to the paper page and pass the generated paper as state
        navigate('/paper', { state: { paper: data.paper } });
      }
    } catch (error) {
      console.error('Error generating paper:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Mock Test Paper Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Difficulty: </label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label>Question Style: </label>
          <select value={questionStyle} onChange={(e) => setQuestionStyle(e.target.value)}>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Essay">Essay</option>
            <option value="Short Answer">Short Answer</option>
          </select>
        </div>
        <div>
          <label>Upload Past Paper (optional): </label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <label>Additional Details:</label>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Enter any additional details here..."
            rows="4"
            cols="50"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Paper'}
        </button>
      </form>
    </div>
  );
}

export default LandingPage;
