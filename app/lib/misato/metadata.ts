import type { Metadata } from 'next';

export const title = '美里町予算ビュー｜予算と決算を、わかりやすく';
export const description = '美里町の予算と決算、お金の流れを公開資料からわかりやすく見る非公式サイトです。';
export const siteUrl = 'https://rs-vis-misato.yasuaki-sakamoto.workers.dev';
export const image = { url: '/ogp-misato.png', width: 1200, height: 630, alt: '美里町予算ビュー。予算と決算をわかりやすく伝える非公式サイト。' };
export const openGraph = { type: 'website', locale: 'ja_JP', siteName: '美里町予算ビュー', title, description, url: '/misato', images: [image] } satisfies NonNullable<Metadata['openGraph']>;
