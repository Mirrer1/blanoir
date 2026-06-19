interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

const SettingsSection = ({ title, description, children }: SettingsSectionProps) => {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

export default SettingsSection
