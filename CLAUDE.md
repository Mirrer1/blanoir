# Blanoir

비개발자도 5분 안에 자기 홈페이지를 만들고 배포할 수 있는 **한글 노코드 페이지 빌더**.

## 현재 상태

Phase 3(에디터 코어) 완료. `(editor)` 그룹 + 자체 헤더 레이아웃, Zustand 스토어, 제목·문단 섹션 인라인 편집, 스타일 패널(크기/정렬/강조/색상+사용자지정), 섹션 추가 메뉴·삭제·순서변경(dnd-kit), 5초 디바운스 자동저장(+변경 감지·수동 저장 버튼), 미저장 이탈 보호(확인 모달 + `beforeunload`)까지 동작.

Phase 3 곁가지도 정리됨: 폰트 컨트롤(스타일 패널 + 한글 폰트 자체 호스팅), 섹션 사이 호버 추가(`SectionInsert`), 저장 상태 표시 다듬기(처음 상태와 같으면 표시 없음 + 재진입 초기화). 에러 처리도 보강: 서버 액션 실패 시 토스트 일관 안내(공용 `ToastOnMount`), `error.tsx`·`not-found.tsx` 추가, 미사용 React Query 제거(데이터는 서버 컴포넌트 + Server Action).

Phase 2(랜딩 + 인증)도 완료 상태(랜딩·로컬/소셜 로그인·회원가입·비밀번호 재설정·대시보드, 실제 DB·메일 연동 검증). 외부 셋업은 MongoDB Atlas·소셜 3종 OAuth·Gmail SMTP 연결됨(`.env.local`).

Phase 4(섹션 확장) 진행 중. 구분선(모양 실선/파선/점선·두께·색)·버튼(텍스트·링크 URL·크기·너비 자동/넓게/전체·정렬·모양·색(배경·글자 각각 지정), 라벨/URL은 패널에서 입력)·이미지 섹션 추가. 스타일 패널을 섹션 타입별로 분리(`EditorTextStylePanel`/`EditorDividerStylePanel`/`EditorButtonStylePanel`/`EditorImageStylePanel` + 공용 `EditorColorField`·`EditorAlignField`·`controlStyles`), 패널을 우측 도킹 드로어(폭 `w-80`, 폭 애니메이션)로 띄워 섹션 선택 시 작업영역이 패널만큼 줄어듦(위에 떠 가리는 오버레이가 아니라 자리를 차지해 콘텐츠 폭이 넓어져도 안 겹침). 텍스트 섹션은 보이지 않는 미러로 표시/편집 박스 높이 일치.

이미지 업로드는 Cloudinary 연동(`lib/cloudinary.ts` + `actions/upload.ts`의 `uploadImage`/`deleteImage`, 공용 훅 `hooks/useImageUpload.ts`의 `uploadOne`/`uploadMany`). 정책: **첫 업로드만 캔버스 드롭존**, 이후 변경·교체·삭제·추가는 **스타일 패널에서 일원화**(캔버스는 표시 전용). 업로드 중 드로어 잠금(`imageUploading`), 성공 시 자동저장(3초)에 반영. 스토리지는 **자동 삭제**(교체·제거·섹션삭제 시 `deleteImage`, 본인 `blanoir/{userId}` 폴더만). 파일명→`alt` 자동 생성(`utils/altFromFileName.ts`). `controlStyles.ts`는 라우트 세그먼트 레벨 상수.

이미지 섹션: 비율(원본/정사각형/와이드) — 원본은 자연비율, 정사각형/와이드는 프레임에 `object-cover`로 꽉 채움. **확대 슬라이더(1~3배) + 캔버스에서 드래그로 초점(보일 부분) 이동**(`focusX`/`focusY`, 안내문은 항상 표시·드래그 동작은 잘리거나 확대됐을 때만 활성), 크기(박스 폭, 콘텐츠 가로폭 대비 비율 1/3 / 2/3 / 전체 — 갤러리 분수 모델과 같은 결, 크게는 풀폭)·모양·정렬.

