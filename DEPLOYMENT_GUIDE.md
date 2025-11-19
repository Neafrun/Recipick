# 🚀 Recipick 배포 가이드

## 📋 배포 전 체크리스트

- [ ] 모든 API 키 발급 완료
- [ ] `.env` 파일 설정 완료
- [ ] 로컬에서 정상 작동 확인
- [ ] 빌드 테스트 완료 (`npm run build`)
- [ ] Git 저장소에 푸시 완료

---

## 🌟 Vercel 배포 (추천)

### 장점
- ✅ 무료 호스팅
- ✅ 자동 배포 (Git push 시)
- ✅ 서버리스 함수 지원 (Naver API 프록시)
- ✅ HTTPS 자동 적용
- ✅ CDN 제공

### 배포 단계

#### 1. Vercel 계정 생성
https://vercel.com 접속 후 GitHub 계정으로 회원가입

#### 2. 프로젝트 임포트
1. "New Project" 클릭
2. GitHub 저장소 선택
3. "Import" 클릭

#### 3. 환경 변수 설정
**Environment Variables** 섹션에서 추가:

```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id
REACT_APP_NAVER_CLIENT_SECRET=your_naver_client_secret
```

#### 4. 배포
"Deploy" 버튼 클릭 → 약 2~3분 후 완료!

#### 5. Naver API 설정
1. 배포 URL 확인 (예: `https://recipick.vercel.app`)
2. https://developers.naver.com → 애플리케이션 설정
3. "서비스 URL"에 배포 URL 추가

### CLI 배포 (고급)

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 🎯 Netlify 배포

### 장점
- ✅ 무료 호스팅
- ✅ 간단한 설정
- ✅ Form 기능 지원

### 단점
- ⚠️ 서버리스 함수 설정 필요

### 배포 단계

#### 1. Netlify 계정 생성
https://netlify.com 접속 후 가입

#### 2. 사이트 생성
1. "New site from Git" 클릭
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `build`

#### 3. 환경 변수 설정
Site settings → Environment → Environment variables:

```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id
REACT_APP_NAVER_CLIENT_SECRET=your_naver_client_secret
```

#### 4. Netlify Functions 설정 (Naver API용)

`netlify.toml` 파일 생성:

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

`netlify/functions/naver-search.js` 생성:

```javascript
exports.handler = async function(event, context) {
  const query = event.queryStringParameters.query;
  
  const response = await fetch(
    `https://openapi.naver.com/v1/search/blog.json?query=${query}&display=9&sort=sim`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
      }
    }
  );
  
  const data = await response.json();
  
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};
```

---

## ❌ GitHub Pages (비추천)

### 문제점
- ❌ 서버리스 함수 미지원
- ❌ Naver API 사용 불가
- ❌ CORS 문제 발생 가능

### 사용 가능한 경우
- Naver API 없이 기본 인기요리만 사용
- 블로그 검색 기능 제외

---

## 🔧 배포 후 확인사항

### 1. 기본 기능 테스트
- [ ] 페이지 로드 확인
- [ ] 재료 입력 및 검색
- [ ] AI 레시피 생성 확인

### 2. API 기능 테스트
- [ ] 유튜브 영상 로드
- [ ] 블로그 검색 작동
- [ ] 실시간 인기요리 표시

### 3. 성능 확인
- [ ] 페이지 로드 속도 (3초 이내)
- [ ] 모바일 반응형 확인
- [ ] HTTPS 적용 확인

---

## 🐛 배포 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 캐시 삭제 후 재시도
rm -rf node_modules
npm install
npm run build
```

### 환경 변수 미적용

- Vercel/Netlify 대시보드에서 환경 변수 재확인
- 변수명이 `REACT_APP_`로 시작하는지 확인
- 재배포 (Vercel: "Redeploy" 버튼)

### Naver API 작동 안 함

1. Naver Developers에서 서비스 URL 확인
2. 배포 URL이 정확히 등록되었는지 확인
3. 브라우저 개발자 도구에서 네트워크 탭 확인

### CORS 에러

- Vercel: `api/naver-search.js` 파일 확인
- Netlify: `netlify/functions/naver-search.js` 파일 확인
- 서버리스 함수가 정상 배포되었는지 확인

---

## 📊 배포 플랫폼 비교

| 기능 | Vercel | Netlify | GitHub Pages |
|------|--------|---------|--------------|
| 무료 호스팅 | ✅ | ✅ | ✅ |
| 자동 배포 | ✅ | ✅ | ✅ |
| 서버리스 함수 | ✅ | ✅ | ❌ |
| 설정 난이도 | ⭐ 쉬움 | ⭐⭐ 보통 | ⭐⭐⭐ 어려움 |
| Naver API | ✅ | ✅ | ❌ |
| 추천도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |

---

## 🎓 추가 정보

### 도메인 연결
Vercel/Netlify 대시보드에서 커스텀 도메인 설정 가능

### 성능 최적화
- 이미지 최적화
- 코드 스플리팅
- CDN 활용 (자동)

### 모니터링
- Vercel Analytics (무료)
- Google Analytics 연동 가능

---

## 💡 배포 팁

1. **환경별 설정**: 개발/프로덕션 환경 분리
2. **CI/CD**: GitHub Actions로 자동 테스트
3. **롤백**: 이전 버전으로 쉽게 복구
4. **미리보기**: PR마다 미리보기 URL 자동 생성

---

**배포에 성공하셨나요? 🎉**

README.md에 배포 URL을 업데이트하는 것을 잊지 마세요!
