import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import CreatorModal from './components/CreatorModal';
import SavedRecipeModal from './components/SavedRecipeModal';
import MainContent from './components/MainContent';
import Loading from './components/Loading';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 데모 계정 자동 생성
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users['demo']) {
      users['demo'] = '1234';
      localStorage.setItem('users', JSON.stringify(users));
      
      // 데모 계정에 샘플 레시피 추가
      const sampleRecipes = ['김치찌개', '불고기', '된장찌개', '떡볶이', '비빔밥'];
      localStorage.setItem('savedRecipes_demo', JSON.stringify(sampleRecipes));
      console.log('✅ 데모 계정 생성 완료 (ID: demo, PW: 1234)');
    }
    
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

