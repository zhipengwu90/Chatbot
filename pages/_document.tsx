import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Ask me something, I will enlighten your mind with knowledge."
          />
          <meta property="og:site_name" content="ChatBot" />
          <meta
            property="og:description"
            content="Ask me something, I will enlighten your mind with knowledge."
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

export default MyDocument;
