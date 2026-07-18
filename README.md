# K.MECS ONE 受発注ポータル — モックアップ（画面イメージ共有用）

株式会社ケーメックスONE（K.MECS ONE）向け **WEB統合型受発注システム** のフロントエンド・モックアップです。
「新システム開発資料（Phase3）」の与件をもとに、ダイワボウライクなWEB受発注／見積〜受注〜発注〜出荷〜請求〜入金の一元管理をイメージ共有するために作成しました。

> ⚠️ モックアップです。ダミーデータのみで動作し、実バックエンド・DB・IBM連携・PDF生成・ヤマトAPI・AIは含みません。

---

## 開き方

クエリパラメータを使うため、**ローカルサーバー経由**で開いてください（`file://` 直開きは不可）。

```bash
cd mockup
python3 -m http.server 8765
# → http://127.0.0.1:8765/index.html
```

**入口：`index.html`（公開トップ・未ログイン状態）**

---

## デザインの方針

### ユーザー画面（顧客ポータル）
kmecsone.jp のトンマナを踏襲したコーポレート調。
- **横型グローバルナビ**（PRODUCTS / MAKERS / QUOTE / ORDERS / PCN・EOL / MYPAGE）＋ 赤の CONTACT ボタン
- ダークの宇宙調ヒーロー、大型英字見出し（PRODUCT LINEUP）、カテゴリカードグリッド、COLUMN 縦書き、NEWS、SUPPORT 赤アイコン、CONTACT US 赤パネル

### 管理画面（業務コンソール）
顧客画面とは意図的に別デザイン。業務ツールとして密度重視。
- **左サイドナビ**（受注業務 / 出荷 / 経理 / 貿易）＋ 未処理バッジ ＋ IBM・ヤマトの接続ステータス
- 淡いラベンダー地（#f0f0fa）＋ コンパクトなテーブル ＋ 業務ヘッダー（担当者・管理者バッジ）

### 画像アセット（kmecsone.jp の実素材）
ロゴ・キービジュアル・カテゴリ写真・メーカーロゴ等は、実サイトから取得したものを `assets/img/` に配置して使用しています。

| ファイル | 用途 |
|---|---|
| `logo.png` | K.MECS ONE ロゴ（ヘッダー・フッター・ログイン・管理画面。ダーク背景ではCSSフィルタで白抜き） |
| `mvimg.jpg` | キービジュアル（トップのヒーロー・ログイン左パネル）＝実サイト #mainimg と同一 |
| `bg1.jpg` | 取扱メーカー／メーカーページの背景（カート回路のテック画像） |
| `bg2.jpg` | CONTACT US セクション背景＝実サイト #contact と同一 |
| `banner1-4.jpg` | トップのバナーエリア4枚 |
| `cat-*.jpg/png` | カテゴリ10種の実写真（コネクタ／センサー／産業用パソコン／有線・無線ネットワーク／スマートコントローラー／計測器／カメラ／フットスイッチ／ラジオ無線）。製品画像にも流用 |
| `mk-odu / moxa / posital / axiomtek.png` | 取扱メーカーの実ロゴ |
| `kv1-3.jpg` | COLUMN のサムネイル |
| `support1-4.jpg` | サポート用（予備） |

### ブランド（kmecsone.jp のテーマCSSから抽出）
- レッド `#e60012`（ブランドカラー）／濃赤 `#cc0000`
- ネイビー `#393b56` / `#22243a`、ブラック `#000`
- ベース `#f8f8f8` / `#f0f0fa`、罫線 `#e5e5e5`
- フォント：**Roboto ＋ Noto Sans JP**

---

## 仮アカウント（デモ用）— アカウントで価格が変わる

ログイン画面のカードをクリックするだけで切替できます。

| | 会社 | 販売店ID | パスワード | 得値ランク | 掛率 | 粗利率 | 取引条件 |
|---|---|---|---|---|---|---|---|
| **A** | 株式会社サンプル電子 | `KM-10428` | `demo1234` | A（特約店） | **65%** | 22% | 月末締め / 翌月末払い・郵送 |
| **B** | 東海精機株式会社 | `KM-20551` | `demo1234` | B（一般） | **82%** | 11% | 20日締め / 翌月10日払い・メール |

**得値 = 標準価格 × 掛率**（顧客ごとの粗利率・取引条件がベース）。
例：ODU AMC 8極（標準 ¥6,000）→ **A社 ¥3,900 / B社 ¥4,920**。

---

## 与件（PDF）の実装対応表

