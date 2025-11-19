# 🚀 Vercel 배포 가이드 (지금 바로!)

## 📋 배포 전 체크리스트

- [x] ✅ 빌드 테스트 완료
- [x] ✅ GitHub에 푸시 완료
- [ ] ⏳ Vercel 계정 생성
- [ ] ⏳ 환경 변수 설정
- [ ] ⏳ 배포 완료!

---

## 🌟 방법 1: Vercel 웹사이트에서 배포 (가장 쉬움!)

### 1단계: Vercel 계정 생성

1. **https://vercel.com** 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택
4. GitHub 계정으로 로그인

### 2단계: 프로젝트 임포트

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서
3. **"Neafrun/Recipick"** 저장소 찾아서 클릭
4. **"Import"** 버튼 클릭

### 3단계: 프로젝트 설정

**프로젝트 이름**: `recipick` (또는 원하는 이름)

**Framework Preset**: `Create React App` (자동 감지됨)

**Root Directory**: `./` (기본값 유지)

**Build Command**: `npm run build` (기본값)

**Output Directory**: `build` (기본값)

### 4단계: 환경 변수 설정 ⚠️ 중요!

**"Environment Variables"** 섹션에서 다음 변수들을 추가하세요:

```
REACT_APP_GEMINI_API_KEY = your_gemini_api_key_here
REACT_APP_YOUTUBE_API_KEY = your_youtube_api_key_here
REACT_APP_NAVER_CLIENT_ID = your_naver_client_id_here
REACT_APP_NAVER_CLIENT_SECRET = your_naver_client_secret_here
```

> 💡 **Tip**: 각 변수를 추가할 때마다 "Add" 버튼을 클릭하세요!

### 5단계: 배포!

1. **"Deploy"** 버튼 클릭
2. 약 2~3분 대기
3. 배포 완료! 🎉

### 6단계: 배포 URL 확인

배포가 완료되면 다음과 같은 URL이 생성됩니다:
```
https://recipick-xxxxx.vercel.app
```

또는 커스텀 도메인을 설정했다면:
```
https://recipick.vercel.app
```

---

## 🔧 방법 2: Vercel CLI로 배포 (고급)

### 1단계: Vercel CLI 설치

```bash
npm install -g vercel
```

### 2단계: 로그인

```bash
vercel login
```

브라우저가 열리면 GitHub 계정으로 로그인

### 3단계: 배포

```bash
vercel
```

질문에 답변:
- **Set up and deploy?** → `Y`
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → `N` (처음 배포)
- **Project name?** → `recipick` (또는 원하는 이름)
- **Directory?** → `./` (Enter)
- **Override settings?** → `N`

### 4단계: 환경 변수 설정

```bash
vercel env add REACT_APP_GEMINI_API_KEY
vercel env add REACT_APP_YOUTUBE_API_KEY
vercel env add REACT_APP_NAVER_CLIENT_ID
vercel env add REACT_APP_NAVER_CLIENT_SECRET
```

각 명령어 실행 시 값을 입력하세요.

### 5단계: 프로덕션 배포

```bash
vercel --prod
```

---

## ⚙️ 배포 후 설정

### Naver API 서비스 URL 등록

1. **https://developers.naver.com** 접속
2. 애플리케이션 설정으로 이동
3. **"웹 서비스 URL"**에 배포된 URL 추가:
   ```
   https://your-app.vercel.app
   ```

### README 업데이트

배포 완료 후 `README.md`의 배포 URL을 업데이트하세요:

```markdown
## 🌐 배포 URL
🔗 **[https://your-app.vercel.app](https://your-app.vercel.app)**
```

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 Recipick을 사용할 수 있습니다! 🚀

---

## 🐛 문제 해결

### 빌드 실패

- 환경 변수가 제대로 설정되었는지 확인
- Vercel 대시보드 → Deployments → 실패한 배포 클릭 → Logs 확인

### API 작동 안 함

- 환경 변수 이름이 정확한지 확인 (`REACT_APP_` 접두사 필수)
- Naver API 서비스 URL에 배포 URL이 등록되었는지 확인

### CORS 에러

- `api/naver-search.js` 파일이 정상적으로 배포되었는지 확인
- Vercel Functions 탭에서 확인 가능

---

**배포 성공하셨나요? 🎊**

