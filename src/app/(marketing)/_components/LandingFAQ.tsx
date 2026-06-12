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
    question: '휴대폰에서도 이용할 수 있나요?',
    answer:
      '가입·로그인, 페이지 구경, 미리보기와 공유까지 휴대폰에서 다 돼요. 새로 만들거나 편집하는 작업만 PC·태블릿을 권장해요.',
  },
]

const LandingFAQ = () => {
  return (
    <section className="mx-auto max-w-5xl px-6 py-32">
      <FadeIn>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          자주 묻는 질문
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <Accordion multiple={false} className="mt-12">
          {FAQS.map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`faq-${index}`}>
              <AccordionTrigger className="py-5 text-base">{question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-7">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </section>
  )
}

export default LandingFAQ
