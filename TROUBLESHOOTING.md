# 🔧 문제 해결 가이드

## OpenAI API 429 오류

### 증상
```
api.openai.com/v1/chat/completions:1 Failed to load resource: the server responded with a status of 429
```

### 원인
1. **무료 크레딧 소진**: OpenAI 계정의 크레딧이 모두 사용됨
2. **Rate Limit 초과**: 짧은 시간에 너무 많은 요청
3. **API 키 만료**: 키가 비활성화되었거나 만료됨
4. **결제 정보 미등록**: 무료 체험 기간 종료 후 결제 수단 필요

### 해결 방법

#### 1. OpenAI 계정 확인
```
https://platform.openai.com/account/billing
```
- 크레딧 잔액 확인
- 사용량 확인

#### 2. API 키 재생성
```
https://platform.openai.com/api-keys
```
1. 현재 키 비활성화
2. 새 키 생성
3. `.env` 파일 업데이트
4. 개발 서버 재시작

#### 3. 결제 정보 등록
```
https://platform.openai.com/account/billing/overview
```
- 신용카드 등록 (최소 $5 충전 필요)
- 무료 체험 종료 후 필수

#### 4. 모의 데이터 모드로 테스트

API 없이 테스트하려면 `src/App.js`를 수정:

```javascript
// 원본
import MainContent from './components/MainContent';

// 모의 데이터 모드로 변경
import MainContent from './components/MainContent-Mock';
```

저장 후 브라우저가 자동으로 새로고침됩니다.

---

## Placeholder 이미지 오류

### 증상
```
via.placeholder.com/200x120: Failed to load resource: net::ERR_NAME_NOT_RESOLVED
```

### 해결됨 ✅
- `https://` 프로토콜 추가
- 페이지 새로고침하면 정상 작동

---

## YouTube API 오류

### 증상
유튜브 영상이 로드되지 않음

### 해결 방법

1. **API 키 확인**
```
https://console.cloud.google.com/apis/credentials
```

2. **YouTube Data API v3 활성화**
```
https://console.cloud.google.com/apis/library/youtube.googleapis.com
```

3. **할당량 확인**
```
https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
```
- 일일 할당량: 10,000 units
- 검색 1회 = 100 units

---

## 개발 서버가 시작되지 않음

### 해결 방법

```bash
# 1. node_modules 삭제
rm -rf node_modules package-lock.json

# 2. 재설치
npm install

# 3. 캐시 정리
npm cache clean --force

# 4. 재시작
npm start
```

---

## 환경 변수가 인식되지 않음

### 체크리스트
- [ ] `.env` 파일이 프로젝트 루트에 있는지 확인
- [ ] 변수명이 `REACT_APP_`으로 시작하는지 확인
- [ ] 개발 서버를 재시작했는지 확인
- [ ] `.env` 파일에 공백이 없는지 확인

### 올바른 형식
```env
REACT_APP_OPENAI_API_KEY=sk-proj-xxxxx
REACT_APP_YOUTUBE_API_KEY=AIzaSyCxxxxx
```

### 잘못된 형식
```env
REACT_APP_OPENAI_API_KEY = sk-proj-xxxxx  # 공백 있음 (X)
OPENAI_API_KEY=sk-proj-xxxxx              # REACT_APP_ 없음 (X)
```

---

## 로컬스토리지 관련 오류

### 초기화 방법

브라우저 개발자 도구(F12) > Console:
```javascript
// 모든 데이터 삭제
localStorage.clear();

// 특정 데이터만 삭제
localStorage.removeItem('users');
localStorage.removeItem('loggedInUser');
localStorage.removeItem('savedRecipes_사용자명');
```

---

## 추가 도움이 필요하신가요?

1. **로그 확인**: 브라우저 개발자 도구(F12) > Console 탭
2. **네트워크 확인**: Network 탭에서 실패한 요청 확인
3. **GitHub Issues**: 프로젝트 저장소에 이슈 등록

---

**마지막 업데이트**: 2024년

