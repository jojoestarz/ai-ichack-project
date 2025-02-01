// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PaperPage from './components/PaperPage';


function App() {
  console.log('App works');
  return (

    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/paper" element={<PaperPage />} />
      </Routes>
    </Router>
  );
}

export default App;
