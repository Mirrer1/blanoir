import AddSectionMenu from './AddSectionMenu'

// 섹션 사이 호버 시 나타나는 삽입 지점
// 경계 위에 absolute로 겹쳐 레이아웃 공간 미차지
const SectionInsert = ({ index }: { index: number }) => (
  <div className="group/insert absolute inset-x-0 top-0 z-20 mx-auto flex h-3 max-w-5xl -translate-y-1/2 items-center px-3">
    <div className="flex w-full items-center gap-2 opacity-0 transition-opacity group-hover/insert:opacity-100">
      <div className="bg-border h-px flex-1" />
      <AddSectionMenu index={index} compact />
      <div className="bg-border h-px flex-1" />
    </div>
  </div>
)

export default SectionInsert
