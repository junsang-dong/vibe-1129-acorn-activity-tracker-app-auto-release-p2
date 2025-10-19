# 배포 가이드

Acorn Activity Tracker를 다양한 플랫폼에 배포하는 방법을 안내합니다.

## 목차

- [자동 배포 (GitHub Actions)](#자동-배포-github-actions)
- [Vercel 배포](#vercel-배포)
- [GitHub Pages 배포](#github-pages-배포)
- [Netlify 배포](#netlify-배포)
- [커스텀 서버 배포](#커스텀-서버-배포)

---

## 자동 배포 (GitHub Actions)

### 1. Secrets 설정

GitHub 저장소 Settings → Secrets and variables → Actions에서 다음 시크릿을 추가하세요:

#### Vercel 관련

```
VERCEL_TOKEN         # Vercel API 토큰
VERCEL_ORG_ID        # Vercel 조직 ID
VERCEL_PROJECT_ID    # Vercel 프로젝트 ID
```

**Vercel 토큰 발급:**
1. [Vercel Account Settings](https://vercel.com/account/tokens)
2. "Create Token" 클릭
3. 토큰 이름 입력 (예: "GitHub Actions")
4. 생성된 토큰을 `VERCEL_TOKEN`에 저장

**Vercel 프로젝트 연결:**
```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인 및 프로젝트 연결
vercel login
vercel link

# .vercel/project.json에서 ID 확인
cat .vercel/project.json
```

#### Product Hunt 관련

```
PRODUCT_HUNT_TOKEN   # Product Hunt API 토큰
```

**Product Hunt 토큰 발급:**
1. [Product Hunt API](https://api.producthunt.com/v2/oauth/applications) 접속
2. 새 애플리케이션 생성
3. OAuth credentials 발급
4. API 토큰을 `PRODUCT_HUNT_TOKEN`에 저장

#### OpenAI 관련

```
OPENAI_API_KEY       # OpenAI API 키
```

**OpenAI API 키 발급:**
1. [OpenAI Platform](https://platform.openai.com/api-keys)
2. "Create new secret key" 클릭
3. 키 이름 입력
4. 생성된 키를 `OPENAI_API_KEY`에 저장

### 2. 워크플로 실행

#### Main 브랜치에 푸시 (프로덕션 배포)

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

자동으로 다음이 실행됩니다:
- ✅ 테스트
- ✅ 빌드
- ✅ Vercel 프로덕션 배포
- ✅ GPT로 Product Hunt 콘텐츠 생성
- ✅ Product Hunt 게시
- ✅ CHANGELOG 업데이트

#### Pull Request (프리뷰 배포)

```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Pull Request 생성 시:
- ✅ 테스트
- ✅ 빌드
- ✅ Vercel 프리뷰 배포
- ❌ Product Hunt 게시 안 함 (드라이런)
- ❌ CHANGELOG 커밋 안 함

### 3. 배포 상태 확인

Actions 탭에서 워크플로 실행 상태를 확인할 수 있습니다:

```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

각 배포 후 Summary에서 다음 정보를 확인:
- 📦 버전 번호
- 🚀 배포 URL
- 📢 Product Hunt 포스트 링크

---

## Vercel 배포

### 웹 UI로 배포

1. [Vercel](https://vercel.com) 접속 및 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 선택
5. "Deploy" 클릭

### CLI로 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경 변수 설정 (선택사항)

```bash
vercel env add CUSTOM_VAR production
```

---

## GitHub Pages 배포

### 1. 저장소 설정

Settings → Pages에서:
- Source: "Deploy from a branch"
- Branch: "main"
- Folder: "/ (root)"

### 2. 자동 배포

Main 브랜치에 푸시하면 자동으로 배포됩니다.

### 3. 커스텀 도메인 (선택사항)

Settings → Pages → Custom domain에서 도메인을 추가하세요.

```
# CNAME 파일 생성
echo "your-domain.com" > CNAME
git add CNAME
git commit -m "chore: add custom domain"
git push
```

---

## Netlify 배포

### 웹 UI로 배포

1. [Netlify](https://netlify.com) 접속 및 로그인
2. "Add new site" → "Import an existing project"
3. GitHub 저장소 연결
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. "Deploy site" 클릭

### CLI로 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy

# 프로덕션 배포
netlify deploy --prod
```

### netlify.toml 설정

프로젝트 루트에 `netlify.toml` 파일 생성:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Service-Worker-Allowed = "/"
```

---

## 커스텀 서버 배포

### 정적 파일 호스팅

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/acorn;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache

`.htaccess` 파일:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<FilesMatch "sw\.js$">
  Header set Cache-Control "public, max-age=0, must-revalidate"
  Header set Service-Worker-Allowed "/"
</FilesMatch>
```

### Docker 배포

#### Dockerfile

```dockerfile
FROM nginx:alpine

# Copy built files
COPY dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yaml
version: '3'
services:
  acorn:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

#### 빌드 및 실행

```bash
# 빌드
docker build -t acorn-tracker .

# 실행
docker run -d -p 80:80 acorn-tracker

# Docker Compose로 실행
docker-compose up -d
```

---

## 환경별 설정

### 개발 환경

```bash
# 로컬 서버 실행
python3 -m http.server 8000
# 또는
npx http-server -p 8000
```

### 스테이징 환경

Vercel 프리뷰 배포 또는 별도 브랜치:

```bash
git checkout -b staging
git push origin staging
```

### 프로덕션 환경

Main 브랜치를 통한 자동 배포:

```bash
git checkout main
git merge develop
git push origin main
```

---

## 성능 최적화

### 1. Gzip/Brotli 압축 활성화

대부분의 호스팅 플랫폼에서 자동으로 지원됩니다.

### 2. CDN 사용

Vercel, Netlify는 자동으로 CDN을 제공합니다.

### 3. 캐싱 전략

```nginx
# Static assets (1 year)
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML (no cache)
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## 트러블슈팅

### Service Worker 업데이트 안 됨

브라우저에서 하드 리프레시 (Ctrl+Shift+R 또는 Cmd+Shift+R)

### 404 에러

SPA 라우팅 설정 확인:
- Vercel: `vercel.json`에 `routes` 설정
- Netlify: `_redirects` 파일 생성
- Nginx: `try_files` 설정

### HTTPS 인증서 문제

대부분의 플랫폼에서 자동으로 Let's Encrypt 인증서를 발급합니다.

---

## 배포 체크리스트

배포 전 확인 사항:

- [ ] 테스트 통과
- [ ] 빌드 성공
- [ ] 버전 번호 업데이트
- [ ] CHANGELOG 작성
- [ ] 문서 업데이트
- [ ] 환경 변수 설정
- [ ] HTTPS 활성화
- [ ] PWA manifest 검증
- [ ] Service Worker 테스트
- [ ] 모바일 테스트
- [ ] 접근성 테스트

---

## 참고 자료

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Documentation](https://docs.netlify.com)
- [Product Hunt API](https://api.producthunt.com/v2/docs)

---

질문이나 문제가 있으신가요? [Issues](https://github.com/junsang-dong/vibe-1130-acorn-activity-tracker-app-auto-release-p2/issues)에서 문의해주세요!

