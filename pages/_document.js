import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * NextScript depends on the React context of NextDocument.
 * Therefore we must wrap it in a NextDocument component to render it.
 */
class Scripts extends NextDocument {
  render() {
    return <NextScript />;
  }
}

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
          {process.env.NODE_ENV !== "production" ? (
            <NextScript />
          ) : (
            <script
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const source = renderToStaticMarkup(
                    NextDocument.renderDocument(Scripts, this.props)
                  )
                    .split("</script>")
                    .filter(Boolean)
                    .map((s) =>
                      JSON.stringify(encodeURIComponent(s + "</script>"))
                    );
                  const script = `
                    if (!window.location.search.includes('no_script')) {
                        [${source}].map(decodeURIComponent).forEach(s => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(s, "text/html");
                            const c = doc.head.children[0];
                            const e = document.createElement('script');
                            for (const n of c.getAttributeNames()) {
                                e.setAttribute(n, c.getAttribute(n));
                                e.innerHTML = c.innerHTML;
                            }
                            document.body.appendChild(e);
                        });
                    }
                  `;
                  return script.trim().replace(/\n/gm, "").replace(/\s+/g, " ");
                })(),
              }}
            />
          )}
        </body>
      </Html>
    );
  }
}
