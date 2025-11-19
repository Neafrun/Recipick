# 🔑 Naver Search API 발급 가이드

## 📌 왜 필요한가요?

Recipick의 다음 기능을 사용하려면 Naver API 키가 필요합니다:
- 📝 블로그 레시피 검색
- 🔥 실시간 인기 요리 랭킹 (TOP 5)

> ✅ **무료**: 하루 25,000회 호출 가능 (Recipick은 하루 1~2회만 사용)

---

## 🚀 빠른 발급 (5분)

### 1단계: Naver Developers 접속

https://developers.naver.com 접속

### 2단계: 로그인

Naver 계정으로 로그인 (없으면 회원가입)

### 3단계: 애플리케이션 등록

1. 상단 메뉴 **"Application"** → **"애플리케이션 등록"** 클릭

2. 애플리케이션 정보 입력:

| 항목 | 입력 값 |
|------|---------|
| **애플리케이션 이름** | Recipick (또는 원하는 이름) |
| **사용 API** | ✅ 검색 → **"블로그"** 체크 |
| **환경 추가** | 아래 참고 |

3. 환경 설정:

**개발 환경**
```
웹 서비스 URL: http://localhost:3000
```

**배포 환경** (나중에 추가 가능)
```
웹 서비스 URL: https://your-app.vercel.app
```

### 4단계: API 키 복사

등록 완료 후 표시되는 값 복사:
- **Client ID**: `abcdef123456...`
- **Client Secret**: `xyz789...`

### 5단계: 환경 변수 설정

프로젝트 루트의 `.env` 파일에 추가:

```env
REACT_APP_NAVER_CLIENT_ID=여기에_Client_ID_붙여넣기
REACT_APP_NAVER_CLIENT_SECRET=여기에_Client_Secret_붙여넣기
```

### 6단계: 서버 재시작

```bash
# 개발 서버 재시작
npm start
```

---

## 🎯 설정 확인

### 1. 콘솔 로그 확인

브라우저 개발자 도구 (F12) → Console 탭:

```
✅ 인기요리 업데이트 완료: ['김치찌개', '불고기', ...]
```

### 2. 블로그 검색 테스트

1. 재료 입력 후 요리 추천 받기
2. 요리 선택
3. "다른 분들의 레시피도 궁금하신가요?" 섹션 확인

### 3. 실시간 인기 요리 확인

메인 페이지 하단 "실시간 대한민국 인기 요리" TOP 5 표시 확인

---

## 🔧 문제 해결

### API 키가 작동하지 않아요

**1. 환경 변수 확인**
```bash
# .env 파일 내용 확인
cat .env

# 올바른 형식인지 확인
# REACT_APP_NAVER_CLIENT_ID=abcd1234
# REACT_APP_NAVER_CLIENT_SECRET=wxyz5678
```

**2. 서버 재시작**
```bash
# Ctrl+C로 서버 종료 후
npm start
```

**3. 캐시 삭제**
```bash
# 브라우저 개발자 도구 (F12)
# Application → Local Storage → localhost:3000
# 우클릭 → Clear
```

### 401 Unauthorized 에러

**원인**: API 키가 잘못되었거나 만료됨

**해결**:
1. Naver Developers에서 API 키 재확인
2. `.env` 파일에 정확히 복사했는지 확인
3. 공백이나 따옴표가 없는지 확인

### 403 Forbidden 에러

**원인**: 서비스 URL이 등록되지 않음

**해결**:
1. Naver Developers → 애플리케이션 설정
2. "웹 서비스 URL" 확인:
   - 개발: `http://localhost:3000`
   - 배포: `https://your-app.vercel.app`
3. 정확히 일치하는지 확인 (http/https, 포트 번호 등)

### CORS 에러

**원인**: 개발 환경의 프록시 설정 문제

**해결**:
1. `src/setupProxy.js` 파일 확인
2. 서버 재시작
3. 문제 지속 시 GitHub Issues에 문의

---

## 📊 사용량 모니터링

### API 호출 횟수 확인

Naver Developers → 애플리케이션 설정 → **"API 이용 현황"**

- 일일 25,000회 제공
- Recipick은 하루 1~2회만 사용 (스마트 캐싱)
- 걱정 없이 사용 가능! 😊

---

## 🌟 고급 설정

### 여러 도메인 등록

개발 + 배포 환경 동시 사용:

```
웹 서비스 URL
├── http://localhost:3000         (개발)
├── https://recipick.vercel.app   (프로덕션)
└── https://recipick-dev.vercel.app (스테이징)
```

### API 호출 최적화

이미 적용된 최적화:
- ✅ 6시간 캐싱 (하루 4회만 API 호출)
- ✅ localStorage 캐싱
- ✅ 실패 시 기본 데이터 사용
- ✅ 중복 요청 방지

---

## 💡 유용한 팁

### 1. 개발 중 API 키 공유 금지
```bash
# .gitignore에 이미 포함됨
.env
.env.local
.env.development.local
```

### 2. 팀원과 API 키 공유
1. 팀원이 각자 API 키 발급
2. 각자의 `.env` 파일에 설정
3. Git에는 `.env.example` 파일만 공유

### 3. 배포 환경 설정
- Vercel: Dashboard → Environment Variables
- Netlify: Site settings → Build & deploy → Environment

---

## 📚 관련 문서

- [Naver Search API 공식 문서](https://developers.naver.com/docs/serviceapi/search/blog/blog.md)
- [Recipick 배포 가이드](./DEPLOYMENT_GUIDE.md)
- [Recipick README](./README.md)

---

## ❓ 자주 묻는 질문

### Q1. 무료인가요?
A. 네! 하루 25,000회까지 무료입니다.

### Q2. 신용카드가 필요한가요?
A. 아니요, Naver 계정만 있으면 됩니다.

### Q3. 상업적으로 사용해도 되나요?
A. 네, Naver API 이용약관을 준수하면 가능합니다.

### Q4. API 키 없이도 사용 가능한가요?
A. 네, 기본 기능은 작동하지만 블로그 검색과 실시간 인기 요리는 사용할 수 없습니다.

---

**API 키 발급에 성공하셨나요? 🎉**

이제 [README.md](./README.md)로 돌아가서 다음 단계를 진행하세요!
