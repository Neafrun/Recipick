# 📝 Recipick 변경 이력

## 🎉 v2.0.0 (2024년)

### 🚀 주요 변경사항

#### AI 엔진 전환
- ❌ OpenAI GPT → ✅ Google Gemini AI
- 무료 사용 가능
- 더 빠른 응답 속도
- 한국어 최적화

#### 새로운 기능
- ✨ **타이핑 효과**: AI가 답변을 작성하는 듯한 자연스러운 표시
- ✨ **2가지 검색 모드**:
  - 입력한 재료만: 추가 구매 없이 지금 있는 재료로만
  - 재료 추가 가능: 필요한 재료를 더 구매해도 괜찮은 경우
- ✨ **실시간 인기 요리 TOP 5**: 네이버 검색량 기반
- ✨ **블로그 레시피 통합**: 네이버 블로그 검색
- ✨ **유튜브 영상 연동**: 요리 영상 자동 검색
- ✨ **상세 레시피**: 초보자도 따라할 수 있는 단계별 설명

#### 사용자 인터페이스
- 🎨 **모달 최적화**: 깔끔한 검색 모드 선택 UI
- 🎨 **반응형 디자인**: 모든 기기에서 최적화
- 🎨 **접기/펼치기**: AI 레시피, 블로그, 유튜브 섹션
- 🎨 **페이지네이션**: 블로그(3개/페이지), 유튜브(4개/페이지)

#### 성능 개선
- ⚡ **스마트 캐싱**: 레시피 로컬 저장으로 빠른 재조회
- ⚡ **인기 요리 캐싱**: 6시간마다 자동 업데이트
- ⚡ **최적화된 API 호출**: 불필요한 중복 요청 방지

#### 개발자 경험
- 🛠 **코드 정리**: 중복 코드 제거
- 🛠 **파일 구조 최적화**: MainContent-Gemini.js → MainContent.js
- 🛠 **문서 통합**: 11개 MD 파일 → 3개 핵심 문서
- 🛠 **환경 변수 예시**: .env.example 추가

---

## 📋 v1.0.0 (초기 버전)

### 기본 기능
- ✅ 재료 기반 레시피 추천 (OpenAI)
- ✅ 레시피 저장 기능
- ✅ 간단한 로그인/회원가입
- ✅ 기본 UI/UX

---

## 🔮 향후 계획

### v2.1.0 (예정)
- [ ] 사용자 설정 저장 (선호 요리 스타일)
- [ ] 레시피 공유 기능
- [ ] 다국어 지원

### v2.2.0 (예정)
- [ ] 영양 정보 표시
- [ ] 칼로리 계산
- [ ] 식단 계획 기능

### v3.0.0 (미래)
- [ ] 실시간 백엔드 연동 (Firebase/Supabase)
- [ ] 소셜 로그인 (Google, Kakao)
- [ ] 커뮤니티 기능
- [ ] 레시피 평가 및 리뷰

---

## 🐛 버그 수정

### v2.0.0
- ✅ AI 응답이 중간에 잘리는 문제 해결 (토큰 제한 증가)
- ✅ 불필요한 설명 문구가 버튼으로 나타나는 문제 해결
- ✅ 모달이 화면 중앙에 표시되지 않는 문제 해결 (React Portal 사용)
- ✅ 초보자 팁이 출력되지 않는 문제 해결

---

## 📚 문서 변경

### 삭제된 문서
- ❌ START_HERE.md → README.md로 통합
- ❌ SETUP_GUIDE.md → README.md로 통합
- ❌ API_LIMIT_GUIDE.md → README.md로 통합
- ❌ DEPLOYMENT_CHECKLIST.md → DEPLOYMENT_GUIDE.md로 통합
- ❌ DEPLOYMENT_OPTIONS.md → DEPLOYMENT_GUIDE.md로 통합
- ❌ PORTFOLIO_DEPLOYMENT.md → DEPLOYMENT_GUIDE.md로 통합
- ❌ POPULAR_RECIPE_UTILS.md → README.md로 통합
- ❌ TROUBLESHOOTING.md → README.md로 통합
- ❌ VERCEL_DEPLOY.md → DEPLOYMENT_GUIDE.md로 통합

### 통합된 문서
- ✅ README.md: 프로젝트 전체 개요 및 빠른 시작
- ✅ DEPLOYMENT_GUIDE.md: 배포 상세 가이드
- ✅ NAVER_API_GUIDE.md: Naver API 발급 가이드

---

## 🗑️ 제거된 파일

### 컴포넌트
- ❌ MainContent.js (OpenAI 버전)
- ❌ MainContent-Mock.js (모의 데이터 버전)
- ✅ MainContent-Gemini.js → MainContent.js로 이름 변경

### 기타
- ❌ backup/ 폴더 (구 버전 백업)

---

**Made with ❤️ by 밥프렌즈**