| 与件 | 実装画面 |
|---|---|
| 非ログイン時は価格非表示 | 公開サイト全体で閲覧可・**価格のみ伏せ**。商品詳細に「価格は非表示です／ログインして価格を見る」パネル |
| 顧客ごとの条件で金額表示（粗利率・取引条件） | 全画面で得値表示。**A/Bで金額が変わる**。マイページに掛率・粗利率・与信・顧客コード |
| 受注経路①ページ内商品検索 | `products.html` → `product-detail.html` → カート |
| 受注経路②営業送付済の見積番号検索 | **`quotes.html`（見積一覧・検索・この見積で発注）** → `quote-order.html` |
| 受注経路③EDI受注をCSが入力 | `admin-orders.html` の経路タグ・経路比率（メール30/FAX20/郵便10/EDI40） |
| 見積：金額(得値)・構成(IPC/ODU)・部材(取扱製品以外も) | `quote-order.html`（区分バッジ：構成（IPC）/構成（ODU）/部材（取扱外）/部材（特注）） |
| 受注品の技術部による構成チェック要 | `quote-order.html` の警告バナー／`quotes.html`・`admin-quotes.html` のフラグ |
| 見積発注時、選択して部分的な注文 | `quote-order.html` 行チェック＋選択合計 |
| 一時保存ボタン | `quote-order.html` / `product-detail.html` → マイページ「一時保存した見積」 |
| 受注後 自動的にIBMに受注/発注インプット | `admin-orders.html` VPN連携図＋「自動IP済/要チェック/エラー」 |
| 各工程は手動インプット（納期入力・出荷入力） | `admin-orders.html` の **納期入力／出荷入力モーダル** |
| 顧客ページ：発注品目の進行状況 | `orders.html` / `order-detail.html`（**①見積→②受発注→③問合せ→④出荷→⑤請求→⑥入金**） |
| 顧客ページ：納期確認 | `order-detail.html` 回答納期／`quote-order.html` 納期情報 |
| 顧客ページ：ヤマト送り状番号 | `order-detail.html`（管理の送り状発行から自動反映） |
| 顧客ページ：PCN/EOL情報 | `notifications.html` / 商品詳細のPCN・EOLタブ |
| 顧客ページ：未入金/入金済み | `orders.html` バッジ・`mypage.html` KPI |
| 購入履歴を元にPCN/EOLを通知 | `notifications.html`（購入実績付き） |
| 「この製品を使うなら…」提案 | `notifications.html` の後継品導線 |
| 商品情報・QAへのリンク | `product-detail.html` のドキュメント/QAタブ（環境調査・RoHS含む） |
| 営業連絡ボタン（担当営業 or 業務に飛ぶ） | 商品詳細・見積・カート・注文詳細に配置 |
| カートの上位製品をお勧め紹介 | `cart.html`「上位製品はいかがですか？」 |
| 最近買ったものリスト | `mypage.html`（再注文ボタン付き） |
| 各工程ごとに進捗を自動メール配信 | `order-detail.html`「進捗メール配信履歴」＋配信ON/OFF |
| メモ機能で出荷FW・特殊要件を記録 | `cart.html` メモ欄／`order-detail.html` メモ・やりとり履歴 |
| ①見積：見積依頼→メーカー見積取得→見積作成 | **`admin-quotes.html`** |
| 一般見積：ODU/MOXA・特殊見積：Fraba/IPC組込 | `admin-quotes.html` 種別バッジ／メーカーページ |
| 見積作成は機械学習AIで実現 | `admin-quotes.html`「🤖 AI見積起案」モーダル（確度・参照データ表示） |
| ⑤請求書発行（IBMから出力・メール10%/郵送70%/EDI・FAX） | **`admin-invoice.html`** 発行種別グラフ・顧客別送付方法 |
| IBMは製品単位→経理が注文書単位に整理し直している | `admin-invoice.html`「**注文書単位へ自動集約**」（32行→6件） |
| ⑥入金：銀行入金確認・IBM入力・顧客コード確認・未入金理由・手数料相殺 | **`admin-payment.html`** 自動照合／手数料相殺検知／顧客コード要確認／未入金理由の自動判定 |
| ④出荷：送り状/伝票印刷・出荷処理 | **`admin-shipping.html`**（B2クラウド連携・送り状プレビュー・一括発行） |
| 貿易：発注IP／納期IP(PI)／仕入IP | **`admin-trade.html`** |
| 貿易：RMA・代品・納期短縮・フォワダー | `admin-trade.html`「その他業務」 |
| 貿易：品目登録（得値分け / 20文字制限） | `admin-trade.html`（20文字カウンタ＋自動省略候補） |

