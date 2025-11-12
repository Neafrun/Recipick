# Recipick - 냉장고 속 재료 기반 레시피 추천 서비스

## 🍳 프로젝트 소개

냉장고 속 재료로 무엇을 만들지 고민될 때, Recipick이 도와드릴게요!
간단한 인터페이스와 반응형 디자인, 인터랙티브한 애니메이션으로 즐거운 요리 경험을 제공합니다.

## ✨ 주요 기능

- 🔍 **재료 기반 레시피 추천**: OpenAI GPT를 활용한 맞춤형 레시피 추천
- 📝 **상세 레시피 제공**: 재료 목록, 조리법, 요리 팁까지 자세하게 안내
- 🎥 **YouTube 영상 연동**: 추천된 레시피의 요리 영상 자동 검색
- 💾 **레시피 저장**: 로그인 후 마음에 드는 레시피 북마크
- 👤 **회원 기능**: 간단한 로그인/회원가입 (로컬스토리지 기반)
- 🌟 **인기 메뉴 캐러셀**: 대한민국 인기 요리 추천

## 🚀 시작하기

### 1. 필수 요구사항

- Node.js (v14 이상)
- npm 또는 yarn
- OpenAI API Key
- YouTube Data API v3 Key

### 2. 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일이 이미 생성되어 있습니다.
API 키가 올바른지 확인하세요:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 4. 개발 서버 실행

```bash
npm start
```

브라우저가 자동으로 열리며 http://localhost:3000 에서 앱을 확인할 수 있습니다.

### 5. 빌드 (배포용)

```bash
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

## 📁 프로젝트 구조

```
Recipick/
├── public/
│   ├── assets/
│   │   └── images/
│   │       └── popular/        # 인기 레시피 이미지
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js           # 헤더 컴포넌트
│   │   ├── Logo.js             # 로고 애니메이션
│   │   ├── LoginModal.js       # 로그인/회원가입 모달
│   │   ├── CreatorModal.js     # 개발팀 정보 모달
│   │   ├── SavedRecipeModal.js # 저장된 레시피 모달
│   │   ├── MainContent.js      # 메인 콘텐츠
│   │   ├── RecipeResult.js     # 레시피 결과 표시
│   │   ├── PopularCarousel.js  # 인기 레시피 캐러셀
│   │   └── Loading.js          # 로딩 스피너
│   ├── App.js                  # 메인 App 컴포넌트
│   ├── App.css                 # 전역 스타일
│   ├── index.js                # React 진입점
│   └── index.css               # 기본 스타일
├── backup/                     # 기존 바닐라 JS 파일 백업
├── .env                        # 환경 변수 (Git에서 제외됨)
├── .gitignore
├── package.json
└── README.md
```

## 🎨 기술 스택

- **Frontend**: React 18
- **스타일링**: CSS3 (애니메이션 포함)
- **AI/API**: 
  - OpenAI GPT-3.5 Turbo
  - YouTube Data API v3
- **상태 관리**: React Hooks (useState, useEffect)
- **저장소**: localStorage (회원정보, 레시피 북마크, 캐시)

## 🎯 사용 방법

1. **재료 입력**: 냉장고에 있는 재료를 입력하세요 (예: 달걀, 돼지고기)
2. **추천 받기**: AI가 재료를 분석하여 3가지 요리를 추천합니다
3. **레시피 확인**: 추천된 요리를 선택하여 재료와 조리법을 확인하세요
4. **영상 보기**: 레시피와 관련된 YouTube 요리 영상을 시청하세요
5. **저장**: 마음에 드는 레시피는 로그인 후 북마크에 저장하세요

## 🌟 특별한 기능

### 캐싱 시스템
- 한 번 조회한 레시피는 localStorage에 캐싱되어 빠르게 재조회 가능

### 인터랙티브 로고
- 호버 시 애니메이션 효과
- 클릭 시 홈으로 이동

### 무한 스크롤 캐러셀
- 인기 요리가 자동으로 스크롤
- 마우스 호버 시 일시정지

## 🔧 배포

### Vercel (추천)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# build 폴더를 Netlify에 드래그 앤 드롭
```

### GitHub Pages
```bash
npm install gh-pages --save-dev
# package.json에 homepage 추가
npm run build
npm run deploy
```

## ⚠️ 주의사항

- API 키는 절대 Git에 커밋하지 마세요 (.env 파일은 .gitignore에 포함됨)
- OpenAI API는 유료이므로 사용량을 모니터링하세요
- YouTube API는 일일 할당량이 있습니다

## 📝 개발 히스토리

- ✅ 바닐라 JavaScript에서 React로 마이그레이션
- ✅ 컴포넌트 기반 구조로 리팩토링
- ✅ 환경 변수로 API 키 관리
- ✅ 반응형 디자인 적용

## 👥 개발팀

**주식회사 밥프렌즈**

## 📄 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

---

**Made with ❤️ by 주식회사 밥프렌즈**
