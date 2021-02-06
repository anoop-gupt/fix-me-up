import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default class ReactyvDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>{publicRuntimeConfig.appTitle}</title>
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body className="ry-body">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
