// Vercel 서버리스 함수 - 네이버 검색 API 프록시
// 배포 환경에서 CORS 문제를 해결하기 위한 프록시

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // 환경 변수 확인 (REACT_APP_ 접두사 있거나 없거나 모두 지원)
  const clientId = process.env.NAVER_CLIENT_ID || process.env.REACT_APP_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.REACT_APP_NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('환경 변수 확인:', {
      NAVER_CLIENT_ID: !!process.env.NAVER_CLIENT_ID,
      REACT_APP_NAVER_CLIENT_ID: !!process.env.REACT_APP_NAVER_CLIENT_ID,
      NAVER_CLIENT_SECRET: !!process.env.NAVER_CLIENT_SECRET,
      REACT_APP_NAVER_CLIENT_SECRET: !!process.env.REACT_APP_NAVER_CLIENT_SECRET,
    });
    return res.status(500).json({ 
      error: 'Naver API credentials not configured',
      message: 'Please set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET (or REACT_APP_NAVER_CLIENT_ID and REACT_APP_NAVER_CLIENT_SECRET) in Vercel environment variables'
    });
  }

  try {
    // 네이버 검색 API 호출
    const response = await fetch(
      `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=1`,
      {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Naver API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Naver API request failed',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    
    // 성공 응답
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

