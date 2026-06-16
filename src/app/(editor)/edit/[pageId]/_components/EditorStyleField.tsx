// 스타일 패널 도구 모음
const EditorStyleField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="text-muted-foreground text-xs font-medium">{label}</p>
    {children}
  </div>
)

export default EditorStyleField
