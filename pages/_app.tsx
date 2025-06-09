import './global.css'
import '../styles/TextLayer.css'
import '../styles/AnnotationLayer.css'
import '../style.css'
import React from 'react'
import localFont from 'next/font/local'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '../components/ErrorBoundary'
import PageLoader from '../components/PageLoader'

const myFont = localFont({
  src: '../public/fonts/PingFangSC.ttf',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  preload: true,
  variable: '--font-pingfang'
})

export default function App ({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ErrorBoundary>
      <PageLoader>
        <main className={`${myFont.variable} font-sans`}>
          <Component {...pageProps} />
          <Analytics />
        </main>
      </PageLoader>
    </ErrorBoundary>
  )
}
