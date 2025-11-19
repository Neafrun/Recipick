// 네이버 검색 API를 활용한 인기 요리 자동 업데이트 서비스

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;

// MZ세대 인기 요리 레시피 리스트 (검색할 후보군)
const KOREAN_RECIPES = [
  // 트렌디 한식
  '김치찌개', '떡볶이', '로제떡볶이', '치즈떡볶이', '김치볶음밥', '간장계란밥',
  '참치김밥', '누드김밥', '비빔밥', '불고기', '제육볶음', '순두부찌개',
  '부대찌개', '계란찜', '계란말이', '된장찌개', '김치찜', '감자탕',
  
  // 파스타 트렌드
  '로제파스타', '까르보나라', '알리오올리오', '크림파스타', '토마토파스타',
  '봉골레파스타', '알리오올리오', '명란파스타', '새우파스타', '냉파스타',
  
  // 간편식/자취생 요리
  '오므라이스', '볶음밥', '새우볶음밥', '참치마요덮밥', '스테이크덮밥',
  '카레', '짜파구리', '라면', '짜파게티', '불닭볶음면',
  
  // 브런치/간단요리
  '토스트', '에그인헬', '샤크슈카', '스크램블에그', '베이컨에그',
  '샌드위치', '프렌치토스트', '팬케이크', '와플', '크로플',
  
  // 다이어트/헬시
  '샐러드', '닭가슴살샐러드', '두부샐러드', '단백질샐러드', '곤약요리',
  '닭가슴살요리', '두부스테이크', '두부요리', '저칼로리요리',
  
  // 중식/아시안
  '마라탕', '마라샹궈', '짜장면', '짬뽕', '탕수육', '깐풍기',
  '팟타이', '쌀국수', '라멘', '우동', '돈까스',
  
  // 술안주/야식
  '치킨', '감자튀김', '떡볶이', '김밥', '족발', '보쌈',
  '닭발', '곱창', '삼겹살', '목살', '치즈볼'
];

/**
 * 환경 구분 (개발 vs 배포)
 */
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 네이버 검색 API로 요리의 블로그 검색 결과 개수 조회
 */
const getRecipePopularity = async (recipeName) => {
  try {
    const query = encodeURIComponent(recipeName + ' 레시피');
    
    // 개발 환경: setupProxy.js를 통한 프록시 사용
    // 배포 환경: Vercel 서버리스 함수 사용
    const url = isDevelopment 
      ? `/api/naver/v1/search/blog.json?query=${query}&display=1`
      : `/api/naver-search?query=${query}`;
    
    const headers = isDevelopment 
      ? {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        }
      : {}; // 배포 환경에서는 서버리스 함수가 헤더 처리
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`⚠️ Rate Limit: ${recipeName} (잠시 후 다시 시도)`);
      } else {
        console.error(`Failed to fetch ${recipeName}:`, response.status);
      }
      return { name: recipeName, count: 0 };
    }

    const data = await response.json();
    return {
      name: recipeName,
      count: data.total || 0, // 전체 검색 결과 개수
    };
  } catch (error) {
    console.error(`Error fetching ${recipeName}:`, error);
    return { name: recipeName, count: 0 };
  }
};

/**
 * 지연 함수 (Rate Limit 방지)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 여러 요리의 인기도를 순차적으로 조회 (Rate Limit 방지)
 */
const getMultipleRecipePopularity = async (recipeList) => {
  const results = [];
  
  // 배치로 나눠서 처리 (5개씩, API 한도 고려)
  const batchSize = 5;
  const delayBetweenBatches = 1200; // 1.2초 (API 부담 줄이기)
  const delayBetweenRequests = 250; // 0.25초
  
  for (let i = 0; i < recipeList.length; i += batchSize) {
    const batch = recipeList.slice(i, i + batchSize);
    const progress = Math.floor((i / recipeList.length) * 100);
    console.log(`🔍 인기도 분석: ${progress}% (${i}/${recipeList.length})`);
    
    // 배치 내에서는 짧은 딜레이로 순차 처리
    for (const recipe of batch) {
      const result = await getRecipePopularity(recipe);
      if (result.count > 0) {
        console.log(`  ✓ ${recipe}: ${result.count.toLocaleString()}개`);
      }
      results.push(result);
      await delay(delayBetweenRequests);
    }
    
    // 다음 배치 전에 대기 (API 한도 고려)
    if (i + batchSize < recipeList.length) {
      await delay(delayBetweenBatches);
    }
  }
  
  console.log('✅ 검색 완료');
  return results;
};

