import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PopularRanking from './PopularRanking';
import RecipeResult from './RecipeResult';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const YOUTUBE_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;

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
  const [naverBlogs, setNaverBlogs] = useState([]);
  const [isVideoExpanded, setIsVideoExpanded] = useState(true); // 유튜브 접기/펼치기 (초기: 펼쳐있음)
  const [recipeSource, setRecipeSource] = useState(''); // 'popular' or 'search'
  const [showPopularRanking, setShowPopularRanking] = useState(true); // 인기요리 표시 여부
  const [blogPage, setBlogPage] = useState(0); // 블로그 페이지
  const [videoPage, setVideoPage] = useState(0); // 비디오 페이지
  const [searchMode, setSearchMode] = useState(''); // 'exact' 또는 'flexible'
  const [showModeModal, setShowModeModal] = useState(false); // 검색 모드 선택 모달
  const [isTyping, setIsTyping] = useState(false); // 타이핑 효과 진행 중

  useEffect(() => {
    const loadRecipe = localStorage.getItem('loadRecipe');
    if (loadRecipe) {
      localStorage.removeItem('loadRecipe');
      handleRecipeSelect(loadRecipe);
    }
  }, []);

  // 타이핑 효과 함수 (청크 단위로 빠르게)
  const typeWriter = async (text, chunkSize = 20, speed = 10) => {
    setIsTyping(true);
    setRecipeContent('');
    
    for (let i = 0; i <= text.length; i += chunkSize) {
      setRecipeContent(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    // 마지막 전체 텍스트 설정
    setRecipeContent(text);
    setIsTyping(false);
  };

  // Gemini API 호출 (단일 모델 사용)
  const callGeminiAPI = async (prompt, maxTokens = 100) => {
    if (!GEMINI_KEY || GEMINI_KEY === 'your_gemini_api_key_here') {
      throw new Error('API_KEY_MISSING');
    }

    try {
      const result = await tryAPICall(GEMINI_CONFIG, prompt, maxTokens);
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

  const handleSearchClick = () => {
    const ing = ingredients.trim();
    if (!ing) {
      alert('재료를 입력해주세요!');
      return;
    }
    setShowModeModal(true); // 모달 띄우기
  };

  const recommendRecipe = async (mode) => {
    setShowModeModal(false); // 모달 닫기
    setSearchMode(mode);
    
    const ing = ingredients.trim();

    setRecipes([]);
    setSelectedRecipe(null);
    setRecipeContent('');
    setVideos([]);
    setNaverBlogs([]);
    setShowPopularRanking(false); // AI 검색 시 인기요리 숨김
    setLoading(true);

    try {
      const prompt = mode === 'exact'
        ? `재료: ${ing}\n\n위 재료들만으로 만들 수 있는 간단한 요리 3가지를 요리 이름만 출력해줘. 설명 없이 요리 이름만 한 줄에 하나씩. 예시:\n1. 계란볶음밥\n2. 김치찌개\n3. 된장국`
        : `재료: ${ing}\n\n위 재료들을 활용한 요리 3가지를 요리 이름만 출력해줘. 설명 없이 요리 이름만 한 줄에 하나씩. 예시:\n1. 계란볶음밥\n2. 김치찌개\n3. 된장국`;
      console.log('📝 프롬프트:', prompt);
      const text = await callGeminiAPI(prompt, 100);
      
      const list = text.split('\n').filter(v => v.trim());
      const recipeNames = list
        .map(item => item.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
        .filter(item => {
          // 불필요한 설명 문구 필터링
          const excludePatterns = [
            '다음은', '제공된', '재료를', '활용하여', '만들 수 있는', '요리', '입니다', 
            '추천', '드립니다', '다음과 같', '아래', '예시'
          ];
          const hasExcludePattern = excludePatterns.some(pattern => item.includes(pattern));
          return item.length > 0 && item.length < 30 && !hasExcludePattern;
        });
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

  const handleRecipeSelect = (name, source = 'search') => {
    setSelectedRecipe(name);
    setRecipeContent('');
    setRecipeMode('');
    setVideos([]);
    setNaverBlogs([]);
    setRecipeSource(source);
    setBlogPage(0);
    setVideoPage(0);
    
    // 인기 요리 선택 시에는 "재료 추가 가능" 모드로 설정
    if (source === 'popular') {
      setSearchMode('flexible');
    }
    
    loadNaverBlogs(name);
    // 자동으로 레시피 로드
    getRecipeContent(name, '레시피');
  };

  const loadNaverBlogs = async (query) => {
    try {
      if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        console.warn('네이버 API 키가 설정되지 않았습니다.');
        return;
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      const searchQuery = encodeURIComponent(query + ' 레시피');
      
      const url = isDevelopment 
        ? `/api/naver/v1/search/blog.json?query=${searchQuery}&display=9&sort=sim`
        : `/api/naver-search?query=${searchQuery}`;
      
      const headers = isDevelopment 
        ? {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
          }
        : {};
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setNaverBlogs(data.items);
        }
      }
    } catch (error) {
      console.error('네이버 블로그 검색 오류:', error);
    }
  };

  const getRecipeContent = async (name, mode) => {
    const cacheKey = `cache_${name}_${mode}_${searchMode}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setRecipeMode(mode);
      // 캐시된 내용도 타이핑 효과 (더 빠르게)
      await typeWriter(cached, 30, 5);
      if (mode === '레시피') {
        loadYouTubeVideos(name);
      }
      return;
    }

    setLoading(true);

    // 검색 모드에 따라 다른 프롬프트 작성
    let prompt;
    
    if (searchMode === 'exact') {
      // "입력한 재료만" 모드
      prompt = `${name} 레시피를 아주 초보자도 따라할 수 있도록 아래 형식으로 정확히 작성해줘:

[기본 정보]
- 인원: 몇 인분인지 명확히 (예: 2인분)
- 난이도: 하/중/상
- 조리시간: 약 몇 분

[필요한 재료]
모든 재료를 정확한 양과 단위로 작성 (g, ml, 개, 큰술, 작은술 등)
- 주재료: ${ingredients} (사용자가 입력한 재료만 여기에 포함)
- 있으면 좋은 재료: (양파, 당근, 소금, 후추 등 요리에 필요한 추가 재료가 있다면 여기에 표시)

[조리 도구]
필요한 도구들 (예: 프라이팬, 냄비, 도마 등)

[조리 과정]
각 단계를 매우 상세하게 작성:
1. 재료 손질 방법 (크기, 모양까지 구체적으로)
2. 불 세기와 시간 명시 (중불, 약불, 강불 등)
3. 익히는 정도 설명 (색깔, 소리, 냄새 등으로 판단)
4. 각 단계마다 주의사항과 팁 추가

전문용어는 쉽게 풀어서 설명하고, 이모지를 적절히 사용해서 보기 좋게 작성해줘.
**중요: 위의 모든 섹션을 반드시 모두 포함해서 작성해줘.**`;
    } else {
      // "재료 추가 가능" 모드
      prompt = `${name} 레시피를 아주 초보자도 따라할 수 있도록 아래 형식으로 정확히 작성해줘:

[기본 정보]
- 인원: 몇 인분인지 명확히 (예: 2인분)
- 난이도: 하/중/상
- 조리시간: 약 몇 분

[필요한 재료]
모든 재료를 정확한 양과 단위로 작성 (g, ml, 개, 큰술, 작은술 등)
- 주재료: (메인이 되는 재료)
- 부재료: (추가로 필요한 재료)

[조리 도구]
필요한 도구들 (예: 프라이팬, 냄비, 도마 등)

[조리 과정]
각 단계를 매우 상세하게 작성:
1. 재료 손질 방법 (크기, 모양까지 구체적으로)
2. 불 세기와 시간 명시 (중불, 약불, 강불 등)
3. 익히는 정도 설명 (색깔, 소리, 냄새 등으로 판단)
4. 각 단계마다 주의사항과 팁 추가

전문용어는 쉽게 풀어서 설명하고, 이모지를 적절히 사용해서 보기 좋게 작성해줘.
**중요: 위의 모든 섹션을 반드시 모두 포함해서 작성해줘.**`;
    }

    try {
      const content = await callGeminiAPI(prompt, 2500);
      localStorage.setItem(cacheKey, content);
      setRecipeMode(mode);
      
      // API 호출 완료 후 로딩 해제
      setLoading(false);
      
      // 타이핑 효과 적용 (20글자씩, 10ms 간격)
      await typeWriter(content, 20, 10);
      
      if (mode === '레시피') {
        loadYouTubeVideos(name);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('레시피 내용을 불러오는 중 오류가 발생했습니다.\n\n' + error.message);
      setLoading(false);
    }
  };

  const loadYouTubeVideos = async (query) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query + ' 레시피')}&key=${YOUTUBE_KEY}`;
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
      handleSearchClick();
    }
  };

  return (
    <div className="container">
      <div className="input-container">
        <input 
          type="text" 
          placeholder="재료 입력 (예: 달걀, 양파, 돼지고기)" 
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearchClick}>
          <i className="fas fa-search"></i> 추천 받기
        </button>
      </div>

      {/* 검색 모드 선택 모달 - Portal 사용 */}
      {showModeModal && ReactDOM.createPortal(
        <div className="mode-modal-overlay" onClick={() => setShowModeModal(false)}>
          <div className="mode-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>어떤 방식으로 요리를 추천받으시겠어요?</h3>
            <p className="mode-modal-subtitle">냉장고 재료만 사용하거나, 추가 재료를 구매할 수도 있어요</p>
            <div className="mode-modal-buttons">
              <button 
                className="mode-modal-btn exact"
                onClick={() => recommendRecipe('exact')}
              >
                <i className="fas fa-lock"></i>
                <div className="mode-btn-content">
                  <strong>입력한 재료만</strong>
                  <span>추가 구매 없이 지금 있는 재료로만</span>
                </div>
              </button>
              <button 
                className="mode-modal-btn flexible"
                onClick={() => recommendRecipe('flexible')}
              >
                <i className="fas fa-unlock"></i>
                <div className="mode-btn-content">
                  <strong>재료 추가 가능</strong>
                  <span>필요한 재료를 더 구매해도 괜찮아요</span>
                </div>
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('modal-root')
      )}

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
          naverBlogs={naverBlogs}
          recipeSource={recipeSource}
          blogPage={blogPage}
          setBlogPage={setBlogPage}
        />
      )}

      {videos.length > 0 && (
        <div className="naver-blogs-section">
          <div 
            className="blog-section-header clickable"
            onClick={() => setIsVideoExpanded(!isVideoExpanded)}
          >
            <div className="blog-header-content">
              <h4>🎥 영상으로도 배워볼까요?</h4>
              <p className="blog-subtitle">요리 과정을 영상으로 확인하면 더 쉬워요!</p>
            </div>
            <span className="collapse-icon">{isVideoExpanded ? '−' : '+'}</span>
          </div>
          {isVideoExpanded && (
            <>
              <div className="youtube-grid">
                {videos.slice(videoPage * 4, (videoPage + 1) * 4).map((video, index) => (
                  <div key={index} className="youtube-card">
                    <iframe 
                      width="100%" 
                      height="200" 
                      src={`https://www.youtube.com/embed/${video.id.videoId}?origin=${window.location.origin}&rel=0`} 
                      frameBorder="0" 
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={video.snippet.title}
                    ></iframe>
                    <p className="youtube-title">{video.snippet.title}</p>
                  </div>
                ))}
              </div>
              {videos.length > 4 && (
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={() => setVideoPage(Math.max(0, videoPage - 1))}
                    disabled={videoPage === 0}
                  >
                    ◀ 이전
                  </button>
                  <span className="pagination-info">
                    {videoPage + 1} / {Math.ceil(videos.length / 4)}
                  </span>
                  <button 
                    className="pagination-btn"
                    onClick={() => setVideoPage(Math.min(Math.ceil(videos.length / 4) - 1, videoPage + 1))}
                    disabled={(videoPage + 1) * 4 >= videos.length}
                  >
                    다음 ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showPopularRanking && (
        <PopularRanking onRecipeSelect={(name) => handleRecipeSelect(name, 'popular')} />
      )}
    </div>
  );
}

export default MainContentGemini;
