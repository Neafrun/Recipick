# 🍳 Recipick - 냉장고 속 재료로 요리 추천

<div align="center">

![Recipick Logo](https://img.shields.io/badge/Recipick-요리_추천_서비스-d25644?style=for-the-badge)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**냉장고 속 재료로 무엇을 만들지 고민될 때, Recipick이 도와드립니다!**

[🚀 데모 보기](#) | [📖 문서](#-주요-기능) | [🐛 버그 리포트](../../issues)

</div>

---

## 🔐 데모 계정

별도의 회원가입 없이 바로 체험하실 수 있습니다!

```
아이디: demo
비밀번호: 1234
```

> 💡 **Tip**: 데모 계정에는 샘플 레시피가 미리 저장되어 있어 북마크 기능도 바로 확인하실 수 있습니다!

---

## 📌 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [배포 가이드](#-배포-가이드)
- [사용 방법](#-사용-방법)
- [문제 해결](#-문제-해결)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

**Recipick**은 냉장고 속 남은 재료로 만들 수 있는 요리를 AI가 추천해주는 웹 서비스입니다.

### ✨ 핵심 가치

- 🥗 **재료 낭비 방지**: 냉장고 속 재료를 활용한 맞춤 레시피
- 🤖 **AI 기반 추천**: Google Gemini로 초보자도 쉬운 상세 레시피
- 📱 **반응형 디자인**: 모바일, 태블릿, PC 모두 지원
- 🔥 **실시간 트렌드**: 네이버 검색 기반 인기 요리 TOP 5

---

## 🌟 주요 기능

### 1. 재료 기반 레시피 추천

두 가지 모드로 요리 추천:
- **입력한 재료만**: 추가 구매 없이 지금 있는 재료로만
- **재료 추가 가능**: 필요한 재료를 더 구매해도 괜찮은 경우

### 2. AI 상세 레시피

Google Gemini API를 활용한 초보자 친화적 레시피:
- ✅ 기본 정보 (인원, 난이도, 조리시간)
- ✅ 필요한 재료 (정확한 양과 단위)
- ✅ 조리 도구
- ✅ 상세한 조리 과정 (타이핑 효과로 부드럽게 표시)

### 3. 다양한 레시피 소스

- 📝 **블로그 레시피**: 네이버 검색 API 기반 실제 요리 경험담
- 🎥 **유튜브 영상**: 요리 과정을 영상으로 확인
- 🔥 **실시간 인기 요리**: 네이버 검색량 기반 TOP 5

### 4. 사용자 기능

- 💾 **레시피 북마크**: 마음에 드는 레시피 저장
- 👤 **간편 로그인**: localStorage 기반 (데모 계정: ljh/1234)
- 📱 **반응형 UI**: 모든 기기에서 최적화된 경험

---

## 🛠 기술 스택

### Frontend
- **Framework**: React 18
- **Styling**: CSS3 with Animations
- **State Management**: React Hooks

### AI & APIs
- **Google Gemini AI**: 무료 AI 레시피 생성
- **Naver Search API**: 블로그 검색 및 실시간 인기 요리
- **YouTube Data API**: 요리 영상 검색

### DevOps
- **Deployment**: Vercel (추천) / Netlify
- **Proxy**: http-proxy-middleware
- **Storage**: localStorage

---

## 🚀 빠른 시작

### 1. 환경 요구사항

- Node.js 14 이상
- npm 또는 yarn

### 2. 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/recipick.git
cd recipick

# 의존성 설치
npm install
```

### 3. API 키 발급

#### 3.1 Google Gemini API (필수)

1. https://aistudio.google.com/app/apikey 접속
2. "Create API Key" 클릭
3. API 키 복사

#### 3.2 Naver Search API (선택)

1. https://developers.naver.com/ 접속
2. "Application" → "애플리케이션 등록"
3. 서비스 URL: `http://localhost:3000`
4. Client ID & Client Secret 복사

#### 3.3 YouTube Data API (선택)

1. https://console.cloud.google.com/ 접속
2. 프로젝트 생성 → API & Services → Enable APIs
3. "YouTube Data API v3" 검색 및 활성화
4. Credentials → API 키 생성

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# 필수
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# 선택 (없으면 기본 기능 사용)
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id_here
REACT_APP_NAVER_CLIENT_SECRET=your_naver_client_secret_here
```

### 5. 개발 서버 실행

```bash
npm start
```

브라우저가 자동으로 http://localhost:3000 을 엽니다.

---

## 📦 배포 가이드

### Vercel 배포 (추천) ⭐

#### 준비사항
1. GitHub 저장소에 코드 푸시
2. Vercel 계정 생성 (GitHub 연동)

#### 배포 단계

```bash
# Vercel CLI 설치 (선택)
npm install -g vercel

# 배포
vercel
```

또는 웹에서:
1. https://vercel.com/new 접속
2. GitHub 저장소 선택
3. 환경 변수 입력 (Gemini API Key 등)
4. Deploy 클릭

#### 네이버 API 설정 (선택)

배포 완료 후:
1. Vercel 배포 URL 확인 (예: `https://your-app.vercel.app`)
2. Naver Developers → 애플리케이션 설정
3. 서비스 URL에 배포 URL 추가

### Netlify 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 빌드
npm run build

# 배포
netlify deploy --prod
```

---

## 📖 사용 방법

### 1. 재료 입력

냉장고에 있는 재료를 입력하세요.
```
예: 달걀, 양파, 감자
```

### 2. 검색 모드 선택

- **입력한 재료만**: 추가 구매 없이 지금 있는 재료로만
- **재료 추가 가능**: 필요한 재료를 더 구매해도 괜찮아요

### 3. 요리 선택

AI가 추천한 3가지 요리 중 하나를 선택하세요.

### 4. 레시피 확인

- 🤖 **AI 레시피**: 초보자도 따라할 수 있는 상세한 조리법
- 📝 **블로그 레시피**: 실제 요리 경험담
- 🎥 **유튜브 영상**: 영상으로 배우기

### 5. 저장 (선택)

마음에 드는 레시피는 북마크 버튼을 눌러 저장하세요!

---

## 🔧 문제 해결

### API 키가 작동하지 않아요

**Gemini API 키 확인**
```bash
# .env 파일 확인
cat .env

# 서버 재시작
npm start
```

### 레시피가 중간에 잘려요

- Gemini API는 최대 2500 토큰까지 출력합니다
- 더 짧은 레시피를 요청하거나, 여러 번 나누어 확인하세요

### 타이핑 효과가 너무 느려요

`src/components/MainContent-Gemini.js`에서 속도 조절:
```javascript
// 현재: 20글자씩, 10ms 간격
await typeWriter(content, 20, 10);

// 더 빠르게: 50글자씩, 5ms 간격
await typeWriter(content, 50, 5);
```

### CORS 에러 발생

개발 환경에서는 `src/setupProxy.js`가 자동으로 처리합니다.
배포 환경에서는 `api/naver-search.js` 서버리스 함수가 처리합니다.

---

## 📂 프로젝트 구조

```
Recipick/
├── api/                           # 서버리스 함수
│   └── naver-search.js            # Naver API 프록시
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js              # 헤더
│   │   ├── MainContent-Gemini.js  # 메인 콘텐츠 (Gemini)
│   │   ├── RecipeResult.js        # 레시피 결과
│   │   ├── PopularRanking.js      # 인기 요리 랭킹
│   │   ├── LoginModal.js          # 로그인 모달
│   │   ├── SavedRecipeModal.js    # 저장된 레시피
│   │   └── ...
│   ├── services/
│   │   └── popularRecipeService.js # 인기 요리 API
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .env                           # 환경 변수
├── package.json
├── README.md                      # 이 파일
├── DEPLOYMENT_GUIDE.md            # 배포 상세 가이드
└── NAVER_API_GUIDE.md             # Naver API 발급 가이드
```

---

## 🎨 주요 특징

### 타이핑 효과
AI가 답변을 작성하는 듯한 자연스러운 타이핑 효과로 사용자 경험 향상

### 스마트 캐싱
- 레시피 캐싱: 한 번 조회한 레시피는 즉시 재조회
- 인기 요리 캐싱: 6시간마다 자동 업데이트

### 반응형 디자인
모바일, 태블릿, 데스크톱 모든 환경에서 최적화된 UI

---

## ⚠️ 주의사항

### API 사용량
- **Gemini API**: 무료 (요청 제한 있음)
- **Naver API**: 하루 25,000회 (스마트 캐싱으로 하루 1~2회만 사용)
- **YouTube API**: 하루 10,000 quota

### 데이터 저장
- localStorage 기반으로 브라우저에만 저장됩니다
- 캐시 삭제 시 데이터가 사라질 수 있습니다
- 다른 기기에서는 동기화되지 않습니다

### 보안
- API 키는 절대 Git에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다

---

## 👥 개발팀

**밥프렌즈** - 냉장고 속 재료로 만드는 맞춤 레시피

---

## 📄 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.

---

## 🙏 감사합니다

**Made with ❤️ by 밥프렌즈**

더 많은 정보가 필요하신가요?
- 📧 이메일: your-email@example.com
- 🐛 버그 리포트: [Issues](../../issues)
- 💡 기능 제안: [Pull Requests](../../pulls)

---

<div align="center">

**⭐ 프로젝트가 마음에 드셨다면 Star를 눌러주세요! ⭐**

</div>
