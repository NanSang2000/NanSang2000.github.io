import React from 'react'
import { type DocsThemeConfig } from 'nextra-theme-docs'
import Link from 'next/link'
// import Link from 'next/link'

export const VercelLogo = (): JSX.Element => (
  <div>
      {/* eslint-disable-next-line react/jsx-no-undef */}
    <Link
      className="flex items-center gap-1 text-current"
      target="_blank"
      rel="noopener noreferrer"
      title="vercel.com homepage"
      href="https://vercel.com"
    >
      <svg height={20} viewBox="0 0 283 64" fill="none">
        <text x="10" y="20" fill="currentColor">Vercel</text>
        <path
          fill="currentColor"
          d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
        />
      </svg>
    </Link>
  </div>
)

// #2979E3
export const Logo = ({ height, color }: { height: number, color: string }): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={height} height={height} viewBox="0 0 170 170" fill="none">
        <defs>
            <rect id="path_0" x="0" y="0" width="170" height="170" />
        </defs>
        <g opacity="1" transform="translate(0 0)  rotate(0 85 85)">
            <mask id="bg-mask-0" fill="white">
                <use xlinkHref="#path_0"></use>
            </mask>
            <g mask="url(#bg-mask-0)" >
                <path id="分组 1" fillRule="evenodd" style={{ fill: color }} transform="translate(8.854166611328104 16.87935001024007)  rotate(0 76.14583338867189 68.12064998975994)" opacity="1" d="M62.9 68.1232C62.9 75.2031 68.85 81.2232 76.15 81.2232C83.44 81.2232 89.39 75.2031 89.39 68.1232C89.39 60.6832 83.44 54.7332 76.15 54.7332C68.85 54.7332 62.9 60.6832 62.9 68.1232Z M68.8507 112.747C65.1707 108.567 61.5507 104.037 58.1507 99.2873C52.4507 98.7373 46.7707 97.8873 41.1507 96.7373C37.5407 111.897 38.8907 122.307 43.3507 124.787C47.8107 127.477 57.5907 123.367 68.8507 112.747Z M46.3208 80.5165C45.5508 82.5665 44.7708 84.6265 44.2708 86.6065C46.1808 87.0365 48.3108 87.3865 50.5008 87.7465L48.3808 84.1265L46.3208 80.5165Z M76.15 46.8707C71.9 46.8707 67.86 46.8707 64.03 47.0807C61.98 50.4107 59.71 53.7407 57.59 57.5007L51.85 68.1207L57.59 78.7506C59.71 82.5007 61.98 85.8307 64.03 89.1607C67.86 89.3707 71.9 89.3707 76.15 89.3707C80.4 89.3707 84.43 89.3707 88.26 89.1607C90.31 85.8307 92.58 82.5007 94.7 78.7506L100.44 68.1207L94.7 57.5007C92.58 53.7407 90.31 50.4107 88.26 47.0807C84.43 46.8707 80.4 46.8707 76.15 46.8707Z M71.9667 36.2457L80.3267 36.2457C78.9067 34.3357 77.4867 32.7057 76.1467 31.1457C74.7967 32.7057 73.3867 34.3357 71.9667 36.2457Z M80.3267 99.9957L71.9667 99.9957C73.3867 101.906 74.7967 103.536 76.1467 105.096C77.4867 103.536 78.9067 101.906 80.3267 99.9957Z M83.4417 23.4927C87.1217 27.6727 90.7417 32.2127 94.1417 36.9527C99.9417 37.5227 105.682 38.3727 111.142 39.5027C114.752 24.3427 113.402 13.9327 108.872 11.4527C104.482 8.76268 94.7017 12.8727 83.4417 23.4927Z M105.967 55.7198C106.747 53.6698 107.527 51.6198 108.018 49.6298C106.107 49.2098 103.987 48.8498 101.787 48.4998L103.908 52.1098L105.967 55.7198Z M38.04 134.07C48.45 140.02 62.55 133.22 76.15 120.25C89.75 133.22 103.84 140.02 114.18 134.07C124.6 128.12 125.73 112.46 121.34 94.19C139.33 88.87 152.29 80.09 152.29 68.12C152.29 56.15 139.33 47.37 121.34 42.05C125.73 23.78 124.6 8.12 114.18 2.17C103.84 -3.78 89.75 3.02 76.15 15.99C62.55 3.02 48.45 -3.78 38.04 2.17C27.7 8.12 26.56 23.78 30.95 42.05C12.96 47.37 0 56.15 0 68.12C0 80.09 12.96 88.87 30.95 94.19C26.56 112.46 27.7 128.12 38.04 134.07Z M118.429 84.1323C133.309 79.6623 141.669 73.2923 141.669 68.1223C141.669 62.9523 133.309 56.5723 118.429 52.1123C116.659 57.4923 114.539 62.8123 112.129 68.1223C114.539 73.4323 116.659 78.7423 118.429 84.1323Z M33.855 52.1123C18.985 56.5723 10.625 62.9523 10.625 68.1223C10.625 73.2923 18.985 79.6623 33.855 84.1323C35.625 78.7423 37.755 73.4323 40.165 68.1223C37.755 62.8123 35.625 57.4923 33.855 52.1123Z M101.787 87.7465C103.987 87.3865 106.107 87.0365 108.018 86.6065C107.527 84.6265 106.747 82.5665 105.967 80.5165L103.908 84.1265L101.787 87.7465Z M108.872 124.787C113.402 122.307 114.752 111.897 111.142 96.7373C105.682 97.8673 99.9417 98.7173 94.1417 99.2873C90.7417 104.037 87.1217 108.567 83.4417 112.747C94.7017 123.367 104.482 127.477 108.872 124.787Z M50.5008 48.4998C48.3108 48.8498 46.1808 49.2098 44.2708 49.6298C44.7708 51.6198 45.5508 53.6698 46.3208 55.7198L48.3808 52.1098L50.5008 48.4998Z M43.3507 11.4527C38.8907 13.9327 37.5407 24.3427 41.1507 39.5027C46.7707 38.3527 52.4507 37.5027 58.1507 36.9527C61.5507 32.2127 65.1707 27.6727 68.8507 23.4927C57.5907 12.8727 47.8107 8.76268 43.3507 11.4527Z " />
            </g>
        </g>
    </svg>
)