갤러리·카드·공백 추가로 **Phase 4 섹션 8종(제목·문단·구분선·공백·버튼·이미지·갤러리·카드) 완료**. 공백(spacer): 섹션 사이 여백 높이만 주는 섹션(작게24/보통48/크게96px), content 없음·style만(divider 패턴), 평소 투명·hover/선택 시에만 영역 표시. 갤러리: **한 줄 가로 캐러셀**(호버 좌우 화살표 — 끝단에선 해당 방향 화살표 숨김 + 스냅, 스크롤바 숨김), 모양·간격만 두고 칸 수 컨트롤은 없앰. 한 줄 최대 3개를 채우고(이미지가 적으면 폭에 맞춰 채움, 컨테이너가 좁으면 `ResizeObserver`로 2개) 넘으면 가로 스크롤, content는 `{url,alt}[]`. 카드: **멀티 카드**(한 섹션에 여러 카드)·레이아웃(세로형/가로형/그리드형)·정렬, content는 `{id,image,alt,title,description}[]`. 열 수 컨트롤도 없애고, 그리드는 한 줄 최대 3개를 카드 수에 맞춰 채우며(`effectiveColumns`) 넘으면 다음 줄로 줄바꿈, 컨테이너 실제 폭을 `ResizeObserver`로 재 좁으면(480px 미만) 한 줄 2개로 좁힘(모바일 미리보기 박스도 반영), 같은 행 카드끼리 제목·설명 영역 높이를 가장 긴 것에 맞춰 통일(`min-height` 측정). 제목·설명은 패널 입력, 빈 상태는 캔버스 스켈레톤 그리드(첫 업로드)→이후 추가/편집은 패널. 이미지/갤러리/카드 관리 버튼은 변경=업로드 아이콘·제거=X 아이콘으로 통일 + 툴팁(`EditorTooltip`). UX 보정: 하단 "섹션 추가" 시 캔버스 맨 아래로 부드럽게 스크롤, 에디터 마운트 동안 body 스크롤 잠금(전체화면 고정), 패널 너비 `w-80`. 편집 textarea는 폰트별 줄높이 차로 생기던 자체 스크롤바를 숨김.

**카드 일원화 완료.** 카드 섹션도 이미지/갤러리와 동일 패턴으로 일원화(공용 `useImageUpload` 훅, 첫 업로드만 캔버스·이후 변경/제거/추가는 패널, 업로드/X 아이콘+툴팁, alt 파일명 자동) + 멀티 카드·레이아웃까지 확장 완료. 버튼 글자색도 배경/글자 분리.

**Phase 4 마무리 완료.** 공백 섹션 추가로 섹션 8종, 이미지 패널 빈 상태 처리(패널에서 이미지 제거 시 깨진 빈 `img` 대신 "이미지 추가" 버튼 — 카드와 동일 패턴), 자동/수동 저장 상태 구분(디바운스 자동저장은 "자동 저장됨", 저장 버튼 클릭은 "저장됨" — `markSaved(snapshot, manual)` + `SaveStatus`에 `manualSaved`), 공개영역(랜딩/로그인/대시보드) 반응형 점검(대부분 양호, 랜딩 히어로 제목 모바일 크기만 `text-4xl`로 조정). 에디터 `_components`를 **`sections/`(EditorSection + Section\* 표시)·`panels/`(스타일 패널·필드·항목)·`shell/`(EditorShell/Header/Canvas 등 뼈대 + 공용)** 3그룹으로 정리(`controlStyles.ts`는 라우트 세그먼트 루트 유지).

**Phase 5(공개 페이지) 진행 중.** 섹션 표시 컴포넌트를 `src/components/sections/`로 공용화(에디터 `Section*`은 표시 뷰 `Section*View`를 감싸 편집만 얹음, 표시 마크업 단일 소스). 공개 페이지 `/user/[handle]/[pageId]` SSR 렌더(`PublicSection` 디스패처 + `PublicPageBody` + `utils/pageMeta.ts`, `generateMetadata`로 title/description/og:image 자동, 빈 섹션 숨김, 버튼은 `live`면 `<a>` 새탭). 공개/비공개 토글(`actions/page.ts`의 `togglePagePublic`, 비공개는 본인 포함 누구나 404). 에디터 헤더 미리보기(전체화면 오버레이, PC/모바일, live store 기준이라 미저장 변경도 반영). 스타일 패널을 오버레이→도킹으로 전환. 한글 폰트 고운바탕 추가(6종). 에디터 헤더 다크모드 토글 + 작업 결과물 영역(캔버스/미리보기/공개) 라이트 절연(`.canvas-light` 토큰 재루팅 + `color-scheme: light`)으로 앱 다크모드와 무관하게 항상 라이트. 콘텐츠 폭은 세 영역(캔버스/미리보기 PC/공개) 모두 `max-w-5xl`로 통일.

