import React, { useEffect, useRef } from 'react';

const popularRecipeNames = [
  '김치찌개', '불고기', '잡채', '마라탕', '소고기 미역국',
  '떡볶이', '갈비찜', '순두부찌개', '닭볶음탕', '참치김밥', '부대찌개'
];

function PopularCarousel({ onRecipeSelect }) {
  const carouselRef = useRef(null);
  const animationRef = useRef(null);

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
  const extendedRecipes = [...popularRecipeNames, ...popularRecipeNames];

  return (
    <div className="popular-carousel-wrapper">
      <div ref={carouselRef} className="popular-carousel">
        {extendedRecipes.map((name, index) => (
          <div 
            key={index} 
            className="popular-item" 
            onClick={() => onRecipeSelect(name)}
          >
            <img 
              src={`/assets/images/popular/${name}.jpg`} 
              alt={name}
              onError={(e) => {
                e.target.onerror = null; // 무한 루프 방지
                // placeholder 대신 색상 배경 사용
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.height = '120px';
                e.target.nextElementSibling.style.display = 'flex';
                e.target.nextElementSibling.style.alignItems = 'center';
                e.target.nextElementSibling.style.justifyContent = 'center';
                e.target.nextElementSibling.style.backgroundColor = '#d25644';
                e.target.nextElementSibling.style.color = 'white';
                e.target.nextElementSibling.style.fontWeight = 'bold';
                e.target.nextElementSibling.style.fontSize = '16px';
              }}
            />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularCarousel;

