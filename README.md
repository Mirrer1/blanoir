# Blanoir

비개발자도 5분 안에 자기 홈페이지를 만들고 배포할 수 있는 **한글 노코드 페이지 빌더**입니다.

클릭만으로 섹션을 쌓고, 자동으로 저장되며, 토글 하나로 공개하면 검색 엔진에도 노출됩니다.

**Live demo:** https://blanoir.vercel.app

<br />

## 아키텍처

<img width="1215" height="697" alt="Image" src="https://github.com/user-attachments/assets/1ea9478c-c0a3-496f-ab16-03ff57aa7369" />

<br />
<br />

## 주요 기능

- **섹션 기반 에디터** — 9종의 섹션을 드래그로 배치하고 인라인으로 편집합니다. 섹션 선택 시 우측 스타일 패널이 콘텐츠/배경 탭으로 열립니다.
- **스타일링** — 한글 폰트 6종, 단색·그레디언트 색상, 섹션 배경(색·이미지)·높이, 스크롤 등장 효과 8종
- **시작 템플릿** — 프로필·매장·청첩장·포트폴리오·이력서 5종 골격으로 빈 캔버스를 채웁니다.
- **자동 저장** — 3초 디바운스 저장 + 미저장 이탈 보호. 이미지는 업로드·교체·삭제에 맞춰 Cloudinary에서 자동 정리됩니다.
- **이미지** — Cloudinary 업로드, 비율·확대·초점(focus) 조정
- **인증** — 구글·카카오·네이버 소셜 + 이메일/비밀번호 로컬, 비밀번호 재설정(메일 인증코드)
- **공개 페이지** — SSR 렌더 + 공개/비공개 토글, 메타데이터·sitemap 자동 생성으로 검색 노출
- **다크 모드** — 작업 도구(헤더·패널)에만 적용하고, 결과물·미리보기는 항상 라이트로 절연
- **반응형** — 모바일/태블릿에서 에디터는 미리보기 전용으로 전환

<br />

## 섹션 종류

| 섹션   | 설명                                          |
| ------ | --------------------------------------------- |
| 제목   | 크기 4단계가 `h1`~`h3`/`p`로 매핑 (SEO 위계)  |
| 문단   | 긴 본문 텍스트                                |
| 이미지 | 1장, 비율·확대·초점 조정                      |
| 버튼   | 링크(외부 URL·내 페이지)·색·너비·정렬         |
| 구분선 | 모양(실선/파선/점선)·두께·색                  |
| 공백   | 섹션 사이 여백 (높이 3단계)                   |
| 갤러리 | 여러 이미지를 한 줄 가로 캐러셀로             |
| 카드   | 이미지+제목+설명 묶음, 그리드형/가로형/세로형 |
| 열     | 가로 2~3칸 분할, 칸마다 제목·문단·이미지·버튼 |

모든 섹션은 공통 컨테이너 속성(배경색·배경이미지·높이·등장 효과)을 가집니다. 제목·문단·이미지·카드·갤러리·버튼에는 링크(외부 URL·내 페이지)를 걸 수 있습니다.

<br />

## 라우트

| 경로                      | 내용                                |
| ------------------------- | ----------------------------------- |
| `/`                       | 랜딩                                |
| `/login`, `/signup`       | 로그인 / 회원가입                   |
| `/forgot-password`        | 비밀번호 재설정                     |
| `/dashboard`              | 내 페이지 목록                      |
| `/edit/[pageId]`          | 에디터                              |
| `/settings`               | 계정 설정 (프로필·비번·테마·요금제) |
| `/user/[handle]/[pageId]` | 공개 페이지 (결과물)                |

<br />

## 기술 스택

| 영역       | 사용                               |
| ---------- | ---------------------------------- |
| 프레임워크 | Next.js 16 (App Router) + React 19 |
| 언어       | TypeScript                         |
| 백엔드     | Next.js Server Actions (풀스택)    |
| 인증       | NextAuth (Auth.js v5)              |
| DB         | MongoDB Atlas + Mongoose           |
| 이미지     | Cloudinary                         |
| 이메일     | Gmail SMTP (nodemailer)            |
| 스타일     | Tailwind CSS v4 + shadcn/ui        |
| 상태       | Zustand                            |
| 폼         | React Hook Form + Zod              |
| 모션       | Motion                             |
| 호스팅     | Vercel                             |

<br />

## 설계 노트

- 조회는 서버 컴포넌트(SSR), 변경은 Server Action으로 처리합니다. 별도 클라이언트 패칭 레이어(React Query 등)를 두지 않습니다.
- Zustand 에디터 스토어는 전역 싱글톤이 아니라 페이지별 Context 스토어로 생성해, SSR 깜빡임과 요청 간 상태 누수를 피합니다.
- 섹션 표시 컴포넌트를 단일 소스로 두고 에디터만 그 위에 편집을 얹어, 캔버스·미리보기·공개에 같은 뷰를 중복 구현하지 않고 편집 화면과 결과물을 일치시킵니다.
- 서버리스 환경을 위해 MongoDB 커넥션을 캐싱하고, 안 쓰는 Cloudinary 이미지는 교체·삭제 시점에 정리합니다.

<br />

## 시작하기

요구 사항: Node.js 20+

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 의 각 키 값을 채웁니다 (아래 참고)

# 3. 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

<br />

### 환경 변수

`.env.example`의 키를 `.env.local`에 채웁니다.

- `MONGODB_URI` — MongoDB Atlas connection string
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — Auth.js
- `GOOGLE_*` / `KAKAO_*` / `NAVER_*` — 소셜 OAuth
- `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — 이미지 호스팅
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — 비밀번호 재설정 메일 (없으면 콘솔 폴백)
- `NEXT_PUBLIC_SITE_URL` — 사이트 베이스 URL (sitemap·OG에 사용)
- `GOOGLE_SITE_VERIFICATION` / `NAVER_SITE_VERIFICATION` — 검색엔진 소유권 인증 (선택)

<br />

## 스크립트

| 명령             | 설명               |
| ---------------- | ------------------ |
| `npm run dev`    | 개발 서버          |
| `npm run build`  | 프로덕션 빌드      |
| `npm run start`  | 빌드 결과 실행     |
| `npm run lint`   | ESLint             |
| `npm run format` | Prettier 포맷      |
| `npm run test`   | Vitest 단위 테스트 |

<br />

## 프로젝트 구조

```
src/
  app/            # App Router (marketing / auth / app / editor / public 그룹)
  actions/        # Server Actions
  components/     # 공용 컴포넌트 (sections / ui / common)
  hooks/          # 커스텀 훅
  lib/            # 외부 연동 (mongoDB, auth, cloudinary, site)
  models/         # Mongoose 스키마
  providers/      # Context Provider
  store/          # Zustand (페이지별 Context 스토어)
  types/          # 공유 타입
  utils/          # 순수 함수
```

<br />

## 문서

| 문서                | 내용                          |
| ------------------- | ----------------------------- |
| `CLAUDE.md`         | 현황 + 기술 스택 + 작업 순서  |
| `docs/AGENT.md`     | 코딩 컨벤션 + Git + 초기 셋업 |
| `docs/DECISIONS.md` | 제품·설계 결정과 그 이유      |