**에디터 안정화·대시보드 보강.** 에디터 스토어를 전역 싱글톤에서 **페이지별 Context 스토어**로 전환(`providers/EditorProvider`가 `store/editor.ts`의 `createEditorStore`로 서버 데이터를 받아 생성, `page.tsx`에서 `pageId`로 키 부여). SSR 시 빈 상태·이전 페이지가 잠깐 보이던 깜빡임과 서버 요청 간 상태 leak 제거. 자동저장·이탈 가드 등 비React 영역은 `getEditorStore()` 모듈 접근자로 현재 스토어 참조. Provider는 `src/providers/`로 모음(전역 `Providers` + `EditorProvider`). 헤더 제목은 연필 아이콘 인라인 편집(`EditorTitle`, 스토어 `setTitle`→자동저장). 섹션 순서변경은 `DragOverlay`로 떠 있는 복제본 + 부드러운 자리내주기(`SORTABLE_TRANSITION`, 패널 항목도 공유), 드래그 중 hover 하이라이트는 끔, 공백은 드래그 시 `bg-muted` 영역으로 표시, `DndContext`에 고정 `id`로 SSR 하이드레이션 일치. 대시보드 카드에 첫 이미지 썸네일(없으면 첫 텍스트 미리보기 `pageMeta.firstTextContent`, 빈 페이지는 "내용 없음"), 페이지 삭제(`actions/page.ts`의 `deletePage` — 소유권 필터 + 페이지 내 Cloudinary 이미지 정리 + 확인 모달). 인증 폼 버튼 로딩은 스피너로 통일.

**설정 페이지·다크모드 토글 배치 정리.** 로그인 사용자 계정 설정 `/settings` 추가 — 프로필(닉네임·페이지 주소 handle·프로필 이미지, handle 변경 시 그 사용자 공개 페이지 주소가 함께 바뀜), 계정(이메일·로그인 방식·가입일 표시), 비밀번호 변경(로컬만, 소셜은 안내), 화면 테마, 요금제(Free/Pro UI만 — 결제는 "준비 중" 토스트로 자리만, 무료 정체성 유지), 로그아웃. 서버 액션 `actions/user.ts`(`updateProfile`·`updateProfileImage`·`changePassword`) + 스키마 `types/user.ts`, 이미지는 Cloudinary 업로드·없으면 기본 인물 아이콘. 대시보드 헤더는 로그아웃을 빼고 설정 아이콘으로 교체(로그아웃은 설정 안으로). 다크모드 토글 배치 규칙 확정: 색이 바뀌는 Blanoir UI 화면(랜딩·인증·대시보드·에디터)엔 헤더 토글, 라이트 고정 결과물·미리보기(공개 페이지·캔버스)엔 없음. 로그인 사용자는 헤더 토글과 별개로 설정 페이지에서도 테마 선택. 소셜 브랜드 아이콘을 `components/common/SocialIcon.tsx`로 공용화(로그인 버튼 + 설정 계정 표시 공유).

**섹션 배경 컨테이너·색상 그레디언트.** 모든 섹션에 공통 컨테이너(박스) 속성 추가 — 배경색·배경이미지·높이(코너 그립으로 조절), `types/section.ts`의 `ContainerStyle`·스토어 `updateSectionContainer`, Mongoose 스키마(`Page.ts`의 `sectionSchema`)에 `container` 반영해 저장·새로고침·공개에 유지. 풀블리드 레이아웃(섹션·배경은 전체폭, 콘텐츠만 가운데 `max-w-5xl`), 스타일 드로어를 **콘텐츠/배경 탭**으로 분리(`EditorBackgroundPanel`·`EditorImageField` 신규, 배경 이미지도 본인 폴더 자동 정리). 색상 쓰는 곳(텍스트·버튼·구분선·배경) 전부 **그레디언트** 지원 — 팔레트에 그레디언트 스와치(프리셋 + 시작/끝색·방향 빌더) + 커스텀 단색, 분기 헬퍼 `utils/colorFill.ts`(`isGradient`/`fillBackground`/`fillText`+`containerBackground`), `@property(--cf-*)` 등록으로 그레디언트도 변수 보간으로 부드럽게 전환. 팔레트는 저채도 뮤트 톤. 섹션 추가 시 **우측 드로어 자동 열림**(텍스트는 바로 포커스, 포털 클릭 버블링 차단으로 메뉴 바깥 클릭 시에도 선택 유지). 섹션 **삭제는 즉시 + 실행취소 토스트**로 전환(확인 모달 대신 실행취소가 안전망, 이미지 정리는 토스트 닫힐 때 확정·실행취소 시 보존). 캔버스/공개 섹션 간격을 `py-2`로 통일.

