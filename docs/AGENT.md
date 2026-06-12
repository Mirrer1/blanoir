# Blanoir 작업 규칙 (AGENT)

> 어떻게 일하고 코드를 짜는지. 제품/스펙 결정은 `DECISIONS.md`, 현황/작업순서는 `../CLAUDE.md` 참고.

## 코딩 규칙

1. JSX return 안에 변수 선언 금지 — return 위에서 미리 계산.
2. 컴포넌트 내부 순서: 변수/state → 콜백(useCallback) → useEffect → return.
3. **return은 1개만.** 조건부 렌더링은 early return X, 단일 return 안에서 삼항 연산자 또는 `&&`로 처리.
4. 모든 컴포넌트는 **화살표 함수 + 하단 default export** 패턴.
5. 이벤트 핸들러는 기본 콜백 추출(return 위). 예외(인라인 허용): 한 줄 + 단순 setter + 재사용 없음.
6. 기본은 **서버 컴포넌트**. `"use client"`는 state/이벤트/브라우저 API 필요한 자식만 최소 단위로 분리.

### return 1개 패턴 예시

❌ 나쁜 예 (return 여러 개):

```tsx
if (isLoading) return <Loading />
if (error) return <Error />
return <Content />
```

✅ 좋은 예 (return 1개):

```tsx
return <>{isLoading ? <Loading /> : error ? <Error /> : <Content />}</>
```

### 컴포넌트 패턴 예시

```tsx
const MyComponent = () => {
  return <div>...</div>
}

export default MyComponent
```

### 이벤트 핸들러 인라인 vs 추출 예시

❌ 단순 setter 인데 굳이 추출:

```tsx
const handleNameChange = (e) => setName(e.target.value)
<input onChange={handleNameChange} />
```

✅ 단순 setter는 인라인 OK:

```tsx
<input onChange={(e) => setName(e.target.value)} />
```

✅ 복합 로직은 추출:

```tsx
const handleSubmit = async () => {
  if (!name) return toast.error('필수')
  await savePage(data)
}

;<button onClick={handleSubmit}>저장</button>
```

### "use client" 정책

- 기본: 서버 컴포넌트
- 클라이언트 컴포넌트는 필요한 부분만 최소 단위로 분리
- `"use client"` 필요 조건 (셋 중 하나):
  - useState/useReducer 등 state
  - useEffect/onClick 등 이벤트 핸들러
  - 브라우저 API (window, localStorage 등)
- 페이지 자체는 서버 컴포넌트로, 인터랙션 있는 자식만 클라이언트로 분리

**Blanoir 적용 예시:**

| 페이지                                | 정책                                            |
| ------------------------------------- | ----------------------------------------------- |
| 랜딩 `/`                              | 서버 컴포넌트                                   |
| 로그인 `/login`                       | 페이지는 서버, 폼만 클라이언트                  |
| 대시보드 `/dashboard`                 | 페이지는 서버 (DB 조회), 카드/버튼만 클라이언트 |
| 에디터 `/edit/[pageId]`               | 거의 다 클라이언트 (state, 인터랙션 폭증)       |
| 공개 페이지 `/user/[handle]/[pageId]` | 서버 컴포넌트 (SSR + SEO)                       |

### 데이터 fetching 패턴

- **조회**: React Query (`useQuery` / `useSuspenseQuery`)
- **변경 (POST/PUT/DELETE)**: Server Action 직접 호출 (axios/API Route 안 만듦)
- **인증**: NextAuth HttpOnly 쿠키 자동 (헤더에 토큰 직접 박지 않음)
- 첫 GET은 서버 컴포넌트에서 prefetch + `HydrationBoundary`로 클라이언트에 hydration

## 코드 스타일

### 주석 스타일

주석은 **꼭 필요하거나 핵심적인 부분, 헷갈릴 수 있는 부분에만** 단다. 코드로 자명한 곳엔 달지 않는다.

- 달 가치 있을 때: 의도/이유가 코드에 안 드러날 때, 비직관적 로직, 함정·주의점, 도메인 맥락
- 달지 않음: 이름만 봐도 뻔한 변수/함수/필드, 단순 위임, 자명한 JSX
- 형식: 한 문장, 괄호 `()` 부연설명 X, 특수문자 장식 X (`── ──` 등), JSDoc(`/** */`) 안 씀 (TS 타입으로 충분)

**예시:**

```tsx
interface User {
  email: string
  password: string | null // 소셜 가입은 null
  tempPwdYn: 'Y' | 'N' // Y면 로그인 시 비번 변경 강제
}

const SignUpPage = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = async () => { ... }

  // Safari 자동완성 깨짐 회피용 지연 포커스
  useEffect(() => { ... }, [])

  return <form>...</form>
}

export default SignUpPage
```

### 컴포넌트 분리 기준

다음 중 하나라도 해당하면 별도 컴포넌트로 분리:

- 300줄 넘음
- 같은 패턴 2번 이상 반복
- 명확히 다른 책임 (헤더 + 푸터 같이 있음 등)
- 다른 곳에서도 쓰일 것 같음

