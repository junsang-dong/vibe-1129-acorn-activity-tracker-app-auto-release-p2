# 🔑 API 키 설정 가이드

## ⚠️ 중요: 누가 API 키가 필요한가요?

### 🙅‍♂️ API 키가 **필요 없는** 경우:

- ✅ 앱을 사용만 하는 경우
- ✅ Vercel에 배포만 하는 경우
- ✅ 습관을 추적하고 관리하는 경우
- ✅ 데이터를 내보내기/가져오기 하는 경우

**👉 이 경우 이 문서를 읽을 필요가 없습니다!**

### 🙋‍♂️ API 키가 **필요한** 경우:

- ⚙️ GitHub Actions 자동 배포를 사용하는 경우
- 🤖 Product Hunt 자동 게시를 원하는 경우
- 🔄 Main 브랜치 푸시 시 자동 배포를 원하는 경우

**👉 이 경우에만 아래 가이드를 따라하세요.**

---

## 📋 필요한 API 키 목록

| API 키 | 필수 여부 | 용도 | 비용 |
|--------|-----------|------|------|
| `VERCEL_TOKEN` | ✅ 필수 | GitHub Actions에서 Vercel 자동 배포 | 무료 |
| `VERCEL_ORG_ID` | ✅ 필수 | Vercel 조직 식별 | 무료 |
| `VERCEL_PROJECT_ID` | ✅ 필수 | Vercel 프로젝트 식별 | 무료 |
| `OPENAI_API_KEY` | ⚪ 선택 | Product Hunt 콘텐츠 GPT 생성 | ~$0.01/배포 |
| `PRODUCT_HUNT_TOKEN` | ⚪ 선택 | Product Hunt 자동 게시 | 무료 |

---

## 🚀 빠른 설정 (15분)

### 1단계: Vercel 설정 (필수)

#### 1-1. Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인 (브라우저가 열립니다)
vercel login
```

#### 1-2. 프로젝트 연결

```bash
# 프로젝트 디렉토리로 이동
cd vibe-1129-acorn-activity-tracker-app-auto-release-p2

# Vercel 프로젝트 연결
vercel link
```

질문에 답변:
- **Set up and deploy?** → `N` (나중에 자동 배포)
- **Which scope?** → 개인 계정 선택
- **Link to existing project?** → `N`
- **Project name?** → Enter (기본값)

#### 1-3. 프로젝트 ID 확인

```bash
cat .vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_abc123def456",
  "projectId": "prj_xyz789uvw012"
}
```

**📝 이 값들을 복사해두세요:**
- `orgId` → `VERCEL_ORG_ID`
- `projectId` → `VERCEL_PROJECT_ID`

#### 1-4. Vercel API 토큰 발급

1. **[Vercel Account Tokens](https://vercel.com/account/tokens)** 페이지 접속
2. **"Create Token"** 클릭
3. 토큰 설정:
   - **Name**: `GitHub Actions - Acorn Tracker`
   - **Scope**: `Full Account` 선택
   - **Expiration**: `No Expiration` (권장)
4. **"Create"** 클릭
5. 🔴 **중요**: 생성된 토큰을 **즉시 복사**하세요! (다시 볼 수 없습니다)

예시: `vercel_abc123def456...`

---

### 2단계: GitHub Secrets 추가 (필수)

#### 2-1. GitHub 저장소 설정 페이지 접속

```
https://github.com/junsang-dong/vibe-1129-acorn-activity-tracker-app-auto-release-p2/settings/secrets/actions
```

또는:
1. GitHub 저장소 접속
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Secrets and variables** → **Actions**

#### 2-2. Vercel Secrets 추가

**"New repository secret"** 버튼 클릭 후 각각 추가:

##### Secret 1: VERCEL_TOKEN
```
Name: VERCEL_TOKEN
Secret: [1-4에서 복사한 Vercel 토큰]
```
"Add secret" 클릭

##### Secret 2: VERCEL_ORG_ID
```
Name: VERCEL_ORG_ID
Secret: [1-3에서 확인한 orgId]
```
"Add secret" 클릭

##### Secret 3: VERCEL_PROJECT_ID
```
Name: VERCEL_PROJECT_ID
Secret: [1-3에서 확인한 projectId]
```
"Add secret" 클릭

#### 2-3. 확인

Secrets 페이지에 3개의 시크릿이 추가되었는지 확인:
- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID

**🎉 기본 설정 완료!** 이제 main 브랜치에 푸시하면 자동으로 Vercel에 배포됩니다.

---

### 3단계: OpenAI API 설정 (선택)

Product Hunt 콘텐츠를 GPT로 자동 생성하려면:

#### 3-1. OpenAI 계정 생성

1. [OpenAI Platform](https://platform.openai.com) 접속
2. 계정 생성 또는 로그인

#### 3-2. 결제 방법 추가 (필수)

1. [Billing 페이지](https://platform.openai.com/account/billing) 접속
2. **"Add payment method"** 클릭
3. 카드 정보 입력
4. 사용량 한도 설정 (권장: **$5-10/월**)

**💰 예상 비용**: 배포당 약 $0.01-0.02 (GPT-4o-mini 사용)

#### 3-3. API 키 발급

1. [API Keys 페이지](https://platform.openai.com/api-keys) 접속
2. **"Create new secret key"** 클릭
3. 키 설정:
   - **Name**: `GitHub Actions - Acorn Tracker`
   - **Permissions**: `All` (기본값)
4. **"Create secret key"** 클릭
5. 🔴 **중요**: 생성된 키를 **즉시 복사**하세요! (다시 볼 수 없습니다)

예시: `sk-proj-abc123...`

#### 3-4. GitHub Secret 추가

```
Name: OPENAI_API_KEY
Secret: [3-3에서 복사한 OpenAI API 키]
```
"Add secret" 클릭

---

### 4단계: Product Hunt API 설정 (선택)

Product Hunt에 자동으로 게시하려면:

#### 4-1. Product Hunt 계정

[Product Hunt](https://www.producthunt.com) 계정이 필요합니다.

#### 4-2. Developer API 신청

1. [Product Hunt API](https://api.producthunt.com/v2/oauth/applications) 접속
2. **"New Application"** 클릭
3. 애플리케이션 정보:
   - **Name**: `Acorn Activity Tracker`
   - **Description**: `Habit tracking app with automated deployment`
   - **Redirect URI**: `http://localhost` (테스트용)