**섹션 등장 효과.** 컨테이너에 스크롤 등장 애니메이션 추가(`container.animation`, 스키마가 Mixed라 별도 변경 없음) — 없음(기본)·위/아래/좌/우·페이드·확대·블러 8종, 배경 탭 아이콘 버튼(`EditorAnimationField`, 줄바꿈). 시작/끝 상태는 `utils/revealMotion.ts`, 공용 래퍼 `components/sections/SectionReveal.tsx`(motion `whileInView` once, 없음이면 통과, `key`로 효과 변경 시 그 자리 재생). **배경 속성이라 콘텐츠만이 아니라 배경색·이미지 포함 섹션 블록 전체가 함께 등장** — 래퍼를 `PublicSection`·`EditorSection` 둘 다 섹션 바깥에 두고, 에디터·미리보기·공개 셋 다 동일 적용. 좌우 효과의 full-bleed 가로 밀림은 캔버스 `overflow-x-hidden`·공개/미리보기 본문 `overflow-x-clip`으로 클립.

**에디터 시작 템플릿.** 빈 캔버스 막막함을 줄이려 에디터 왼쪽에 템플릿 시작 패널 추가(`EditorTemplatePanel`, 진입 시 기본 펼침 + 화살표로 접기/펴기, width 애니메이션). 페이지 종류별 5종(프로필·매장·청첩장·포트폴리오·이력서) — 각 `templates.ts`의 `build()`가 새 id로 섹션 배열 생성, 글·제목·버튼·구분선은 안내 문구까지 채우고 이미지·갤러리·카드는 빈 플레이스홀더(첫 업로드는 캔버스). 배경·등장효과는 안 넣어 중립 골격 유지(라벨은 단어 안 겹치게, 프로필 두 버튼은 글자수 맞춰 너비 통일). 적용은 스토어 `replaceSections`로 **기존 섹션 덮어쓰기 + 실행취소 토스트**(삭제 패턴과 동일, 밀려난 이미지는 토스트 닫힐 때 정리). 이미지 URL 수집 로직을 `utils/imageUrls.ts`로 공용화(`EditorSection`·템플릿 패널 공유). 버튼 긴 텍스트는 `max-w-full`+`break-keep break-words`로 영역 안에서 줄바꿈·넘침 방지.

**모바일 미리보기 전용·SEO·배포.** 모바일/태블릿(1024px 미만)에서 에디터 접속 시 편집 UI 대신 결과물 미리보기만 보여주는 전용 모드 추가(`hooks/useIsSmallScreen.ts`의 `useSyncExternalStore`+`matchMedia` 구독, `EditorViewportGate`가 PC=`EditorShell`/그 외=`EditorMobilePreview` 분기, 미리보기는 상단에 대시보드 링크+안내문+`EditorPublishButton`·본문 `PublicPageBody`). 대시보드 새 페이지 버튼도 PC 전용(`hidden lg:block`)·빈 상태는 PC 안내. SEO 기반 구성: `lib/site.ts` 상수, 루트 `layout` metadata 강화(`metadataBase`·title 템플릿·openGraph·twitter·robots·verification env), `app/robots.ts`·`app/sitemap.ts`(공개 페이지 DB 동적, `force-dynamic`), 인증/에디터 noindex, 공개 페이지 `generateMetadata` 보강(canonical·og), 랜딩 JSON-LD(WebSite), 브랜드 한글표기 '블라누아' 노출. 파비콘은 반전 B 디자인 `app/icon.png` 하나로 통일(기존 `favicon.ico`·미사용 starter svg 제거).

