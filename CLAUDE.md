# Blanoir

비개발자도 5분 안에 자기 홈페이지를 만들고 배포할 수 있는 **한글 노코드 페이지 빌더**.

## 현재 상태

Phase 3(에디터 코어) 완료. `(editor)` 그룹 + 자체 헤더 레이아웃, Zustand 스토어, 제목·문단 섹션 인라인 편집, 스타일 패널(크기/정렬/강조/색상+사용자지정), 섹션 추가 메뉴·삭제·순서변경(dnd-kit), 5초 디바운스 자동저장(+변경 감지·수동 저장 버튼), 미저장 이탈 보호(확인 모달 + `beforeunload`)까지 동작.

Phase 2(랜딩 + 인증)도 완료 상태(랜딩·로컬/소셜 로그인·회원가입·비밀번호 재설정·대시보드, 실제 DB·메일 연동 검증). 외부 셋업은 MongoDB Atlas·소셜 3종 OAuth·Gmail SMTP 연결됨(`.env.local`).

**다음 작업: Phase 3 곁가지(폰트·섹션 사이 추가) → Phase 4 — 섹션 확장**

## 문서 안내

이 저장소의 문서는 3개로 나뉜다.

| 문서                  | 내용                                     |
| --------------------- | ---------------------------------------- |
| `CLAUDE.md` (이 파일) | 현황 + 기술 스택 + 작업 순서 + 길잡이    |
| `docs/AGENT.md`       | 코딩 컨벤션, 명명 규칙, Git, 초기 셋업   |
| `docs/DECISIONS.md`   | 무엇을 왜 만들기로 했나 (제품/설계 결정) |

> 코드 작성 규칙은 반드시 `docs/AGENT.md`를 따른다. 기능/스펙 관련 결정은 `docs/DECISIONS.md`를 근거로 한다.

## 기술 스택

| 영역          | 선택                                                            |
| ------------- | --------------------------------------------------------------- |
| 프레임워크    | Next.js 16 (App Router) + React 19                              |
| 언어          | TypeScript                                                      |
| 백엔드        | Next.js Server Actions / API Routes (풀스택)                    |
| 인증          | NextAuth (Auth.js) — 구글/카카오/네이버 소셜 + 이메일/비번 로컬 |
| 이메일 발송   | Gmail SMTP (nodemailer) — 키 없으면 콘솔 폴백                   |
| DB            | MongoDB Atlas + Mongoose                                        |
| 이미지 호스팅 | Cloudinary                                                      |
| 호스팅        | Vercel                                                          |
| 스타일        | Tailwind CSS v4 (CSS 기반 설정, `@theme`)                       |
| UI 컴포넌트   | shadcn/ui                                                       |
| 모션          | Motion (구 Framer Motion, `motion` 패키지)                      |
| 다크모드      | next-themes                                                     |
| 상태관리      | Zustand                                                         |
| 서버 상태     | React Query (TanStack Query)                                    |
| 폼            | React Hook Form + Zod                                           |
| 테스트        | Vitest (단위) + Playwright (E2E 1~2개)                          |
| 한글 폰트     | Pretendard                                                      |
| 영문 폰트     | Inter                                                           |

> 기술 선택 이유, 서버리스 커넥션 관리, 비용 구성은 `docs/DECISIONS.md` 참고.

## 작업 순서 (커밋 단위)

### Phase 1: 기반 셋업

**외부 셋업 (직접 실행):**

- [x] MongoDB Atlas 계정 생성 + 클러스터 생성 + connection string 발급 (로컬 DNS의 SRV 거부 이슈로 non-SRV 형식 사용)
- [x] Google Cloud Console에서 OAuth 클라이언트 등록
- [x] Kakao Developers OAuth 등록 (이메일 미제공 → 합성 이메일로 처리)
- [x] Naver Developers OAuth 등록
- [x] Gmail SMTP 앱 비밀번호 발급 (비밀번호 재설정 메일 발송)
- [ ] GitHub 레포지토리 생성 (main 단일 브랜치, 바로 push·배포)

**코드 작업:**

- [x] 프로젝트 초기화 (`create-next-app`), 라이브러리 설치
- [x] Tailwind + shadcn 설정
- [x] Prettier + Husky + lint-staged 설정
- [x] 디자인 시스템 (모노톤 neutral 테마, Pretendard, next-themes 다크모드 토글)
- [x] `.env.local` 작성, `.env.example` git에 올림
- [x] MongoDB 연결 (`lib/mongodb.ts`, 서버리스 커넥션 캐싱 패턴 적용)
- [x] User/Page 스키마 (`models/`)
- [x] NextAuth v5 셋업 (`lib/auth.ts`, `auth.config.ts`, route, `proxy.ts` 가드)
- [x] 공용 컴포넌트 (Header/Footer 등 — `(marketing)`/`(app)` 그룹 헤더로 구현)

