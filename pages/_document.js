import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta 
          property="og:title" 
          content="Cover Craft" 
          key="title"
        />
        <meta 
          property="og:description" 
          content="Cover Craft is an automated cover letter writing tool that helps you create professional, eye-catching cover letters in minutes. Our easy-to-use platform enables you to quickly customize and personalize your letter, so you can stand out to potential employers and land your dream job." 
          key="description"
          />
        <meta
          property="og:image"
          content="https://covercraft.vercel.app/covercraft.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