**Vercel 배포 완료.** `blanoir.vercel.app`에 연결·env 등록(Mongo·소셜 3종·Cloudinary·Gmail + `NEXT_PUBLIC_SITE_URL`/`NEXTAUTH_URL`·검증 코드), 함수 리전을 Atlas와 동일한 서울(`icn1`)로 맞춰 왕복 지연 최소화. 이미지 업로드 Server Action은 기본 1MB 제한을 넘는 이미지가 500 나던 걸 `next.config.ts`의 `serverActions.bodySizeLimit` 6MB 상향으로 해결. Atlas Network Access는 Vercel IP 비고정이라 `0.0.0.0/0` 허용. 구글·네이버 서치콘솔 소유권 인증(메타태그 env) + sitemap 제출. 도메인은 데모라 미구매(`vercel.app` 사용, 추후 구매 시 env 교체·OAuth/검증 재설정).

**열(다단) 섹션·열 테스트·템플릿 패널 기억.** 가로로 칸을 나누는 열 섹션 추가로 섹션 9종 — 추가 메뉴에 2열/3열. **슬롯형**(한 칸 한 블록)이라 중첩 dnd 없이 안전: 칸엔 제목·문단·이미지·버튼만 넣고 갤러리·카드·구분선·공백은 제외, 칸 편집은 기존 섹션처럼 캔버스 인라인(클릭하면 그 칸 스타일 패널), 빈 칸은 "+추가"로 4종 메뉴, 칸 이미지는 일반 이미지 섹션과 동일하게 동작. 데이터는 `types/section.ts`의 `ColumnsSection`(`content.columns: ColumnChild[][]`·`style.widths`), 향후 한 칸에 여러 블록 쌓기 대비해 칸을 배열로 둠. 스토어 갱신은 top-level 섹션과 칸 자식을 한 id로 찾는 `mapNode`·`findNode`로 일원화해 기존 텍스트·버튼·이미지 패널을 그대로 재활용. 너비는 6칸 그리드 한 칸 단위로 경계 드래그(드래그 중엔 DOM 직접 갱신해 부드럽게, 놓으면 ease-out 안착), 좁아지면 3열→태블릿 2열→모바일 1열 자동 스택(`ResizeObserver`). 칸 콘텐츠는 세로 가운데 정렬, 모든 칸이 비면 공개에서 숨김, 컨테이너 배경·등장효과는 열 블록 전체에 적용. **추가는 캔버스, 순서변경·삭제는 스타일 패널**로 갤러리·카드와 분담 통일(`EditorColumnsStylePanel`에 패널 내부 sortable 리스트 + 비우기, 스토어 `moveColumn`·`removeColumnChild`). 템플릿은 어울리는 자리에만 반영(청첩장 신랑·신부, 포트폴리오 사진·소개, 매장 전화·지도). 열 스토어 로직은 단위 테스트로 검증(`store/editor.test.ts` — `findNode`·`addSection(columns)`·`addColumnChild`·중첩 `updateSection*`·`removeColumnChild`·`restoreColumnChild`·`setColumnWidths`·`moveColumn`). 템플릿 시작 패널은 빈 페이지면 열고 그 페이지에서 한 번 닫으면 페이지별로 닫힘을 기억(`hooks/useTemplatePanel`의 `useSyncExternalStore`+localStorage로 SSR 하이드레이션·effect-setState 회피).

**콘텐츠 링크 일원화.** 텍스트·문단·이미지·카드·갤러리에 링크 속성 추가(버튼은 원래 링크가 본업) — 블록 전체를 감싸는 링크만 두고 문단 안 일부 단어만 거는 인라인 링크는 리치텍스트라 제외, 공개·미리보기에서만 `live`로 `<a>` 새 탭 동작하고 표시 컴포넌트가 링크 있을 때만 감쌈, 별도 표시 스타일 없이 커서 포인터만(버튼과 동일 기준), 열 칸 자식(제목·문단·이미지·버튼)까지 일관 적용. 링크 입력은 공용 `EditorLinkField`로 추출해 외부 URL·내 페이지 토글 + 페이지 선택 피커(`EditorPageLinkPicker`, 공개 우선 정렬·공개/비공개 뱃지)를 다섯 섹션이 공유, 내 페이지는 `/user/handle/pageId` 저장. 옵셔널한 성격이라 패널에서 평소엔 "+ 링크 추가" 버튼만 두고 누르면 펼치는 점진적 표시·X로 비우고 접힘(버튼 섹션은 `alwaysOpen`이라 항상 펼침), 모든 패널에서 맨 아래로 통일. `types/section.ts` 각 content에 `link?` 추가, content가 Mixed라 저장 자동. 카드 기본 레이아웃을 세로형→그리드형, 패널 버튼도 그리드·가로·세로 순으로 변경.

