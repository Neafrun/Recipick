import React, { useState, useEffect } from 'react';

function SavedRecipeModal({ currentUser, onClose }) {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const key = `savedRecipes_${currentUser}`;
      const recipes = JSON.parse(localStorage.getItem(key) || '[]');
      setSavedRecipes(recipes);
    }
  }, [currentUser]);

  const handleRecipeClick = (name) => {
    // 레시피 클릭 시 페이지 리로드하여 해당 레시피 표시
    localStorage.setItem('loadRecipe', name);
    window.location.reload();
  };

  const handleDelete = (name) => {
    const key = `savedRecipes_${currentUser}`;
    let arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr = arr.filter(n => n !== name);
    localStorage.setItem(key, JSON.stringify(arr));
    setSavedRecipes(arr);
  };

  return (
    <div className="modal">
      <div className="modal-content saved-modal">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h3><i className="fas fa-bookmark"></i> 내 레시피</h3>
        {savedRecipes.length === 0 ? (
          <p style={{textAlign: 'center', color: '#888', marginTop: '15px'}}>
            저장된 레시피가 없습니다.
          </p>
        ) : (
          <ul>
            {savedRecipes.map((name, index) => (
              <li key={index}>
                <span onClick={() => handleRecipeClick(name)}>{name}</span>
                <button onClick={() => handleDelete(name)}>❌</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SavedRecipeModal;

