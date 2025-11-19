# 📝 Git Commit Message Guide

## 🎯 Commit Message Convention

실무에서 사용하는 표준 커밋 메시지 컨벤션을 따릅니다.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

## 📌 Types

### 주요 타입

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드 업무 수정, 패키지 매니저 설정 등
- **perf**: 성능 개선
- **ci**: CI 설정 파일 수정

---

## 💡 Examples

### ✅ Good Examples

```bash
# 새로운 기능
git commit -m "feat: Add typing effect for AI recipe responses"

# 버그 수정
git commit -m "fix: Resolve modal positioning issue on mobile"

# 문서 수정
git commit -m "docs: Update README with deployment instructions"

# 스타일 변경
git commit -m "style: Format code with Prettier"

# 리팩토링
git commit -m "refactor: Optimize MainContent component structure"

# 성능 개선
git commit -m "perf: Implement smart caching for recipe data"

# 설정 변경
git commit -m "chore: Update dependencies to latest versions"
```

### ❌ Bad Examples

```bash
# 너무 짧음
git commit -m "update"

# 한글 사용 (인코딩 문제 가능)
git commit -m "기능 추가"

# 불명확함
git commit -m "fix bug"

# 과도하게 길음
git commit -m "feat: Add a new feature that allows users to search for recipes using ingredients they have in their fridge and get AI-powered recommendations with detailed cooking instructions"
```

---

## 📋 Common Commit Messages for This Project

### Feature Development

```bash
feat: Add search mode selection (exact/flexible)
feat: Implement typing effect for recipe display
feat: Add pagination for blog and YouTube sections
feat: Integrate Naver Search API for blog recipes
feat: Add real-time popular recipe ranking
feat: Implement recipe bookmark functionality
```

### Bug Fixes

```bash
fix: Resolve modal centering issue with React Portal
fix: Prevent recipe content truncation (increase token limit)
fix: Filter out unnecessary description text from recipe buttons
fix: Correct CORS error in development environment
fix: Handle API key missing error gracefully
```

### Documentation

```bash
docs: Update README with deployment guide
docs: Add API key setup instructions
docs: Consolidate multiple MD files into core documents
docs: Add portfolio information to CreatorModal
```

### Refactoring

```bash
refactor: Consolidate MainContent components (3 → 1)
refactor: Optimize API call structure
refactor: Improve code organization and remove duplicates
refactor: Update component naming conventions
```

### Styling

```bash
style: Improve modal UI for portfolio showcase
style: Add responsive design for mobile devices
style: Update color scheme and typography
style: Enhance button hover effects
```

### Configuration

```bash
chore: Update project dependencies
chore: Configure Git UTF-8 encoding
chore: Update demo account credentials
chore: Prepare for production deployment
```

---

## 🎨 Multi-line Commit Messages

복잡한 변경사항은 여러 줄로 작성:

```bash
git commit -m "feat: Add portfolio information to CreatorModal

- Add developer info (Neafrun, email, GitHub)
- Add tech stack badges (React, Gemini AI, Naver API, YouTube API)
- Add key features list
- Add GitHub repository link
- Improve modal styling for portfolio showcase"
```

---

## 🔄 Breaking Changes

주요 변경사항이 있을 때:

```bash
git commit -m "feat!: Migrate from OpenAI to Gemini AI

BREAKING CHANGE: REACT_APP_OPENAI_API_KEY is no longer used.
Please update to REACT_APP_GEMINI_API_KEY in your .env file."
```

---

## 📚 Best Practices

1. **제목은 50자 이내**: 간결하고 명확하게
2. **제목은 명령형**: "Add" not "Added" or "Adds"
3. **본문은 72자마다 줄바꿈**: 가독성 향상
4. **본문은 "왜"와 "어떻게" 설명**: "무엇을"은 제목에서
5. **타입은 소문자**: `feat` not `Feat` or `FEAT`
6. **영어 사용**: 한글은 인코딩 문제 가능

---

## 🚀 Quick Reference

```bash
# 기능 추가
git commit -m "feat: <description>"

# 버그 수정
git commit -m "fix: <description>"

# 문서 수정
git commit -m "docs: <description>"

# 리팩토링
git commit -m "refactor: <description>"

# 스타일 변경
git commit -m "style: <description>"

# 설정 변경
git commit -m "chore: <description>"
```

---

## 📖 References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

---

**Remember**: 좋은 커밋 메시지는 프로젝트의 히스토리를 명확하게 만들어줍니다! 📝