### Phase 2: 랜딩 + 인증

- [x] 랜딩 UI 퍼블리싱 (Hero/Features/HowItWorks/UseCases/FAQ/FinalCTA + 헤더/푸터)
- [x] 랜딩 인터랙션 (motion 스크롤 페이드 `FadeIn`, 호버)
- [x] 로그인 페이지 (소셜 3종 버튼 + 이메일/비번 폼)
- [x] 회원가입 페이지 (로컬용 — 이메일/비번/닉네임)
- [x] 비번 bcrypt 해싱
- [x] 첫 가입 시 handle 자동 생성 로직 (es-hangul 로마자 변환 + 중복 시 숫자 접미사)
- [x] 비밀번호 재설정 페이지 (이메일 → 인증코드 → 새 비밀번호, Gmail SMTP, 5회 제한)
- [x] 대시보드 UI (페이지 목록 카드)
- [x] 대시보드 API (페이지 목록 조회, 새 페이지 생성)

### Phase 3: 에디터 코어

- [x] 에디터 레이아웃 (`(editor)` 그룹, 자체 EditorHeader)
- [x] Zustand editor store (`store/editor.ts`)
- [x] 제목 섹션 + 인라인 편집 UI (`SectionText` 공통화)
- [x] 제목 스타일 패널 (크기/색/정렬/굵게/기울임) — **폰트는 곁가지로 미룸**
- [x] 문단 섹션
- [x] 섹션 추가 (`AddSectionMenu` — base-ui Menu, 종류 메뉴)
- [x] 섹션 삭제 / 순서 변경 (dnd-kit)
- [x] 자동저장 (5초 디바운스 + 스냅샷 변경 감지) + Server Action `savePage` (+ 수동 저장 버튼)
- [x] 페이지 이탈 경고 (`beforeunload` + base-ui AlertDialog 확인 모달 + 언마운트 flush)

**미룬 곁가지 (Phase 4 전 또는 함께):**

- [ ] 폰트 컨트롤 (스타일 패널 폰트 + 한글 폰트 로딩 인프라)
- [ ] 섹션 사이 호버 추가 (`AddSectionMenu`의 `index` prop 활용)
- [ ] 캔버스 다크모드 절연 (Phase 5 다크 토글과 함께 — `DECISIONS.md` 참조)

### Phase 4: 섹션 확장

**외부 셋업:**

- [ ] Cloudinary 계정 생성 + API 키 발급

**코드 작업:**

- [ ] 이미지 섹션 (Cloudinary 연동, 명시적 "저장" 버튼)
- [ ] 버튼 섹션 (외부 링크)
- [ ] 구분선 섹션
- [ ] 갤러리 섹션 (그리드)
- [ ] 카드 섹션 (이미지+제목+설명)

### Phase 5: 공개 페이지

- [ ] 사용자 페이지 렌더링 (Server Component, SSR)
- [ ] SEO 메타데이터 자동 생성 (generateMetadata)
- [ ] 사용자 프로필 페이지 (`/user/[handle]`)
- [ ] 공개/비공개 토글 + 비공개시 404 처리
- [ ] 다크모드 토글 (헤더)
- [ ] PC/모바일 미리보기 토글 (에디터)
- [ ] 모바일에서 에디터 접속 시 미리보기 전용 모드

### Phase 6: 마무리 (개발 완료 후)

**코드 작업:**

- [ ] 에러 처리 (error.tsx, not-found.tsx, middleware)
- [ ] 반응형 점검 (모바일/태블릿/PC)
- [ ] 단위 테스트 작성 (Vitest)
- [ ] E2E 테스트 작성 (Playwright 1~2개 시나리오)

**외부 셋업 (직접 실행):**

- [ ] 도메인 구매 (가비아 — **blanoir.com**)
- [ ] Vercel 계정 + 프로젝트 연결
- [ ] Vercel 대시보드에 `.env.production` 환경변수 등록
- [ ] Vercel에 도메인 연결
- [ ] 소셜 OAuth Redirect URL을 운영 도메인으로 추가 (Google/Kakao/Naver 콘솔)
- [ ] MongoDB Atlas Network Access에 Vercel IP 허용 (0.0.0.0/0 또는 화이트리스트)
