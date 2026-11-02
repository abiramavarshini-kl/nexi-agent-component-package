// Generates src/generated/props.json for the docs site: the props of every
// exported component and the fields of every exported object type, read from
// the library's TypeScript source so the tables never drift from the code.
//
//   { components: { Name: { file, props: Prop[], native? } }, types: { Name: { file, props: Prop[] } } }
//   Prop = { name, type, required, description, default? }
// `native: true` means the component also takes its element's HTML attributes.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const srcDir = fileURLToPath(new URL("../../src/", import.meta.url));
const outFile = fileURLToPath(new URL("../src/generated/props.json", import.meta.url));

const program = ts.createProgram([srcDir + "index.ts"], {
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2020,
});
const checker = program.getTypeChecker();
const index = program.getSourceFile(srcDir + "index.ts");
const exportsOf = checker.getExportsOfModule(checker.getSymbolAtLocation(index));

const inSrc = (node) => {
  const file = node.getSourceFile().fileName.replace(/\\/g, "/");
  return file.startsWith(srcDir.replace(/\\/g, "/")) && !file.includes("/node_modules/");
};
const fileOf = (node) => relative(srcDir, node.getSourceFile().fileName).replace(/\\/g, "/").replace(/\.tsx?$/, "");

const typeText = (type, at) =>
  checker
    .typeToString(type, at, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
    .replace(/ \| (undefined|null)(?=$| )/g, "")
    .replace(/^\((.*)\)$/, "$1");

/* default values from a destructured first parameter: ({ size = "sm" }: Props) */
function defaultsOf(fn) {
  const param = fn?.parameters?.[0];
  const out = {};
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) {
      if (el.initializer && !el.dotDotDotToken) out[(el.propertyName ?? el.name).getText()] = el.initializer.getText();
    }
  }
  return out;
}

/* cva variants take their defaults from `defaultVariants: { tone: "neutral" }` */
function variantDefaults(node) {
  const m = node.getSourceFile().getFullText().match(/defaultVariants:\s*\{([^}]*)\}/);
  const out = {};
  for (const [, key, value] of m?.[1].matchAll(/(\w+):\s*("[^"]*"|\w+)/g) ?? []) out[key] = value;
  return out;
}

/* a `// trailing comment` on a prop line, used when there's no JSDoc */
function trailingComment(decl) {
  const text = decl.getSourceFile().getFullText();
  const ranges = ts.getTrailingCommentRanges(text, decl.getEnd()) ?? [];
  const r = ranges.find((c) => c.kind === ts.SyntaxKind.SingleLineCommentTrivia);
  return r ? text.slice(r.pos + 2, r.end).trim() : "";
}

function propsOf(type, at, defaults = {}) {
  const props = [];
  for (const prop of checker.getPropertiesOfType(type)) {
    const decls = prop.getDeclarations() ?? [];
    // only props this library declares — skip the inherited HTML attributes
    if (!decls.length || !decls.some(inSrc)) {
      props.native = true;
      continue;
    }
    const decl = decls.find(inSrc);
    const description =
      ts.displayPartsToString(prop.getDocumentationComment(checker)).trim() || trailingComment(decl);
    props.push({
      name: prop.getName(),
      type: typeText(checker.getTypeOfSymbolAtLocation(prop, at), at),
      required: !(prop.flags & ts.SymbolFlags.Optional),
      description,
      ...(defaults[prop.getName()] !== undefined && { default: defaults[prop.getName()] }),
    });
  }
  return props;
}

const components = {};
const types = {};

for (const exp of exportsOf) {
  const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
  const decl = sym.valueDeclaration ?? sym.declarations?.[0];
  if (!decl || !inSrc(decl)) continue;
  const name = exp.getName();

  if (sym.flags & ts.SymbolFlags.Function) {
    const sig = checker.getTypeOfSymbolAtLocation(sym, decl).getCallSignatures()[0];
    const param = sig?.getParameters()[0];
    if (!/^[A-Z]/.test(name) || !param) continue;
    const paramType = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(param, decl));
    const props = propsOf(paramType, decl, { ...variantDefaults(decl), ...defaultsOf(decl) });
    components[name] = { file: fileOf(decl), props, ...(props.native && { native: true }) };
  } else if (sym.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) {
    const type = checker.getDeclaredTypeOfSymbol(sym);
    if (!(type.flags & ts.TypeFlags.Object) && !type.isIntersection()) continue;
    const props = propsOf(type, decl);
    if (props.length) types[name] = { file: fileOf(decl), props };
  }
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({ components, types }, null, 1) + "\n");
console.log(`props.json: ${Object.keys(components).length} components, ${Object.keys(types).length} types`);
