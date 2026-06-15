import { Gowun_Dodum, Nanum_Gothic, Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google'

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: false,
})

const nanumGothic = Nanum_Gothic({
  weight: ['400', '700'],
  variable: '--font-nanum-gothic',
  display: 'swap',
  preload: false,
})

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
  preload: false,
})

const gowunDodum = Gowun_Dodum({
  weight: '400',
  variable: '--font-gowun-dodum',
  display: 'swap',
  preload: false,
})

export const koreanFontVariables = [
  notoSansKr.variable,
  nanumGothic.variable,
  nanumMyeongjo.variable,
  gowunDodum.variable,
].join(' ')
