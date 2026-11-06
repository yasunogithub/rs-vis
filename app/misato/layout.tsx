import type { Metadata } from 'next';
import { openGraph } from '@/app/lib/misato/metadata';
export const metadata: Metadata = { title: '美里町予算ビュー｜サンキー図', description: '美里町の予算と決算の非公式可視化', alternates: { canonical: '/misato' }, openGraph: { ...openGraph, url: '/misato' } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
