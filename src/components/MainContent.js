import React, { useState, useEffect } from 'react';
import PopularCarousel from './PopularCarousel';
import RecipeResult from './RecipeResult';

const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const YOUTUBE_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

function MainContent({ currentUser, setLoading }) {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeContent, setRecipeContent] = useState('');
  const [recipeMode, setRecipeMode] = useState(''); // '재료' 또는 '레시피'
  const [videos, setVideos] = useState([]);
  const [showPopular, setShowPopular] = useState(true);

  useEffect(() => {
    // 저장된 레시피 불러오기
    const loadRecipe = localStorage.getItem('loadRecipe');
    if (loadRecipe) {
      localStorage.removeItem('loadRecipe');
      handleRecipeSelect(loadRecipe);
    }
  }, []);

  const recommendRecipe = async () => {
    const ing = ingredients.trim();
    
    if (!ing) {
      alert('재료를 입력해 주세요!');
      return;
    }

    setShowPopular(false);
    setRecipes([]);
    setSelectedRecipe(null);
    setRecipeContent('');
    setVideos([]);
    setLoading(true);

    try {
      if (!OPENAI_KEY || OPENAI_KEY === 'your_openai_api_key_here') {
        alert('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
        setLoading(false);
        return;
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + OPENAI_KEY
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // 옵션: 'gpt-4', 'gpt-4-turbo', 'gpt-4o-mini'
          messages: [
            { role: 'user', content: `입력한 재료만 사용해서 만들 수 있는 요리 3가지를 알려줘. 요리 이름만 나열해줘: ${ing}` }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      const json = await res.json();
      
      // API 오류 응답 처리
      if (!res.ok) {
        if (res.status === 429) {
          alert('⚠️ OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        } else if (res.status === 401) {
          alert('❌ OpenAI API 키가 유효하지 않습니다. .env 파일의 API 키를 확인해주세요.');
        } else {
          alert(`API 오류: ${json.error?.message || '알 수 없는 오류가 발생했습니다.'}`);
        }
        setLoading(false);
        return;
      }

      // 응답 데이터 검증
      if (!json.choices || !json.choices[0] || !json.choices[0].message) {
        alert('올바른 응답을 받지 못했습니다. 다시 시도해주세요.');
        setLoading(false);
        return;
      }

      const list = json.choices[0].message.content.split('\n').filter(v => v.trim());
      const recipeNames = list.map(item => item.replace(/^\d+\.\s*/, '').trim());
      setRecipes(recipeNames);
    } catch (error) {
      console.error('Error:', error);
      alert('레시피 추천 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeSelect = (name) => {
    setSelectedRecipe(name);
    setRecipeContent('');
    setRecipeMode('');
    setVideos([]);
  };

  const getRecipeContent = async (name, mode) => {
    const cacheKey = `cache_${name}_${mode}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setRecipeContent(cached);
      setRecipeMode(mode);
      if (mode === '레시피') {
        loadYouTubeVideos(name);
      }
      return;
    }

    setLoading(true);

    const prompt = (mode === '재료')
      ? `${name} 처음 요리를 하는 사람들도 쉽게 따라 할 수 있는 수준으로 레시피를 작성해줘 그리고 익힘의 정도나 써는 방법 재료의 양을 덧붙여줘 
      요리를 만들 때 들어가는 모든 재료를 '몇 인분 기준인지' 명확히 밝혀주고, 그리고 몇 인분인지 설명을 최상단에 배치해 줘 각 재료의 이름과 양(예: g, ml, 개 등 단위 포함)을 보기 좋게 줄바꿈 해서 알려줘. 
      그래프, 표는 쓰지 마 그리고 한국어로 작성해 주고 친절하게 작성해 줘 그리고 사람들이 모를 것 같은 전문용어나 단어는 설명해 주는 내용 덧붙여줘 
      그리고 "한 인분" "두 인분" 이런 식으로 작성하지 말고 1인분 이렇게 작성해 줘 그리고 상황에 맞는 이모티콘 넣어서 작성해 줘 
     그리고 진짜 사람들이 모를만한 정보만 추가적으로 출력해 줘 
     그리고 맞춤법 똑바로 지켜서 출력해 줘. 그리고 네가 명심해야 하는 건 레시피 보기에선 레시피만 깔끔하게 정리돼서 나오게 만들어줘야 해 
     그리고 많은 재료 입력해서 적합한 요리가 없어도 너가 알아서 요리를 창조해서 맛있게 만들어줘 재료를 많이 입력해서 없는 요리여도 너가 적합한 요리를 만들어줘 
     그리고 만약에 내가 입력한 재료가 아닌 재료를 출력해줄 거면 따로 입력하지 않은 재료 이렇게 출력을 해줄래 그리고 내가 입력한 재료랑 내가 입력하지 않은 재료 구분해서 작성해주라 
     그리고 사람들이 보면서 웃을 수 있게 Tmi를 넣어서 작성해줘`
      : `${name}의 조리법을 순서대로 알려줘.`;

    try {
      if (!OPENAI_KEY || OPENAI_KEY === 'your_openai_api_key_here') {
        alert('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
        setLoading(false);
        return;
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + OPENAI_KEY
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // 옵션: 'gpt-4', 'gpt-4-turbo', 'gpt-4o-mini'
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      const json = await res.json();
      
      // API 오류 응답 처리
      if (!res.ok) {
        if (res.status === 429) {
          alert('⚠️ OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        } else if (res.status === 401) {
          alert('❌ OpenAI API 키가 유효하지 않습니다. .env 파일의 API 키를 확인해주세요.');
        } else {
          alert(`API 오류: ${json.error?.message || '알 수 없는 오류가 발생했습니다.'}`);
        }
        setLoading(false);
        return;
      }

      // 응답 데이터 검증
      if (!json.choices || !json.choices[0] || !json.choices[0].message) {
        alert('올바른 응답을 받지 못했습니다. 다시 시도해주세요.');
        setLoading(false);
        return;
      }

      const content = json.choices[0].message.content;
      localStorage.setItem(cacheKey, content);
      setRecipeContent(content);
      setRecipeMode(mode);
      
      if (mode === '레시피') {
        loadYouTubeVideos(name);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('레시피 내용을 불러오는 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const loadYouTubeVideos = async (query) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&q=${encodeURIComponent(query + ' 레시피')}&key=${YOUTUBE_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        setVideos(data.items);
      }
    } catch (error) {
      console.error('YouTube API Error:', error);
    }
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

      {videos.length > 0 && (
        <div id="popularVideos">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <iframe 
                width="300" 
                height="200" 
                src={`https://www.youtube.com/embed/${video.id.videoId}`} 
                frameBorder="0" 
                allowFullScreen
                title={video.snippet.title}
              ></iframe>
              <p>{video.snippet.title}</p>
            </div>
          ))}
        </div>
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

export default MainContent;

