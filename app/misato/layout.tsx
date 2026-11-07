import type { Metadata } from 'next';
import { openGraph, image } from '@/app/lib/misato/metadata';
const title = '美里町予算ビュー｜サンキー図';
const description = '美里町の予算と決算の非公式可視化';
export const metadata: Metadata = { title, description, alternates: { canonical: '/misato' }, openGraph: { ...openGraph, title, description, url: '/misato' }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
