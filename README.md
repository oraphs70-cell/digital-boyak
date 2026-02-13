# 디지털 보약 (Digital Boyak) 💊

> 시니어를 위한 스마트폰 도우미 앱

## 📱 프로젝트 소개

**디지털 보약**은 어르신들이 스마트폰을 쉽게 사용할 수 있도록 도와주는 디지털 비서 앱입니다.
복잡한 앱들을 큰 버튼 하나로 바로 실행할 수 있습니다.

## ✨ 주요 기능

### 🔗 외부 앱 연동 (딥링크)
- **길찾기**: 카카오맵으로 바로 연결
- **병원**: 똑딱 앱으로 병원 예약
- **택시**: 카카오T로 택시 호출
- **건강**: 건강보험공단 정보 확인

### 🤖 AI 비서
- Google Gemini AI로 무엇이든 질문하기

### 📊 사용 분석
- Firebase Firestore로 버튼 클릭 통계 수집
- 어르신 사용 패턴 분석

### 🌤️ 부가 기능
- GPS 기반 현재 위치 표시
- OpenWeatherMap 연동 날씨 정보
- SOS 119 긴급 전화
- 앱 공유 기능

## 🛠️ 기술 스택

- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore
- **Icons**: React Icons
- **APIs**: OpenWeatherMap, Nominatim (역지오코딩)

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 API 키를 입력하세요.

```bash
cp .env.example .env
```

#### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Firestore Database 활성화
3. 웹 앱 등록 후 설정값을 `.env`에 입력

#### OpenWeatherMap 설정 (선택사항)
1. [OpenWeatherMap](https://openweathermap.org/api)에서 무료 API 키 발급
2. `.env`의 `VITE_OPENWEATHER_API_KEY`에 입력

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── Header.jsx          # 상단 헤더 (위치, 검색, 알림)
│   ├── MainBanner.jsx      # 메인 배너 (보약이 캐릭터)
│   ├── InfoBar.jsx         # 정보 바 (날씨, SOS, 공유)
│   ├── FeatureGrid.jsx     # 핵심 기능 버튼 그리드
│   ├── AIAssistantButton.jsx  # AI 비서 버튼
│   └── BottomNavigation.jsx   # 하단 네비게이션
├── firebase/            # Firebase 설정
│   ├── config.js           # Firebase 초기화
│   └── analytics.js        # 사용 로그 & 딥링크
├── hooks/               # 커스텀 훅
│   ├── useGeolocation.js   # GPS 위치 훅
│   └── useWeather.js       # 날씨 API 훅
├── App.jsx              # 메인 앱 컴포넌트
├── main.jsx             # 앱 진입점
└── index.css            # 글로벌 스타일
```

## 🎨 디자인 특징

- **시니어 친화적 UI**: 큰 버튼, 큰 글씨, 높은 대비
- **따뜻한 색상**: 파스텔 톤 (살구색/주황색)
- **보약이 마스코트**: 친근한 약탕기 캐릭터
- **직관적 네비게이션**: 5개 탭 하단 메뉴

## 📊 Firestore 데이터 구조

### Collection: `usage_logs`
| 필드 | 타입 | 설명 |
|-----|-----|-----|
| button_name | string | 클릭한 버튼 (taxi, hospital 등) |
| timestamp | timestamp | 클릭 시간 |
| user_location | string | 사용자 위치 |
| device_info | string | 기기 정보 |

## 📱 딥링크 스키마

| 기능 | 딥링크 | 미설치 시 |
|-----|-------|---------|
| 길찾기 | `kakaomap://open` | Play Store |
| 병원 | `ddocdoc://` | Play Store |
| 택시 | `kakaot://` | Play Store |
| 건강 | 웹 URL | 건강보험공단 사이트 |
| AI 비서 | `gemini.google.com` | 브라우저 |

## 📄 라이선스

MIT License

---

Made with 💖 for seniors
