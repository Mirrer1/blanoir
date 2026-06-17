import type { SpacerSection } from '@/types/section'

const SIZE_HEIGHT = { small: 'h-6', medium: 'h-12', large: 'h-24' } as const

const SectionSpacer = ({ section }: { section: SpacerSection }) => (
  <div className={SIZE_HEIGHT[section.style.size]} />
)

export default SectionSpacer
