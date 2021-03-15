import NextDocument, { Head, Html, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <template id="scripts">
            <NextScript />
          </template>
          <script
            dangerouslySetInnerHTML={{
              __html: (() =>
                `
                if (!window.location.search.includes('no_script')) {
                  const template = document
                    .querySelector("#scripts")
                    .content.cloneNode(true);
                  Array.from(template.querySelectorAll("script")).forEach((script) => {
                    document.body.appendChild(script);
                  });
                }
                `.trim())(),
            }}
          />
        </body>
      </Html>
    );
  }
}
