// Build only the audited Hayama routes and their dependencies. The staging tree
// deliberately has no public/ directory and therefore cannot export national data.
import { mkdtemp, mkdir, cp, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'hayama-dist');
const stage = await mkdtemp(join(tmpdir(), 'hayama-export-'));
const files = [
  'app/globals.css', 'app/layout.tsx', 'app/page.tsx', 'app/favicon.ico',
  'app/budget-sankey/page.tsx', 'app/budget-sankey/layout.tsx', 'app/unavailable/page.tsx',
  'app/lib/hayama/data.ts', 'app/lib/hayama/graph.ts', 'app/lib/mof-sankey-layout.ts', 'app/lib/mof-sankey-constants.ts',
  'client/components/hayama/HayamaView.tsx', 'client/components/mof-budget/SankeyChart.tsx', 'client/lib/formatBudget.ts',
  'types/sankey.ts', 'types/mof-budget-overview.ts', 'tailwind.config.ts', 'postcss.config.mjs', 'tsconfig.json',
];
try {
  for (const file of files) {
    const target = join(stage, file);
    await mkdir(dirname(target), { recursive: true });
    await cp(join(root, file), target);
  }
  await symlink(join(root, 'node_modules'), join(stage, 'node_modules'), 'dir');
  await writeFile(join(stage, 'package.json'), JSON.stringify({ name: 'hayama-static-build', private: true, version: '0.0.1' }));
  await writeFile(join(stage, 'next.config.ts'), "import type { NextConfig } from 'next';\nconst config: NextConfig = { output: 'export', turbopack: { root: process.cwd() }, images: { unoptimized: true } };\nexport default config;\n");
  const build = spawnSync(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'build'], { cwd: stage, stdio: 'inherit' });
  if (build.error || build.status !== 0) throw build.error ?? new Error(`Build failed: ${build.status}`);
  // A failed build never replaces a previously successful output.
  await rm(output, { recursive: true, force: true });
  await cp(join(stage, 'out'), output, { recursive: true });
  await cp(join(root, 'LICENSE'), join(output, 'LICENSE.txt'));
  console.log(`Hayama static export: ${output}`);
} finally {
  await rm(stage, { recursive: true, force: true });
}