---

## 画面一覧（全20画面）

### ユーザー画面（顧客ポータル／横型グローバルナビ）
| ファイル | 画面 |
|---|---|
| `index.html` | **公開トップ** — ヒーロー・PRODUCT LINEUP（キーワード/カテゴリ/業界事例）・取扱メーカー・COLUMN・NEWS・SUPPORT |
| `products.html` | 製品を探す（キーワード/メーカー/カテゴリ/在庫で絞り込み・並べ替え） |
| `maker.html?m=odu` | メーカートップ（ODU / MOXA / Fraba / IPC） |
| `product-detail.html?code=AMC-2P-08` | 製品詳細 — **価格はログイン必須**・仕様/QA/PCN履歴 |
| `quotes.html` | **見積一覧** — 見積番号検索・この見積で発注 |
| `quote-order.html?no=QT26060025` | 見積内容から発注 — 構成/部材・部分注文・一時保存 |
| `cart.html` | カート — 上位製品おすすめ・メモ |
| `checkout.html` / `order-complete.html` | 注文確認 / 注文完了 |
| `orders.html` / `order-detail.html` | 注文・進捗（6工程） / 注文詳細（送り状・メモ・メール配信） |
| `notifications.html` | PCN / EOL 情報 |
| `mypage.html` | マイページ — お取引条件・最近買ったもの・一時保存 |
| `login.html` | ログイン — 仮アカウント A / B |

### 管理画面（業務コンソール／左サイドナビ）
| ファイル | 画面 |
|---|---|
| `admin-orders.html` | 受注管理・IBM連携（経路比率・受注/発注IP・納期入力・出荷入力） |
| `admin-quotes.html` | 見積管理・**AI見積作成** |
| `admin-shipping.html` | 出荷・**ヤマト送り状発行** |
| `admin-invoice.html` | **請求書発行**（注文書単位に自動集約） |
| `admin-payment.html` | **入金消込** |
| `admin-trade.html` | 貿易 発注/納期/仕入IP・RMA・品目登録 |

---

## 画面遷移マップ

```
【ユーザー画面】横型グローバルナビから常時アクセス
index（公開トップ）※価格は非表示
   ├─→ products ─→ product-detail ※価格は非表示
   ├─→ maker(?m=odu|moxa|fraba|ipc) ─→ product-detail
   ├─→ notifications ─→ product-detail（後継品）
   └─→ login ★仮アカウント A / B
             ↓ ログイン＝得値が表示される（A/Bで金額が変わる）
        mypage ─┬─→ products ─→ product-detail ─→ cart
                ├─→ quotes ─→ quote-order（部分注文）─→ cart
                └─→ orders ─→ order-detail（送り状・メモ・メール履歴）
        cart ─→ checkout ─→ order-complete ─→ orders

【管理画面】左サイドナビ（フッター「管理画面（社内）」から入れます）
admin-orders（受注・IBM連携・納期/出荷入力）
admin-quotes（見積・AI起案）
admin-shipping（送り状発行）→ 顧客の order-detail に自動反映
admin-invoice（請求書発行）→ admin-payment（入金消込）
admin-trade（貿易 発注/納期/仕入IP）
```

---

## 構成ファイル

```
mockup/
├── index.html / products.html / maker.html / product-detail.html
├── quotes.html / quote-order.html / cart.html / checkout.html
├── order-complete.html / orders.html / order-detail.html
├── notifications.html / mypage.html / login.html          … ユーザー画面
├── admin-orders.html / admin-quotes.html / admin-shipping.html
├── admin-invoice.html / admin-payment.html / admin-trade.html  … 管理画面
├── assets/
│   ├── data.js       … 仮アカウント(A/B)・メーカー4社・商品14点・見積6件・受注経路・カテゴリ・NEWS/COLUMN
│   ├── shell.js      … renderUserShell（横型ナビ）/ renderAdminShell（サイドナビ）・得値計算
│   └── common.css    … K.MECS ONE トンマナのデザインシステム
└── README.md
```

### 技術メモ
- 静的HTML + Tailwind CSS（CDN）。ビルド不要
- ログイン状態・カートは `localStorage`（`kmecs_account` に A / B を保持）
- 価格ロジックは `shell.js` の `netPrice()` = `標準価格 × アカウント掛率`（10円丸め）
- 商品詳細・メーカー・見積はクエリパラメータ駆動（`?code=` / `?m=` / `?no=`）
- 商品・見積の追加は `assets/data.js` のみで完結

---

制作：株式会社ティーツーシー（関口 智紀）／ 2026-07 打合せ用
