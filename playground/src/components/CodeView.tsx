import { useEffect, useMemo, useState } from "react";
import { highlight } from "sugar-high";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyButton({ text, label = "Copy code" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className="icon-btn copy-btn"
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true))}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

/** A highlighted, copyable code listing. `plain` skips highlighting (shell commands). */
export function CodeView({ code, plain, className = "" }: { code: string; plain?: boolean; className?: string }) {
  const html = useMemo(() => (plain ? null : highlight(code)), [code, plain]);
  return (
    <div className={`code ${className}`}>
      <CopyButton text={code} />
      <pre>{html === null ? <code>{code}</code> : <code dangerouslySetInnerHTML={{ __html: html }} />}</pre>
    </div>
  );
}
