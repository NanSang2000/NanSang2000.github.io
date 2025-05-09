import './global.css'
import '../styles/TextLayer.css'
import '../styles/AnnotationLayer.css'
import '../style.css'
import React from 'react'
import localFont from '@next/font/local'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { LanguageProvider } from '../components/LanguageContext'

const myFont = localFont({ src: './PingFangSC.ttf' })

export default function App ({ Component, pageProps }: AppProps): JSX.Element {
  return (
    
    <LanguageProvider>
      <main className={myFont.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </LanguageProvider>
  )
}
