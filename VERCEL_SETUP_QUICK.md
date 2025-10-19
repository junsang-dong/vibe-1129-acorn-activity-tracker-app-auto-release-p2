# ⚡ Vercel 빠른 배포 가이드

최종 사용자가 바로 접속 가능한 Acorn Activity Tracker를 Vercel에 배포하는 가장 빠른 방법입니다.

## 🚀 3분 안에 배포하기

### 방법 1: 웹 UI로 배포 (추천, 가장 쉬움)

#### 1단계: Vercel 버튼으로 배포

아래 "Deploy" 버튼을 클릭하거나 링크를 방문하세요:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjunsang-dong%2Fvibe-1129-acorn-activity-tracker-app-auto-release-p2)

또는 수동으로:

**👉 [https://vercel.com/new](https://vercel.com/new)** 접속

#### 2단계: GitHub 저장소 연결

1. **"Import Git Repository"** 클릭
2. GitHub 계정 연결 (처음 1회)
3. **`vibe-1129-acorn-activity-tracker-app-auto-release-p2`** 저장소 선택
4. **"Import"** 클릭

#### 3단계: 프로젝트 설정

- **Project Name**: `acorn-tracker` (또는 원하는 이름)
- **Framework Preset**: `Other` (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: 비워두기 (정적 사이트)
- **Output Directory**: 비워두기

#### 4단계: 배포!

**"Deploy"** 버튼 클릭 → 2-3분 대기

✅ 완료! 배포 URL이 생성됩니다:
```
https://acorn-tracker.vercel.app
```

---

### 방법 2: CLI로 배포 (개발자용)

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 디렉토리로 이동
cd vibe-1130-acorn-activity-tracker-app-auto-release-p2

# 4. 배포
vercel

# 5. 프로덕션 배포
vercel --prod
```

---

## 🔑 API 키 설정 방법

이 앱은 **최종 사용자용으로는 API 키가 필요 없습니다!** 

모든 데이터는 사용자의 브라우저에 로컬로 저장되며, 서버나 외부 API를 사용하지 않습니다.

### 그럼 언제 API 키가 필요한가요?

**자동 배포 파이프라인**을 사용하려는 경우에만 필요합니다:
- ✅ OpenAI API (Product Hunt 콘텐츠 자동 생성용)
- ✅ Product Hunt API (자동 게시용)
- ✅ Vercel API (GitHub Actions 자동 배포용)

### 일반 사용자라면?

**API 키 설정 없이 바로 사용 가능합니다!**

1. Vercel로 배포
2. URL 공유
3. 끝! 🎉

---

## 📱 배포된 앱 사용하기

### 접속 방법

Vercel 배포 완료 후 받은 URL로 접속:
```
https://your-app-name.vercel.app
```

### 주요 기능

- ✅ **회원가입 불필요** - 바로 사용 시작
- ✅ **설치 가능** - 브라우저에서 "홈 화면에 추가"
- ✅ **오프라인 작동** - 인터넷 없이도 사용 가능
- ✅ **완전 무료** - 모든 기능 무료
- ✅ **개인정보 보호** - 데이터가 서버로 전송되지 않음

### 모바일에 설치하기

#### iOS (Safari)
1. URL 접속
2. 공유 버튼 (⬆️) 클릭
3. "홈 화면에 추가" 선택
4. "추가" 클릭

#### Android (Chrome)
1. URL 접속
2. 메뉴 (⋮) 클릭
3. "홈 화면에 추가" 선택
4. "추가" 클릭

---

## 🔧 고급: 자동 배포 파이프라인 설정

GitHub Actions로 완전 자동화된 배포를 원하신다면:

### 필요한 API 키

| API 키 | 용도 | 필수 여부 | 발급 방법 |
|--------|------|-----------|----------|
| `VERCEL_TOKEN` | 자동 배포 | ✅ 필수 | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | 프로젝트 식별 | ✅ 필수 | CLI로 `vercel link` 후 `.vercel/project.json` 확인 |
| `VERCEL_PROJECT_ID` | 프로젝트 식별 | ✅ 필수 | CLI로 `vercel link` 후 `.vercel/project.json` 확인 |
| `OPENAI_API_KEY` | PH 콘텐츠 생성 | ⚪ 선택 | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `PRODUCT_HUNT_TOKEN` | PH 자동 게시 | ⚪ 선택 | [api.producthunt.com](https://api.producthunt.com/v2/oauth/applications) |

### 빠른 설정 (5분)

#### 1. Vercel CLI로 프로젝트 연결

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# ID 확인
cat .vercel/project.json
```

출력:
```json
{
  "orgId": "team_xxxxxx",  👈 VERCEL_ORG_ID
  "projectId": "prj_xxxxx" 👈 VERCEL_PROJECT_ID
}
```

#### 2. Vercel API 토큰 발급

1. [https://vercel.com/account/tokens](https://vercel.com/account/tokens) 접속
2. "Create Token" 클릭
3. 이름: `GitHub Actions`
4. "Create" → 토큰 복사

#### 3. GitHub Secrets 추가

**GitHub 저장소** → **Settings** → **Secrets and variables** → **Actions**

"New repository secret" 클릭하여 추가:

```
Name: VERCEL_TOKEN
Secret: [복사한 Vercel 토큰]
```

```
Name: VERCEL_ORG_ID
Secret: [.vercel/project.json의 orgId]
```

```
Name: VERCEL_PROJECT_ID
Secret: [.vercel/project.json의 projectId]
```

#### 4. (선택) OpenAI & Product Hunt

Product Hunt 자동 게시를 원하면:

```
Name: OPENAI_API_KEY
Secret: [OpenAI API 키]
```

```
Name: PRODUCT_HUNT_TOKEN
Secret: [Product Hunt API 토큰]
```

#### 5. 완료! 🎉

이제 `main` 브랜치에 푸시할 때마다 자동으로:
- ✅ 빌드 & 테스트
- ✅ Vercel 배포
- ✅ Product Hunt 게시 (선택사항)
- ✅ CHANGELOG 업데이트

---

## 🌐 커스텀 도메인 설정 (선택)

### Vercel에서 도메인 추가

1. Vercel 프로젝트 페이지 접속
2. **Settings** → **Domains**
3. 도메인 입력 (예: `acorn.yourdomain.com`)
4. DNS 설정 안내에 따라 설정

### 무료 도메인 옵션

- Vercel 기본 도메인: `*.vercel.app` (무료)
- Freenom: `.tk`, `.ml`, `.ga` 등 무료 도메인
- GitHub Pages: `username.github.io/repo-name`

---

## 📊 배포 상태 확인

### Vercel Dashboard

[https://vercel.com/dashboard](https://vercel.com/dashboard)

확인 가능 항목:
- 📈 배포 히스토리
- 📊 방문자 통계
- 🔍 로그 확인
- ⚡ 성능 메트릭

### GitHub Actions

[https://github.com/junsang-dong/vibe-1129-acorn-activity-tracker-app-auto-release-p2/actions](https://github.com/junsang-dong/vibe-1129-acorn-activity-tracker-app-auto-release-p2/actions)

확인 가능 항목:
- ✅ 워크플로 실행 상태
- 📦 배포 버전
- 🔗 배포 URL
- 📝 로그 확인

---

## ❓ 자주 묻는 질문

### Q: 비용이 얼마나 드나요?

**A: 완전 무료입니다!**
- Vercel Hobby 플랜: 무료
- GitHub: 무료 (공개 저장소)
- 앱 사용: 무료 (광고 없음)

자동 배포 파이프라인을 사용하면:
- OpenAI API: ~$0.01/배포
- Product Hunt: 무료

### Q: API 키가 꼭 필요한가요?

**A: 일반 사용자는 필요 없습니다!**

API 키는 **자동 배포 파이프라인**을 사용하려는 개발자만 필요합니다.

앱을 단순히 배포하고 사용하려면 **API 키 없이** Vercel 버튼만 클릭하면 됩니다.

### Q: 데이터가 서버에 저장되나요?

**A: 아니요, 완전히 로컬입니다.**

모든 데이터는 사용자의 브라우저 localStorage에 저장됩니다. 서버로 전송되지 않습니다.

### Q: 여러 기기에서 동기화할 수 있나요?

**A: 수동 동기화만 가능합니다.**

"데이터 내보내기" → 다른 기기에서 "데이터 가져오기"

### Q: Vercel 외에 다른 곳에 배포할 수 있나요?

**A: 네! 다양한 플랫폼 지원:**
- GitHub Pages
- Netlify
- Cloudflare Pages
- 커스텀 서버 (Nginx, Apache)

자세한 내용은 `DEPLOY.md` 참조

### Q: HTTPS가 자동으로 설정되나요?

**A: 네!**

Vercel은 자동으로 무료 SSL 인증서를 제공합니다.

### Q: 앱을 수정하고 싶어요

**A: 저장소를 Fork하세요!**

1. GitHub에서 "Fork" 클릭
2. Fork한 저장소를 Vercel에 연결
3. 원하는 대로 수정
4. Push하면 자동 배포!

---

## 🎯 다음 단계

### 바로 사용하기
1. ✅ Vercel Deploy 버튼 클릭
2. ✅ 2분 대기
3. ✅ URL 접속
4. ✅ 첫 습관 추가!

### 자동화 설정 (선택)
1. `SETUP_GUIDE.md` 읽기
2. API 키 발급
3. GitHub Secrets 추가
4. Push하면 자동 배포!

---

## 🆘 도움이 필요하신가요?

### 문서
- 📖 [전체 설정 가이드](SETUP_GUIDE.md)
- 🚀 [배포 가이드](DEPLOY.md)
- ⚡ [빠른 시작](QUICK_START.md)

### 문의
- 🐛 [버그 리포트](https://github.com/junsang-dong/vibe-1129-acorn-activity-tracker-app-auto-release-p2/issues)
- 💬 [토론](https://github.com/junsang-dong/vibe-1129-acorn-activity-tracker-app-auto-release-p2/discussions)

---

## 🎉 시작하기

지금 바로 Deploy 버튼을 클릭하여 3분 안에 배포하세요!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjunsang-dong%2Fvibe-1129-acorn-activity-tracker-app-auto-release-p2)

**또는**

[https://vercel.com/new](https://vercel.com/new) 에서 수동으로 연결

---

즐거운 습관 추적 되세요! 🌰✨

