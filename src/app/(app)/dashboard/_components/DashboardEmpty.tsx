import NewPageButton from './NewPageButton'

const DashboardEmpty = () => {
  return (
    <div className="flex flex-col items-center gap-5 rounded-lg border border-dashed py-24 text-center">
      <div className="space-y-1">
        <p className="font-heading text-lg font-bold">아직 만든 페이지가 없어요</p>
        <p className="text-muted-foreground text-sm">첫 페이지를 만들어 5분 만에 공개해 보세요.</p>
      </div>
      <NewPageButton />
    </div>
  )
}

export default DashboardEmpty
