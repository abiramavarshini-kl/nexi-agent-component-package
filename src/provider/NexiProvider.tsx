import { cn } from "../lib/utils";

export type NexiProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Force the dark palette for this subtree. Leave undefined to inherit a
   *  `.dark` class from an ancestor (e.g. on <html>). */
  dark?: boolean;
  /** Render as a bare `display: contents` wrapper so it doesn't affect layout. */
  contents?: boolean;
};

/** Scopes nexi-agent typography + tokens to a subtree. Wrap your agent UI
 *  (or the whole app) in it once. */
export function NexiProvider({ dark, contents = false, className, children, ...rest }: NexiProviderProps) {
  return (
    <div className={cn("nexi", dark && "dark", contents && "contents", className)} {...rest}>
      {children}
    </div>
  );
}
