'use client';

import { useMemo, useState } from 'react';
import projects from '@/app/lib/hayama/projects.json';
import { filterHayamaProjects } from '@/app/lib/hayama/project-search';

const pdf = 'https://www.town.hayama.lg.jp/material/files/group/2/2026jisshikeikaku.pdf';
const choices = (items: string[]) => [...new Set(items)].sort((a, b) => a.localeCompare(b, 'ja'));
const policies = choices(projects.map(p => p.policy));
const departments = choices(projects.map(p => p.department));
const codes = choices(projects.flatMap(p => p.code.split(' ')));

export function ProjectsView() {
  const [query, setQuery] = useState('');
  const [policy, setPolicy] = useState('');
  const [department, setDepartment] = useState('');
  const [code, setCode] = useState('');
  const filtered = useMemo(() => filterHayamaProjects(projects, { query, policy, department, code }), [query, policy, department, code]);
  return <section aria-labelledby="projects-heading" className="space-y-4">
    <div><h2 id="projects-heading" className="text-xl font-bold">実施計画の事業一覧 <span className="text-sm font-normal">{filtered.length}件 / {projects.length}件</span></h2>
      <p className="mt-2 text-sm leading-relaxed">町の「第五次葉山町総合計画 実施計画（2026年度当初予算）」の事業票から、令和8年度と明記され、事業名・担当課・事業費を読み取れた{projects.length}件を収録しています。一部の票は年度表記などの確認が必要なため含まれず、町の全事業一覧ではありません。</p>
      <p className="mt-2 text-sm">金額は事業票の<strong>当初予算（千円）</strong>です。9月補正後予算や決算とは異なります。評価データ未収録。小さい画面では表を左右にスクロールできます。</p></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-bold">事業名・担当課・番号で検索<input value={query} onChange={e => setQuery(e.target.value)} placeholder="事業名で探す" className="mt-1 w-full rounded-lg border border-mirai-border bg-card px-3 py-2 font-normal" /></label>
      <label className="text-sm font-bold">政策・基盤分野<select value={policy} onChange={e => setPolicy(e.target.value)} className="mt-1 w-full rounded-lg border border-mirai-border bg-card px-3 py-2 font-normal"><option value="">すべての分野</option>{policies.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="text-sm font-bold">施策コード<select value={code} onChange={e => setCode(e.target.value)} className="mt-1 w-full rounded-lg border border-mirai-border bg-card px-3 py-2 font-normal"><option value="">すべての施策</option>{codes.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="text-sm font-bold">担当課<select value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 w-full rounded-lg border border-mirai-border bg-card px-3 py-2 font-normal"><option value="">すべての担当課</option>{departments.map(x => <option key={x}>{x}</option>)}</select></label>
    </div>
    <div className="overflow-x-auto rounded-xl border border-mirai-border bg-card"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-mirai-border"><th className="p-3">分野・施策</th><th className="p-3">事業名</th><th className="p-3">担当課・会計</th><th className="p-3 text-right">当初予算（千円）</th><th className="p-3">詳細</th></tr></thead><tbody>
      {filtered.map(p => <tr key={`${p.account}-${p.id}`} className="border-b border-mirai-border last:border-0"><td className="p-3">{p.policy}<br /><span className="text-xs">{p.code}</span></td><td className="p-3 font-bold">{p.name}</td><td className="p-3">{p.department}<br /><span className="text-xs">{p.account}</span></td><td className="p-3 text-right tabular-nums">{p.amount.toLocaleString('ja-JP')}</td><td className="p-3"><details><summary className="cursor-pointer underline">詳細</summary><div className="mt-2 space-y-1 font-normal"><p>{p.account}・簡略番号 {p.id}</p><p>評価データ未収録</p><a href={`${pdf}#page=${p.page}`} target="_blank" rel="noreferrer" className="underline">町の事業票（PDF {p.page}ページ）</a></div></details></td></tr>)}
      {!filtered.length && <tr><td colSpan={5} className="p-4">該当する事業はありません。</td></tr>}
    </tbody></table></div>
    <p className="text-sm"><a href={pdf} className="underline" target="_blank" rel="noreferrer">出典：葉山町 実施計画（2026年度当初予算）</a></p>
  </section>;
}
