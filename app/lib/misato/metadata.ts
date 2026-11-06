import type { Metadata } from 'next';

export const title = '美里町予算ビュー｜予算と決算を、わかりやすく';
export const description = '美里町の予算と決算、お金の流れを公開資料からわかりやすく見る非公式サイトです。';
export const openGraph = { type: 'website', locale: 'ja_JP', siteName: '美里町予算ビュー', title, description, url: '/misato' } satisfies NonNullable<Metadata['openGraph']>;
