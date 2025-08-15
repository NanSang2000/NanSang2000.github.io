import './global.css'
import '../styles/TextLayer.css'
import '../styles/AnnotationLayer.css'
import '../style.css'
import '../styles/blog.css'
import React from 'react'
import localFont from 'next/font/local'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '../components/ErrorBoundary'
import { I18nProvider } from '../components/I18nProvider'

const myFont = localFont({
  src: '../public/fonts/PingFangSC.ttf'
})

export default function App ({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <main className={myFont.className}>
          <Component {...pageProps} />
          <Analytics />
        </main>
      </I18nProvider>
    </ErrorBoundary>
  )
}
