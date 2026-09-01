# CLAUDE.md — ケーメックスONE モックアップ 作業ガイド（Claude共有指示）

このファイルは **Claude Code がこのリポジトリで作業するときに自動で読み込む共有指示** です。
担当スタッフが変わっても Claude が同じ前提・ルールで動くように、規約はここに集約します。
**ルールを足したい／変えたいときは、このファイルを編集して commit・push** すれば、全員の Claude に反映されます。

---

## プロジェクト概要
- 株式会社ケーメックスONE 向け **B2B受発注ポータルのモックアップ**（画面イメージ共有・仕様検討用）。
- **実データ連携・本番認証・DB・IBM連携・PDF生成・ヤマトAPI・AI は含まない**（すべてダミー／モック挙動）。
- 制作：株式会社ティーツーシー（担当：関口 智紀）。

## 触る範囲・構成
- 静的サイト（HTML + Tailwind CSS〈CDN〉+ 素のJavaScript）。**ビルド不要**。
- `assets/data.js` … 全画面共通のダミーデータ ＋ 閲覧パスワードゲート（`sessionStorage: kmecs_gate`、PW `kmecs28`）。
- `assets/shell.js` … 共通ヘッダー/ナビの描画。`KMECS.renderUserShell`＝顧客側、`KMECS.renderAdminShell`＝社内側。
- `assets/common.css` … 共通スタイル。 `assets/img/` … 画像。
- `index.html`（顧客TOP）／`mypage.html`ほか（②マイページ）／`admin-*.html`（③社内管理）。

## 絶対に守る制約
- **顧客側（①顧客ポータル・②マイページ）には「粗利率・掛率(rate)・与信枠(credit)・得値ランク(A/B/C)」の値を表示しない。** 社内側（③ `admin-*`）はOK。
- 価格は顧客側では「**お客様価格（得値）**」ラベルとしてのみ表示。
- 顧客向けの在庫は具体数を出さず**レベル表示**（在庫十分／あり／わずか／取寄）。

## 共通シェルの注意点
- `renderUserShell` / `renderAdminShell` は `document.body.innerHTML` を再構築し、`#content` を `#page` に移す。
  → **レンダー後は `#content` が消える**。Playwright等で本文を見るときは `#page` や `body` を参照。

## 更新・デプロイ手順
1. 編集 → 下記「動作確認」→ commit。
2. **本番配信 = `tools.t2c-inc.com/cl/kmecsone/`**（T2C独自ドメイン・Basic認証で保護・拡張子なしのクリーンURLに正規化）。`t2c-inc/kmecs-one-mockup`（private）への push で自動更新。
3. **remote は2つ・役割が違う**：
   - `t2c` = `t2c-inc/kmecs-one-mockup`（**private＝本番 tools.t2c-inc.com の配信元**）→ **本番更新は `git push t2c main`**
   - `origin` = `sekiguchitomoki/kmecs-one-mockup`（public＝予備ミラー/GitHub Pages）→ https://sekiguchitomoki.github.io/kmecs-one-mockup/
   - 通常は両方に push して同期（`git push t2c main && git push origin main`）。
   - Basic認証のID/PWは**リポジトリに書かない**（公開ミラーに漏れるため。別途共有）。
   - 参考：T2C組織リポジトリは原則 private（`gh repo create t2c-inc/<name> --private`）。t2c-inc.github.io のPagesは使わない（Freeプランでprivate不可のため）。
4. push認証は gh のトークンを使う：
   ```
   git -c credential.helper='!f() { echo "username=x-access-token"; echo "password=$(gh auth token)"; }; f' push <remote> main
   ```
5. デプロイ完了確認：`gh api repos/<owner>/kmecs-one-mockup/pages --jq .status`（`built` になればOK）。
   push がリモート先行で弾かれたら `git rebase origin/main`（または該当remote）→ push。

## 動作確認（Playwright推奨）
- ローカル配信：`python3 -m http.server 8000`（`file://` 直開きは不可＝クエリパラメータを使うため）。
- 閲覧ゲートのバイパス：`sessionStorage.setItem('kmecs_gate','ok')`。
- ログイン状態：`localStorage.setItem('kmecs_account','A')`（デモアカウント）。
- 各HTMLの inline script を構文チェックし、コンソールエラー／リンク切れ／主要操作を実機確認してから push。

## 成果物（PPT・Excel等）の保存先ルール
- **成果物ファイルは必ず Googleドライブに保存**（ローカルに置かない）。
  `…/クライアント/ケーメックスONE/04_基幹システム/03_操作マニュアル_モックアップ/`
- ディレクトリマップ（機能一覧）の最新は **Drive上の共同編集スプレッドシート**。
  ⚠️ claude.ai の Googleドライブ連携では **クラウドのスプレッドシートのセル編集はできない**（ファイル単位の操作のみ）。
  変更はユーザーがブラウザで適用、または更新版xlsxの書き出しで対応する。

## 閲覧パスワード
- `kmecs28`（`assets/data.js` 冒頭のゲート）。軽い閲覧制限で、本番のセキュリティではない。
