'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SankeyChart } from '@/client/components/mof-budget/SankeyChart';
import { budget, settlement, total, type MisatoData } from '@/app/lib/misato/data';
import { misatoGraph } from '@/app/lib/misato/graph';

const sourceSha = process.env.NEXT_PUBLIC_MISATO_SOURCE_SHA;
const sourceUrl = sourceSha ? `https://github.com/yasunogithub/rs-vis-misato/tree/${sourceSha}` : 'https://github.com/yasunogithub/rs-vis-misato';
const oku = (data: MisatoData, value: number) => `${(value * data.yenPerUnit / 100000000).toFixed(2)}億円`;
const unitLabel = (data: MisatoData) => data.yenPerUnit === 1000 ? '千円' : '円';
const tab = (active: boolean) => `rounded-full px-4 py-2 text-sm font-bold transition-colors ${active ? 'bg-primary text-white shadow-xs' : 'text-mirai-text-subtle hover:bg-mirai-surface-teal'}`;

export function MisatoView() {
  const [kind, setKind] = useState<'budget' | 'settlement'>('budget');
  const data = kind === 'budget' ? budget : settlement;
  const graph = useMemo(() => misatoGraph(data), [data]);
  const revenue = total(data.revenue), expense = total(data.expenditure);
  return <div className="min-h-screen bg-background text-mirai-text">
    <header className="mx-auto max-w-7xl px-3 pt-3 sm:px-6">
      <div className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-mirai-border bg-card px-4 shadow-soft sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mirai-surface-teal text-lg font-bold text-primary">美</span><span className="truncate text-base font-bold">美里町予算ビュー</span></Link>
        <span className="shrink-0 rounded-full bg-mirai-surface-warm px-3 py-1 text-xs font-bold text-mirai-text-subtle">非公式</span>
      </div>
    </header>
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-2xl bg-mirai-gradient p-5 sm:p-8">
        <p className="text-xs font-bold tracking-wide text-primary">美里町の予算・決算をみる</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">町のお金は、どこから来て、<br className="hidden sm:block" />どこへ行くの？</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed">埼玉県美里町の公表資料から、一般会計のお金の流れを見られる非公式サイトです。</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <div className="rounded-xl bg-card px-4 py-3"><div className="text-lg font-bold tabular-nums">{oku(budget, total(budget.revenue))}</div><div className="mt-1 text-xs text-mirai-text-subtle">令和8年度 当初予算</div></div>
          <div className="rounded-xl bg-card px-4 py-3"><div className="text-lg font-bold tabular-nums">{oku(settlement, total(settlement.expenditure))}</div><div className="mt-1 text-xs text-mirai-text-subtle">令和7年度 歳出決算</div></div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-mirai-border bg-card p-1" role="group" aria-label="資料の選択"><button type="button" onClick={() => setKind('budget')} aria-pressed={kind === 'budget'} className={tab(kind === 'budget')}>令和8年度 当初予算</button><button type="button" onClick={() => setKind('settlement')} aria-pressed={kind === 'settlement'} className={tab(kind === 'settlement')}>令和7年度 決算</button></div>
      </div>
      <section aria-labelledby="chart-title" className="space-y-4">
        <div><h2 id="chart-title" className="text-xl font-bold">一般会計 <span className="text-sm font-normal text-mirai-text-subtle">（{data.title}）</span></h2>
          <p className="mt-2 text-sm">歳入 <strong>{oku(data, revenue)}</strong> ・ 歳出 <strong>{oku(data, expense)}</strong>{kind === 'settlement' && ` ・ 差引 ${oku(data, revenue - expense)}`}{kind === 'settlement' && data.carryover > 0 && ` ・ 実質収支 ${oku(data, revenue - expense - data.carryover)}`}</p>
          <p className="mt-2 text-sm leading-relaxed text-mirai-text-subtle">集計された歳入と歳出を一般会計に接続した図です。特定の財源が特定の事業に使われたことを示すものではありません。{kind === 'settlement' && data.carryover > 0 && `差引額には翌年度へ繰り越す財源 ${oku(data, data.carryover)} を含みます。`}</p></div>
        <div className="rounded-2xl border border-mirai-border bg-card p-4 shadow-xs sm:p-6"><p className="text-xs text-mirai-text-subtle">図の項目にカーソルを合わせると金額が表示されます。小さい画面では図を左右にスクロールできます。</p>
          <div className="overflow-x-auto"><div className="min-w-[900px]"><SankeyChart ariaLabel={`${data.title}の歳入から一般会計を経て歳出に至る流れ`} nodes={graph.nodes} links={graph.links} width={1200} height={680} legendLabels={{ source: '歳入', account: '一般会計', 'net-expenditure': '歳出（目的別）', surplus: '歳入歳出差引額' }} /></div></div>
          <details className="mt-4 border-t border-mirai-border pt-4"><summary className="cursor-pointer text-sm font-bold">図の内訳を表で見る（{unitLabel(data)}）</summary><div className="mt-3 grid gap-4 sm:grid-cols-2">{([['歳入', data.revenue], ['歳出（目的別）', data.expenditure]] as const).map(([label, items]) => <table key={label} className="w-full text-sm"><caption className="text-left font-bold">{label}</caption><thead><tr><th className="text-left">区分</th><th className="text-right">金額（{unitLabel(data)}）</th></tr></thead><tbody>{items.map(([name, amount]) => <tr key={name}><td>{name}</td><td className="text-right tabular-nums">{amount.toLocaleString('ja-JP')}</td></tr>)}</tbody></table>)}</div></details>
          <a className="mt-4 inline-block text-sm text-primary underline" href={data.source} target="_blank" rel="noreferrer">町の{data.title}資料（PDF）を開く</a>
        </div>
      </section>
      <section className="rounded-2xl border border-mirai-border bg-card p-5 sm:p-6"><h2 className="text-base font-bold">このサイトについて</h2><p className="mt-2 text-sm leading-relaxed">サンキー図は一般会計の集計です。事業別の内訳は対応データが未整備のため、この版では提供していません。</p><p className="mt-2 text-sm leading-relaxed">AIを使って町の公開資料を整理しています。読み取りや整理に誤りが残る可能性があります。正確な内容は町の原資料をご確認ください。</p><p className="mt-3 text-sm">お問い合わせ：<a href="https://x.com/yasuaki_jp" target="_blank" rel="noreferrer" className="text-primary underline">X（@yasuaki_jp）</a></p><p className="mt-2 text-sm">このサイトは <a href="https://github.com/team-mirai-volunteer/rs-vis" className="text-primary underline">team-mirai-volunteer/rs-vis</a> のサンキー図を利用し、美里町の公表資料に合わせて変更しています。</p><p className="mt-2 text-sm"><a href={sourceUrl} className="text-primary underline">この版のソースコード</a> ・ <a href="/LICENSE.txt" className="text-primary underline">ライセンス（AGPL-3.0）</a></p></section>
    </main>
  </div>;
}
