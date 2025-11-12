import React, { useState, useEffect } from 'react';
import PopularCarousel from './PopularCarousel';
import RecipeResult from './RecipeResult';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const YOUTUBE_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// 안정적인 모델 하나만 사용 (토큰 절약)
const GEMINI_CONFIG = {
  version: 'v1beta',
  model: 'gemini-2.5-flash-lite'
};

function MainContentGemini({ currentUser, setLoading }) {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeContent, setRecipeContent] = useState('');
  const [recipeMode, setRecipeMode] = useState('');
  const [videos, setVideos] = useState([]);
  const [showPopular, setShowPopular] = useState(true);
  const [apiStatus, setApiStatus] = useState(''); // API 상태 메시지

  useEffect(() => {
    const loadRecipe = localStorage.getItem('loadRecipe');
    if (loadRecipe) {
      localStorage.removeItem('loadRecipe');
      handleRecipeSelect(loadRecipe);
    }
  }, []);

  // Gemini API 호출 (단일 모델 사용)
  const callGeminiAPI = async (prompt, maxTokens = 100) => {
    if (!GEMINI_KEY || GEMINI_KEY === 'your_gemini_api_key_here') {
      throw new Error('API_KEY_MISSING');
    }

    try {
      const result = await tryAPICall(GEMINI_CONFIG, prompt, maxTokens);
      setApiStatus(`✅ 작동 중: ${GEMINI_CONFIG.model}`);
      return result;
    } catch (error) {
      console.error(`❌ API 오류 (${GEMINI_CONFIG.model}):`, error.message);
      throw error;
    }
  };

  const tryAPICall = async (config, prompt, maxTokens) => {
    const url = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${GEMINI_KEY}`;
    
    console.log(`🌐 API 호출 시도: ${config.version}/${config.model}`);
    console.log(`📍 URL:`, url.replace(GEMINI_KEY, 'API_KEY_HIDDEN'));
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens
        }
      })
    });

    const json = await res.json();

    console.log(`📊 API 응답 (${res.status}):`, json);

    if (!res.ok) {
      console.error(`❌ API 오류 (${config.version}/${config.model}):`, json);
      throw new Error(json.error?.message || `HTTP ${res.status}`);
    }

    if (!json.candidates || !json.candidates[0] || !json.candidates[0].content) {
      throw new Error('Invalid response structure');
    }

    return json.candidates[0].content.parts[0].text;
  };

  const recommendRecipe = async () => {
    const ing = ingredients.trim();
    
    if (!ing) {
      alert('재료를 입력해 주세요!');
      return;
    }

    // 🔍 디버깅: API 키 확인
    console.log('🔑 Gemini API Key 확인:', GEMINI_KEY ? `${GEMINI_KEY.substring(0, 20)}...` : '❌ 없음');
    console.log('🔑 API Key 길이:', GEMINI_KEY?.length);
    console.log('🔍 환경 변수 전체:', process.env);

    setShowPopular(false);
    setRecipes([]);
    setSelectedRecipe(null);
    setRecipeContent('');
    setVideos([]);
    setLoading(true);

    try {
      const prompt = `입력한 재료만 사용해서 만들 수 있는 요리 3가지를 알려줘. 요리 이름만 나열해줘: ${ing}`;
      console.log('📝 프롬프트:', prompt);
      const text = await callGeminiAPI(prompt, 100);
      
      const list = text.split('\n').filter(v => v.trim());
      const recipeNames = list.map(item => item.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim());
      setRecipes(recipeNames);
    } catch (error) {
      console.error('Error:', error);
      
      if (error.message === 'API_KEY_MISSING') {
        alert('🔑 Gemini API 키가 설정되지 않았습니다.\n\n1. https://aistudio.google.com/app/apikey 에서 무료 API 키 발급\n2. .env 파일에 REACT_APP_GEMINI_API_KEY 추가\n3. 개발 서버 재시작');
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        alert('⚠️ API 요청 한도 초과\n\n무료 버전 한도:\n- 분당 15회\n- 일일 1,500회\n\n잠시 후 다시 시도해주세요.');
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        alert('❌ 모델을 찾을 수 없습니다\n\n해결 방법:\n1. API 키를 새로 발급받아보세요\n2. 몇 분 후 다시 시도해보세요\n3. 또는 check-gemini-models.html로 사용 가능한 모델 확인');
      } else {
        alert('❌ 오류 발생\n\n' + error.message + '\n\n브라우저 콘솔(F12)에서 자세한 내용을 확인하세요.');
      }
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
      const content = await callGeminiAPI(prompt, 1000);
      localStorage.setItem(cacheKey, content);
      setRecipeContent(content);
      setRecipeMode(mode);
      
      if (mode === '레시피') {
        loadYouTubeVideos(name);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('레시피 내용을 불러오는 중 오류가 발생했습니다.\n\n' + error.message);
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
      <div style={{
        backgroundColor: '#e8f5e9',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '2px solid #4caf50',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '24px' }}>🤖</span>
        <div style={{ flex: 1 }}>
          <strong>Google Gemini 사용 중</strong> - 무료 AI 모델!
          {apiStatus && <div style={{ fontSize: '12px', marginTop: '5px', color: '#2e7d32' }}>{apiStatus}</div>}
        </div>
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

export default MainContentGemini;
