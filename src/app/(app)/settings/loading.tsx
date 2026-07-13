const SettingsLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="bg-muted h-8 w-16 animate-pulse rounded" />
      <div className="mt-8 flex animate-pulse flex-col gap-6">
        <div className="bg-muted h-40 w-full rounded-lg" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-muted h-32 rounded-lg" />
          <div className="bg-muted h-32 rounded-lg" />
        </div>
        <div className="bg-muted h-28 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default SettingsLoading
