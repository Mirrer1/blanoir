import type { Metadata } from 'next'

import LandingFAQ from './_components/LandingFAQ'
import LandingFeatures from './_components/LandingFeatures'
import LandingFinalCTA from './_components/LandingFinalCTA'
import LandingHero from './_components/LandingHero'
import LandingHowItWorks from './_components/LandingHowItWorks'
import LandingUseCases from './_components/LandingUseCases'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
}

const LandingPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingUseCases />
      <LandingFAQ />
      <LandingFinalCTA />
      <ScrollToTopButton />
    </>
  )
}

export default LandingPage