### useEffect 가이드

**쓰지 말 것:**

- 데이터 fetching → React Query 사용
- 파생 상태 계산 → 변수로 계산
- 이벤트 처리 → 이벤트 핸들러에서 처리

**써야 할 때 (진짜 부수효과만):**

- DOM 직접 조작 (포커스, 스크롤)
- 이벤트 리스너 / 타이머 등록·해제
- 외부 라이브러리 초기화

**원칙:**

- 의존성 배열 정확히 명시
- cleanup 함수 잊지 말기

### 상수 관리

- 한 파일 내 3곳 이상 사용 → 파일 상단에 대문자 변수로 분리
- 1~2곳이면 인라인 OK
- 의미 불명한 숫자는 의미가 드러나게 변수명 주기
- 환경별 다른 값은 `.env`
- 별도 `constants/` 폴더는 만들지 않음

### 메모이제이션 기준

- 기본: 사용 안 함 (React 리렌더는 대부분 충분히 빠름)
- `useMemo`: 무거운 계산에만 (단순 계산 X)
- `useCallback`: `memo`된 자식에 함수 넘길 때만
- `memo`: 부모 리렌더 잦은데 자식 props 안 바뀔 때
- 성능 문제 측정 후 적용 (추측으로 미리 X)

### 폼 처리

- react-hook-form + zod (스키마 검증)
- shadcn `Form` 컴포넌트 사용 (에러 표시 일관)
- 제출 → Server Action 호출
- 로딩 → `formState.isSubmitting`
- zod 스키마는 폼 파일 옆 또는 `types/`에 둠

## 명명 / 위치 규칙

### 파일/폴더 명명

- 파일명 = export 이름과 동일
  - 컴포넌트: `PascalCase.tsx` (예: `UserCard.tsx`)
  - 훅: `useXxx.ts`
  - 유틸/타입: `camelCase.ts`
- 폴더명: 한 단어면 소문자, 합성 단어면 `camelCase` (예: `editor/`, `pageEditor/`)
- Next.js 특수 파일은 소문자 고정 (`page.tsx`, `layout.tsx`)

### 컴포넌트 명명 (스코프 접두어)

- 특정 페이지/기능 종속 컴포넌트는 부모 스코프 접두어 사용
  - 에디터: `EditorHeader`, `EditorCanvas`, `EditorSidebar`
  - 랜딩: `LandingHero`, `LandingFeatures`
- 공용(`common/`)과 shadcn(`ui/`) 컴포넌트는 접두어 X (`Header`, `Footer`, `Button` 등)

### 컴포넌트 위치

- 한 페이지에서만 사용 → 해당 페이지 폴더 내 `_components/`에 둠 (Next.js private folder)
- 여러 페이지에서 공유 → `src/components/{기능}/`
- shadcn UI → `src/components/ui/`

### 그룹 라우팅

페이지를 역할별로 그룹화 (URL엔 영향 X, 레이아웃 공유 용도).

- `(marketing)` — 랜딩 (가벼운 헤더 + 푸터)
- `(auth)` — 로그인/회원가입 (카드 UI, 헤더 없음)
- `(app)` — 로그인 후 페이지 (대시보드, 에디터, 공통 헤더)
- `(public)` — 공개 페이지 (워터마크, `/user/...`)

인증 가드는 그룹 라우팅이 아니라 `middleware.ts`에서 처리.

### 타입 작성 위치

- 공유 타입(서버 응답 데이터 등) → `src/types/` 도메인별 파일 (`user.ts`, `page.ts`, `section.ts`)
- 컴포넌트 Props / 작은 로컬 타입 → 그 컴포넌트 파일 안
- 2~3곳 이상 반복되면 → `types/`로 올려 공통화
- 중복/공통 조각은 실제로 생겼을 때 정리 (미리 설계 X)

## 작업 흐름 / Git

### 작업 흐름

퍼블리싱 → 서버(API/Server Action) → 프론트(연동) → 테스트 → 커밋

### 커밋 메시지 컨벤션

- 한 줄, 한글, 짧게
- prefix: `feat:` / `fix:` / `refactor:` / `chore:` / `test:` / `style:`
- 예: `feat: 로그인 페이지 퍼블리싱`, `feat: NextAuth 구글 로그인 연동`

### Git

- 단일 `main` 브랜치 (트렁크 기반). 작업 → 커밋 → `main` push → Vercel 자동 배포.

## 초기 셋업 (Phase 1)

