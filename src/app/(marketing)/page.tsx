import LandingFAQ from './_components/LandingFAQ'
import LandingFeatures from './_components/LandingFeatures'
import LandingFinalCTA from './_components/LandingFinalCTA'
import LandingHero from './_components/LandingHero'
import LandingHowItWorks from './_components/LandingHowItWorks'
import LandingUseCases from './_components/LandingUseCases'

const LandingPage = () => {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingUseCases />
      <LandingFAQ />
      <LandingFinalCTA />
    </>
  )
}

export default LandingPage
