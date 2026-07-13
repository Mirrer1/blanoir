// 메이슨리 레이아웃 카드 동적 높이
const CARD_ASPECTS = [
  'aspect-[4/5]',
  'aspect-[4/3]',
  'aspect-square',
  'aspect-[3/4]',
  'aspect-[4/3]',
  'aspect-[5/6]',
]

const ExploreLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between gap-3">
        <div className="bg-muted h-8 w-24 animate-pulse rounded" />
        <div className="bg-muted h-9 w-28 animate-pulse rounded-md" />
      </div>
      <div className="mt-8 flex animate-pulse flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="bg-muted h-9 rounded-md sm:w-52 sm:shrink-0" />
          <div className="bg-muted h-9 flex-1 rounded-md" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_ASPECTS.map((aspect, index) => (
            <div key={index} className={`bg-muted rounded-lg ${aspect}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExploreLoading
