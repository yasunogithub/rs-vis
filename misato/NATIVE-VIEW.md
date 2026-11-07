# 美里町版（独立サイト版）

埼玉県美里町の町公表資料から一般会計の集計を表示する非公式サイトです。葉山町版とは**別サイト・別Worker**として公開します。元の国の予算全体ビューや葉山町のデータはこのサイトでは使用しません。

## データ

- 令和8年度一般会計当初予算（[町公表PDF](https://www.town.saitama-misato.lg.jp/cmsfiles/contents/0000001/1650/R8yosannsyo.pdf)「1 総括」、単位：千円）。歳入・歳出とも 6,647,392 千円。
- 令和7年度一般会計決算（[町公表PDF](https://www.town.saitama-misato.lg.jp/cmsfiles/contents/0000002/2755/R7_01.pdf)、単位：円）。歳入 6,987,179,904 円／歳出 6,426,160,211 円／差引 561,019,693 円。翌年度繰越財源 105,931,000 円は歳出表の翌年度繰越額合計から算出（実質収支の調書ページはアウトライン化フォントでテキスト抽出できず、調書の公式値との直接照合は未実施）。
- データは `app/lib/misato/data.ts` に資料ごとの単位（`yenPerUnit`）つきで記録し、図への入力で円に換算。検算は `node --import tsx --test tests/misato-budget.test.ts`。
- 町の集計には財源と個別の使途を対応づける情報がないため、一般会計に集約し、特定財源の使途を断定しない。事業別の内訳・補正予算は未提供。
- ソースは AGPL-3.0 であり、配布時にはライセンスと対応するソースへのリンクを維持する。

## 静的ビルド

依存関係を `npm ci` で導入後、`npm run build:misato` を実行すると `misato-dist/` に静的サイトを出力する。このコマンドは、必要なファイルだけを一時ディレクトリにコピーして Next.js の static export を作る。ルート `/` は美里町ビューそのもので、`/misato` でも同じ画面を表示する。生成される root レイアウトは美里町のメタデータから作られ、葉山町のドメインやページ・国のデータ・API・ミドルウェアはビルド入力に含めない。`misato-dist/` は生成物なのでビルド成功後に置き換わる。

Cloudflare では**生成した `misato-dist/` のみ**を静的アセットとして配信すること。リポジトリ全体や元の `public/` を配信しない。

ビルドは追跡ファイルに未コミット変更があると失敗し、Git の HEAD を画面のソースリンクに埋め込む。Git履歴を含むチェックアウトが必要。配備前には出力のリンク先が配備コミットと一致することを確認すること。

## Cloudflare の Git 連携（別ページとして新規作成）

葉山版（Worker名 `rs-vis`）とは別に、新しい Worker `rs-vis-misato` として Git 連携する。Workers Builds の設定:

- リポジトリ: `yasunogithub/rs-vis-misato`
- 本番ブランチ: `feat/misato-budget`（当面。main へ統合したら切り替える）
- Root directory: `/misato`
- Build command: `bun run build`
- Deploy command: `bunx wrangler deploy`

`misato/package.json` の build はリポジトリルートの `npm ci` と `npm run build:misato` を順に実行し、ルートの `package-lock.json` に従って依存を導入する。`misato/bun.lock` は Wrangler とその依存を固定する。`misato/wrangler.jsonc` は `../misato-dist` の静的ファイルのみを assets として指定し、404 応答を指定する。

Workers Builds の Preview・Production の設定と配備後の実際の内容・リンク（希望ドメイン、HTTPS、未知URLの404）を確認するまでは公開とみなさない。ローカルでのビルド成功はクラウド上での配備成功を保証しない。既存の葉山 Worker を置き換えないこと。
