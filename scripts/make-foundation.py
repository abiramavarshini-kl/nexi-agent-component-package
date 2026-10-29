"""Turn upstream Beautiful UI app/globals.css into a package-safe foundation.

- drops `@import "tailwindcss"` (added by the entry that needs it)
- inlines shadow-plugin/unprefixed (MIT) so no CSS package resolution is needed
- moves the site's global <body> styling onto a `.nexi` scope
- removes gallery-only rules (component nav, showcase, home reveal)
- gives the font vars real fallbacks (upstream sets them via next/font)

Usage: python3 scripts/make-foundation.py <upstream globals.css> <shadow-plugin css> <out>
"""
import re
import sys

src, shadow_path, out = sys.argv[1:4]
css = open(src, encoding="utf-8").read()
shadow = open(shadow_path, encoding="utf-8").read()


def drop_block(text: str, start_pattern: str) -> str:
    """Remove a CSS rule/at-rule (with balanced braces) whose header matches."""
    m = re.search(start_pattern, text, flags=re.M)
    if not m:
        raise SystemExit(f"pattern not found: {start_pattern}")
    i = text.index("{", m.start())
    depth = 0
    for j in range(i, len(text)):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                return text[: m.start()] + text[j + 1 :]
    raise SystemExit("unbalanced braces")


css = css.replace('@import "tailwindcss";\n', "")
css = re.sub(r'@import "shadow-plugin/unprefixed";\n', "", css)

# body → .nexi scope (no global page background hijack)
body_new = """.nexi {
  color: var(--ink);
  font-family: var(--font-sans);
  font-feature-settings: "cv11", "ss01";
  font-size: 14px;
  letter-spacing: -0.01em;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
"""
css = drop_block(css, r"^body \{")
css = css.replace("::selection {", body_new + "\n.nexi ::selection {", 1)
css = drop_block(css, r"^html \{")

# gallery-only rules
css = drop_block(css, r"^\.component-nav-scroll \{")
css = drop_block(css, r"^\.component-nav-scroll::-webkit-scrollbar \{")
css = drop_block(css, r"^@media \(min-width: 64rem\) \{\n  \.component-nav-scroll")
css = drop_block(css, r"^\.home-reveal \{")
for sel in [
    r"^  \.primitive-showcase \{",
    r"^  \.primitive-showcase :is\(input",
    r"^  \.primitive-showcase :is\(a, button, \[role=\"button\"\]\) \{",
    r"^  \.primitive-showcase :is\(a, button, \[role=\"button\"\]\):focus-visible",
    r"^  \.primitive-showcase :is\(img",
]:
    css = drop_block(css, sel)

# font fallbacks: use Inter / JetBrains Mono when the host app loads them
css = css.replace(
    ":root {\n",
    ':root {\n  --font-inter: "Inter";\n  --font-mono-face: "JetBrains Mono";\n',
    1,
)

header = """/* nexi-agent foundation — design tokens, theme mapping, keyframes and
 * component CSS. Derived from Beautiful UI (MIT, (c) 2026 Shane Levine,
 * https://github.com/slev12397/beautiful-ui) and shadow-plugin (MIT, Florian Kiem). */

"""
open(out, "w", encoding="utf-8").write(header + shadow.strip() + "\n\n" + css.strip() + "\n")
print("wrote", out, len(header + shadow + css), "bytes")
