# GitHub Pages 배포 가이드

## 📋 배포 전 체크리스트

### 1. 이미지 파일 추가
- [ ] `assets/img/` 폴더에 로고 이미지 추가
- [ ] 사례 이미지 추가 (있을 경우)
- [ ] `data/cases.json`의 이미지 경로 확인

### 2. PDF 자료 추가
- [ ] `assets/pdf/brochure.pdf` - 회사소개서 PDF 파일 추가

### 3. 데이터 검토
- [ ] `data/company.json` - 회사 정보 확인
- [ ] `data/solutions.json` - 솔루션 내용 확인
- [ ] `data/cases.json` - 사례 정보 확인
- [ ] `data/contact.json` - 연락처 정보 확인

## 🚀 GitHub Pages 배포 방법

### Step 1: GitHub 리포지토리 생성

1. GitHub에 로그인
2. 새 리포지토리 생성
   - 이름: `mediafeel` (또는 원하는 이름)
   - Public 설정
   - README 체크 해제 (이미 존재)

### Step 2: 코드 푸시

```bash
# 프로젝트 폴더로 이동
cd "c:\Users\jwbae\OneDrive\문서\GitHub\mediafeel"

# Git 초기화 (아직 초기화하지 않았다면)
git init

# 원격 리포지토리 추가
git remote add origin https://github.com/YOUR_USERNAME/mediafeel.git

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: MEDIA-ISM website"

# 푸시
git push -u origin main
```

### Step 3: GitHub Pages 활성화

1. GitHub 리포지토리 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - Branch: `main` 선택
   - Folder: `/root` 선택
5. **Save** 클릭

### Step 4: 배포 확인

- 배포 완료까지 1-2분 소요
- 배포 URL: `https://YOUR_USERNAME.github.io/mediafeel/`
- Actions 탭에서 배포 진행 상황 확인 가능

## 🌐 커스텀 도메인 연결 (선택사항)

### 도메인이 있는 경우

1. **DNS 설정**
   - A 레코드 추가:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - 또는 CNAME 레코드: `YOUR_USERNAME.github.io`

2. **CNAME 파일 추가**
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

3. **GitHub Pages 설정**
   - Settings > Pages
   - Custom domain에 도메인 입력
   - Enforce HTTPS 체크

## 🔧 업데이트 방법

```bash
# 파일 수정 후
git add .
git commit -m "Update content"
git push
```

자동으로 재배포됩니다 (1-2분 소요).

## 🧪 로컬 테스트

배포 전 로컬에서 테스트:

```bash
# Python 서버
python -m http.server 8000

# Node.js http-server
npx http-server -p 8000

# 브라우저에서
http://localhost:8000
```

## ⚠️ 주의사항

1. **파일명 대소문자 주의**
   - GitHub Pages는 대소문자를 구분합니다
   - 모든 경로가 정확한지 확인하세요

2. **CORS 이슈**
   - GitHub Pages는 CORS를 자동으로 처리합니다
   - 외부 API 사용 시 CORS 설정 확인

3. **캐싱**
   - 브라우저 캐시로 변경사항이 즉시 반영되지 않을 수 있습니다
   - Ctrl + Shift + R (강제 새로고침)

## 📱 모바일 테스트

배포 후 다양한 기기에서 테스트:
- iPhone (Safari)
- Android (Chrome)
- Tablet
- Desktop (Chrome, Firefox, Safari, Edge)

## 🎯 SEO 최적화 (선택사항)

`index.html`에 추가 메타 태그:
```html
<meta property="og:title" content="MEDIA-ISM - (주)미디어즘">
<meta property="og:description" content="원스톱 맞춤 설계 시뮬레이터 & 멀티미디어 솔루션">
<meta property="og:image" content="./assets/img/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com">
```

## 📞 문제 해결

### 페이지가 404 에러
- Settings > Pages에서 설정 확인
- `main` 브랜치에 코드가 푸시되었는지 확인

### CSS/JS가 로드되지 않음
- 브라우저 콘솔(F12) 확인
- 파일 경로가 올바른지 확인
- 대소문자 확인

### JSON 데이터가 로드되지 않음
- 브라우저 콘솔에서 네트워크 탭 확인
- JSON 파일 문법 오류 확인 (JSONLint 사용)

## 🎉 완료!

배포가 성공하면 웹사이트가 전 세계에 공개됩니다!
