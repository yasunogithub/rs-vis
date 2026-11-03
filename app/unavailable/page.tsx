import Link from 'next/link';
export default function Unavailable() {
  return <main className="mx-auto max-w-2xl p-8"><h1 className="text-2xl font-bold">この機能は葉山町版では未提供です</h1><p className="my-4">葉山町に対応するデータの整備・検証が済んでいません。</p><Link className="underline" href="/">葉山町予算ビューへ戻る</Link></main>;
}
