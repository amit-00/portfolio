import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-10 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-10">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="text-xl font-bold mt-8">{children}</h3>,
  p: ({ children }) => (
    <p className="text-muted-foreground leading-relaxed mt-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline text-foreground hover:text-primary transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mt-4 flex flex-col gap-2 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mt-4 flex flex-col gap-2 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border pl-4 mt-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-8" />,
  pre: ({ children }) => (
    <pre className="mt-4 rounded-xl border border-border p-4 overflow-x-auto text-sm">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={`${className ?? ""} rounded bg-border/40 px-1 py-0.5 text-sm`}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-3 py-2 text-left font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2 text-muted-foreground">
      {children}
    </td>
  ),
  img: ({ src, alt }) => {
    const url = typeof src === "string" ? src : "";
    if (isVideoSrc(url)) {
      return (
        <video
          controls
          src={url}
          aria-label={alt ?? undefined}
          className="w-full rounded-xl border border-border mt-4"
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- markdown images have no intrinsic dimensions, which next/image requires
      <img
        src={url}
        alt={alt ?? ""}
        className="w-full rounded-xl border border-border mt-4"
      />
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