const config: DocsThemeConfig = {
  head: (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Nan's Blog" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
            <meta property="og:title" content="Blog" />
            <meta property="og:description" content="Personal Blog" />
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="alternate icon" href="/favicon.png" type="image/png" />
            <link rel="apple-touch-icon" href="/favicon.png" />
        </>
  ),
  project: {
    link: 'https://github.com/nansang2000/blog'
  },
  docsRepositoryBase: 'https://github.com/nangsang2000/blog/main',
  banner: {
    key: 'beta 0.0.1',
    text: <a href="https://nextra.site" target="_blank" rel="noreferrer">
       🎉 Nextra 2.0 is released. Read more →
     </a>
  },
  feedback: {
    content: null
  },
  sidebar: {
    titleComponent ({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  editLink: {
    text: '帮我在 GitHub 改进文章'
  },
  primaryHue: { dark: 205, light: 205 },
  logo: (<>
      <Logo height={30} color={'#2979E3'} />
      <div className={'ml-3 nx-font-mono text-2xl hover:underline hover:decoration-pink-500 transition-all ease'}>Nan's</div>
  </>),
  useNextSeoProps () {
    return {
      titleTemplate: ' %s | Nan Sang Blog 🍃'
    }
  },
  footer: {
    text: <div className={'flex flex-col lg:flex-row w-full gap-4 lg:gap-0'}>
      <div className={'flex flex-col w-full justify-between'}>
        <div className={'flex h-max items-center'}>
          <Logo height={30} color={'#2979E3'}/>
          <div
            className={'ml-3 font-bold nx-font-mono text-xl md:text-2xl hover:underline hover:decoration-pink-500 transition-all ease'}>Nan's
          </div>
        </div>
        <div className={'mt-3 font-sans font-thin text-sm md:text-base'} suppressHydrationWarning>
          @{new Date().getFullYear()} Nan Sang. All rights reserved.
        </div>
      </div>
      <div className={'h-full w-full lg:w-max flex justify-center lg:justify-end items-center mt-3 lg:mt-0'}>
        <div
          className={'text-black dark:text-white w-max h-10 flex justify-center items-center mr-3 text-center whitespace-nowrap text-sm md:text-base'}>Powered
          by
        </div>
        <VercelLogo/>
      </div>
    </div>
  }
}

export default config
