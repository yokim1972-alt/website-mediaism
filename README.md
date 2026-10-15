# MEDIA-ISM Website

(주)미디어즘의 공식 웹사이트입니다.

## 🚀 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - Dark & Minimal 디자인, 반응형 레이아웃
- **JavaScript (ES6 Modules)** - 바닐라 JS, SPA 라우팅
- **GitHub Pages** - 정적 호스팅

## 📁 프로젝트 구조

```
mediafeel/
├── index.html              # 메인 HTML
├── css/
│   ├── main.css           # 기본 스타일, 레이아웃
│   ├── pages.css          # 페이지별 스타일
│   └── components.css     # 컴포넌트 스타일
├── js/
│   ├── main.js            # 라우터, 상태관리
│   └── pages/             # 페이지 모듈
│       ├── home.js
│       ├── about.js
│       ├── solutions.js
│       ├── cases.js
│       ├── case-detail.js
│       ├── contact.js
│       └── privacy.js
├── data/                  # JSON 데이터
│   ├── company.json
│   ├── solutions.json
│   ├── cases.json
│   └── contact.json
└── assets/
    ├── img/              # 이미지 파일
    └── pdf/              # PDF 다운로드 자료
```

## 🎨 디자인 시스템

### 색상 팔레트
- **배경**: `#000000`, `#111111`, `#1a1a1a`
- **Primary**: `#00bfa5` (청록)
- **Secondary**: `#fdd835` (옐로)
- **텍스트**: `#e0e0e0`, `#9e9e9e`
- **보더**: `#333333`

### 타이포그래피
- **영문**: Inter
- **한글**: Pretendard (fallback: Noto Sans KR)

## 🌐 페이지 구조

1. **홈** (`#/`) - 핵심 가치, 솔루션 아코디언, CTA
2. **회사소개** (`#/about`) - 비전/미션, 연혁, 인증/특허
3. **솔루션** (`#/solutions`) - 6가지 솔루션 상세
4. **사례** (`#/cases`) - 프로젝트 사례, 필터링
5. **문의** (`#/contact`) - 연락처, 지도, PDF 다운로드
6. **개인정보처리방침** (`#/privacy`)

## 🚀 로컬 개발

1. 프로젝트 클론
```bash
git clone https://github.com/your-username/mediafeel.git
cd mediafeel
```

2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000
```

3. 브라우저에서 접속
```
http://localhost:8000
```

## 📦 GitHub Pages 배포

1. GitHub 리포지토리에 푸시
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. GitHub Pages 설정
   - Settings > Pages
   - Source: `main` 브랜치
   - Directory: `/root`
   - Save

3. 배포 URL
```
https://your-username.github.io/mediafeel/
```

## 🔧 커스터마이징

### 데이터 수정
`data/` 폴더의 JSON 파일을 수정하여 콘텐츠를 변경할 수 있습니다.

### 이미지 추가
1. `assets/img/` 폴더에 이미지 업로드
2. JSON 파일에서 이미지 경로 수정

### PDF 자료
`assets/pdf/` 폴더에 PDF 파일을 추가하세요.

## 📱 반응형 디자인

- **Desktop**: 1200px 이상
- **Tablet**: 768px - 1199px
- **Mobile**: 767px 이하

## 🎯 주요 기능

- ✅ SPA (Single Page Application) 라우팅
- ✅ 해시 기반 내비게이션
- ✅ 반응형 디자인
- ✅ 아코디언 UI
- ✅ 필터링 시스템
- ✅ 모달 팝업
- ✅ 플로팅 버튼
- ✅ 스크롤 투 탑

## 📞 문의

- **회사**: (주)미디어즘
- **전화**: 010-3287-8984
- **이메일**: media00041@naver.com
- **주소**: 경기 안양시 만안구 양화로71번길 37

## 📄 라이선스

© 2025 (주)미디어즘. All rights reserved.
