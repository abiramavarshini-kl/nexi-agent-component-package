// Builds the two stylesheets nexi-agent ships:
//   dist/styles.css   — standalone, precompiled (Tailwind not required in the host app)
//   dist/tailwind.css — for Tailwind v4 hosts: tokens + theme + @source, compiled by the host
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Run the Tailwind CLI with node directly — spawning npx(.cmd) fails on Windows.
const require = createRequire(import.meta.url);
const cliPkg = require.resolve("@tailwindcss/cli/package.json");
const tailwindCli = join(dirname(cliPkg), require(cliPkg).bin.tailwindcss);

const foundation = readFileSync("src/styles/foundation.css", "utf8");
mkdirSync("dist", { recursive: true });

// 1) standalone: Tailwind (with preflight) + foundation, scanning our sources
const entry = "dist/.styles.entry.css";
writeFileSync(entry, `@import "tailwindcss" source(none);\n@source "../src";\n\n${foundation}`);
execFileSync(process.execPath, [tailwindCli, "-i", entry, "-o", "dist/styles.css", "--minify"], { stdio: "inherit" });
rmSync(entry);

// 2) Tailwind-host entry: the host's own `@import "tailwindcss"` compiles it;
//    @source points the host's scanner at our built JS for the class names.
writeFileSync("dist/tailwind.css", `/* Use after @import "tailwindcss"; in a Tailwind v4 project. */\n@source "./";\n\n${foundation}`);
console.log("css: dist/styles.css, dist/tailwind.css");
