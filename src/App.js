import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import CreatorModal from './components/CreatorModal';
import SavedRecipeModal from './components/SavedRecipeModal';
// OpenAI API 사용
// import MainContent from './components/MainContent';

// 모의 데이터 모드 (API 없이 즉시 사용!)
// import MainContent from './components/MainContent-Mock';

// Google Gemini API 사용 (새 API 키로 재시도)
import MainContent from './components/MainContent-Gemini';
import Loading from './components/Loading';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedInUser');
    if (loggedUser) {
      setCurrentUser(loggedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('loggedInUser', username);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <div className="app-wrapper">
      <Header 
        currentUser={currentUser}
        onLoginClick={() => currentUser ? handleLogout() : setShowLoginModal(true)}
        onMyRecipeClick={() => setShowSavedModal(true)}
        onCompanyClick={() => setShowCreatorModal(true)}
      />

      <MainContent 
        currentUser={currentUser}
        setLoading={setLoading}
      />

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      {showCreatorModal && (
        <CreatorModal onClose={() => setShowCreatorModal(false)} />
      )}

      {showSavedModal && (
        <SavedRecipeModal 
          currentUser={currentUser}
          onClose={() => setShowSavedModal(false)}
        />
      )}

      <Loading show={loading} />
    </div>
  );
}

export default App;

