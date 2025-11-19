import React, { useState, useEffect } from 'react';
import { fetchPopularRecipes, getCacheInfo, clearPopularRecipesCache } from '../services/popularRecipeService';

// 요리별 이모지 (MZ세대 트렌드 추가)
const RECIPE_EMOJIS = {
  // 한식
  '김치찌개': '🥘', '된장찌개': '🍲', '순두부찌개': '🍜', '부대찌개': '🍲', '청국장찌개': '🥣',
  '불고기': '🥩', '갈비찜': '🍖', '삼겹살': '🥓', '제육볶음': '🍖', '닭볶음탕': '🍗',
  '떡볶이': '🌶️', '로제떡볶이': '🌶️', '치즈떡볶이': '🧀', '라볶이': '🍜',
  '김밥': '🍙', '비빔밥': '🍚', '돌솥비빔밥': '🍚', '참치김밥': '🍙', '누드김밥': '🥗',
  '김치볶음밥': '🍚', '볶음밥': '🍚', '새우볶음밥': '🍤', '계란찜': '🥚', 
  '계란말이': '🥚', '간장계란밥': '🍚', '김치찜': '🥘', '감자탕': '🍲',
  
  // 양식 (MZ세대 인기)
  '로제파스타': '🍝', '까르보나라': '🍝', '크림파스타': '🍝', '토마토파스타': '🍝', 
  '알리오올리오': '🍝', '파스타': '🍝', '봉골레파스타': '🍝', '명란파스타': '🍝',
  '새우파스타': '🍝', '냉파스타': '🍝', '리조또': '🍚', '스테이크덮밥': '🥩',
  '오므라이스': '🍳', '샌드위치': '🥪', '피자': '🍕', '치킨': '🍗', '스테이크': '🥩',
  '팬케이크': '🥞', '와플': '🧇', '크로플': '🧇', '프렌치토스트': '🍞', '토스트': '🍞',
  
  // 브런치/간단요리
  '에그인헬': '🍳', '샤크슈카': '🍳', '스크램블에그': '🍳', '베이컨에그': '🥓',
  
  // 다이어트/헬시
  '샐러드': '🥗', '닭가슴살샐러드': '🥗', '두부샐러드': '🥗', '단백질샐러드': '🥗',
  '닭가슴살요리': '🍗', '두부스테이크': '🍲', '두부요리': '🍲', '곤약요리': '🍲',
  '저칼로리요리': '🥗',
  
  // 중식/아시안
  '냉면': '🍜', '칼국수': '🍜', '수제비': '🥟', '라면': '🍜', '짜장면': '🍝',
  '짬뽕': '🍜', '탕수육': '🍗', '깐풍기': '🍗', '마라탕': '🌶️', '마라샹궈': '🌶️',
  '초밥': '🍣', '돈까스': '🍛', '우동': '🍜', '라멘': '🍜', '카레': '🍛',
  '팟타이': '🍜', '쌀국수': '🍜', '짜파구리': '🍜', '짜파게티': '🍝', 
  '불닭볶음면': '🌶️',
  
  // 술안주/야식
  '족발': '🥩', '보쌈': '🥓', '닭발': '🍗', '곱창': '🍖', '목살': '🥓', 
  '치즈볼': '🧀', '감자튀김': '🍟',
  
  // 기타
  '해장국': '🍲', '설렁탕': '🍜', '곰탕': '🍜', '삼계탕': '🍗',
  '닭갈비': '🍗', '찜닭': '🍗', '아구찜': '🐟',
  '소고기 미역국': '🥣', '된장국': '🍲', '잡채': '🍝', '참치마요덮밥': '🍚',
  '덮밥': '🍱', '브런치': '🍽️', '쿠키': '🍪', '브라우니': '🍫'
};

function PopularRanking({ onRecipeSelect }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true); // 접기/펼치기 상태
  const [isRealtime, setIsRealtime] = useState(false); // 실시간 데이터 여부
  const [showAll, setShowAll] = useState(false); // TOP 5 / TOP 10 전환

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    setLoading(true);
    try {
      const recipes = await fetchPopularRecipes(10);
      setRankings(recipes);
      
      const info = getCacheInfo();
      setCacheInfo(info);
      setIsRealtime(info !== null); // 캐시가 있으면 실시간 데이터
    } catch (error) {
      console.error('랭킹 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 테스트용: 캐시 삭제하고 강제로 새로 불러오기 (개발자 모드에서만 표시)
  const handleForceRefresh = async () => {
    const confirmed = window.confirm(
      '⚠️ 실시간 데이터를 강제로 불러옵니다.\n\n' +
      '네이버 API로 15개 요리를 검색합니다.\n' +
      '약 30초 정도 소요됩니다.\n\n계속하시겠습니까?'
    );
    
    if (confirmed) {
      clearPopularRecipesCache();
      console.log('🗑️ 캐시 삭제됨 - 강제 새로고침 시작...');
      await loadRankings();
    }
  };

  const getEmoji = (recipeName) => {
    return RECIPE_EMOJIS[recipeName] || '🍽️';
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) {
    return (
      <div className="popular-ranking-section">
        <div className="ranking-loading-state">
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p>실시간 인기요리 분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-ranking-minimal">
      {/* 헤더 - 클릭하면 접기/펼치기 */}
      <div 
        className="ranking-header-minimal clickable" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="ranking-title-with-badge">
          <h2>🔥 실시간 대한민국 인기 요리</h2>
          <span className={`naver-badge ${!isRealtime ? 'warning' : ''}`}>
            {isRealtime ? '*실시간 검색량 기반' : '*기본 랭킹 (API 미연결)'}
          </span>
        </div>
        <div className="ranking-header-right">
          {isRealtime && cacheInfo && (
            <span className="cache-text-minimal">{cacheInfo.hoursRemaining}시간 후 갱신</span>
          )}
          {!isRealtime && (
            <button 
              className="force-refresh-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleForceRefresh();
              }}
              title="네이버 API로 실시간 데이터 불러오기"
            >
              🔄 실시간 불러오기
            </button>
          )}
          <button className="toggle-btn" aria-label="접기/펼치기">
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* 전체 리스트 - 접기/펼치기 */}
      {isExpanded && (
        <>
          <div className="ranking-list-minimal">
            {rankings.slice(0, showAll ? 10 : 5).map((recipe, index) => {
              const rank = index + 1;
              return (
                <div 
                  key={index}
                  className={`rank-item-minimal ${rank <= 3 ? 'top-rank' : ''}`}
                  onClick={() => onRecipeSelect(recipe)}
                >
                  <span className="rank-number-minimal">{rank}</span>
                  <span className="rank-emoji-minimal">{getEmoji(recipe)}</span>
                  <span className="rank-name-minimal">{recipe}</span>
                </div>
              );
            })}
          </div>
          
          {rankings.length > 5 && (
            <button 
              className="show-more-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? '▲ TOP 5만 보기' : '▼ TOP 10 전체보기'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default PopularRanking;

