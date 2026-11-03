import type { Metadata } from 'next';
import { openGraph } from '@/app/lib/hayama/metadata';
export const metadata: Metadata = { title: '葉山町予算ビュー｜サンキー図', description: '葉山町の予算と決算の非公式可視化', alternates: { canonical: '/budget-sankey' }, openGraph: { ...openGraph, url: '/budget-sankey' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
