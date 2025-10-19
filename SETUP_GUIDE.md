# 🚀 자동 배포 파이프라인 설정 가이드

이 가이드는 Acorn Activity Tracker의 자동 배포 파이프라인을 설정하는 방법을 단계별로 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [Vercel 설정](#vercel-설정)
4. [GitHub Secrets 설정](#github-secrets-설정)
5. [OpenAI API 키 발급](#openai-api-키-발급)
6. [Product Hunt API 토큰 발급](#product-hunt-api-토큰-발급)
7. [워크플로 테스트](#워크플로-테스트)
8. [문제 해결](#문제-해결)

---

## 🎯 개요

### 배포 파이프라인 흐름

```
Main 브랜치 푸시
    ↓
GitHub Actions 트리거
    ↓
코드 체크아웃 & 의존성 설치
    ↓
테스트 실행
    ↓
빌드
    ↓
Vercel 프로덕션 배포
    ↓
배포 URL 획득
    ↓
GPT로 Product Hunt 콘텐츠 생성
    ↓
Product Hunt API 게시
    ↓
CHANGELOG 자동 업데이트
    ↓
완료! 🎉
```

### Pull Request 워크플로

```
PR 생성/업데이트
    ↓
GitHub Actions 트리거
    ↓
테스트 & 빌드
    ↓
Vercel 프리뷰 배포
    ↓
Product Hunt 콘텐츠 생성 (드라이런)
    ↓
Artifacts로 저장
    ↓
실제 게시 안 함 ❌
```

---

## 🛠 사전 준비

### 필요한 계정

- ✅ GitHub 계정
- ✅ Vercel 계정 (무료)
- ✅ OpenAI 계정 (API 키 필요, 유료)
- ✅ Product Hunt 계정 (API 접근 필요)

### 필요한 도구

```bash
# Node.js (v18 이상)
node --version

# npm
npm --version

# Vercel CLI (전역 설치)
npm install -g vercel
```

---

## ⚡ Vercel 설정

### 1. Vercel 계정 생성

[Vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인

### 2. Vercel CLI 로그인

```bash
vercel login
```

### 3. 프로젝트 연결

```bash
# 프로젝트 디렉토리로 이동
cd vibe-1130-acorn-activity-tracker-app-auto-release-p2

# Vercel 프로젝트 연결
vercel link
```

질문에 답변:
- Set up and deploy? **N** (나중에 GitHub Actions로 배포)
- Which scope? **개인 계정 선택**
- Link to existing project? **N**
- Project name? **Enter** (기본값 사용)

### 4. Vercel 프로젝트 ID 확인

```bash
cat .vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_xxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxx"
}
```

**중요**: `orgId`와 `projectId`를 복사해두세요!

### 5. Vercel API 토큰 발급

1. [Vercel Account Settings](https://vercel.com/account/tokens) 접속
2. "Create Token" 클릭
3. Token Name: `GitHub Actions`
4. Scope: **Full Account**
5. Expiration: **No Expiration** (권장) 또는 원하는 기간
6. "Create" 클릭
7. 생성된 토큰을 **안전한 곳에 복사** (다시 볼 수 없습니다!)

---

## 🔐 GitHub Secrets 설정

### 1. GitHub 저장소로 이동

```
https://github.com/YOUR_USERNAME/vibe-1130-acorn-activity-tracker-app-auto-release-p2
```

### 2. Settings → Secrets and variables → Actions

좌측 사이드바에서 **Settings** 클릭 → **Secrets and variables** → **Actions**

### 3. New repository secret 클릭

각 시크릿을 하나씩 추가합니다:

#### VERCEL_TOKEN

- Name: `VERCEL_TOKEN`
- Secret: Vercel에서 발급받은 API 토큰
- "Add secret" 클릭

#### VERCEL_ORG_ID

- Name: `VERCEL_ORG_ID`
- Secret: `.vercel/project.json`의 `orgId` 값
- "Add secret" 클릭

#### VERCEL_PROJECT_ID

- Name: `VERCEL_PROJECT_ID`
- Secret: `.vercel/project.json`의 `projectId` 값
- "Add secret" 클릭

---

## 🤖 OpenAI API 키 발급

### 1. OpenAI 플랫폼 접속

[OpenAI Platform](https://platform.openai.com) 접속 및 로그인

### 2. API 키 생성

1. 좌측 메뉴에서 **API keys** 클릭
2. "Create new secret key" 클릭
3. Name: `GitHub Actions - Acorn Tracker`
4. "Create secret key" 클릭
5. 생성된 키를 **복사** (다시 볼 수 없습니다!)

### 3. 결제 방법 설정 (필수)

OpenAI API는 사용량 기반 과금입니다:

1. [Billing](https://platform.openai.com/account/billing) 페이지 접속
2. 결제 방법 추가
3. 사용량 한도 설정 (권장: $5-10/월)

**예상 비용**: GPT-4o-mini 사용 시 배포당 약 $0.01-0.02

### 4. GitHub Secrets에 추가

- Name: `OPENAI_API_KEY`
- Secret: OpenAI에서 발급받은 API 키
- "Add secret" 클릭

---

## 📢 Product Hunt API 토큰 발급

### 방법 1: Developer API (권장)

1. [Product Hunt API](https://api.producthunt.com/v2/oauth/applications) 접속
2. "New Application" 클릭
3. 애플리케이션 정보 입력:
   - Name: `Acorn Activity Tracker`
   - Redirect URI: `http://localhost`
4. "Create" 클릭
5. **Developer Token** 복사

### 방법 2: OAuth (고급)

OAuth 플로우가 필요한 경우 [Product Hunt API 문서](https://api.producthunt.com/v2/docs) 참조

### GitHub Secrets에 추가

- Name: `PRODUCT_HUNT_TOKEN`
- Secret: Product Hunt에서 발급받은 토큰
- "Add secret" 클릭

### ⚠️ 주의사항

Product Hunt API는 실제 제품을 게시하므로 **테스트 시 주의**가 필요합니다.

**드라이런 옵션**: Pull Request로 테스트하면 실제 게시 없이 콘텐츠만 생성됩니다.

---

## 🧪 워크플로 테스트

### 1. Pull Request로 테스트 (안전)

```bash
# 새 브랜치 생성
git checkout -b test/deployment-pipeline

# 작은 변경 (예: README 수정)
echo "Test deployment" >> README.md

# 커밋 및 푸시
git add README.md
git commit -m "test: deployment pipeline"
git push origin test/deployment-pipeline
```

GitHub에서 Pull Request 생성:
- ✅ 테스트 실행됨
- ✅ Vercel 프리뷰 배포됨
- ✅ Product Hunt 콘텐츠 생성됨 (Artifacts에 저장)
- ❌ 실제 게시 안 됨

### 2. Actions 탭에서 확인

```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

워크플로 실행 클릭 → 각 단계 확인

### 3. Artifacts 다운로드

Actions 실행 페이지 하단에서 `product-hunt-preview` 다운로드:
- `ph_post.json`: 생성된 Product Hunt 콘텐츠 확인

### 4. Main 브랜치로 머지 (실제 배포)

PR이 성공하면 Main으로 머지:
- ✅ 프로덕션 배포
- ✅ Product Hunt 게시 (실제!)
- ✅ CHANGELOG 자동 업데이트

---

## 🔍 워크플로 확인 사항

### Actions Summary 확인

각 배포 후 Summary에서 다음 확인:

| 항목 | 설명 |
|------|------|
| 📦 Version | 배포된 버전 번호 |
| 🚀 Deploy URL | Vercel 배포 URL |
| 📢 Product Hunt | PH 포스트 링크 |
| 🔄 Event | push 또는 pull_request |
| 🌿 Branch | 브랜치 이름 |
| 👤 Actor | 실행자 |

### 배포 URL 테스트

배포 URL을 브라우저에서 열어 확인:
- ✅ 페이지 로드됨
- ✅ 기능 정상 작동
- ✅ PWA 설치 가능

### Product Hunt 포스트 확인

PH 포스트 링크 클릭:
- ✅ 제품 정보가 올바르게 표시됨
- ✅ 배포 URL이 정확함
- ✅ 설명과 태그가 적절함

---

## ❌ 문제 해결

### Vercel 배포 실패

**증상**: `Failed to extract deployment URL`

**해결**:
1. Vercel Secrets 확인 (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
2. Vercel 토큰이 만료되지 않았는지 확인
3. `.vercel/project.json` 파일이 올바른지 확인

### OpenAI API 오류

**증상**: `OpenAI API Error: insufficient_quota`

**해결**:
1. [OpenAI Billing](https://platform.openai.com/account/billing) 확인
2. 결제 방법이 등록되어 있는지 확인
3. 사용량 한도 확인

**증상**: `OpenAI API Error: invalid_api_key`

**해결**:
1. GitHub Secrets의 `OPENAI_API_KEY` 확인
2. API 키가 정확한지 확인 (공백 없이)
3. 필요시 새 API 키 발급

### Product Hunt API 오류

**증상**: `Product Hunt API Error`

**해결**:
1. Product Hunt 토큰이 유효한지 확인
2. API 요청 횟수 제한 확인
3. 제품 정보가 올바른지 확인

**주의**: Product Hunt는 하루에 게시할 수 있는 제품 수에 제한이 있습니다.

### Service Worker 업데이트 안 됨

**증상**: 배포 후 변경사항이 반영되지 않음

**해결**:
1. 브라우저 하드 리프레시 (Ctrl+Shift+R / Cmd+Shift+R)
2. Service Worker 등록 해제:
   - DevTools → Application → Service Workers → Unregister
3. 캐시 삭제:
   - DevTools → Application → Clear storage

### Secrets 노출 우려

**증상**: 로그에 시크릿이 보일까 걱정됨

**해결**:
- GitHub Actions는 자동으로 시크릿을 `***`로 마스킹합니다
- 워크플로 로그를 확인해도 시크릿 값은 보이지 않습니다
- 절대 `echo $SECRET_NAME` 같은 명령을 사용하지 마세요

---

## 📊 배포 모니터링

### GitHub Actions 배지

README.md에 배지 추가:

```markdown
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)
```

### Vercel Dashboard

[Vercel Dashboard](https://vercel.com/dashboard)에서:
- 배포 히스토리 확인
- 트래픽 통계 확인
- 로그 확인

### Product Hunt Analytics

[Product Hunt Dashboard](https://www.producthunt.com/my/products)에서:
- 포스트 성과 확인
- 투표 및 댓글 모니터링

---

## 🎓 추가 최적화

### 1. 배포 알림

Slack 또는 Discord 웹훅 추가:

```yaml
- name: Notify on success
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{"text":"✅ Deployment successful!"}'
```

### 2. 버전 자동 증가

`package.json` 버전을 자동으로 증가:

```yaml
- name: Bump version
  run: npm version patch -m "chore: bump version to %s"
```

### 3. 릴리스 노트 생성

GitHub Release 자동 생성:

```yaml
- name: Create Release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ env.VERSION }}
    release_name: Release v${{ env.VERSION }}
```

---

## 📚 참고 자료

### 공식 문서

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Vercel 문서](https://vercel.com/docs)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Product Hunt API 문서](https://api.producthunt.com/v2/docs)

### 추천 읽을거리

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## ✅ 설정 완료 체크리스트

배포 파이프라인 설정이 완료되었는지 확인하세요:

- [ ] Vercel 계정 생성 및 로그인
- [ ] Vercel CLI로 프로젝트 연결
- [ ] Vercel API 토큰 발급
- [ ] GitHub Secrets에 `VERCEL_TOKEN` 추가
- [ ] GitHub Secrets에 `VERCEL_ORG_ID` 추가
- [ ] GitHub Secrets에 `VERCEL_PROJECT_ID` 추가
- [ ] OpenAI 계정 생성 및 결제 방법 등록
- [ ] OpenAI API 키 발급
- [ ] GitHub Secrets에 `OPENAI_API_KEY` 추가
- [ ] Product Hunt 계정 생성
- [ ] Product Hunt API 토큰 발급
- [ ] GitHub Secrets에 `PRODUCT_HUNT_TOKEN` 추가
- [ ] Pull Request로 드라이런 테스트
- [ ] Main 브랜치로 실제 배포 테스트
- [ ] 배포 URL 확인
- [ ] Product Hunt 포스트 확인
- [ ] README 배지 업데이트

---

## 🎉 완료!

축하합니다! 이제 완전히 자동화된 배포 파이프라인이 설정되었습니다.

Main 브랜치에 푸시할 때마다:
- 자동으로 빌드 & 테스트
- Vercel에 프로덕션 배포
- Product Hunt에 자동 게시
- CHANGELOG 자동 업데이트

더 이상 수동 배포는 필요 없습니다! 🚀

---

질문이나 문제가 있으신가요?
- [Issues](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/issues)
- [Discussions](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/discussions)

