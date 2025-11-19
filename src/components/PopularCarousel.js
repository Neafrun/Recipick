import React, { useEffect, useRef, useState } from 'react';
import { fetchPopularRecipes } from '../services/popularRecipeService';

// 요리별 이모지 매핑 (MZ세대 트렌드 추가)
const RECIPE_EMOJIS = {
  // 한식
  '김치찌개': '🥘', '된장찌개': '🍲', '순두부찌개': '🍜', '부대찌개': '🍲', '청국장찌개': '🥣',
  '불고기': '🥩', '갈비찜': '🍖', '삼겹살': '🥓', '제육볶음': '🍖', '닭볶음탕': '🍗',
  '떡볶이': '🌶️', '김밥': '🍙', '비빔밥': '🍚', '돌솥비빔밥': '🍚', '참치김밥': '🍙',
  '김치볶음밥': '🍚', '볶음밥': '🍚', '계란찜': '🥚', '김치찜': '🥘',
  
  // 양식 (MZ세대 인기)
  '로제파스타': '🍝', '까르보나라': '🍝', '크림파스타': '🍝', '토마토파스타': '🍝', 
  '알리오올리오': '🍝', '파스타': '🍝', '리조또': '🍚', '스테이크덮밥': '🥩',
  '오므라이스': '🍳', '샌드위치': '🥪', '피자': '🍕', '치킨': '🍗', '스테이크': '🥩',
  '팬케이크': '🥞', '와플': '🧇', '프렌치토스트': '🍞', '토스트': '🍞',
  
  // 중식/아시안
  '냉면': '🍜', '칼국수': '🍜', '수제비': '🥟', '라면': '🍜', '짜장면': '🍝',
  '짬뽕': '🍜', '탕수육': '🍗', '깐풍기': '🍗', '마라탕': '🌶️', '마라샹궈': '🌶️',
  '초밥': '🍣', '돈까스': '🍛', '우동': '🍜', '라멘': '🍜', '카레': '🍛',
  '팟타이': '🍜',
  
  // 기타
  '감자탕': '🍲', '해장국': '🍲', '설렁탕': '🍜', '곰탕': '🍜', '삼계탕': '🍗',
  '닭갈비': '🍗', '족발': '🥩', '보쌈': '🥓', '찜닭': '🍗', '아구찜': '🐟',
  '소고기 미역국': '🥣', '된장국': '🍲', '잡채': '🍝', '참치마요덮밥': '🍚',
  '덮밥': '🍱', '샐러드': '🥗', '브런치': '🍽️', '스크램블에그': '🍳', 
  '베이컨에그': '🥓', '쿠키': '🍪', '브라우니': '🍫'
};

// 그라데이션 색상 배열
const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
];

function PopularCarousel({ onRecipeSelect }) {
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const [popularRecipes, setPopularRecipes] = useState([
    '로제파스타', '떡볶이', '김치찌개', '마라탕', '김치볶음밥',
    '까르보나라', '치킨', '불고기', '참치김밥', '비빔밥', '오므라이스'
  ]); // MZ세대 트렌드 초기 기본값
  const [isLoading, setIsLoading] = useState(true);
  
  // 요리 이름으로 이모지 가져오기
  const getEmoji = (recipeName) => {
    return RECIPE_EMOJIS[recipeName] || '🍽️';
  };
  
  // 요리 이름으로 그라데이션 색상 가져오기 (일관성 유지)
  const getGradient = (recipeName, index) => {
    const hash = recipeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return GRADIENT_COLORS[hash % GRADIENT_COLORS.length];
  };

  // 인기요리 데이터 가져오기
  useEffect(() => {
    const loadPopularRecipes = async () => {
      try {
        const recipes = await fetchPopularRecipes(11);
        setPopularRecipes(recipes);
      } catch (error) {
        console.error('인기요리 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularRecipes();
  }, []);

  // 캐러셀 애니메이션
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let position = 0;
    let paused = false;
    const itemWidth = 220;
    const totalItems = carousel.children.length;

    const handleMouseEnter = () => { paused = true; };
    const handleMouseLeave = () => { paused = false; };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    function scroll() {
      if (!paused) {
        position += 1;
        if (position >= itemWidth * (totalItems / 2)) {
          position = 0;
          carousel.style.transition = 'none';
          carousel.style.transform = `translateX(0px)`;
        } else {
          carousel.style.transition = 'transform 0.03s linear';
          carousel.style.transform = `translateX(-${position}px)`;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    }

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 이미지를 2번 반복하여 무한 스크롤 효과
  const extendedRecipes = [...popularRecipes, ...popularRecipes];

  return (
    <div className="popular-carousel-wrapper">
      {isLoading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#999',
          fontSize: '14px'
        }}>
          🔍 MZ세대 인기 레시피 불러오는 중...
        </div>
      )}
      <div ref={carouselRef} className="popular-carousel">
        {extendedRecipes.map((name, index) => {
          // 원본 배열에서의 실제 순위 계산 (중복 제거)
          const originalIndex = index % popularRecipes.length;
          const rank = originalIndex + 1;
          
          return (
            <div 
              key={index} 
              className="popular-item-simple" 
              onClick={() => onRecipeSelect(name)}
            >
              <div className="popular-card-simple">
                {/* 순위 숫자 */}
                <div className="rank-number-simple">
                  {rank}
                </div>
                
                {/* 이모지 */}
                <div className="emoji-simple">
                  {getEmoji(name)}
                </div>
                
                {/* 요리 이름 */}
                <div className="recipe-name-simple">
                  {name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PopularCarousel;

