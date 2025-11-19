import React, { useState, useEffect } from 'react';
import { fetchPopularRecipes, getCacheInfo } from '../services/popularRecipeService';

// 요리별 이모지
const RECIPE_EMOJIS = {
  '김치찌개': '🥘', '된장찌개': '🍲', '순두부찌개': '🍜', '부대찌개': '🍲', '청국장찌개': '🥣',
  '불고기': '🥩', '갈비찜': '🍖', '삼겹살': '🥓', '제육볶음': '🍖', '닭볶음탕': '🍗',
  '잡채': '🍝', '떡볶이': '🌶️', '김밥': '🍙', '비빔밥': '🍚', '돌솥비빔밥': '🍚',
  '냉면': '🍜', '칼국수': '🍜', '수제비': '🥟', '라면': '🍜', '짜장면': '🍝',
  '짬뽕': '🍜', '탕수육': '🍗', '깐풍기': '🍗', '마라탕': '🌶️', '마라샹궈': '🌶️',
  '감자탕': '🍲', '해장국': '🍲', '설렁탕': '🍜', '곰탕': '🍜', '삼계탕': '🍗',
  '닭갈비': '🍗', '족발': '🥩', '보쌈': '🥓', '찜닭': '🍗', '아구찜': '🐟',
  '참치김밥': '🍙', '치킨': '🍗', '피자': '🍕', '파스타': '🍝', '스테이크': '🥩',
  '초밥': '🍣', '돈까스': '🍛', '우동': '🍜', '라멘': '🍜', '카레': '🍛',
  '소고기 미역국': '🥣', '계란찜': '🥚', '된장국': '🍲', '김치볶음밥': '🍚', '볶음밥': '🍚'
};

function PopularRankingModal({ onClose, onRecipeSelect }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cacheInfo, setCacheInfo] = useState(null);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    setLoading(true);
    try {
      // 인기요리 데이터 로드 (캐시 또는 새로 가져오기)
      const recipes = await fetchPopularRecipes(11);
      setRankings(recipes);
      
      // 캐시 정보 로드
      const info = getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('랭킹 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (recipeName) => {
    return RECIPE_EMOJIS[recipeName] || '🍽️';
  };

  const handleRecipeClick = (recipe) => {
    onRecipeSelect(recipe);
    onClose();
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ranking-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="ranking-header">
          <h2>🔥 실시간 인기요리 TOP 11</h2>
          <p className="ranking-subtitle">
            네이버 검색량 기반 · 대한민국 트렌드
          </p>
          {cacheInfo && (
            <div className="cache-info">
              <span className="cache-badge">
                {cacheInfo.isValid ? '✅ 최신 데이터' : '⚠️ 업데이트 필요'}
              </span>
              <span className="cache-time">
                마지막 업데이트: {cacheInfo.lastUpdated}
              </span>
              <span className="cache-refresh">
                {cacheInfo.hoursRemaining}시간 후 자동 갱신
              </span>
            </div>
          )}
        </div>

        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* 로딩 */}
        {loading ? (
          <div className="ranking-loading">
            <div className="loading-spinner"></div>
            <p>실시간 인기요리 분석 중...</p>
          </div>
        ) : (
          <>
            {/* 랭킹 리스트 */}
            <div className="ranking-list">
              {rankings.map((recipe, index) => {
                const rank = index + 1;
                const medal = getMedalEmoji(rank);
                
                return (
                  <div 
                    key={index} 
                    className={`ranking-item ${rank <= 3 ? 'top-three' : ''}`}
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div className="rank-section">
                      <div className="rank-number">
                        {medal || rank}
                      </div>
                      {rank <= 3 && (
                        <div className="rank-badge-text">
                          TOP {rank}
                        </div>
                      )}
                    </div>

                    <div className="recipe-emoji">
                      {getEmoji(recipe)}
                    </div>

                    <div className="recipe-info">
                      <h3>{recipe}</h3>
                      <div className="recipe-stats">
                        <span className="stat-item">
                          🔍 검색 트렌드: {rank <= 3 ? '🔥 급상승' : rank <= 7 ? '📈 인기' : '✨ 관심'}
                        </span>
                      </div>
                    </div>

                    <div className="recipe-action">
                      <button className="view-recipe-btn">
                        레시피 보기 →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 하단 정보 */}
            <div className="ranking-footer">
              <p>💡 <strong>Tip:</strong> 요리를 클릭하면 상세 레시피를 볼 수 있어요!</p>
              <button className="refresh-btn" onClick={loadRankings}>
                🔄 새로고침
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PopularRankingModal;

