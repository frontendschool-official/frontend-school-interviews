import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html suppressHydrationWarning>
        <Head>
          {/* Inter font */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          {/* Prevent theme flash: set dark class ASAP */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(){
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = (stored === 'light' || stored === 'dark' || stored === 'black') ? stored : (prefersDark ? 'dark' : 'light');
                  var root = document.documentElement;
                  if (theme === 'dark' || theme === 'black') {
                    root.classList.add('dark');
                    root.classList.add(theme === 'black' ? 'theme-black' : 'theme-dark');
                  }
                } catch (e) {}
              })();
            `}}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}