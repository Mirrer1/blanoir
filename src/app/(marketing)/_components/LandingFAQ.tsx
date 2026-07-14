import FadeIn from '@/components/common/FadeIn'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQS = [
  {
    question: '정말 무료인가요?',
    answer: '네, 만들고 공개하는 기본 기능은 모두 무료예요.',
  },
  {
    question: '코딩을 전혀 몰라도 되나요?',
    answer: '네, 클릭과 입력만으로 만들어져서 따로 배울 게 없어요.',
  },
  {
    question: '만든 페이지는 어떻게 보여주나요?',
    answer: "'공개'로 바꾸면 생기는 링크 주소만 공유하면 누구나 볼 수 있어요.",
  },
  {
    question: '휴대폰·태블릿에서도 이용할 수 있나요?',
    answer:
      '가입·로그인, 페이지 구경, 미리보기와 공유까지 휴대폰·태블릿에서 다 되고, 새로 만들거나 편집하는 것만 화면이 넓은 PC에서 할 수 있어요.',
  },
]

// SEO용 FAQ 구조화 데이터
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

const LandingFAQ = () => {
  return (
    <section className="border-t">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-24 sm:grid-cols-3 sm:gap-16 sm:py-32">
        <div className="flex flex-col sm:col-span-1">
          <FadeIn>
            <div className="flex items-start gap-3">
              <span className="font-heading text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
                05
              </span>
              <span className="text-muted-foreground pt-1.5 text-xs font-medium tracking-widest uppercase">
                FAQ
              </span>
            </div>
          </FadeIn>
          <FadeIn>
            <h2 className="font-heading mt-10 text-3xl leading-tight font-extrabold tracking-tight text-balance break-keep sm:text-4xl">
              자주 묻는 질문
            </h2>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="min-w-0 sm:col-span-2 sm:min-h-[21rem]">
          <Accordion multiple={false}>
            {FAQS.map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`faq-${index}`}>
                <AccordionTrigger className="py-5 text-base">{question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-7 text-pretty break-keep">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}

export default LandingFAQ
