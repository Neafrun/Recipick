import React from 'react';
import Logo from './Logo';

function Header({ currentUser, onLoginClick, onMyRecipeClick, onCompanyClick }) {
  return (
    <>
      <div className="company-name" onClick={onCompanyClick}>
        밥프렌즈
      </div>

      <button className="menu-btn" onClick={onLoginClick}>
        <i className={currentUser ? "fas fa-sign-out-alt" : "fas fa-user"}></i>
        {currentUser ? ' 로그아웃' : ' 로그인'}
      </button>

      {currentUser && (
        <button className="menu-btn my-recipe-btn" onClick={onMyRecipeClick}>
          <i className="fas fa-bookmark"></i> 내 레시피
        </button>
      )}

      <div className="header">
        <Logo />
      </div>
    </>
  );
}

export default Header;

