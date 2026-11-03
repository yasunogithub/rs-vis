'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ProjectsView } from '@/client/components/hayama/ProjectsView';
import { SankeyChart } from '@/client/components/mof-budget/SankeyChart';
import { budget, settlement, total } from '@/app/lib/hayama/data';
import { hayamaGraph } from '@/app/lib/hayama/graph';

const sourceSha = process.env.NEXT_PUBLIC_HAYAMA_SOURCE_SHA;
const sourceUrl = sourceSha ? `https://github.com/yasunogithub/rs-vis/tree/${sourceSha}` : 'https://github.com/yasunogithub/rs-vis';

const oku = (thousandYen: number) => `${(thousandYen / 100000).toFixed(2)}億円`;

export function HayamaView() {
  const [view, setView] = useState<'flow' | 'projects'>('flow');
  const [kind, setKind] = useState<'budget' | 'settlement'>('budget');
  const data = kind === 'budget' ? budget : settlement;
  const graph = useMemo(() => hayamaGraph(data), [data]);
  const revenue = total(data.revenue), expense = total(data.expenditure);
  return <div className="min-h-screen bg-background text-mirai-text">
    <header className="border-b border-mirai-border bg-card"><div className="mx-auto max-w-7xl px-4 py-4"><Link href="/" className="text-lg font-bold">葉山町予算ビュー</Link><span className="ml-3 text-xs">非公式</span></div></header>
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div><h1 className="text-2xl font-bold">{view === 'flow' ? '葉山町のお金の流れ' : '葉山町の事業一覧'}</h1><p className="mt-2 text-sm leading-relaxed">葉山町の公表資料をもとにした非公式サイトです。</p></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="表示の選択"><button type="button" aria-pressed={view === 'flow'} onClick={() => setView('flow')} className={`rounded-full border px-4 py-2 text-sm font-bold ${view === 'flow' ? 'bg-primary text-white' : 'bg-card'}`}>お金の流れ</button><button type="button" aria-pressed={view === 'projects'} onClick={() => setView('projects')} className={`rounded-full border px-4 py-2 text-sm font-bold ${view === 'projects' ? 'bg-primary text-white' : 'bg-card'}`}>事業一覧</button></div>
      {view === 'projects' ? <ProjectsView /> : <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="資料の選択">
        <button type="button" onClick={() => setKind('budget')} aria-pressed={kind === 'budget'} className={`rounded-full border px-4 py-2 text-sm font-bold ${kind === 'budget' ? 'bg-primary text-white' : 'bg-card'}`}>令和8年度 9月補正後予算</button>
        <button type="button" onClick={() => setKind('settlement')} aria-pressed={kind === 'settlement'} className={`rounded-full border px-4 py-2 text-sm font-bold ${kind === 'settlement' ? 'bg-primary text-white' : 'bg-card'}`}>令和7年度 決算</button>
      </div>
      <section aria-labelledby="chart-title" className="rounded-xl border border-mirai-border bg-card p-4">
        <h2 id="chart-title" className="text-lg font-bold">{data.title}｜一般会計</h2>
        <p className="mt-2 text-sm">歳入 {oku(revenue)} ・ 歳出 {oku(expense)}{kind === 'settlement' && ` ・ 差引 ${oku(revenue - expense)} ・ 実質収支 ${oku(revenue - expense - data.carryover)}`}</p>
        <p className="mt-2 text-sm leading-relaxed">集計された歳入と歳出を一般会計に接続した図です。特定の財源が特定の事業に使われたことを示すものではありません。{kind === 'settlement' && `差引額には翌年度へ繰り越す財源 ${oku(data.carryover)} を含みます。`}</p>
        <p className="mt-2 text-xs">小さい画面では図を左右にスクロールできます。表示は億円に丸めています。</p>
        <div className="overflow-x-auto"><div className="min-w-[900px]"><SankeyChart ariaLabel={`${data.title}の歳入から一般会計を経て歳出に至る流れ`} nodes={graph.nodes} links={graph.links} width={1200} height={680} legendLabels={{ source: '歳入', account: '一般会計', 'net-expenditure': '歳出（目的別）', surplus: '歳入歳出差引額' }} /></div></div>
        <details className="my-4"><summary className="cursor-pointer font-bold">図の内訳を表で見る（千円）</summary><div className="mt-3 grid gap-4 sm:grid-cols-2">{([['歳入', data.revenue], ['歳出（目的別）', data.expenditure]] as const).map(([label, items]) => <table key={label} className="w-full text-sm"><caption className="text-left font-bold">{label}</caption><thead><tr><th className="text-left">区分</th><th className="text-right">金額（千円）</th></tr></thead><tbody>{items.map(([name, amount]) => <tr key={name}><td>{name}</td><td className="text-right tabular-nums">{amount.toLocaleString('ja-JP')}</td></tr>)}</tbody></table>)}</div></details>
        <a className="text-sm underline" href={data.source} target="_blank" rel="noreferrer">町の{data.title}資料（PDF）を開く</a>
      </section>
      </>}
      <section className="rounded-xl border border-mirai-border bg-card p-4"><h2 className="text-lg font-bold">データについて</h2><p className="mt-2 text-sm leading-relaxed">各資料の千円単位の金額を円に換算して描画しています。サンキー図は一般会計の集計を表示します。事業別の支出先、契約・再委託、事業評価などは対応データが未整備のため提供していません。ゼロや推定値として扱っていません。</p><p className="mt-2 text-sm"><a href={sourceUrl} className="underline">この版のソースコード</a> ・ <a href="/LICENSE.txt" className="underline">ライセンス（AGPL-3.0）</a></p><p className="mt-2 text-sm">AIを使って町の公開資料を整理しています。読み取りや整理に誤りが残る可能性があります。正確な内容は町の原資料をご確認ください。</p><p className="mt-2 text-sm">お問い合わせ：<a href="https://x.com/yasuaki_jp" target="_blank" rel="noreferrer" className="underline">X（@yasuaki_jp）</a></p><p className="mt-2 text-sm">このサイトは <a href="https://github.com/team-mirai-volunteer/rs-vis" className="underline">team-mirai-volunteer/rs-vis</a> のサンキー図を利用し、葉山町の公表資料に合わせて変更しています。</p></section>
    </main>
  </div>;
}