4. **"Create"** 클릭

#### 4-3. Developer Token 발급

애플리케이션 페이지에서:
- **Developer Token** 복사

예시: `abc123def456...`

#### 4-4. GitHub Secret 추가

```
Name: PRODUCT_HUNT_TOKEN
Secret: [4-3에서 복사한 Product Hunt 토큰]
```
"Add secret" 클릭

---

## ✅ 설정 완료 체크리스트

모든 설정이 완료되었는지 확인하세요:

### 필수 (자동 배포용)
- [ ] Vercel CLI 설치 완료
- [ ] `vercel link` 실행 완료
- [ ] Vercel API 토큰 발급
- [ ] GitHub에 `VERCEL_TOKEN` 추가
- [ ] GitHub에 `VERCEL_ORG_ID` 추가
- [ ] GitHub에 `VERCEL_PROJECT_ID` 추가

### 선택 (Product Hunt 자동 게시용)
- [ ] OpenAI 계정 생성 및 결제 추가
- [ ] OpenAI API 키 발급
- [ ] GitHub에 `OPENAI_API_KEY` 추가
- [ ] Product Hunt 계정 생성
- [ ] Product Hunt Developer Token 발급
- [ ] GitHub에 `PRODUCT_HUNT_TOKEN` 추가

---

## 🧪 테스트하기

### 테스트 1: Dry-Run (안전)

Pull Request로 테스트:

```bash
# 테스트 브랜치 생성
git checkout -b test/api-setup

# 작은 변경
echo "# Test" >> README.md

# 커밋 & 푸시
git add README.md
git commit -m "test: API setup"
git push origin test/api-setup
```

GitHub에서 Pull Request 생성 후:
1. **Actions** 탭에서 워크플로 실행 확인
2. ✅ Vercel 프리뷰 배포 성공 확인
3. ✅ Product Hunt 콘텐츠 생성 확인 (Artifacts)
4. ❌ 실제 Product Hunt 게시는 안 됨 (정상)

### 테스트 2: 실제 배포

PR이 성공하면 main에 머지:

```bash
# GitHub에서 PR 머지 후
git checkout main
git pull origin main
```

또는 직접 main에 푸시:

```bash
git checkout main
git add .
git commit -m "feat: setup automated deployment"
git push origin main
```

