import AddSectionMenu from './AddSectionMenu'

// 섹션 사이 호버 시 나타나는 삽입 지점
const SectionInsert = ({ index }: { index: number }) => (
  <div className="group/insert relative flex h-3 items-center">
    <div className="flex w-full items-center gap-2 opacity-0 transition-opacity group-hover/insert:opacity-100">
      <div className="bg-border h-px flex-1" />
      <AddSectionMenu index={index} compact />
      <div className="bg-border h-px flex-1" />
    </div>
  </div>
)

export default SectionInsert
