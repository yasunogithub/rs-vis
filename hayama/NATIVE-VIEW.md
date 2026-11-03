# 葉山町版（元アプリ版）

元の `mof-budget/SankeyChart` と配置計算を再利用し、町公表資料の一般会計集計を表示する非公式サイトです。元の独立HTML版は `hayama/index.html` に残しています。

## データと元アプリとの差

- 令和8年度9月補正後の一般会計予算（[町公表PDF](https://www.town.hayama.lg.jp/material/files/group/3/20260904hosei.pdf) 本文6ページ）。歳入の「各種交付金」「その他」は掲載内訳を合算。
- 令和7年度一般会計決算（[町公表PDF](https://www.town.hayama.lg.jp/material/files/group/1/r7kessanngaiyou.pdf) 本文1・2・5ページ）。決算の歳入歳出差引には翌年度に繰り越す財源を含み、実質収支はその財源を差し引く。
- 町の集計には財源と個別の使途を対応づける情報がないため、一般会計に集約し、特定財源の使途を断定しない。
- 元の予算全体ビューの図・配置・ホバー表示を再利用。事業別の絞り込み、個別事業・支出先・契約・再委託・事業評価・特別会計などは対応する町の一次データを未整備のため未提供。元の国データを代用しない。

データは `app/lib/hayama/data.ts` に千円単位で記録し、図への入力で円に換算。内訳・収支の検算は `node --import tsx --test tests/hayama-budget.test.ts`。ソースは AGPL-3.0 であり、配布時にはライセンスと対応するソースへのリンクを維持する。

## 静的ビルド

依存関係を `npm ci` で導入後、`npm run build` を実行すると `hayama-dist/` に静的サイトを出力する。このコマンドは、必要なファイルだけを一時ディレクトリにコピーして Next.js の static export を作る。元リポジトリの `public/`、国向けページ・API、ミドルウェアはビルド入力に含めない。`hayama-dist/` は生成物なのでビルド成功後に置き換わる。

Cloudflare では **生成した `hayama-dist/` のみ**を静的アセットとして配信すること。リポジトリ全体や元の `public/` を配信しない。Cloudflare 側の build / deploy command、出力先、未知のURLの404応答、希望ドメイン、HTTPSおよび実際の表示・図の操作は公開先で要確認。以前の Next.js の通常ビルドはこの隔離を保証せず、静的アセットがミドルウェアより先に配信される設定もあるため公開しない。

ビルドは追跡ファイルに未コミット変更があると失敗し、Git の HEAD を画面のソースリンクに埋め込む。Git履歴を含むチェックアウトが必要。配備前には出力のリンク先が配備コミットと一致することを確認すること。静的出力自体はクラウドへの配備・権限設定を行わない。

`wrangler.hayama.jsonc` は静的アセットのみと404応答の設定案であり、Worker名とルートを意図的に指定していない。対象を確認して `--config` と `--name` を明示するまで配備設定として使わない。既存 Worker を置き換える影響とプレビューを確認すること。

## Cloudflare の `/hayama` ビルド

現在確認された Workers Builds の Root directory `/hayama`、build command `bun run build`、deploy command `bunx wrangler deploy` に対応する。`hayama/package.json` の build はリポジトリルートの `npm ci` と `npm run build` を順に実行し、ルートの `package-lock.json` に従って依存を導入する。`hayama/bun.lock` は Wrangler とその依存を固定する。`hayama/wrangler.jsonc` は `../hayama-dist` の静的ファイルのみを assets として指定し、旧 `hayama/index.html` やルートの `public/` を配信しない。404 応答を指定する。

Workers Builds の Preview・Production の設定と既存 Worker のルート、配備後の実際の内容とリンクを確認するまでは公開しない。ローカルでのビルド成功はクラウド上での配備成功を保証しない。

## 実施計画の事業一覧

町の「第五次葉山町総合計画 実施計画（2026年度当初予算）」PDF（全276ページ）のうち、各票に令和8年度と明記され、事業名・施策コード・所属・会計・本年度当初の事業費を抽出できた169件を掲載。記載が令和7年度の票、再掲・続きのページ、読み取り条件を満たさない票は除外しており、全事業の網羅を主張しない。会計と簡略番号で重複を検出する。数値は事業票に記載された千円で、金額と出典ページは機械的に読み取り、全件についてPDFテキストの事業費先頭値と比較した。2026年度9月補正や2025年度決算の額・評価結果ではなく、サンキー内訳との対応づけも行わない。町の原資料を参照するリンクを各項目に掲載する。

抽出は原PDFと `pdftotext -layout` 出力に対して `python3 scripts/extract-hayama-plan.py SOURCE.pdf SOURCE-layout.txt`（PyMuPDF が必要）。正規データは `app/lib/hayama/projects.json`。町の一般のオープンデータ利用規約は[オープンデータページ](https://www.town.hayama.lg.jp/soshiki/seisaku/9/850.html)に掲載されるが、このPDFへの適用は未確認。出典の表示とリンクを維持し、元資料の権利表示等を変更しない。