/**
 * 인기 요리 TOP N 가져오기 (캐싱 포함)
 */
export const fetchPopularRecipes = async (topN = 11) => {
  const CACHE_KEY = 'popular_recipes_cache';
  const CACHE_TIME_KEY = 'popular_recipes_cache_time';
  const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6시간 (더 자주 업데이트)

  try {
    // 1. 캐시 확인
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cachedData && cachedTime) {
      const timeElapsed = Date.now() - parseInt(cachedTime);
      
      // 캐시가 유효한 경우 (6시간 이내)
      if (timeElapsed < CACHE_DURATION) {
        console.log('📦 캐시에서 인기요리 로드:', new Date(parseInt(cachedTime)).toLocaleString());
        return JSON.parse(cachedData);
      }
    }

    // 2. 네이버 API 키 확인
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || 
        NAVER_CLIENT_ID === 'your_naver_client_id_here') {
      console.warn('⚠️ 네이버 API 키가 설정되지 않아 기본 인기요리 사용');
      return getDefaultPopularRecipes();
    }

    console.log('🔥 실시간 인기요리 검색 시작 (네이버 API)');

    // 3. API 한도를 고려하여 적당한 개수만 검색 (15개)
    const selectedRecipes = KOREAN_RECIPES
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);

    console.log(`📊 ${selectedRecipes.length}개 요리 분석 중 (API 한도 고려)`);

    // 4. 각 요리의 인기도 조회
    const popularityResults = await getMultipleRecipePopularity(selectedRecipes);

    // 5. 인기도 순으로 정렬 (검색 결과가 많은 순)
    const sortedRecipes = popularityResults
      .filter(recipe => recipe.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, topN)
      .map(recipe => recipe.name);

    // 6. 결과가 충분하지 않으면 기본값으로 채우기
    if (sortedRecipes.length < topN) {
      const defaultRecipes = getDefaultPopularRecipes();
      while (sortedRecipes.length < topN && defaultRecipes.length > 0) {
        const recipe = defaultRecipes.shift();
        if (!sortedRecipes.includes(recipe)) {
          sortedRecipes.push(recipe);
        }
      }
    }

    // 7. 캐시 저장
    localStorage.setItem(CACHE_KEY, JSON.stringify(sortedRecipes));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

    console.log('✅ 인기요리 업데이트 완료 (6시간 후 자동 갱신)');
    console.log('🏆 TOP 10:', sortedRecipes.slice(0, 5).join(', '), '...');
    return sortedRecipes;

  } catch (error) {
    console.error('❌ 인기요리 조회 실패:', error);
    return getDefaultPopularRecipes();
  }
};

/**
 * 기본 인기 요리 목록 (API 실패 시 폴백) - MZ세대 트렌드
 */
const getDefaultPopularRecipes = () => {
  return [
    '로제파스타', '로제떡볶이', '김치찌개', '마라탕', '간장계란밥',
    '오므라이스', '까르보나라', '김치볶음밥', '참치김밥', '에그인헬', '치킨'
  ];
};

/**
 * 캐시 수동 삭제 (테스트용)
 */
export const clearPopularRecipesCache = () => {
  localStorage.removeItem('popular_recipes_cache');
  localStorage.removeItem('popular_recipes_cache_time');
  console.log('🗑️ 인기요리 캐시 삭제 완료');
};

/**
 * 캐시 정보 확인
 */
export const getCacheInfo = () => {
  const cachedTime = localStorage.getItem('popular_recipes_cache_time');
  if (cachedTime) {
    const cacheDate = new Date(parseInt(cachedTime));
    const timeElapsed = Date.now() - parseInt(cachedTime);
    const hoursRemaining = Math.max(0, 6 - Math.floor(timeElapsed / (60 * 60 * 1000)));
    
    return {
      lastUpdated: cacheDate.toLocaleString(),
      hoursRemaining: hoursRemaining,
      isValid: timeElapsed < 6 * 60 * 60 * 1000,
    };
  }
  return null;
};