**남은 작업:** 프로필 페이지 `/user/[handle]`(프로필 + 공개 페이지 목록 카드, 카드는 제목 중심 + 있으면 썸네일 `pageMeta.firstImageUrl` 재사용, 없는 handle 404, 우선순위 낮음), E2E 테스트(Playwright 1~2 시나리오). 공개 페이지 자체 다크 토글은 안 하기로.

## 문서 안내

이 저장소의 문서는 3개로 나뉜다.

| 문서                  | 내용                                     |
| --------------------- | ---------------------------------------- |
| `CLAUDE.md` (이 파일) | 현황 + 기술 스택 + 작업 순서 + 길잡이    |
| `docs/AGENT.md`       | 코딩 컨벤션, 명명 규칙, Git, 초기 셋업   |
| `docs/DECISIONS.md`   | 무엇을 왜 만들기로 했나 (제품/설계 결정) |

> 코드 작성 규칙은 반드시 `docs/AGENT.md`를 따른다. 기능/스펙 관련 결정은 `docs/DECISIONS.md`를 근거로 한다.

## 기술 스택

| 영역          | 선택                                                                  |
| ------------- | --------------------------------------------------------------------- |
| 프레임워크    | Next.js 16 (App Router) + React 19                                    |
| 언어          | TypeScript                                                            |
| 백엔드        | Next.js Server Actions / API Routes (풀스택)                          |
| 인증          | NextAuth (Auth.js) — 구글/카카오/네이버 소셜 + 이메일/비번 로컬       |
| 이메일 발송   | Gmail SMTP (nodemailer) — 키 없으면 콘솔 폴백                         |
| DB            | MongoDB Atlas + Mongoose                                              |
| 이미지 호스팅 | Cloudinary                                                            |
| 호스팅        | Vercel                                                                |
| 스타일        | Tailwind CSS v4 (CSS 기반 설정, `@theme`)                             |
| UI 컴포넌트   | shadcn/ui                                                             |
| 모션          | Motion (구 Framer Motion, `motion` 패키지)                            |
| 다크모드      | next-themes                                                           |
| 상태관리      | Zustand                                                               |
| 데이터 패칭   | 서버 컴포넌트(SSR) + Server Action (별도 클라이언트 패칭 레이어 없음) |
| 폼            | React Hook Form + Zod                                                 |
| 테스트        | Vitest (단위) + Playwright (E2E 1~2개)                                |
| 한글 폰트     | Pretendard                                                            |
| 영문 폰트     | Inter                                                                 |

> 기술 선택 이유, 서버리스 커넥션 관리, 비용 구성은 `docs/DECISIONS.md` 참고.

## 작업 순서 (커밋 단위)

### Phase 1: 기반 셋업

**외부 셋업 (직접 실행):**

- [x] MongoDB Atlas 계정 생성 + 클러스터 생성 + connection string 발급 (로컬 DNS의 SRV 거부 이슈로 non-SRV 형식 사용)
- [x] Google Cloud Console에서 OAuth 클라이언트 등록
- [x] Kakao Developers OAuth 등록 (이메일 미제공 → 합성 이메일로 처리)
- [x] Naver Developers OAuth 등록
- [x] Gmail SMTP 앱 비밀번호 발급 (비밀번호 재설정 메일 발송)
- [x] GitHub 레포지토리 생성 (main 단일 브랜치, 바로 push·배포 — `Mirrer1/blanoir`)

**코드 작업:**

- [x] 프로젝트 초기화 (`create-next-app`), 라이브러리 설치
- [x] Tailwind + shadcn 설정
- [x] Prettier + Husky + lint-staged 설정
- [x] 디자인 시스템 (모노톤 neutral 테마, Pretendard, next-themes 다크모드 토글)
- [x] `.env.local` 작성, `.env.example` git에 올림
- [x] MongoDB 연결 (`lib/mongoDB.ts`, 서버리스 커넥션 캐싱 패턴 적용)
- [x] User/Page 스키마 (`models/`)
- [x] NextAuth v5 셋업 (`lib/auth.ts`, `lib/authConfig.ts`, route, `proxy.ts` 가드)
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

