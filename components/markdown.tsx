import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Figure } from "@/components/relay/figure";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

// Everything else is styled by `.prose` in globals.css — only assets need a
// component, because photography is boxed rather than bled into the page.
const components: Components = {
  // An image becomes a <figure>, which is illegal inside the <p> markdown wraps
  // a lone image in — so unwrap that paragraph.
  p: ({ children, node }) => {
    const only = node?.children.length === 1 ? node.children[0] : undefined;
    if (only?.type === "element" && only.tagName === "img") return <>{children}</>;
    return <p>{children}</p>;
  },
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
  img: ({ src, alt }) => {
    const url = typeof src === "string" ? src : "";
    const caption = alt || undefined;
    if (isVideoSrc(url)) {
      return (
        <Figure caption={caption}>
          <video controls src={url} aria-label={alt ?? undefined} className="w-full" />
        </Figure>
      );
    }
    return (
      <Figure caption={caption}>
        {/* eslint-disable-next-line @next/next/no-img-element -- markdown images have no intrinsic dimensions, which next/image requires */}
        <img src={url} alt={alt ?? ""} className="w-full" />
      </Figure>
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
