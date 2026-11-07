// Build only the audited Misato routes and their dependencies, mirroring
// scripts/build-hayama-static.mjs. This is a SEPARATE site from Hayama:
// the Hayama home page (app/page.tsx) and the Hayama root layout are NOT
// staged. Instead the staging tree generates its own root page (the Misato
// view at /) and a root layout built from the Misato metadata, so canonical
// and OGP URLs never point at the Hayama site. The /misato route is staged
// as well and shows the same view. No Misato OGP image exists yet.
import { mkdtemp, mkdir, cp, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'misato-dist');
// A source link must identify exactly the tracked files that are being built.
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const sha = git('rev-parse', '--verify', 'HEAD^{commit}');
if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('Invalid Git commit SHA');
if (git('status', '--porcelain', '--untracked-files=no')) throw new Error('Commit tracked changes before building so the source link is exact');
const stage = await mkdtemp(join(tmpdir(), 'misato-export-'));
const files = [
  'app/globals.css', 'app/favicon.ico',
  'app/misato/page.tsx', 'app/misato/layout.tsx',
  'app/lib/misato/metadata.ts', 'app/lib/misato/data.ts', 'app/lib/misato/graph.ts',
  'app/lib/mof-sankey-layout.ts', 'app/lib/mof-sankey-constants.ts',
  'client/components/misato/MisatoView.tsx', 'client/components/mof-budget/SankeyChart.tsx', 'client/lib/formatBudget.ts',
  'types/sankey.ts', 'types/mof-budget-overview.ts', 'tailwind.config.ts', 'postcss.config.mjs', 'tsconfig.json',
];
try {
  for (const file of files) {
    const target = join(stage, file);
    await mkdir(dirname(target), { recursive: true });
    await cp(join(root, file), target);
  }
  await symlink(join(root, 'node_modules'), join(stage, 'node_modules'), 'dir');
  await writeFile(join(stage, 'package.json'), JSON.stringify({ name: 'misato-static-build', private: true, version: '0.0.1' }));
  await writeFile(join(stage, 'next.config.ts'), "import type { NextConfig } from 'next';\nconst config: NextConfig = { output: 'export', turbopack: { root: process.cwd() }, images: { unoptimized: true } };\nexport default config;\n");
  // Root of this separate site is the Misato view itself.
  await writeFile(join(stage, 'app/page.tsx'), "import { MisatoView } from '@/client/components/misato/MisatoView';\nexport default function Home() { return <MisatoView />; }\n");
  await writeFile(join(stage, 'app/layout.tsx'), [
    'import type { Metadata, Viewport } from "next";',
    'import "./globals.css";',
    "import { title, description, openGraph } from './lib/misato/metadata';",
    "export const metadata: Metadata = { title, description, alternates: { canonical: '/' }, openGraph: { ...openGraph, url: '/' } };",
    'export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2aa693" };',
    'export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {',
    '  return (<html lang="ja" suppressHydrationWarning><body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>{children}</body></html>);',
    '}',
    '',
  ].join('\n'));
  // All staged source inputs must exist in the commit, not only in the worktree.
  git('ls-files', '--error-unmatch', '--', ...files);
  const build = spawnSync(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'build'], { cwd: stage, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_MISATO_SOURCE_SHA: sha } });
  if (build.error || build.status !== 0) throw build.error ?? new Error(`Build failed: ${build.status}`);
  // A failed build never replaces a previously successful output.
  await rm(output, { recursive: true, force: true });
  await cp(join(stage, 'out'), output, { recursive: true });
  await cp(join(root, 'LICENSE'), join(output, 'LICENSE.txt'));
  console.log(`Misato static export: ${output}`);
} finally {
  await rm(stage, { recursive: true, force: true });
}
