// API 없이 테스트할 수 있는 모의 버전
import React, { useState, useEffect } from 'react';
import PopularCarousel from './PopularCarousel';
import RecipeResult from './RecipeResult';

// 모의 데이터
const MOCK_RECIPES = {
  '달걀': ['달걀찜', '계란후라이', '달걀말이'],
  '돼지고기': ['제육볶음', '돼지고기 김치찌개', '돼지고기 덮밥'],
  '치킨': ['닭볶음탕', '닭가슴살 샐러드', '치킨까스'],
  '기본': ['김치찌개', '된장찌개', '계란국']
};

const MOCK_RECIPE_CONTENT = {
  '재료': `
🥘 2인분 기준

📌 필요한 재료:
- 주재료 200g
- 양파 1개
- 마늘 3쪽
- 간장 2스푼
- 설탕 1스푼
- 참기름 1스푼

💡 TMI: 이 레시피는 초보자도 쉽게 따라할 수 있어요!
`,
  '레시피': `
👨‍🍳 조리 방법:

1️⃣ 재료 손질하기
   - 양파는 채썰기
   - 마늘은 다지기

2️⃣ 볶기
   - 팬에 기름을 두르고 마늘을 볶아요
   - 향이 나면 주재료를 넣어주세요

3️⃣ 간하기
   - 간장, 설탕으로 간을 맞춰요
   - 약한 불에서 5분간 조려주세요

4️⃣ 완성
   - 참기름을 뿌리고 완성!

💡 TMI: 약한 불에서 천천히 조리하는 게 포인트!
`
};

function MainContentMock({ currentUser, setLoading }) {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeContent, setRecipeContent] = useState('');
  const [recipeMode, setRecipeMode] = useState('');
  const [showPopular, setShowPopular] = useState(true);

  const recommendRecipe = () => {
    const ing = ingredients.trim();
    
    if (!ing) {
      alert('재료를 입력해 주세요!');
      return;
    }

    setShowPopular(false);
    setSelectedRecipe(null);
    setRecipeContent('');
    setLoading(true);

    // 모의 API 호출 시뮬레이션
    setTimeout(() => {
      const key = Object.keys(MOCK_RECIPES).find(k => ing.includes(k));
      const mockRecipes = key ? MOCK_RECIPES[key] : MOCK_RECIPES['기본'];
      setRecipes(mockRecipes);
      setLoading(false);
      alert('💡 모의 데이터 모드입니다. 실제 OpenAI API 키를 설정하면 더 정확한 레시피를 받을 수 있어요!');
    }, 1000);
  };

  const handleRecipeSelect = (name) => {
    setSelectedRecipe(name);
    setRecipeContent('');
    setRecipeMode('');
  };

  const getRecipeContent = (name, mode) => {
    setLoading(true);
    
    // 모의 데이터 로드 시뮬레이션
    setTimeout(() => {
      setRecipeContent(MOCK_RECIPE_CONTENT[mode]);
      setRecipeMode(mode);
      setLoading(false);
    }, 800);
  };

  const saveRecipe = (name) => {
    if (!currentUser) {
      alert('로그인해야 저장 가능합니다!');
      return;
    }
    
    const key = `savedRecipes_${currentUser}`;
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (arr.includes(name)) {
      alert('이미 저장된 레시피입니다!');
      return;
    }
    
    arr.push(name);
    localStorage.setItem(key, JSON.stringify(arr));
    alert('⭐ 저장되었습니다!');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      recommendRecipe();
    }
  };

  return (
    <div className="container">
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '2px solid #ffc107'
      }}>
        ⚠️ <strong>모의 데이터 모드</strong>: OpenAI API 키를 확인하고 MainContent.js를 사용하세요.
      </div>

      <div className="input-container">
        <input 
          type="text" 
          placeholder="재료 입력 (예: 달걀, 돼지고기)" 
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={recommendRecipe}>
          <i className="fas fa-search"></i> 추천 받기
        </button>
      </div>

      {recipes.length > 0 && (
        <div>
          <h3>추천 요리 목록</h3>
          <div className="recipe-button-list">
            {recipes.map((name, index) => (
              <div key={index} className="recipe-item">
                <button 
                  className="recipe-btn-item" 
                  onClick={() => handleRecipeSelect(name)}
                >
                  {name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeResult 
          recipeName={selectedRecipe}
          mode={recipeMode}
          content={recipeContent}
          onModeChange={getRecipeContent}
          onSave={saveRecipe}
        />
      )}

      {showPopular && (
        <>
          <h2 className="section-title">
            <i className="fas fa-star"></i> 인기 요리 추천
          </h2>
          <PopularCarousel onRecipeSelect={handleRecipeSelect} />
        </>
      )}
    </div>
  );
}

export default MainContentMock;

