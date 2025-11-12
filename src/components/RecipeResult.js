import React from 'react';

function RecipeResult({ recipeName, mode, content, onModeChange, onSave }) {
  const oppositeMode = mode === '재료' ? '레시피' : '재료';

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <h4>{recipeName}{mode && ` - ${mode}`}</h4>
        <div className="recipe-detail-actions">
          {!mode && (
            <>
              <button 
                className="recipe-btn" 
                onClick={() => onModeChange(recipeName, '재료')}
              >
                재료 보기
              </button>
              <button 
                className="recipe-btn" 
                onClick={() => onModeChange(recipeName, '레시피')}
              >
                레시피 보기
              </button>
            </>
          )}
          {mode && (
            <>
              <button 
                className="recipe-btn" 
                onClick={() => onModeChange(recipeName, oppositeMode)}
              >
                {oppositeMode} 보기
              </button>
              <button 
                className="icon-btn" 
                onClick={() => onSave(recipeName)} 
                title="레시피 저장"
              >
                <i className="fas fa-bookmark"></i>
              </button>
            </>
          )}
        </div>
      </div>
      {content && (
        <p dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}></p>
      )}
    </div>
  );
}

export default RecipeResult;