- [x] 폰트 컨트롤 (스타일 패널 폰트 + 한글 폰트 `next/font/local` 자체 호스팅)
- [x] 섹션 사이 호버 추가 (`AddSectionMenu`의 `index` prop 활용 — `SectionInsert`)
- [x] 캔버스 다크모드 절연 (`.canvas-light` 토큰 재루팅 + `color-scheme: light`, 결과물 영역은 항상 라이트)

### Phase 4: 섹션 확장

**외부 셋업:**

- [x] Cloudinary 계정 생성 + API 키 발급 (`.env.local`에 4개 키 등록 완료)

**코드 작업:**

- [x] 이미지 섹션 (Cloudinary 연동, 선택 즉시 자동 업로드 + 교체·삭제 시 자동 정리)
- [x] 버튼 섹션 (외부 링크 — 텍스트·URL·크기·너비·정렬·모양·색, 패널 입력)
- [x] 구분선 섹션 (모양·두께·색)
- [x] 이미지 크롭/확대 (비율·cover·확대 슬라이더·드래그 초점)
- [x] 갤러리 섹션 (한 줄 가로 캐러셀, 호버 화살표)
- [x] 카드 섹션 (이미지+제목+설명)
- [x] 이미지/갤러리 관리 패널 일원화 (공용 `useImageUpload` 훅)
- [x] 공백 섹션 (섹션 사이 여백 — 높이 3단계)
- [x] 자동/수동 저장 상태 구분 ("자동 저장됨" vs 저장 버튼 "저장됨")
- [x] 에디터 `_components` 폴더 그룹화 (`sections`/`panels`/`shell`)

### Phase 5: 공개 페이지

- [x] 사용자 페이지 렌더링 (Server Component, SSR)
- [x] SEO 메타데이터 자동 생성 (generateMetadata)
- [ ] 사용자 프로필 페이지 (`/user/[handle]`)
- [x] 공개/비공개 토글 + 비공개시 404 처리
- [x] 다크모드 토글 (헤더) + 캔버스/미리보기/공개 라이트 절연
- [x] PC/모바일 미리보기 토글 (에디터)
- [x] 모바일에서 에디터 접속 시 미리보기 전용 모드

### Phase 6: 마무리 (개발 완료 후)

**코드 작업:**

- [x] 에러 처리 (`error.tsx`·`not-found.tsx` 추가, `proxy.ts` 가드 + 서버 액션 try/catch → 토스트)
- [x] 반응형 점검 — 공개영역(랜딩/로그인/대시보드) 완료. 에디터 모바일 미리보기 전용은 Phase 5와 함께
- [x] 단위 테스트 작성 (Vitest) — 순수 유틸 5종 콜로케이트 테스트(`handle`·`colorFill`·`altFromFileName`·`pageMeta`·`imageUrls`) + 열 섹션 스토어 로직 테스트(`store/editor.test.ts`), `vitest.config.ts`(`@/` alias·node 환경)
- [ ] E2E 테스트 작성 (Playwright 1~2개 시나리오)

**외부 셋업 (직접 실행):**

- [ ] 도메인 구매 (가비아 — **blanoir.com**) — 데모라 보류, `vercel.app` 사용
- [x] Vercel 계정 + 프로젝트 연결 (`blanoir.vercel.app`)
- [x] Vercel 대시보드에 환경변수 등록 (`.env.production` 파일 대신 대시보드 직접 등록)
- [x] Vercel 함수 리전을 서울(`icn1`)로 — Atlas와 동일 리전, 왕복 지연 최소화
- [ ] Vercel에 도메인 연결 — 도메인 구매 시
- [x] 소셜 OAuth Redirect URL을 운영 도메인으로 추가 (Google/Kakao/Naver 콘솔)
- [x] MongoDB Atlas Network Access에 Vercel IP 허용 (0.0.0.0/0)
- [x] 검색엔진 등록 — 구글 서치콘솔 + 네이버 서치어드바이저 소유권 인증 + sitemap 제출
