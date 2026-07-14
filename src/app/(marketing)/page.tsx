import type { Metadata } from 'next'

import LandingAbout from './_components/LandingAbout'
import LandingFAQ from './_components/LandingFAQ'
import LandingFeatures from './_components/LandingFeatures'
import LandingFinalCTA from './_components/LandingFinalCTA'
import LandingHero from './_components/LandingHero'
import LandingHowItWorks from './_components/LandingHowItWorks'
import LandingShowcase from './_components/LandingShowcase'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'
import { getSharedPage } from '@/lib/explore'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// 1시간마다 인기 템플릿을 갱신
export const revalidate = 3600

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
}

const LandingPage = async () => {
  const { posts } = await getSharedPage({ limit: 4, sort: 'popular' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHero />
      <LandingAbout />
      <LandingFeatures />
      <LandingShowcase posts={posts} />
      <LandingHowItWorks />
      <LandingFAQ />
      <LandingFinalCTA />
      <ScrollToTopButton />
    </>
  )
}

export default LandingPage
