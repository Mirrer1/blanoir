import localFont from 'next/font/local'

const notoSansKr = localFont({
  src: [
    { path: '../app/fonts/NotoSansKR-400.woff2', weight: '400' },
    { path: '../app/fonts/NotoSansKR-700.woff2', weight: '700' },
  ],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: false,
})

const nanumGothic = localFont({
  src: [
    { path: '../app/fonts/NanumGothic-400.woff2', weight: '400' },
    { path: '../app/fonts/NanumGothic-700.woff2', weight: '700' },
  ],
  variable: '--font-nanum-gothic',
  display: 'swap',
  preload: false,
})

const nanumMyeongjo = localFont({
  src: [
    { path: '../app/fonts/NanumMyeongjo-400.woff2', weight: '400' },
    { path: '../app/fonts/NanumMyeongjo-700.woff2', weight: '700' },
  ],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
  preload: false,
})

const gowunDodum = localFont({
  src: '../app/fonts/GowunDodum-400.woff2',
  weight: '400',
  variable: '--font-gowun-dodum',
  display: 'swap',
  preload: false,
})

const gowunBatang = localFont({
  src: [
    { path: '../app/fonts/GowunBatang-400.woff2', weight: '400' },
    { path: '../app/fonts/GowunBatang-700.woff2', weight: '700' },
  ],
  variable: '--font-gowun-batang',
  display: 'swap',
  preload: false,
})

export const koreanFontVariables = [
  notoSansKr.variable,
  nanumGothic.variable,
  nanumMyeongjo.variable,
  gowunDodum.variable,
  gowunBatang.variable,
].join(' ')
