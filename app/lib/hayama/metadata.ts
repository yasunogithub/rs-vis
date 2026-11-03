import type { Metadata } from 'next';

export const title = '葉山町予算ビュー｜予算と決算を、わかりやすく';
export const description = '葉山町の予算と決算、お金の流れや事業を公開資料からわかりやすく見る非公式サイトです。';
export const image = { url: '/ogp-hayama.png', width: 1200, height: 630, alt: '葉山町予算ビュー。予算と決算をわかりやすく伝える非公式サイト。' };
export const openGraph = { type: 'website', locale: 'ja_JP', siteName: '葉山町予算ビュー', title, description, url: '/', images: [image] } satisfies NonNullable<Metadata['openGraph']>;