확인:
1. **Actions** 탭에서 워크플로 실행 확인
2. ✅ Vercel 프로덕션 배포 확인
3. ✅ Product Hunt 게시 확인 (선택사항 설정 시)
4. ✅ CHANGELOG 업데이트 확인

---

## 🔒 보안 모범 사례

### DO ✅

1. **GitHub Secrets 사용**
   - 모든 API 키는 GitHub Secrets에 저장
   - 절대 코드에 직접 넣지 마세요

2. **.env 파일 Git 제외**
   - `.gitignore`에 이미 추가되어 있음
   - 절대 커밋하지 마세요

3. **최소 권한 원칙**
   - API 키는 필요한 권한만 부여
   - Vercel 토큰은 특정 프로젝트만 접근

4. **정기적 로테이션**
   - API 키를 주기적으로 교체 (3-6개월)
   - 사용하지 않는 키는 삭제

### DON'T ❌

1. **API 키를 코드에 포함**
   ```javascript
   // ❌ 절대 하지 마세요!
   const apiKey = "sk-proj-abc123...";
   ```

2. **.env 파일을 커밋**
   ```bash
   # ❌ 절대 하지 마세요!
   git add .env
   ```

3. **공개 채널에 공유**
   - 이메일, Slack, Discord에 API 키 공유 금지
   - 스크린샷에 API 키 노출 금지

4. **브라우저 개발자 도구에 노출**
   - 클라이언트 JavaScript에 API 키 포함 금지
   - (이 앱은 서버리스이므로 해당 없음)

---

## ❓ 문제 해결

### Q: "vercel command not found" 오류

```bash
# Vercel CLI 재설치
npm install -g vercel

# PATH 확인
echo $PATH

# 터미널 재시작
```

### Q: GitHub Actions에서 "Invalid token" 오류

**원인**: Vercel 토큰이 잘못되었거나 만료됨

**해결**:
1. [Vercel Tokens](https://vercel.com/account/tokens)에서 기존 토큰 삭제
2. 새 토큰 생성
3. GitHub Secrets의 `VERCEL_TOKEN` 업데이트

### Q: OpenAI API "insufficient_quota" 오류

**원인**: 결제 방법이 등록되지 않았거나 한도 초과

**해결**:
1. [OpenAI Billing](https://platform.openai.com/account/billing) 확인
2. 결제 방법 추가 또는 업데이트
3. 사용량 한도 증가

### Q: Product Hunt API "unauthorized" 오류

**원인**: Product Hunt 토큰이 잘못됨

**해결**:
1. [Product Hunt API](https://api.producthunt.com/v2/oauth/applications) 확인
2. Developer Token 재발급
3. GitHub Secrets의 `PRODUCT_HUNT_TOKEN` 업데이트

### Q: Secrets를 업데이트했는데 워크플로가 실패

**원인**: 이전 워크플로가 오래된 시크릿을 캐시함

**해결**:
1. 워크플로 재실행:
   - Actions 탭 → 실패한 워크플로 → "Re-run jobs"
2. 또는 더미 커밋 푸시:
   ```bash
   git commit --allow-empty -m "chore: trigger workflow"
   git push
   ```

---

## 📚 추가 자료

### 공식 문서

- [Vercel 문서](https://vercel.com/docs)
- [GitHub Secrets 문서](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Product Hunt API 문서](https://api.producthunt.com/v2/docs)

### 프로젝트 문서

- [전체 설정 가이드](SETUP_GUIDE.md)
- [Vercel 빠른 배포](VERCEL_SETUP_QUICK.md)
- [배포 가이드](DEPLOY.md)

---

## 🆘 도움 요청

문제가 계속되면:

1. [Issues](https://github.com/junsang-dong/vibe-1129-acorn-activity-tracker-app-auto-release-p2/issues) 에서 검색
2. 새 Issue 생성 시 포함할 내용:
   - 어떤 단계에서 문제 발생
   - 오류 메시지 (API 키는 제거!)
   - 시도한 해결 방법
   - 환경 정보 (OS, Node 버전 등)

---

## 🎉 완료!

API 키 설정이 완료되었습니다!

이제 main 브랜치에 푸시할 때마다:
- ✅ 자동으로 빌드 & 테스트
- ✅ Vercel에 프로덕션 배포
- ✅ Product Hunt에 자동 게시 (선택)
- ✅ CHANGELOG 자동 업데이트

**더 이상 수동 배포는 필요 없습니다!** 🚀

---

즐거운 개발 되세요! 🌰✨