```bash
# 프로젝트 생성 (App Router, TypeScript, Tailwind)
npx create-next-app@latest blanoir --typescript --tailwind --app --eslint --src-dir

cd blanoir

# 핵심 라이브러리
npm install mongoose next-auth zustand @tanstack/react-query react-hook-form
npm install zod @hookform/resolvers
npm install nanoid motion next-themes
# motion = 구 framer-motion의 새 패키지명. next-themes = 다크모드 토글
# axios — 현재 미사용 (React Query + Server Action). 외부 API 호출 필요 시 설치
npm install cloudinary next-cloudinary
npm install bcryptjs
npm install -D @types/bcryptjs

# 이메일 (Resend + React Email)
npm install resend react-email @react-email/components

# shadcn/ui 초기화
npx shadcn@latest init

# 자주 쓰는 shadcn 컴포넌트
npx shadcn@latest add button input textarea dialog dropdown-menu toast sonner card avatar tabs separator

# 테스트
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event
npm install -D @playwright/test

# 한글 폰트
npm install pretendard

# 코드 퀄리티 (Prettier + import 정렬)
npm install -D prettier @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss

# pre-commit hook
npm install -D husky lint-staged
npx husky init
```

### Prettier 설정 (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  "importOrder": ["<THIRD_PARTY_MODULES>", "^(@/|\\.).*", "^.+\\.(css|scss)$"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "importOrderParserPlugins": ["typescript", "jsx"]
}
```

- `@trivago/prettier-plugin-sort-imports`: import 그룹 분리 + 정렬
- `prettier-plugin-tailwindcss`: Tailwind 클래스 자동 정렬
- 안 쓰는 import는 ESLint `no-unused-vars`로 잡힘 (수동 제거)

### Import 순서 (4그룹, 그룹 사이 빈 줄)

```tsx
// 1. 외부 라이브러리 (react, next, zod 등)
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

// 4. 스타일
import './styles.css'
import { formatDate } from './utils'
// 2. 내부 파일 (@/ 절대경로 + ./ 상대경로)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
// 3. 타입 (import type)
import type { User } from '@/types/user'
```

→ trivago plugin이 `import type`을 자동으로 일반 import 뒤로 정렬.

### Husky + lint-staged 설정

**`package.json`:**

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

**`.husky/pre-commit`:**

```bash
npx lint-staged
```

→ 커밋 시 자동으로 ESLint + Prettier 실행. 더러운 코드 커밋 차단.

### 환경 변수

**정책:**

- env 파일은 **gitignore** — git에 절대 안 올림
- **2개로 분리 운영:**
  - `.env.local` — 로컬 개발용 (localhost, 개발용 DB/계정)
  - `.env.production` — 배포용 (실제 도메인, 운영 DB/계정) → Vercel 대시보드에 등록
- 변수명은 동일, 값만 환경별로 다름
- 예시 파일은 `.env.example` 만들어서 git에 올림 (키만, 값 비움)

**.gitignore에 반드시 포함:**

```
.env*
!.env.example
.claude/settings.local.json
```

**변수 목록 (.env.local 예시):**

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000   # 배포용은 https://blanoir.com
NEXTAUTH_SECRET=                      # openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Kakao OAuth
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# Naver OAuth
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Resend (이메일 발송)
RESEND_API_KEY=
EMAIL_FROM=noreply@blanoir.com
```

> 배포용(`.env.production`)은 Vercel 대시보드 환경 변수에 등록. 로컬에선 `.env.local`만 사용.

### 권장 폴더 구조

```
blanoir/
  src/
    app/
      layout.tsx                            # 루트 레이아웃
      error.tsx
      not-found.tsx

      (marketing)/
        layout.tsx                          # 랜딩 헤더 + 푸터
        page.tsx                            # /

      (auth)/
        layout.tsx                          # 카드 UI
        login/
          page.tsx
          _components/
            LoginForm.tsx
        signup/
          page.tsx
          _components/
            SignupForm.tsx

      (app)/
        layout.tsx                          # 로그인 후 공통 헤더
        dashboard/
          page.tsx
          _components/
            DashboardPageCard.tsx
            DashboardEmpty.tsx
        edit/
          [pageId]/
            layout.tsx                      # 에디터 전용 레이아웃
            page.tsx
            _components/
              EditorHeader.tsx
              EditorCanvas.tsx
              EditorSidebar.tsx

      (public)/
        user/
          [handle]/
            page.tsx
            [pageId]/
              page.tsx

      api/auth/[...nextauth]/route.ts

    components/
      ui/                                   # shadcn (자동 생성)
      common/                               # 공용 (Header, Footer 등)

    actions/                                # Server Actions
      page.ts
      user.ts

    hooks/
      useAuth.ts
      useAutoSave.ts

    lib/                                    # 외부 연동 설정
      mongodb.ts
      auth.ts
      cloudinary.ts

    utils/                                  # 순수 함수
      formatDate.ts
      handle.ts
      nanoid.ts

    store/                                  # Zustand
      editor.ts

    types/
      user.ts
      page.ts
      section.ts

    models/                                 # Mongoose 스키마
      User.ts
      Page.ts

  middleware.ts                             # 인증 체크 (선택, layout으로 대체 가능)
  next.config.ts
  tailwind.config.ts
  components.json                           # shadcn 설정
  .env.local
```

> 위 구조는 시작 가이드. 실제 폴더는 만들면서 자연스럽게 채워나감. 변경/추가된 부분은 MD에 반영.
