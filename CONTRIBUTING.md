# 기여 가이드

Acorn Activity Tracker에 기여해 주셔서 감사합니다! 🎉

## 시작하기 전에

1. [Issues](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/issues)에서 작업할 이슈를 찾거나 새로 만드세요
2. 이미 진행 중인 작업이 아닌지 확인하세요
3. 큰 변경사항은 먼저 이슈를 통해 논의하세요

## 개발 환경 설정

```bash
# 저장소 Fork 및 Clone
git clone https://github.com/YOUR_USERNAME/vibe-1130-acorn-activity-tracker-app-auto-release-p2.git
cd vibe-1130-acorn-activity-tracker-app-auto-release-p2

# 의존성 설치
npm install

# 개발 서버 시작
npm run serve
```

## 브랜치 전략

- `main`: 프로덕션 브랜치
- `feature/*`: 새 기능
- `fix/*`: 버그 수정
- `docs/*`: 문서 변경
- `chore/*`: 빌드/도구 변경

## 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>: <subject>

[optional body]

[optional footer]
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/도구 변경

### 예시

```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: resolve localStorage quota error"
git commit -m "docs: update README with new features"
```

## Pull Request 프로세스

1. **브랜치 생성**
   ```bash
   git checkout -b feature/awesome-feature
   ```

2. **변경사항 커밋**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

3. **테스트 실행**
   ```bash
   npm test
   ```

4. **Push**
   ```bash
   git push origin feature/awesome-feature
   ```

5. **Pull Request 생성**
   - 명확한 제목과 설명 작성
   - 관련 이슈 링크
   - 변경사항 스크린샷 (UI 변경 시)

## 코드 스타일

### JavaScript

- ES6+ 문법 사용
- 세미콜론 사용
- 2칸 들여쓰기
- 의미 있는 변수명
- 함수는 단일 책임 원칙

```javascript
// Good
const handleButtonClick = (event) => {
  event.preventDefault();
  updateUserPreferences();
};

// Bad
const handle = (e) => {
  e.preventDefault();
  update();
};
```

### CSS

- BEM 네이밍 규칙 또는 유틸리티 클래스
- CSS Variables 사용
- Mobile-first 접근

```css
/* Good */
.habit-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
}

/* Bad */
.hc {
  background: #fff;
  border-radius: 10px;
}
```

### HTML

- 시맨틱 HTML 사용
- 접근성 속성 추가 (ARIA)
- 의미 있는 class 이름

```html
<!-- Good -->
<button 
  class="btn btn-primary" 
  aria-label="습관 추가"
  type="button"
>
  습관 추가
</button>

<!-- Bad -->
<div onclick="add()">습관 추가</div>
```

## 테스트

새로운 기능을 추가할 때는 테스트도 함께 추가하세요:

```bash
# 테스트 실행
npm test

# 로컬에서 빌드 확인
npm run build
```

## 문서화

- README.md는 항상 최신 상태로 유지
- 새로운 기능은 문서화
- 코드 주석은 "왜"를 설명

## 리뷰 프로세스

1. 자동 CI/CD 체크 통과 필요
2. 최소 1명의 리뷰 승인
3. 충돌 해결 완료
4. 모든 대화 스레드 해결

## 이슈 리포트

버그를 발견하셨나요? [Issue 생성](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/issues/new)

### 버그 리포트 템플릿

```markdown
**버그 설명**
명확하고 간결한 버그 설명

**재현 방법**
1. '...'로 이동
2. '...'를 클릭
3. 스크롤
4. 에러 발생

**예상 동작**
어떻게 동작해야 하는지 설명

**스크린샷**
가능하다면 스크린샷 첨부

**환경**
- OS: [예: macOS 13.0]
- 브라우저: [예: Chrome 120]
- 버전: [예: 1.0.0]
```

### 기능 제안 템플릿

```markdown
**기능 설명**
추가하고 싶은 기능에 대한 명확한 설명

**문제 해결**
이 기능이 해결하는 문제는?

**대안 고려**
고려한 다른 해결 방법

**추가 컨텍스트**
스크린샷, 참고 자료 등
```

## 질문이 있으신가요?

- [Discussions](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/discussions)에서 질문하세요
- [Issues](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/issues)에서 검색해보세요

## 행동 강령

- 존중하고 포용적인 언어 사용
- 건설적인 피드백
- 다양한 관점 수용
- 커뮤니티 복지 우선

## 라이선스

기여하신 모든 코드는 [MIT License](LICENSE)에 따라 배포됩니다.

---

다시 한번 감사드립니다! 💚

