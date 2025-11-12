import React, { useState } from 'react';

function LoginModal({ onClose, onLogin }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    const id = username.trim();
    const pw = password;
    
    if (!id || !pw) {
      alert('아이디/비밀번호 입력!');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[id] || users[id] !== pw) {
      alert('로그인 실패');
      return;
    }
    
    onLogin(id);
    setUsername('');
    setPassword('');
  };

  const handleSignup = () => {
    const id = username.trim();
    const pw = password;
    const pw2 = confirmPassword;
    
    if (!id || !pw || !pw2) {
      alert('모두 입력!');
      return;
    }
    
    if (pw !== pw2) {
      alert('비밀번호 불일치!');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[id]) {
      alert('이미 존재하는 아이디!');
      return;
    }
    
    users[id] = pw;
    localStorage.setItem('users', JSON.stringify(users));
    alert('회원가입 완료!');
    setIsLoginTab(true);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      isLoginTab ? handleLogin() : handleSignup();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="tab-buttons">
          <button 
            className={isLoginTab ? 'active' : ''} 
            onClick={() => setIsLoginTab(true)}
          >
            로그인
          </button>
          <button 
            className={!isLoginTab ? 'active' : ''} 
            onClick={() => setIsLoginTab(false)}
          >
            회원가입
          </button>
        </div>

        {isLoginTab ? (
          <div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="아이디" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <i className="fas fa-user"></i>
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <i className="fas fa-lock"></i>
            </div>
            <button className="action-btn" onClick={handleLogin}>로그인</button>
          </div>
        ) : (
          <div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="아이디" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <i className="fas fa-user"></i>
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="비밀번호" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <i className="fas fa-lock"></i>
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="비밀번호 확인" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <i className="fas fa-lock"></i>
            </div>
            <button className="action-btn" onClick={handleSignup}>회원가입</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;

