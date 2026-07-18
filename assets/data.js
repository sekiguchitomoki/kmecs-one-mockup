/* ===== 閲覧パスワードゲート（外部からのカジュアルな閲覧を防ぐ簡易ロック） =====
   ※ 静的サイトのためソース上にコードが見える簡易ロックです（一応の目的）。
   ※ Playwright等の自動化は sessionStorage.kmecs_gate='ok' でバイパスできます。 */
(function(){
  var PASS='kmecs28';                       // 閲覧パスワード（必要に応じて変更可）
  try{ if(sessionStorage.getItem('kmecs_gate')==='ok') return; }catch(e){ return; }
  try{ document.documentElement.style.visibility='hidden'; }catch(e){}
  var ok=false;
  for(var i=0;i<3;i++){
    var v=window.prompt('ケーメックスONE 受発注ポータル（モックアップ）\n閲覧パスワードを入力してください');
    if(v===null) break;
    if(v===PASS){ ok=true; break; }
  }
  if(ok){ try{ sessionStorage.setItem('kmecs_gate','ok'); }catch(e){} try{ document.documentElement.style.visibility=''; }catch(e){} }
  else {
    document.documentElement.innerHTML='<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0d1024;color:#fff"><div style="text-align:center"><div style="font-weight:700;font-size:20px">ケーメックスONE モックアップ</div><div style="color:#9aa0ad;margin-top:8px">閲覧にはパスワードが必要です。再読み込みで再入力できます。</div></div></body>';
    throw new Error('gate');
  }
})();

/* KMECS ONE モック — 共通ダミーデータ */

/* ===== 仮アカウント（顧客ごとの条件＝粗利率・取引条件で金額表示）===== */
window.ACCOUNTS = {
  A: {
    key:'A', id:'KM-10428', pw:'demo1234',
    user:'田中 太郎', company:'株式会社サンプル電子', custCode:'1042-01',
    rank:'A', rate:0.65, margin:22, rankLabel:'特約店ランクA',
    terms:'月末締め / 翌月末払い', credit:'与信枠 500万円', invoiceBy:'郵送',
    addr:'〒222-0033 神奈川県横浜市港北区新横浜1-2-3 サンプルビル5F',
  },
  B: {
    key:'B', id:'KM-20551', pw:'demo1234',
    user:'鈴木 花子', company:'東海精機株式会社', custCode:'2055-03',
    rank:'B', rate:0.82, margin:11, rankLabel:'一般ランクB',
    terms:'20日締め / 翌月10日払い', credit:'与信枠 200万円', invoiceBy:'メール',
    addr:'〒460-0008 愛知県名古屋市中区栄2-4-5 東海精機ビル',
  },
};

/* ===== 受注経路（PDF：メール30/FAX20/郵便10/EDI40）===== */
window.ROUTES = [
  { key:'web',   label:'Web（ページ内商品検索）', pct:0,  note:'顧客が直接入力', color:'#e60012' },
  { key:'quote', label:'Web（見積番号から発注）', pct:0,  note:'顧客が直接入力', color:'#ff6b6b' },
  { key:'mail',  label:'メール', pct:30, note:'顧客が入力（CS対応なし）', color:'#393b56' },
  { key:'fax',   label:'FAX',    pct:20, note:'顧客が入力（CS対応なし）', color:'#5b5e80' },
  { key:'post',  label:'郵便',   pct:10, note:'顧客が入力（CS対応なし）', color:'#8b8ea8' },
  { key:'edi',   label:'EDI',    pct:40, note:'見積番号からCSが入力（社内トレース可）', color:'#14887b' },
];

/* ===== 製品カテゴリ（/products/search/ 準拠・検索ページの実画像）===== */
window.CATEGORIES = [
  { key:'connector', en:'CONNECTOR',        ja:'コネクタ',               img:'assets/img/scat-connector.jpg' },
  { key:'sensor',    en:'SENSOR',           ja:'センサー',               img:'assets/img/scat-sensor.jpg' },
  { key:'ipc',       en:'INDUSTRIAL PC',    ja:'産業用パソコン',         img:'assets/img/scat-ipc.jpg' },
  { key:'wired',     en:'WIRED NETWORK',    ja:'有線ネットワーク',       img:'assets/img/scat-wired.jpg' },
  { key:'wireless',  en:'WIRELESS NETWORK', ja:'無線ネットワーク',       img:'assets/img/scat-wireless.jpg' },
  { key:'smartctrl', en:'SMART CONTROLLER', ja:'スマートコントローラー', img:'assets/img/scat-smart.jpg' },
  { key:'measure',   en:'CONVERTER',        ja:'変換器 / 計測',          img:'assets/img/scat-measure.jpg' },
  { key:'camera',    en:'CAMERA',           ja:'カメラ',                 img:'assets/img/scat-camera.jpg' },
  { key:'footsw',    en:'FOOT SWITCH',      ja:'フットスイッチ',         img:'assets/img/scat-foot.jpg' },
  { key:'radio',     en:'RADIO WIRELESS',   ja:'ラジオ無線リモコン',     img:'assets/img/cat-radio.png' },
];

/* ===== 取扱メーカー一覧（/products/makers/ 全社）=====
   big:true = MOXA / ODU / POSITAL（大きく表示）。logo が無い社はテキスト表示 */
window.MAKERS_ALL = [
  { name:'MOXA',      key:'moxa',  big:true,  logo:'assets/img/mk-moxa.png',    note:'産業用ネットワーク' },
  { name:'ODU',       key:'odu',   big:true,  logo:'assets/img/mk-odu.png',     note:'高信頼コネクタ' },
  { name:'POSITAL',   key:'fraba', big:true,  logo:'assets/img/mk-posital.png', note:'エンコーダ / 傾斜センサ' },
  { name:'IEI',       key:'',      logo:'assets/img/mk-iei.jpg',     note:'産業用コンピュータ' },
  { name:'ARBOR',     key:'',      logo:'assets/img/mk-arbor.jpg',   note:'組込 / モバイル端末' },
  { name:'AXIOMTEK',  key:'ipc',   logo:'assets/img/mk-axiomtek.png',note:'産業用PC / 組込' },
  { name:'GIGAIPC',   key:'',      logo:'assets/img/mk-gigaipc.png', note:'産業用マザーボード' },
  { name:'ATEN',      key:'',      logo:'assets/img/mk-aten.png',    note:'KVM / AVスイッチ' },
  { name:'GETT',      key:'',      logo:'assets/img/mk-gett.jpg',    note:'産業用入力機器' },
  { name:'HBC',       key:'',      logo:'assets/img/mk-hbc.jpg', note:'無線リモコン' },
  { name:'VIVOTEK',   key:'',      logo:'assets/img/mk-vivotek.jpg', note:'ネットワークカメラ' },
  { name:'ANTONICS',  key:'',      logo:'assets/img/mk-antonics.png', note:'産業用アンテナ' },
  { name:'PROVERTHA', key:'',      logo:'assets/img/mk-provertha.png', note:'コネクタ / インターフェース' },
  { name:'herga',     key:'',      logo:'assets/img/mk-herga.png', note:'フットスイッチ / 医療用スイッチ' },
  { name:'HIOS',      key:'',      logo:'assets/img/mk-hios.png', note:'電動ドライバ' },
  { name:'HAHN',      key:'',      logo:'assets/img/mk-hahn.jpg', note:'電動シリンダ / グリッパ' },
];

/* ===== 業界事例（/leading/ 全カテゴリ）===== */
window.INDUSTRIES = [
  { key:'machinery', en:'MACHINERY', ja:'マシナリー', img:'assets/img/case-machinery.jpg', note:'製造装置・工作機械',
    makers:['moxa','ipc'], desc:'製造装置・工作機械の制御ネットワークと組込コンピューティング。装置内のイーサネット化・遠隔監視・稼働データ収集を、止まらない産業用機器で支えます。' },
  { key:'medical', en:'MEDICAL', ja:'医療', img:'assets/img/case-medical.jpg', note:'医療機器・ロボット',
    makers:['odu','ipc'], desc:'医療機器・手術支援ロボット向けの高信頼コネクタと組込PC。接点信頼性・洗浄耐性・長期供給が求められる領域に対応します。' },
  { key:'power', en:'POWER', ja:'電力', img:'assets/img/case-energy.jpg', note:'発電・電力インフラ',
    makers:['moxa','fraba'], desc:'発電所・変電・再生可能エネルギー設備のネットワークと位置・角度検出。広温度・耐ノイズの機器で電力インフラの安定運用に貢献します。' },
  { key:'construction', en:'CONSTRUCTION', ja:'建設機械', img:'assets/img/case-construction.jpg', note:'建機・重機',
    makers:['fraba','odu'], desc:'建機・重機の傾斜/角度センサと堅牢コネクタ。屋外・振動・粉塵の過酷環境で確実に動作する部品を提供します。' },
  { key:'robot', en:'ROBOT', ja:'ロボット', img:'assets/img/case-robot.jpg', note:'産業用ロボット',
    makers:['fraba','odu','moxa'], desc:'産業用ロボットの関節エンコーダ・可動部コネクタ・制御ネットワーク。高分解能な位置検出と屈曲耐性で精密動作を支えます。' },
  { key:'rail', en:'RAIL / TRAFFIC', ja:'鉄道・交通インフラ', img:'assets/img/case-rail.jpg', note:'鉄道・ETC・交通',
    makers:['moxa','odu'], desc:'車両・軌道・ETC/交通システム向けの車載規格ネットワークと耐環境コネクタ。EN50155準拠クラスの信頼性が求められる領域に対応します。' },
  { key:'ship', en:'SHIP / MARINE', ja:'船・海洋', img:'assets/img/case-ship.jpg', note:'船舶・海洋設備',
    makers:['moxa','ipc'], desc:'船舶・海洋設備の船内ネットワークと耐環境コンピュータ。塩害・振動・広温度に耐える機器で海上インフラを支えます。' },
  { key:'fa', en:'FACTORY AUTOMATION', ja:'ファクトリーオートメーション', img:'assets/img/case-factory.jpg', note:'FA・生産ライン',
    makers:['moxa','ipc','fraba'], desc:'生産ラインのフィールドネットワーク・エッジ制御・位置検出。PLC/上位系との接続とデータ収集をワンストップで構成できます。' },
  { key:'building', en:'BUILDING AUTOMATION', ja:'ビルディングオートメーション', img:'assets/img/case-building.jpg', note:'ビル設備・空調',
    makers:['moxa','ipc'], desc:'ビル設備・空調・入退室のネットワーク統合。多様なプロトコルのゲートウェイ変換とエッジ収集で建物全体を可視化します。' },
  { key:'plant', en:'PLANT', ja:'プラント', img:'assets/img/case-factory.jpg', note:'プラント・化学',
    makers:['moxa','odu'], desc:'プラント・化学設備の堅牢ネットワークと耐環境コネクタ。広域・屋外・防爆エリア近傍での安定通信を実現します。' },
  { key:'measurement', en:'MEASUREMENT', ja:'計測', img:'assets/img/case-other.jpg', note:'計測・検査',
    makers:['odu','fraba','ipc'], desc:'計測・検査装置向けの高信頼コネクタ・センサ・組込PC。高精度・繰り返し嵌合・長期安定性が求められる用途に対応します。' },
  { key:'other', en:'OTHER', ja:'その他', img:'assets/img/case-other.jpg', note:'その他業界',
    makers:['moxa','odu','fraba','ipc'], desc:'上記以外の業界も、産業用ネットワーク・コネクタ・センサ・組込PCの組み合わせでご提案します。まずはお気軽にご相談ください。' },
];
window.getIndustry = (key) => window.INDUSTRIES.filter(s => s.key === key)[0] || window.INDUSTRIES[0];

/* ===== 顧客マスタ（管理画面：顧客管理 / 売上分析用）===== */
window.CUSTOMERS = [
  { code:'1042-01', rep:'鈴木 慶博', company:'株式会社サンプル電子', acc:'A', rank:'A', rate:0.65, area:'関東', contact:'田中 太郎', tel:'045-000-0000',
    addr:'〒222-0033 神奈川県横浜市港北区新横浜1-2-3', terms:'月末締め / 翌月末払い', credit:5000000,
    salesYear:18600000, salesPrev:16800000, unpaid:281600, ordersCount:42, lastOrder:'2026/07/15', invoiceBy:'郵送' },
  { code:'2055-03', rep:'田村 直樹', company:'東海精機株式会社', acc:'B', rank:'B', rate:0.82, area:'中部', contact:'鈴木 花子', tel:'052-000-0000',
    addr:'〒460-0008 愛知県名古屋市中区栄2-4-5', terms:'20日締め / 翌月10日払い', credit:2000000,
    salesYear:9200000, salesPrev:9600000, unpaid:638880, ordersCount:23, lastOrder:'2026/07/08', invoiceBy:'メール' },
  { code:'3011-02', rep:'鈴木 慶博', company:'マルショウ工業株式会社', acc:'', rank:'B', rate:0.80, area:'関東', contact:'佐藤 健', tel:'048-000-0000',
    addr:'〒330-0001 埼玉県さいたま市大宮区', terms:'月末締め / 翌月末払い', credit:3000000,
    salesYear:12400000, salesPrev:10200000, unpaid:0, ordersCount:31, lastOrder:'2026/07/14', invoiceBy:'EDI' },
  { code:'4023-01', rep:'佐々木 涼', company:'北陸電子部品株式会社', acc:'', rank:'C', rate:0.88, area:'北陸', contact:'山本 大輔', tel:'076-000-0000',
    addr:'〒920-0001 石川県金沢市', terms:'月末締め / 翌々月10日払い', credit:1500000,
    salesYear:5600000, salesPrev:6100000, unpaid:56800, ordersCount:18, lastOrder:'2026/07/02', invoiceBy:'FAX' },
  { code:'5088-04', rep:'田村 直樹', company:'関西オートメ株式会社', acc:'', rank:'A', rate:0.68, area:'関西', contact:'中村 洋子', tel:'06-000-0000',
    addr:'〒541-0041 大阪府大阪市中央区', terms:'月末締め / 翌月末払い', credit:8000000,
    salesYear:24800000, salesPrev:21500000, unpaid:1280000, ordersCount:56, lastOrder:'2026/07/13', invoiceBy:'郵送' },
  { code:'6100-01', rep:'佐々木 涼', company:'東日本システム株式会社', acc:'', rank:'B', rate:0.79, area:'東北', contact:'高橋 誠', tel:'022-000-0000',
    addr:'〒980-0021 宮城県仙台市青葉区', terms:'20日締め / 翌月10日払い', credit:2500000,
    salesYear:8100000, salesPrev:7400000, unpaid:0, ordersCount:20, lastOrder:'2026/06/28', invoiceBy:'メール' },
  { code:'7042-02', rep:'鈴木 慶博', company:'九州メカトロ株式会社', acc:'', rank:'C', rate:0.90, area:'九州', contact:'伊藤 拓也', tel:'092-000-0000',
    addr:'〒812-0011 福岡県福岡市博多区', terms:'月末締め / 翌月末払い', credit:1200000,
    salesYear:4300000, salesPrev:3900000, unpaid:98000, ordersCount:14, lastOrder:'2026/06/20', invoiceBy:'郵送' },
  { code:'8006-01', rep:'田村 直樹', company:'中部プラント工業株式会社', acc:'', rank:'A', rate:0.66, area:'中部', contact:'渡辺 香織', tel:'054-000-0000',
    addr:'〒420-0851 静岡県静岡市葵区', terms:'月末締め / 翌月末払い', credit:6000000,
    salesYear:19700000, salesPrev:18900000, unpaid:0, ordersCount:48, lastOrder:'2026/07/10', invoiceBy:'EDI' },
  { code:'9001-01', rep:'田村 直樹', company:'近畿ロボティクス株式会社', acc:'', rank:'A', rate:0.67, area:'関西', contact:'岡田 誠一', tel:'06-100-0000',
    addr:'〒530-0001 大阪府大阪市北区', terms:'月末締め / 翌月末払い', credit:7000000,
    salesYear:22400000, salesPrev:19800000, unpaid:0, ordersCount:51, lastOrder:'2026/07/16', invoiceBy:'郵送' },
  { code:'9002-01', rep:'鈴木 慶博', company:'関東計測システム株式会社', acc:'', rank:'B', rate:0.78, area:'関東', contact:'小林 由美', tel:'03-100-0000',
    addr:'〒140-0001 東京都品川区', terms:'月末締め / 翌月末払い', credit:3500000,
    salesYear:13100000, salesPrev:11200000, unpaid:0, ordersCount:34, lastOrder:'2026/07/11', invoiceBy:'メール' },
  { code:'9003-01', rep:'佐々木 涼', company:'北海道エンジニアリング株式会社', acc:'', rank:'B', rate:0.80, area:'北海道', contact:'加藤 大地', tel:'011-100-0000',
    addr:'〒060-0001 北海道札幌市中央区', terms:'20日締め / 翌月10日払い', credit:2500000,
    salesYear:7600000, salesPrev:8300000, unpaid:132000, ordersCount:22, lastOrder:'2026/06/02', invoiceBy:'FAX' },
  { code:'9004-01', rep:'鈴木 慶博', company:'四国メカニクス株式会社', acc:'', rank:'C', rate:0.89, area:'四国', contact:'松本 隆', tel:'087-100-0000',
    addr:'〒760-0001 香川県高松市', terms:'月末締め / 翌々月10日払い', credit:1200000,
    salesYear:3800000, salesPrev:4600000, unpaid:74000, ordersCount:12, lastOrder:'2026/05/12', invoiceBy:'郵送' },
  { code:'9005-01', rep:'田村 直樹', company:'中国産業機器株式会社', acc:'', rank:'B', rate:0.79, area:'中国', contact:'井上 千夏', tel:'082-100-0000',
    addr:'〒730-0011 広島県広島市中区', terms:'月末締め / 翌月末払い', credit:3000000,
    salesYear:10900000, salesPrev:9700000, unpaid:0, ordersCount:28, lastOrder:'2026/07/05', invoiceBy:'EDI' },
  { code:'9006-01', rep:'佐々木 涼', company:'東北オートメーション株式会社', acc:'', rank:'A', rate:0.69, area:'東北', contact:'菅原 拓海', tel:'022-100-0000',
    addr:'〒980-0001 宮城県仙台市青葉区', terms:'月末締め / 翌月末払い', credit:6500000,
    salesYear:21200000, salesPrev:22800000, unpaid:412000, ordersCount:39, lastOrder:'2025/08/20', invoiceBy:'郵送' },
  { code:'9007-01', rep:'鈴木 慶博', company:'首都圏ファクトリー株式会社', acc:'', rank:'B', rate:0.81, area:'関東', contact:'藤田 恵', tel:'03-200-0000',
    addr:'〒160-0022 東京都新宿区', terms:'20日締め / 翌月10日払い', credit:2800000,
    salesYear:9400000, salesPrev:8100000, unpaid:0, ordersCount:26, lastOrder:'2026/07/09', invoiceBy:'メール' },
  { code:'9008-01', rep:'田村 直樹', company:'ナニワ精密工業株式会社', acc:'', rank:'C', rate:0.90, area:'関西', contact:'森 健二', tel:'06-300-0000',
    addr:'〒556-0001 大阪府大阪市浪速区', terms:'月末締め / 翌月末払い', credit:1000000,
    salesYear:2900000, salesPrev:5200000, unpaid:0, ordersCount:9, lastOrder:'2025/03/10', invoiceBy:'FAX' },
  { code:'9009-01', rep:'佐々木 涼', company:'新潟テクノ株式会社', acc:'', rank:'B', rate:0.83, area:'北陸', contact:'長谷川 亮', tel:'025-100-0000',
    addr:'〒950-0001 新潟県新潟市中央区', terms:'月末締め / 翌月末払い', credit:2000000,
    salesYear:6300000, salesPrev:5900000, unpaid:88000, ordersCount:17, lastOrder:'2026/06/25', invoiceBy:'郵送' },
  { code:'9010-01', rep:'鈴木 慶博', company:'湘南デバイス株式会社', acc:'', rank:'C', rate:0.91, area:'関東', contact:'村上 さやか', tel:'0466-10-0000',
    addr:'〒251-0001 神奈川県藤沢市', terms:'月末締め / 翌々月10日払い', credit:900000,
    salesYear:2100000, salesPrev:2000000, unpaid:0, ordersCount:8, lastOrder:'2026/07/03', invoiceBy:'メール' },
  { code:'9011-01', rep:'田村 直樹', company:'瀬戸内システムズ株式会社', acc:'', rank:'B', rate:0.80, area:'中国', contact:'谷口 洋平', tel:'086-100-0000',
    addr:'〒700-0901 岡山県岡山市北区', terms:'月末締め / 翌月末払い', credit:4000000,
    salesYear:15600000, salesPrev:13400000, unpaid:0, ordersCount:37, lastOrder:'2026/07/14', invoiceBy:'EDI' },
  { code:'9012-01', rep:'佐々木 涼', company:'沖縄インダストリー株式会社', acc:'', rank:'C', rate:0.90, area:'九州', contact:'比嘉 涼子', tel:'098-100-0000',
    addr:'〒900-0001 沖縄県那覇市', terms:'月末締め / 翌々月10日払い', credit:800000,
    salesYear:1800000, salesPrev:2600000, unpaid:56000, ordersCount:6, lastOrder:'2024/11/05', invoiceBy:'郵送' },
];
window.getCustomer = function(code){ return window.CUSTOMERS.filter(function(c){return c.code===code;})[0]; };

/* ===== 営業担当者マスタ（担当別売上）===== */
window.REPS = [
  { name:'鈴木 慶博', dept:'CS営業1課', target:38000000 },
  { name:'田村 直樹', dept:'CS営業1課', target:52000000 },
  { name:'佐々木 涼', dept:'CS営業2課', target:20000000 },
];
window.repSales = function(name){
  return window.CUSTOMERS.filter(function(c){return c.rep===name;});
};

/* ===== 操作履歴 / 監査ログ（誰が・いつ・何を）=====
   act: create/update/delete/issue/login/export / target種別 */
window.AUDIT_LOG = [
  { at:'2026/07/17 10:42', user:'山田 業務', role:'CS', act:'update',  target:'顧客', ref:'関西オートメ株式会社', detail:'基本掛率 68%→66% に変更' },
  { at:'2026/07/17 10:15', user:'佐藤 経理', role:'経理', act:'issue', target:'請求書', ref:'IV-2607-006', detail:'請求書を発行（郵送）' },
  { at:'2026/07/17 09:58', user:'山田 業務', role:'CS', act:'update',  target:'受注', ref:'WO-24072', detail:'ステータス 手配中→出荷済' },
  { at:'2026/07/17 09:30', user:'田村 直樹', role:'営業', act:'create', target:'見積', ref:'QT26070045', detail:'AI起案の見積を送付' },
  { at:'2026/07/17 09:12', user:'山田 業務', role:'CS', act:'login',   target:'システム', ref:'—', detail:'業務コンソールにログイン' },
  { at:'2026/07/16 18:20', user:'鈴木 慶博', role:'営業', act:'update', target:'顧客', ref:'株式会社サンプル電子', detail:'個別価格 EDS-408A を固定¥31,000に設定' },
  { at:'2026/07/16 17:45', user:'佐藤 経理', role:'経理', act:'update', target:'入金', ref:'IV-2607-003', detail:'入金消込（IBM連携）' },
  { at:'2026/07/16 16:30', user:'山田 業務', role:'CS', act:'create',  target:'商品', ref:'EDS-4014', detail:'新規商品を公開（サイト出力）' },
  { at:'2026/07/16 15:02', user:'渡辺 貿易', role:'貿易', act:'update', target:'発注', ref:'PO-7702', detail:'納期IP（PI反映）2026/08/05' },
  { at:'2026/07/16 14:18', user:'田村 直樹', role:'営業', act:'export', target:'レポート', ref:'RFM分析', detail:'RFM分析結果をCSVエクスポート' },
  { at:'2026/07/16 11:40', user:'佐藤 経理', role:'経理', act:'delete', target:'請求書', ref:'IV-2606-099', detail:'誤発行の請求書ドラフトを削除' },
  { at:'2026/07/16 10:05', user:'山田 業務', role:'CS', act:'update',  target:'受注', ref:'WO-24070', detail:'IBM連携エラーを再送信' },
  { at:'2026/07/15 17:22', user:'鈴木 慶博', role:'営業', act:'update', target:'顧客', ref:'九州メカトロ株式会社', detail:'担当営業を引き継ぎ' },
  { at:'2026/07/15 14:35', user:'佐藤 経理', role:'経理', act:'issue',  target:'請求書', ref:'IV-2607-001', detail:'請求書を発行（郵送）' },
  { at:'2026/07/15 09:00', user:'admin', role:'管理者', act:'login', target:'システム', ref:'—', detail:'管理者アカウントでログイン' },
];
/* ===== 商品マーケ指標（閲覧数/カート投入/注文数/売上）=====
   実運用では GA/アクセスログ・受注データから集計。ここでは擬似生成 */
window.buildProductStats = function(){
  return window.PRODUCTS.map(function(p, i){
    var base = (p.tag==='定番'?1:0)*900 + (p.tag==='上位'?600:0) + (p.maker==='moxa'?450:250);
    var seed = (p.code.length*37 + i*53) % 100;
    var views = base + seed*11 + (p.stock||0)*3;                 // 閲覧数
    var carts = Math.round(views * (0.06 + (seed%9)/100));       // カート投入
    var orders = Math.round(carts * (0.35 + (seed%5)/100));      // 注文数
    var qty = orders * (1 + (seed%6));                            // 販売数量
    var sales = qty * (window.netPrice? p.price : p.price);       // 売上（標準価格ベース）
    return { code:p.code, name:p.name, maker:p.maker, catJa:p.catJa, price:p.price, tag:p.tag,
      views:views, carts:carts, orders:orders, qty:qty, sales:qty*p.price,
      cvr: orders? Math.round(orders/views*1000)/10 : 0 };
  });
};

window.ACT_LABEL = {
  create:{ ja:'作成', bg:'#dcfce7', tx:'#166534' },
  update:{ ja:'更新', bg:'#dbeafe', tx:'#1e40af' },
  delete:{ ja:'削除', bg:'#fee2e2', tx:'#b91c1c' },
  issue: { ja:'発行', bg:'#fef3c7', tx:'#92400e' },
  login: { ja:'ログイン', bg:'#f3f4f6', tx:'#374151' },
  export:{ ja:'出力', bg:'#ede9fe', tx:'#6d28d9' },
};

/* ===== 受注データ（管理：受注一覧 / 検索 / 分析用）=====
   status: arranging手配中 / shipped出荷済 / billed請求済 / paid入金済 / unpaid未入金 */
window.ADMIN_ORDERS = [
  { no:'WO-24076', cust:'1042-01', date:'2026/07/18', amount:437580, route:'Web（ポータル）', status:'arranging', maker:'odu',   items:'ODU AMC 他（顧客ポータル発注）' },
  { no:'WO-24075', cust:'1042-01', date:'2026/07/15', amount:471900, route:'Web検索',        status:'arranging', maker:'moxa',  items:'ODU AMC コネクタ 他2点' },
  { no:'WO-24074', cust:'3011-02', date:'2026/07/15', amount:98000,  route:'EDI',            status:'arranging', maker:'moxa',  items:'MOXA NPort 他' },
  { no:'WO-24073', cust:'1042-01', date:'2026/07/12', amount:214000, route:'見積Web',        status:'shipped',   maker:'odu',   items:'ODU AMC コネクタ 他2点' },
  { no:'WO-24072', cust:'2055-03', date:'2026/07/08', amount:580800, route:'メール',          status:'unpaid',    maker:'moxa',  items:'MOXA EDS-518A ×4 他' },
  { no:'WO-24071', cust:'4023-01', date:'2026/07/02', amount:56800,  route:'FAX',            status:'billed',    maker:'fraba', items:'POSITAL IXARC ×2' },
  { no:'WO-24070', cust:'5088-04', date:'2026/06/30', amount:1280000,route:'EDI',            status:'unpaid',    maker:'moxa',  items:'MOXA EDS 一式' },
  { no:'WO-24069', cust:'1042-01', date:'2026/06/28', amount:77000,  route:'Web検索',        status:'paid',      maker:'moxa',  items:'MOXA EDS-408A ×2' },
  { no:'WO-24068', cust:'8006-01', date:'2026/06/25', amount:342000, route:'Web検索',        status:'paid',      maker:'ipc',   items:'産業用IPC ユニット' },
  { no:'WO-24061', cust:'5088-04', date:'2026/06/20', amount:126000, route:'Web検索',        status:'shipped',   maker:'fraba', items:'POSITAL 磁気エンコーダ ×6' },
  { no:'WO-24055', cust:'1042-01', date:'2026/06/18', amount:281600, route:'見積Web',        status:'unpaid',    maker:'ipc',   items:'産業用IPC ×2' },
  { no:'WO-24048', cust:'6100-01', date:'2026/06/12', amount:189000, route:'メール',          status:'paid',      maker:'moxa',  items:'MOXA AWK ×3' },
  { no:'WO-24040', cust:'8006-01', date:'2026/06/05', amount:69520,  route:'Web検索',        status:'paid',      maker:'moxa',  items:'MOXA NPort ×4' },
  { no:'WO-24033', cust:'7042-02', date:'2026/05/30', amount:98000,  route:'FAX',            status:'billed',    maker:'odu',   items:'ODU MEDI-SNAP 他' },
  { no:'WO-24028', cust:'2055-03', date:'2026/05/24', amount:212000, route:'EDI',            status:'paid',      maker:'moxa',  items:'MOXA EDS-408A ×4' },
];
window.ORDER_STATUS = {
  arranging:{ ja:'手配中',   bg:'#e60012', cls:'text-white' },
  shipped:  { ja:'出荷済',   bg:'#dcfce7', cls:'text-emerald-700' },
  billed:   { ja:'請求済',   bg:'#fef3c7', cls:'text-amber-700' },
  unpaid:   { ja:'未入金',   bg:'#111111', cls:'text-white' },
  paid:     { ja:'入金済',   bg:'#e5e7eb', cls:'text-neutral-700' },
};

/* ===== メーカー（MOXA がメイン＝先頭）===== */
window.MAKERS = {
  moxa: { key:'moxa', name:'MOXA', country:'台湾', quoteType:'一般見積', logo:'assets/img/mk-moxa.png', main:true,
    tagline:'産業用ネットワークのデファクト・スタンダード',
    desc:'産業用イーサネットスイッチ、セキュアルータ、無線/セルラー、シリアルデバイスサーバ、リモートI/O、産業用コンピュータまで。工場・プラント・交通・電力の過酷環境で止まらない産業用ネットワークインフラとエッジコネクティビティを提供します。当社の主力取扱メーカーです。',
    cats:['イーサネットスイッチ','セキュアルータ','プロトコルゲートウェイ','無線AP/ブリッジ','セルラー','シリアルデバイスサーバ','リモートI/O','産業用コンピュータ'] },
  odu: { key:'odu', name:'ODU', country:'ドイツ', quoteType:'一般見積', logo:'assets/img/mk-odu.png',
    tagline:'高信頼コネクタのグローバルスタンダード',
    desc:'医療・計測・産業機器向けの高密度プッシュプルコネクタ。過酷環境での接点信頼性に定評があり、カスタムAssyにも対応します。',
    cats:['円形コネクタ','ハイデンシティ','ケーブルAssy','アクセサリ'] },
  fraba: { key:'fraba', name:'Fraba / POSITAL', country:'ドイツ', quoteType:'特殊見積', logo:'assets/img/mk-posital.png',
    tagline:'位置検出のスペシャリスト',
    desc:'磁気・光学式エンコーダ、傾斜センサ。高分解能かつ堅牢な設計で、搬送・建機・再エネ分野で採用されています。',
    cats:['アブソリュートエンコーダ','インクリメンタル','傾斜センサ','アクセサリ'] },
  ipc: { key:'ipc', name:'AXIOMTEK / IPC', country:'各国', quoteType:'特殊見積', logo:'assets/img/mk-axiomtek.png',
    tagline:'止まらない産業用コンピューティング',
    desc:'ファンレスBOX型PC、組込ボード、パネルPC。長期供給・広温度対応で、装置組込やエッジ制御に最適です。',
    cats:['BOX型PC','パネルPC','組込ボード','拡張モジュール'] },
};

/* ===== 商品（price = 標準価格 / img = 製品画像）=====
   MOXA がメインのため先頭に配置。MOXAは実カテゴリ・実製品画像を使用 */
window.PRODUCTS = [
  /* ---- MOXA（主力）---- */
  { code:'EDS-408A', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-408A 産業用スイッチ 8ポート', price:48000, stock:24, lead:'2営業日', tag:'定番',
    desc:'マネージド産業用イーサネットスイッチ。冗長リング（Turbo Ring）対応で、ライン停止リスクを低減します。',
    spec:[['ポート','10/100M ×8'],['電源','DC 12〜48V 冗長入力'],['動作温度','-10〜60℃'],['取付','DINレール']] },
  { code:'EDS-518A', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-518A ギガビットスイッチ', price:98000, stock:6, lead:'2営業日', tag:'上位',
    desc:'ギガビット対応のマネージドスイッチ。基幹ラインの帯域確保に。',
    spec:[['ポート','GbE ×2 + 10/100M ×16'],['電源','DC 24/48V'],['動作温度','-10〜60℃'],['取付','DINレール']] },
  { code:'EDR-G9010', maker:'moxa', cat:'wired', catJa:'セキュアルータ', img:'assets/img/moxa-router.jpg', name:'MOXA EDR-G9010 産業用セキュアルータ', price:128000, stock:8, lead:'2営業日', tag:'定番',
    desc:'ファイアウォール/NAT/VPN搭載の産業用セキュアルータ。OT/ITネットワークの安全な分離に。',
    spec:[['ポート','GbE ×10'],['機能','FW / NAT / VPN'],['動作温度','-40〜75℃'],['取付','DINレール']] },
  { code:'MGATE-MB3180', maker:'moxa', cat:'wired', catJa:'プロトコルゲートウェイ', img:'assets/img/moxa-gateway.jpg', name:'MOXA MGate MB3180 Modbusゲートウェイ', price:36000, stock:18, lead:'即納', tag:'',
    desc:'Modbus TCP ⇔ RTU/ASCII を相互変換するプロトコルゲートウェイ。既存機器の統合に。',
    spec:[['I/F','シリアル×1 / LAN×1'],['対応','Modbus TCP/RTU/ASCII'],['動作温度','-40〜75℃'],['取付','DINレール']] },
  { code:'IMC-101', maker:'moxa', cat:'wired', catJa:'メディアコンバータ', img:'assets/img/moxa-media.jpg', name:'MOXA IMC-101 産業用メディアコンバータ', price:24000, stock:30, lead:'即納', tag:'',
    desc:'銅線⇔光ファイバを変換する産業用メディアコンバータ。長距離・耐ノイズ配線に。',
    spec:[['ポート','10/100M TX ⇔ FX'],['光','マルチ/シングルモード'],['動作温度','-40〜75℃'],['取付','DINレール']] },
  { code:'AWK-3131A', maker:'moxa', cat:'wireless', catJa:'無線AP/ブリッジ', img:'assets/img/moxa-wireless.jpg', name:'MOXA AWK-3131A 産業用無線AP', price:78000, stock:9, lead:'5営業日', tag:'定番',
    desc:'産業用無線アクセスポイント/ブリッジ/クライアント。AGV・搬送設備の高速ローミングに対応。',
    spec:[['規格','IEEE 802.11a/b/g/n'],['動作温度','-25〜60℃'],['電源','DC 12〜48V / PoE'],['取付','DINレール/壁']] },
  { code:'OnCell-G3150A', maker:'moxa', cat:'wireless', catJa:'セルラー', img:'assets/img/moxa-cellular.jpg', name:'MOXA OnCell G3150A セルラーゲートウェイ', price:88000, stock:5, lead:'5営業日', tag:'',
    desc:'LTE対応の産業用セルラーゲートウェイ。遠隔地設備のIoT接続・リモート監視に。',
    spec:[['通信','LTE / 3G'],['I/F','LAN×1 / シリアル×1'],['動作温度','-30〜70℃'],['取付','DINレール']] },
  { code:'NPort-5150A', maker:'moxa', cat:'smartctrl', catJa:'シリアルデバイスサーバ', img:'assets/img/moxa-deviceserver.jpg', name:'MOXA NPort 5150A シリアルデバイスサーバ', price:19800, stock:40, lead:'即納', tag:'',
    desc:'RS-232/422/485機器をイーサネット化。既存装置のネットワーク接続を最短で実現します。',
    spec:[['ポート','RS-232/422/485 ×1'],['通信','10/100M ×1'],['動作温度','0〜60℃'],['電源','DC 12〜48V']] },
  { code:'ioLogik-E1210', maker:'moxa', cat:'smartctrl', catJa:'リモートI/O', img:'assets/img/moxa-io.jpg', name:'MOXA ioLogik E1210 リモートイーサI/O', price:42000, stock:14, lead:'即納', tag:'',
    desc:'16点DIのイーサネットリモートI/O。設備の状態監視・遠隔制御をシンプルに構築。',
    spec:[['I/O','DI ×16'],['通信','Modbus TCP / SNMP'],['動作温度','-10〜60℃'],['取付','DINレール']] },
  { code:'MC-1121', maker:'moxa', cat:'ipc', catJa:'産業用コンピュータ', img:'assets/img/moxa-ipc.jpg', name:'MOXA MC-1121 産業用組込コンピュータ', price:158000, stock:4, lead:'2週間', tag:'',
    desc:'ファンレスx86産業用コンピュータ。エッジ処理・プロトコル変換のゲートウェイに。',
    spec:[['CPU','x86 / 4GB RAM'],['I/F','LAN×2 / COM×2 / USB×4'],['動作温度','-40〜70℃'],['取付','DINレール/壁']] },

  /* ---- MOXA（カテゴリ横断・実型番）---- */
  { code:'EDS-2005-EL', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-2005-EL', price:39300, stock:7, lead:'2営業日', tag:'', desc:'MOXA イーサネットスイッチシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','イーサネットスイッチ'],['型番','EDS-2005-EL']] },
  { code:'EDS-2005-ELP', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-2005-ELP', price:40600, stock:14, lead:'5営業日', tag:'', desc:'MOXA イーサネットスイッチシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','イーサネットスイッチ'],['型番','EDS-2005-ELP']] },
  { code:'EDS-2008-EL', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-2008-EL', price:41900, stock:21, lead:'2週間', tag:'', desc:'MOXA イーサネットスイッチシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','イーサネットスイッチ'],['型番','EDS-2008-EL']] },
  { code:'EDS-2008-ELP', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-2008-ELP', price:43200, stock:28, lead:'即納', tag:'', desc:'MOXA イーサネットスイッチシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','イーサネットスイッチ'],['型番','EDS-2008-ELP']] },
  { code:'EDS-G2005-EL', maker:'moxa', cat:'wired', catJa:'イーサネットスイッチ', img:'assets/img/moxa-switch.jpg', name:'MOXA EDS-G2005-EL', price:44500, stock:35, lead:'2営業日', tag:'', desc:'MOXA イーサネットスイッチシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','イーサネットスイッチ'],['型番','EDS-G2005-EL']] },
  { code:'EDR-8010', maker:'moxa', cat:'wired', catJa:'セキュアルータ', img:'assets/img/moxa-router.jpg', name:'MOXA EDR-8010', price:45800, stock:0, lead:'5営業日', tag:'', desc:'MOXA セキュアルータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セキュアルータ'],['型番','EDR-8010']] },
  { code:'EDR-810', maker:'moxa', cat:'wired', catJa:'セキュアルータ', img:'assets/img/moxa-router.jpg', name:'MOXA EDR-810', price:47100, stock:7, lead:'2週間', tag:'', desc:'MOXA セキュアルータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セキュアルータ'],['型番','EDR-810']] },
  { code:'EDR-G9004', maker:'moxa', cat:'wired', catJa:'セキュアルータ', img:'assets/img/moxa-router.jpg', name:'MOXA EDR-G9004', price:48400, stock:14, lead:'即納', tag:'', desc:'MOXA セキュアルータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セキュアルータ'],['型番','EDR-G9004']] },
  { code:'TN-5900', maker:'moxa', cat:'wired', catJa:'セキュアルータ', img:'assets/img/moxa-router.jpg', name:'MOXA TN-5900', price:49700, stock:21, lead:'2営業日', tag:'', desc:'MOXA セキュアルータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セキュアルータ'],['型番','TN-5900']] },
  { code:'TN-4900', maker:'moxa', cat:'wired', catJa:'セキュアルータ', img:'assets/img/moxa-router.jpg', name:'MOXA TN-4900', price:51000, stock:28, lead:'5営業日', tag:'', desc:'MOXA セキュアルータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セキュアルータ'],['型番','TN-4900']] },
  { code:'EDF-G1002-BP', maker:'moxa', cat:'wired', catJa:'ネットワークセキュリティ', img:'assets/img/moxa-router.jpg', name:'MOXA EDF-G1002-BP', price:52300, stock:35, lead:'2週間', tag:'', desc:'MOXA ネットワークセキュリティシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','ネットワークセキュリティ'],['型番','EDF-G1002-BP']] },
  { code:'MGate-5119', maker:'moxa', cat:'wired', catJa:'プロトコルゲートウェイ', img:'assets/img/moxa-gateway.jpg', name:'MOXA MGate-5119', price:53600, stock:0, lead:'即納', tag:'', desc:'MOXA プロトコルゲートウェイシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','プロトコルゲートウェイ'],['型番','MGate-5119']] },
  { code:'MGate-5135', maker:'moxa', cat:'wired', catJa:'プロトコルゲートウェイ', img:'assets/img/moxa-gateway.jpg', name:'MOXA MGate-5135', price:54900, stock:7, lead:'2営業日', tag:'', desc:'MOXA プロトコルゲートウェイシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','プロトコルゲートウェイ'],['型番','MGate-5135']] },
  { code:'MGate-MB3170-G2', maker:'moxa', cat:'wired', catJa:'プロトコルゲートウェイ', img:'assets/img/moxa-gateway.jpg', name:'MOXA MGate-MB3170-G2', price:56200, stock:14, lead:'5営業日', tag:'', desc:'MOXA プロトコルゲートウェイシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','プロトコルゲートウェイ'],['型番','MGate-MB3170-G2']] },
  { code:'MGate-MB3170', maker:'moxa', cat:'wired', catJa:'プロトコルゲートウェイ', img:'assets/img/moxa-gateway.jpg', name:'MOXA MGate-MB3170', price:57500, stock:21, lead:'2週間', tag:'', desc:'MOXA プロトコルゲートウェイシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','プロトコルゲートウェイ'],['型番','MGate-MB3170']] },
  { code:'MGate-5101-PBM', maker:'moxa', cat:'wired', catJa:'プロトコルゲートウェイ', img:'assets/img/moxa-gateway.jpg', name:'MOXA MGate-5101-PBM', price:58800, stock:28, lead:'即納', tag:'', desc:'MOXA プロトコルゲートウェイシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','プロトコルゲートウェイ'],['型番','MGate-5101-PBM']] },
  { code:'IMC-21', maker:'moxa', cat:'wired', catJa:'メディアコンバータ', img:'assets/img/moxa-media.jpg', name:'MOXA IMC-21', price:60100, stock:35, lead:'2営業日', tag:'', desc:'MOXA メディアコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','メディアコンバータ'],['型番','IMC-21']] },
  { code:'IMC-21A', maker:'moxa', cat:'wired', catJa:'メディアコンバータ', img:'assets/img/moxa-media.jpg', name:'MOXA IMC-21A', price:61400, stock:0, lead:'5営業日', tag:'', desc:'MOXA メディアコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','メディアコンバータ'],['型番','IMC-21A']] },
  { code:'IMC-21GA', maker:'moxa', cat:'wired', catJa:'メディアコンバータ', img:'assets/img/moxa-media.jpg', name:'MOXA IMC-21GA', price:62700, stock:7, lead:'2週間', tag:'', desc:'MOXA メディアコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','メディアコンバータ'],['型番','IMC-21GA']] },
  { code:'IMC-101G', maker:'moxa', cat:'wired', catJa:'メディアコンバータ', img:'assets/img/moxa-media.jpg', name:'MOXA IMC-101G', price:64000, stock:14, lead:'即納', tag:'', desc:'MOXA メディアコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','メディアコンバータ'],['型番','IMC-101G']] },
  { code:'IMC-P21A-G2', maker:'moxa', cat:'wired', catJa:'メディアコンバータ', img:'assets/img/moxa-media.jpg', name:'MOXA IMC-P21A-G2', price:65300, stock:21, lead:'2営業日', tag:'', desc:'MOXA メディアコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','メディアコンバータ'],['型番','IMC-P21A-G2']] },
  { code:'AWK-1137C', maker:'moxa', cat:'wireless', catJa:'無線AP/ブリッジ/クライアント', img:'assets/img/moxa-wireless.jpg', name:'MOXA AWK-1137C', price:100600, stock:28, lead:'5営業日', tag:'', desc:'MOXA 無線AP/ブリッジ/クライアントシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','無線AP/ブリッジ/クライアント'],['型番','AWK-1137C']] },
  { code:'AWK-1131A', maker:'moxa', cat:'wireless', catJa:'無線AP/ブリッジ/クライアント', img:'assets/img/moxa-wireless.jpg', name:'MOXA AWK-1131A', price:101900, stock:35, lead:'2週間', tag:'', desc:'MOXA 無線AP/ブリッジ/クライアントシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','無線AP/ブリッジ/クライアント'],['型番','AWK-1131A']] },
  { code:'AWK-1151C', maker:'moxa', cat:'wireless', catJa:'無線AP/ブリッジ/クライアント', img:'assets/img/moxa-wireless.jpg', name:'MOXA AWK-1151C', price:103200, stock:0, lead:'即納', tag:'', desc:'MOXA 無線AP/ブリッジ/クライアントシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','無線AP/ブリッジ/クライアント'],['型番','AWK-1151C']] },
  { code:'AWK-1161A', maker:'moxa', cat:'wireless', catJa:'無線AP/ブリッジ/クライアント', img:'assets/img/moxa-wireless.jpg', name:'MOXA AWK-1161A', price:104500, stock:7, lead:'2営業日', tag:'', desc:'MOXA 無線AP/ブリッジ/クライアントシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','無線AP/ブリッジ/クライアント'],['型番','AWK-1161A']] },
  { code:'AWK-1161C', maker:'moxa', cat:'wireless', catJa:'無線AP/ブリッジ/クライアント', img:'assets/img/moxa-wireless.jpg', name:'MOXA AWK-1161C', price:105800, stock:14, lead:'5営業日', tag:'', desc:'MOXA 無線AP/ブリッジ/クライアントシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','無線AP/ブリッジ/クライアント'],['型番','AWK-1161C']] },
  { code:'OnCell-3120-LTE', maker:'moxa', cat:'wireless', catJa:'セルラーゲートウェイ/ルータ', img:'assets/img/moxa-cellular.jpg', name:'MOXA OnCell-3120-LTE', price:107100, stock:21, lead:'2週間', tag:'', desc:'MOXA セルラーゲートウェイ/ルータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セルラーゲートウェイ/ルータ'],['型番','OnCell-3120-LTE']] },
  { code:'NPort-5100A', maker:'moxa', cat:'smartctrl', catJa:'シリアルデバイスサーバ', img:'assets/img/moxa-deviceserver.jpg', name:'MOXA NPort-5100A', price:58400, stock:28, lead:'即納', tag:'', desc:'MOXA シリアルデバイスサーバシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルデバイスサーバ'],['型番','NPort-5100A']] },
  { code:'NPort-5100', maker:'moxa', cat:'smartctrl', catJa:'シリアルデバイスサーバ', img:'assets/img/moxa-deviceserver.jpg', name:'MOXA NPort-5100', price:59700, stock:35, lead:'2営業日', tag:'', desc:'MOXA シリアルデバイスサーバシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルデバイスサーバ'],['型番','NPort-5100']] },
  { code:'NPort-P5150A', maker:'moxa', cat:'smartctrl', catJa:'シリアルデバイスサーバ', img:'assets/img/moxa-deviceserver.jpg', name:'MOXA NPort-P5150A', price:61000, stock:0, lead:'5営業日', tag:'', desc:'MOXA シリアルデバイスサーバシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルデバイスサーバ'],['型番','NPort-P5150A']] },
  { code:'NPort-5200A', maker:'moxa', cat:'smartctrl', catJa:'シリアルデバイスサーバ', img:'assets/img/moxa-deviceserver.jpg', name:'MOXA NPort-5200A', price:62300, stock:7, lead:'2週間', tag:'', desc:'MOXA シリアルデバイスサーバシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルデバイスサーバ'],['型番','NPort-5200A']] },
  { code:'NPort-5200', maker:'moxa', cat:'smartctrl', catJa:'シリアルデバイスサーバ', img:'assets/img/moxa-deviceserver.jpg', name:'MOXA NPort-5200', price:63600, stock:14, lead:'即納', tag:'', desc:'MOXA シリアルデバイスサーバシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルデバイスサーバ'],['型番','NPort-5200']] },
  { code:'UPort-1200-G2', maker:'moxa', cat:'smartctrl', catJa:'USB-シリアル変換 / ハブ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA UPort-1200-G2', price:22900, stock:21, lead:'2営業日', tag:'', desc:'MOXA USB-シリアル変換 / ハブシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','USB-シリアル変換 / ハブ'],['型番','UPort-1200-G2']] },
  { code:'UPort-1400-G2', maker:'moxa', cat:'smartctrl', catJa:'USB-シリアル変換 / ハブ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA UPort-1400-G2', price:24200, stock:28, lead:'5営業日', tag:'', desc:'MOXA USB-シリアル変換 / ハブシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','USB-シリアル変換 / ハブ'],['型番','UPort-1400-G2']] },
  { code:'UPort-1600-8', maker:'moxa', cat:'smartctrl', catJa:'USB-シリアル変換 / ハブ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA UPort-1600-8', price:25500, stock:35, lead:'2週間', tag:'', desc:'MOXA USB-シリアル変換 / ハブシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','USB-シリアル変換 / ハブ'],['型番','UPort-1600-8']] },
  { code:'TCC-80', maker:'moxa', cat:'smartctrl', catJa:'シリアルコンバータ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA TCC-80', price:26800, stock:0, lead:'即納', tag:'', desc:'MOXA シリアルコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルコンバータ'],['型番','TCC-80']] },
  { code:'TCC-82', maker:'moxa', cat:'smartctrl', catJa:'シリアルコンバータ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA TCC-82', price:28100, stock:7, lead:'2営業日', tag:'', desc:'MOXA シリアルコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルコンバータ'],['型番','TCC-82']] },
  { code:'TCC-100', maker:'moxa', cat:'smartctrl', catJa:'シリアルコンバータ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA TCC-100', price:29400, stock:14, lead:'5営業日', tag:'', desc:'MOXA シリアルコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルコンバータ'],['型番','TCC-100']] },
  { code:'TCC-120', maker:'moxa', cat:'smartctrl', catJa:'シリアルコンバータ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA TCC-120', price:30700, stock:21, lead:'2週間', tag:'', desc:'MOXA シリアルコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルコンバータ'],['型番','TCC-120']] },
  { code:'TCF-90-M', maker:'moxa', cat:'smartctrl', catJa:'シリアルコンバータ', img:'assets/img/moxa-serialconv.jpg', name:'MOXA TCF-90-M', price:32000, stock:28, lead:'即納', tag:'', desc:'MOXA シリアルコンバータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','シリアルコンバータ'],['型番','TCF-90-M']] },
  { code:'CP-102E', maker:'moxa', cat:'smartctrl', catJa:'マルチポートシリアルボード', img:'assets/img/moxa-serialconv.jpg', name:'MOXA CP-102E', price:33300, stock:35, lead:'2営業日', tag:'', desc:'MOXA マルチポートシリアルボードシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','マルチポートシリアルボード'],['型番','CP-102E']] },
  { code:'CP-102N', maker:'moxa', cat:'smartctrl', catJa:'マルチポートシリアルボード', img:'assets/img/moxa-serialconv.jpg', name:'MOXA CP-102N', price:34600, stock:0, lead:'5営業日', tag:'', desc:'MOXA マルチポートシリアルボードシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','マルチポートシリアルボード'],['型番','CP-102N']] },
  { code:'CP-102U', maker:'moxa', cat:'smartctrl', catJa:'マルチポートシリアルボード', img:'assets/img/moxa-serialconv.jpg', name:'MOXA CP-102U', price:35900, stock:7, lead:'2週間', tag:'', desc:'MOXA マルチポートシリアルボードシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','マルチポートシリアルボード'],['型番','CP-102U']] },
  { code:'CP-104EL-A', maker:'moxa', cat:'smartctrl', catJa:'マルチポートシリアルボード', img:'assets/img/moxa-serialconv.jpg', name:'MOXA CP-104EL-A', price:37200, stock:14, lead:'即納', tag:'', desc:'MOXA マルチポートシリアルボードシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','マルチポートシリアルボード'],['型番','CP-104EL-A']] },
  { code:'CP-104N', maker:'moxa', cat:'smartctrl', catJa:'マルチポートシリアルボード', img:'assets/img/moxa-serialconv.jpg', name:'MOXA CP-104N', price:38500, stock:21, lead:'2営業日', tag:'', desc:'MOXA マルチポートシリアルボードシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','マルチポートシリアルボード'],['型番','CP-104N']] },
  { code:'ioThinx-4510', maker:'moxa', cat:'smartctrl', catJa:'コントローラ / リモートI/O', img:'assets/img/moxa-io.jpg', name:'MOXA ioThinx-4510', price:39800, stock:28, lead:'5営業日', tag:'', desc:'MOXA コントローラ / リモートI/Oシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','コントローラ / リモートI/O'],['型番','ioThinx-4510']] },
  { code:'MC-1100', maker:'moxa', cat:'ipc', catJa:'産業用コンピュータ', img:'assets/img/moxa-ipc.jpg', name:'MOXA MC-1100', price:167100, stock:35, lead:'2週間', tag:'', desc:'MOXA 産業用コンピュータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','産業用コンピュータ'],['型番','MC-1100']] },
  { code:'MC-1200', maker:'moxa', cat:'ipc', catJa:'産業用コンピュータ', img:'assets/img/moxa-ipc.jpg', name:'MOXA MC-1200', price:168400, stock:0, lead:'即納', tag:'', desc:'MOXA 産業用コンピュータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','産業用コンピュータ'],['型番','MC-1200']] },
  { code:'MC-7400', maker:'moxa', cat:'ipc', catJa:'産業用コンピュータ', img:'assets/img/moxa-ipc.jpg', name:'MOXA MC-7400', price:169700, stock:7, lead:'2営業日', tag:'', desc:'MOXA 産業用コンピュータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','産業用コンピュータ'],['型番','MC-7400']] },
  { code:'DA-820E', maker:'moxa', cat:'ipc', catJa:'産業用コンピュータ', img:'assets/img/moxa-ipc.jpg', name:'MOXA DA-820E', price:171000, stock:14, lead:'5営業日', tag:'', desc:'MOXA 産業用コンピュータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','産業用コンピュータ'],['型番','DA-820E']] },
  { code:'DA-680', maker:'moxa', cat:'ipc', catJa:'産業用コンピュータ', img:'assets/img/moxa-ipc.jpg', name:'MOXA DA-680', price:172300, stock:21, lead:'2週間', tag:'', desc:'MOXA 産業用コンピュータシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','産業用コンピュータ'],['型番','DA-680']] },
  { code:'MRC-Suite', maker:'moxa', cat:'wired', catJa:'セキュアリモートアクセス', img:'assets/img/moxa-router.jpg', name:'MOXA MRC-Suite', price:63600, stock:28, lead:'即納', tag:'', desc:'MOXA セキュアリモートアクセスシリーズ。産業用途向けの堅牢設計・広温度対応。', spec:[['メーカー','MOXA'],['カテゴリ','セキュアリモートアクセス'],['型番','MRC-Suite']] },

  /* ---- ODU（コネクタ）---- */
  { code:'AMC-2P-08', maker:'odu', cat:'connector', catJa:'ハイデンシティ', name:'ODU AMC ハイデンシティ コネクタ 8極', price:6000, stock:120, lead:'即納', tag:'定番',
    desc:'高密度・耐環境の産業用プッシュプルコネクタ。IPCユニットや計測機器の接続に。RoHS対応。',
    spec:[['極数','8極'],['定格','DC 250V / 5A'],['嵌合サイクル','5,000回'],['保護等級','IP68（嵌合時）'],['対応規格','RoHS / REACH']] },
  { code:'AMC-2P-12W', maker:'odu', cat:'connector', catJa:'ハイデンシティ', name:'ODU AMC 防水タイプ 12極', price:9000, stock:40, lead:'即納', tag:'',
    desc:'AMCシリーズの防水仕様。屋外設置装置や洗浄環境での使用に適します。',
    spec:[['極数','12極'],['定格','DC 250V / 5A'],['保護等級','IP69K'],['対応規格','RoHS / REACH']] },
  { code:'MS-K1P-06', maker:'odu', cat:'connector', catJa:'円形コネクタ', name:'ODU MEDI-SNAP 円形コネクタ 6極', price:7800, stock:0, lead:'3週間', tag:'長納期',
    desc:'医療機器向け円形プッシュプルコネクタ。滅菌対応・色分けコーディング可能。',
    spec:[['極数','6極'],['定格','DC 125V / 3A'],['滅菌','オートクレーブ可'],['対応規格','RoHS']] },
  { code:'CBL-AMC-2M', maker:'odu', cat:'connector', catJa:'ケーブルAssy', name:'ODU AMC 専用ケーブルAssy 2m', price:4200, stock:65, lead:'即納', tag:'',
    desc:'AMCコネクタ用の完成ケーブル。両端加工済みで組立工数を削減します。',
    spec:[['長さ','2m'],['芯数','8芯'],['シールド','あり'],['対応規格','RoHS']] },

  /* ---- Fraba / POSITAL（センサ）---- */
  { code:'OCD-DPB1B', maker:'fraba', cat:'sensor', catJa:'アブソリュートエンコーダ', name:'POSITAL OCD アブソリュート磁気エンコーダ', price:30000, stock:8, lead:'5営業日', tag:'定番',
    desc:'マルチターン対応のアブソリュートエンコーダ。ギア機構レスで衝撃・振動に強い設計。',
    spec:[['分解能','シングル16bit / マルチ14bit'],['出力','PROFIBUS-DP'],['保護等級','IP67'],['シャフト','φ10mm']] },
  { code:'IXARC-INC', maker:'fraba', cat:'sensor', catJa:'インクリメンタル', name:'POSITAL IXARC インクリメンタルエンコーダ', price:22000, stock:14, lead:'5営業日', tag:'',
    desc:'汎用インクリメンタルエンコーダ。パルス数のカスタム対応可。',
    spec:[['出力パルス','1024 P/R'],['出力形式','ラインドライバ'],['保護等級','IP65'],['電源','DC 5〜30V']] },
  { code:'TILT-2D', maker:'fraba', cat:'sensor', catJa:'傾斜センサ', name:'POSITAL 2軸 傾斜センサ', price:42000, stock:3, lead:'3週間', tag:'長納期',
    desc:'建機・高所作業車向けの2軸傾斜センサ。振動下でも安定した角度出力。',
    spec:[['測定範囲','±90°（2軸）'],['出力','CANopen'],['保護等級','IP69K'],['電源','DC 10〜30V']] },

  { code:'IPC-3050-i5', maker:'ipc', cat:'ipc', catJa:'BOX型PC', name:'産業用IPC 組込ユニット BOX型 (Core i5)', price:198000, stock:3, lead:'即納', tag:'',
    desc:'ファンレスBOX型産業用PC。広温度対応・長期供給。装置組込やエッジ制御に。',
    spec:[['CPU','Core i5 / 8GB RAM'],['ストレージ','SSD 256GB'],['動作温度','-20〜60℃'],['I/F','LAN×2 / COM×4 / USB×6']] },
  { code:'IPC-3000-i3', maker:'ipc', cat:'ipc', catJa:'BOX型PC', name:'産業用IPC IPC-3000 シリーズ (Core i3)', price:148000, stock:5, lead:'即納', tag:'EOL予定',
    desc:'従来モデル。2026/09 最終受注予定。後継の IPC-3050 への切替をご検討ください。',
    spec:[['CPU','Core i3 / 4GB RAM'],['ストレージ','SSD 128GB'],['動作温度','0〜50℃'],['I/F','LAN×2 / COM×2 / USB×4']] },
  { code:'PPC-156', maker:'ipc', cat:'ipc', catJa:'パネルPC', name:'15.6型 産業用パネルPC タッチ対応', price:238000, stock:2, lead:'2週間', tag:'',
    desc:'前面IP65のタッチパネルPC。装置のHMIとしてそのまま組込可能。',
    spec:[['画面','15.6型 FHD 静電容量式'],['CPU','Celeron / 8GB RAM'],['前面保護','IP65'],['取付','パネルマウント']] },
];

/* ===== 見積（営業送付済・見積番号から発注）=====
   構成：IPC/ODU 等。部材：取扱製品以外も含む（PDF与件） */
window.QUOTES = [
  { no:'QT26070031', acc:'A', date:'2026/07/03', title:'MOXA AWK-1131A-JP 他 3点', due:'2026/08/02', left:11, status:'有効', staff:'鈴木 慶博',
    type:'一般見積', techCheck:false,
    lines:[
      { code:'AWK-3131A',   qty:3,  kind:'製品' },
      { code:'EDS-408A',    qty:2,  kind:'製品' },
      { code:'NPort-5150A', qty:4,  kind:'製品' },
    ] },
  { no:'QT26070028', acc:'A', date:'2026/07/02', title:'産業用スイッチングハブ 提案', due:'2026/07/16', left:10, status:'有効', staff:'鈴木 慶博',
    type:'一般見積', techCheck:false,
    lines:[ { code:'EDS-518A', qty:2, kind:'製品' }, { code:'EDS-408A', qty:4, kind:'製品' } ] },
  { no:'QT26060025', acc:'A', date:'2026/06/30', title:'IPC-3050 組込構成一式（IPC + ODU + 部材）', due:'2026/07/14', left:6, status:'有効', staff:'鈴木 慶博',
    type:'特殊見積', techCheck:true,
    lines:[
      { code:'IPC-3050-i5', qty:2,  kind:'構成（IPC）' },
      { code:'AMC-2P-08',   qty:20, kind:'構成（ODU）' },
      { code:'CBL-AMC-2M',  qty:20, kind:'構成（ODU）' },
      { custom:'DINレール取付キット（他社品）', cust_code:'KIT-DIN-01', qty:2,  price:3200,  kind:'部材（取扱外）' },
      { custom:'耐環境ケース加工（特注）',      cust_code:'CASE-SP-02', qty:2,  price:28000, kind:'部材（特注）' },
    ] },
  { no:'QT26060021', acc:'B', date:'2026/06/28', title:'UPS（無停電電源装置）他', due:'2026/07/12', left:4, status:'有効', staff:'鈴木 慶博',
    type:'一般見積', techCheck:false,
    lines:[ { code:'OCD-DPB1B', qty:6, kind:'製品' }, { code:'IXARC-INC', qty:4, kind:'製品' } ] },
  { no:'QT26060018', acc:'A', date:'2026/06/25', title:'サーバー構成ご提案', due:'2026/07/09', left:3, status:'有効', staff:'鈴木 慶博',
    type:'特殊見積', techCheck:true,
    lines:[ { code:'PPC-156', qty:1, kind:'構成（IPC）' }, { code:'NPort-5150A', qty:2, kind:'製品' } ] },
  { no:'QT26060012', acc:'A', date:'2026/06/20', title:'セキュリティ機器一式', due:'2026/07/04', left:0, status:'期限切れ', staff:'鈴木 慶博',
    type:'一般見積', techCheck:false,
    lines:[ { code:'AWK-3131A', qty:1, kind:'製品' } ] },
];

/* ===== ニュース / コラム（トップ用）===== */
window.NEWS = [
  { id:'n1', date:'2026.07.15', cat:'イベント情報', title:'第31回名古屋ものづくりワールドに出展いたします',
    body:'2026年秋に開催される「第31回 名古屋ものづくりワールド」に出展いたします。当社ブースでは、産業用ネットワーク（MOXA）、高信頼コネクタ（ODU）、エンコーダ（POSITAL）を中心に、現場課題に合わせた構成事例をご紹介します。ご来場の際はぜひお立ち寄りください。' },
  { id:'n2', date:'2026.07.08', cat:'イベント情報', title:'Japan IT Week 春 秋（ネットワーク・IoT関連）に出展いたします',
    body:'ネットワーク・IoT関連の専門展「Japan IT Week」に出展いたします。エッジからクラウドまでの産業用接続ソリューションを、実機とデモを交えてご覧いただけます。' },
  { id:'n3', date:'2026.06.20', cat:'お知らせ', title:'ODU 医療機器向けコネクタソリューションのご案内',
    body:'医療機器・手術支援ロボット向けに、洗浄耐性・接点信頼性に優れた ODU の高密度プッシュプルコネクタをご案内します。カスタムAssyのご相談も承ります。' },
  { id:'n4', date:'2026.05.30', cat:'お知らせ', title:'【新製品】POSITAL 20mm IXARC マルチターン磁気エンコーダを発売',
    body:'コンパクトな20mm径ながら高分解能を実現した、POSITAL IXARC シリーズのマルチターン磁気エンコーダを取り扱い開始しました。搬送・建機・再エネ分野に適しています。' },
  { id:'n5', date:'2026.05.12', cat:'お知らせ', title:'新たなエンコーダのトレンド・バッテリーフリーのアブソリュート',
    body:'バッテリー交換が不要なエネルギーハーベスト方式のマルチターンエンコーダについて、仕組みと導入メリットを解説する資料をご用意しました。担当営業までお問い合わせください。' },
];
window.getNews = (id) => window.NEWS.filter(n => n.id === id)[0] || window.NEWS[0];

window.COLUMNS = [
  { id:'c1', title:'産業用ネットワークの選び方 —— MOXA 冗長化リング Turbo Ring の基礎', date:'2026.07.10', tag:'MOXA', big:true,
    lead:'産業用イーサネットの可用性を左右する「リング冗長化」。代表的な Turbo Ring を例に、選定の勘どころを整理します。',
    body:['産業用ネットワークでは、ケーブル断線やスイッチ故障が生産停止に直結します。これを防ぐのがリング型の冗長化構成で、経路が1つ切れても瞬時に別経路へ切り替わります。',
          'Turbo Ring は代表的な高速リカバリ方式で、リング上のノード数が増えても切替時間を一定水準に抑えられるのが特長です。設計時はリング内の最大ノード数、二重リングの要否、上位系との接続点を先に決めると構成がぶれません。',
          '実運用では、リンク状態の監視と通知の仕組みまで含めて設計しておくと、障害時の一次切り分けが大幅に短縮できます。構成のご相談は担当営業までお寄せください。'] },
  { id:'c2', title:'OT/ITを安全につなぐ —— MOXA セキュアルータ EDR-G9010 活用術', date:'2026.06.25', tag:'MOXA',
    lead:'工場ネットワーク（OT）と情報系（IT）を安全に接続するための、ファイアウォール／NAT／VPNの基本設計を解説します。',
    body:['OTとITを直結せず、境界にセキュアルータを置いて通信を必要最小限に絞るのがセキュリティの基本です。',
          'EDR-G9010 のようなセキュアルータでは、ファイアウォールで通信の可否を制御し、NATで機器アドレスを隠蔽、VPNで遠隔保守経路を暗号化します。まず「誰が・どの機器と・どのポートで通信するか」を洗い出すと、ルールがシンプルになります。',
          '導入時はセグメント分割の粒度と、保守用リモートアクセスの運用ルールをセットで決めることをおすすめします。'] },
  { id:'c3', title:'遠隔設備をIoT化 —— セルラーゲートウェイ導入の勘どころ', date:'2026.06.10', tag:'MOXA',
    lead:'有線が引けない遠隔設備の見える化に有効なセルラーゲートウェイ。回線・電源・運用の3点から導入の要点をまとめます。',
    body:['ポンプ場・屋外設備・移動体など、有線敷設が難しい場所ではセルラー通信が現実解になります。',
          '選定では、対応バンドとSIM運用（通信量・多拠点管理）、電源の安定性、そして通信断時のローカル保持・再送の仕組みを確認します。エッジ側でデータを一次蓄積できると、回線が不安定でも取りこぼしを防げます。',
          'スモールスタートで1拠点を検証し、運用手順を固めてから横展開すると失敗しにくいです。'] },
  { id:'c4', title:'コネクタの嵌合サイクルと保護等級 —— 現場で失敗しない選定', date:'2026.05.20', tag:'ODU',
    lead:'コネクタ選定で見落としがちな「嵌合回数」と「保護等級（IP）」。用途に合った選び方を整理します。',
    body:['コネクタは電気性能だけでなく、抜き差し回数（嵌合サイクル）と防塵防水（IP等級）を用途に合わせて選ぶ必要があります。',
          '頻繁に着脱する検査・医療用途では嵌合サイクルの多いプッシュプル式が有利です。屋外・洗浄環境ではIP等級とロック機構、ケーブル側の耐屈曲性まで合わせて確認します。',
          '特殊形状・混合コンタクトのカスタムAssyにも対応可能です。要件が固まっていない段階でもお気軽にご相談ください。'] },
  { id:'c5', title:'エンコーダのEOLに備える —— 後継機への移行チェックリスト', date:'2026.04.28', tag:'POSITAL',
    lead:'長期使用が前提のエンコーダも、いつかは生産終了（EOL）を迎えます。慌てないための移行チェック項目をまとめました。',
    body:['エンコーダのEOL対応では、機械的な取付寸法（シャフト径・フランジ）、電気インターフェース（出力方式・分解能）、そして通信プロトコルの3点が移行可否を分けます。',
          '後継機では分解能や通信仕様が向上していることが多く、上位側の設定変更が必要になる場合があります。EOL通知を受けたら、在庫の手当てと並行して後継機の評価を早めに始めるのが安全です。',
          '当社のPCN/EOL通知機能では、対象製品と後継品をポータル上でご確認いただけます。移行のご相談も承ります。'] },
];
window.getColumn = (id) => window.COLUMNS.filter(c => c.id === id)[0] || window.COLUMNS[0];

/* ===== 画像ヘルパー（実サイトの画像を使用）===== */
window.IMG = {
  logo:'assets/img/logo.png',
  hero:'assets/img/mvimg.jpg',
  bgCart:'assets/img/bg1.jpg',
  bgContact:'assets/img/bg2.jpg',
  columns:['assets/img/bg1.jpg','assets/img/mvimg.jpg','assets/img/support1.jpg','assets/img/support2.jpg','assets/img/bg2.jpg'],
  supports:['assets/img/support1.jpg','assets/img/support2.jpg'],
  };
/* 製品画像：個別画像(img)があれば優先、なければカテゴリ実写にフォールバック */
window.prodImg = function(p){
  if(p && p.img) return p.img;
  var c = window.CATEGORIES.filter(function(x){ return x.key===(p&&p.cat); })[0];
  return c ? c.img : 'assets/img/cat-connector.jpg';
};
window.catImg = function(key){
  var c = window.CATEGORIES.filter(function(x){ return x.key===key; })[0];
  return c ? c.img : 'assets/img/cat-connector.jpg';
};

/* ===== 便利関数 ===== */
window.getProduct = (code) => window.PRODUCTS.filter(p => p.code === code)[0] || window.PRODUCTS[0];
window.productsByMaker = (m) => window.PRODUCTS.filter(p => p.maker === m);
window.productsByCat = (c) => window.PRODUCTS.filter(p => p.cat === c);
window.getQuote = (no) => window.QUOTES.filter(q => q.no === no)[0] || window.QUOTES[0];
/* 見積行の単価：製品は得値、部材は見積提示価格 */
window.quoteLinePrice = function (l) {
  if (l.custom) return l.price;
  const n = window.netPrice(getProduct(l.code).price);
  return n === null ? null : n;
};
window.quoteLineName = (l) => l.custom ? l.custom : getProduct(l.code).name;
window.quoteLineCode = (l) => l.custom ? l.cust_code : l.code;
window.quoteTotal = function (q) {
  let s = 0;
  for (const l of q.lines) { const p = window.quoteLinePrice(l); if (p === null) return null; s += p * l.qty; }
  return s;
};

/* ===== 請求書（注文書単位に自動集約） ===== */
window.INVOICES = [
  { no:'IV-2607-001', cust:'1042-01', orders:['WO-24055'], close:'2026/06/30', due:'2026/07/31', status:'unpaid', lines:[['IPC-3050-i5',2]] },
  { no:'IV-2607-002', cust:'2055-03', orders:['WO-24072'], close:'2026/06/20', due:'2026/07/10', status:'unpaid', lines:[['EDS-518A',4],['NPort-5150A',10]] },
  { no:'IV-2607-003', cust:'1042-01', orders:['WO-24069'], close:'2026/06/30', due:'2026/07/31', status:'paid',   lines:[['EDS-408A',2]] },
  { no:'IV-2607-004', cust:'1042-01', orders:['WO-24073'], close:'2026/07/31', due:'2026/08/31', status:'draft',  lines:[['AMC-2P-08',20],['CBL-AMC-2M',20],['EDS-408A',3]] },
  { no:'IV-2607-005', cust:'4023-01', orders:['WO-24071'], close:'2026/07/20', due:'2026/08/10', status:'draft',  lines:[['IXARC-INC',2]] },
  { no:'IV-2607-006', cust:'5088-04', orders:['WO-24070'], close:'2026/07/31', due:'2026/08/31', status:'unpaid', lines:[['EDS-518A',6],['EDR-G9010',2]] },
  { no:'IV-2607-007', cust:'8006-01', orders:['WO-24068'], close:'2026/06/30', due:'2026/07/31', status:'paid',   lines:[['IPC-3050-i5',1],['PPC-156',1]] },
  { no:'IV-2607-008', cust:'3011-02', orders:['WO-24074'], close:'2026/07/31', due:'2026/08/31', status:'draft',  lines:[['NPort-5150A',3],['MGATE-MB3180',2]] },
  { no:'IV-2607-009', cust:'6100-01', orders:['WO-24048'], close:'2026/06/20', due:'2026/07/10', status:'paid',   lines:[['AWK-3131A',3]] },
  { no:'IV-2607-010', cust:'7042-02', orders:['WO-24033'], close:'2026/06/30', due:'2026/07/31', status:'unpaid', lines:[['MS-K1P-06',4]] },
  { no:'IV-2607-011', cust:'8006-01', orders:['WO-24040'], close:'2026/06/30', due:'2026/07/31', status:'paid',   lines:[['NPort-5150A',4]] },
  { no:'IV-2607-012', cust:'5088-04', orders:['WO-24061'], close:'2026/07/31', due:'2026/08/31', status:'draft',  lines:[['OCD-DPB1B',6]] },
];
window.getInvoice = (no) => window.INVOICES.filter(v => v.no === no)[0] || window.INVOICES[0];
window.invNet = (cust, code) => Math.round(getProduct(code).price * getCustomer(cust).rate/10)*10;
window.invSubtotal = (v) => v.lines.reduce((s,l) => s + window.invNet(v.cust,l[0])*l[1], 0);
window.invC = function(v){ var c=getCustomer(v.cust); return { company:c.company, addr:c.addr, user:c.contact, terms:c.terms, custCode:c.code, rank:c.rank, rate:c.rate, invoiceBy:c.invoiceBy, margin:Math.round((1-c.rate)*100) }; };

/* ===== 出荷（ヤマト送り状） ===== */
window.SHIPMENTS = [
  { order:'WO-24061', cust:'5088-04', maker:'fraba', items:'POSITAL OCD 磁気エンコーダ ×6', pkgs:1, type:'宅急便 / 発払い', slip:'4567-8901-2345', date:'2026/07/14' },
  { order:'WO-24069', cust:'1042-01', maker:'moxa', items:'MOXA EDS-408A ×2', pkgs:1, type:'宅急便 / 発払い', slip:'4567-8901-2401', date:'2026/07/15' },
  { order:'WO-24073', cust:'1042-01', maker:'odu', items:'ODU AMC コネクタ 他2点', pkgs:2, type:'宅急便 / 発払い', slip:'', date:'' },
  { order:'WO-24072', cust:'2055-03', maker:'moxa', items:'MOXA EDS-518A ×4 他', pkgs:3, type:'宅急便 / 着払い', slip:'', date:'' },
  { order:'WO-24075', cust:'1042-01', maker:'odu', items:'ODU AMC コネクタ 他2点', pkgs:1, type:'宅急便タイムサービス', slip:'', date:'' },
  { order:'WO-24074', cust:'3011-02', maker:'moxa', items:'MOXA NPort ×3 他', pkgs:1, type:'宅急便 / 発払い', slip:'', date:'' },
  { order:'WO-24068', cust:'8006-01', maker:'ipc', items:'産業用IPC ユニット ×1', pkgs:2, type:'宅急便 / 発払い', slip:'4567-8901-2360', date:'2026/07/13' },
  { order:'WO-24048', cust:'6100-01', maker:'moxa', items:'MOXA AWK ×3', pkgs:1, type:'宅急便 / 発払い', slip:'', date:'' },
  { order:'WO-24033', cust:'7042-02', maker:'odu', items:'ODU MEDI-SNAP 他', pkgs:1, type:'宅急便 / 着払い', slip:'4567-8901-2312', date:'2026/07/09' },
];
window.getShipment = (order) => window.SHIPMENTS.filter(s => s.order === order)[0] || window.SHIPMENTS[0];
window.shipCust = (s) => getCustomer(s.cust) || {company:s.cust, addr:'—', contact:'—'};

/* ===== 問合せ（③問合せ：受注〜出荷の間の顧客対応） ===== */
window.INQ_STATUS = {
  open   : { ja:'未対応',  bg:'#e60012', cls:'text-white' },
  working: { ja:'対応中',  bg:'#f0a500', cls:'text-white' },
  done   : { ja:'完了',    bg:'#e8e8ee', cls:'text-neutral-600' },
};
window.INQUIRIES = [
  { id:'IQ-2607-011', at:'2026/07/17 10:20', cust:'1042-01', order:'WO-24075', ch:'ポータル', status:'open', staff:'鈴木 慶博',
    subject:'納期を1週間前倒しできますか', email:'t.tanaka@sample-densi.example.jp', body:'ライン立上げの都合で、7/24までに納品いただけると助かります。分納でも構いません。' },
  { id:'IQ-2607-010', at:'2026/07/17 09:05', cust:'2055-03', order:'WO-24072', ch:'電話', status:'open', staff:'田村 直樹',
    subject:'EDS-518A のファームウェア指定', email:'h.suzuki@tokai-seiki.example.jp', body:'FW v3.9 で出荷してほしい。現行ラインの他機と揃える必要あり。' },
  { id:'IQ-2607-009', at:'2026/07/16 16:40', cust:'5088-04', order:'WO-24070', ch:'メール', status:'working', staff:'佐々木 涼',
    subject:'IBM連携エラーの件（在庫マスタ不整合）', email:'kobai@kansai-autome.example.jp', body:'注文が通っているか確認したい。エラー通知が届いた。' },
  { id:'IQ-2607-008', at:'2026/07/16 11:15', cust:'1042-01', order:'WO-24073', ch:'ポータル', status:'working', staff:'鈴木 慶博',
    subject:'ODU AMC の代替品について', email:'t.tanaka@sample-densi.example.jp', body:'AMC-2P-08 が長納期の場合、互換のある代替型番があれば提案してほしい。' },
  { id:'IQ-2607-007', at:'2026/07/15 14:30', cust:'3011-02', order:'WO-24074', ch:'メール', status:'done', staff:'田村 直樹',
    subject:'請求書の宛名変更', email:'keiri@marusho.example.jp', body:'請求書の宛名を「マルショウ工業株式会社 経理部」に変更してください。', reply:'次回請求分より変更いたしました。' },
  { id:'IQ-2607-006', at:'2026/07/14 09:50', cust:'8006-01', order:'WO-24068', ch:'電話', status:'done', staff:'佐々木 涼',
    subject:'検品時に数量不足（MS-K1P-06 ×2）', email:'kobai@chubu-plant.example.jp', body:'納品数が2個不足していました。', reply:'ODUへ代品申請済み。7/22に不足分を出荷予定です。' },
];
window.getInquiry = (id) => window.INQUIRIES.filter(q => q.id === id)[0] || window.INQUIRIES[0];

/* ===== 見積依頼（①見積依頼 → ②メーカー見積取得 → ③見積作成） =====
   lines[].mkCost / mkLead が空＝メーカー見積 未取得。両方入ると②取得済。 */
window.QUOTE_REQUESTS = [
  { id:'RQ-2607-031', date:'2026/07/17', cust:'1042-01', type:'一般見積', status:'todo', staff:'鈴木 慶博',
    note:'ライン増設用。数量まとめ引きで単価要相談。',
    lines:[
      { code:'AMC-2P-08',  qty:50, mkCost:null, mkLead:'' },
      { code:'CBL-AMC-2M', qty:50, mkCost:null, mkLead:'' },
    ] },
  { id:'RQ-2607-030', date:'2026/07/16', cust:'2055-03', type:'特殊見積', status:'tech', staff:'鈴木 慶博',
    note:'IPC組込構成。技術部の構成チェックが必要。',
    lines:[
      { code:'IPC-3050-i5', qty:2,  mkCost:185000, mkLead:'約3週間' },
      { code:'NPort-5150A', qty:4,  mkCost:null,   mkLead:'' },
      { custom:'DINレール取付キット（他社品）', qty:2, mkCost:2800, mkLead:'在庫' },
    ] },
  { id:'RQ-2607-029', date:'2026/07/16', cust:'5088-04', type:'特殊見積', status:'maker', staff:'佐々木 涼',
    note:'傾斜センサ。メーカー（POSITAL/fraba）へ見積依頼中。',
    lines:[
      { code:'OCD-DPB1B', qty:10, mkCost:null, mkLead:'' },
    ] },
];
window.getQuoteRequest = (id) => window.QUOTE_REQUESTS.filter(r => r.id === id)[0] || window.QUOTE_REQUESTS[0];

/* ===== 顧客側 注文（一覧 orders.html / 詳細 order-detail.html / mypage 共通マスタ） =====
   step = 完了工程数（0=見積前 … 6=入金済）。STEPS=['見積','受発注','問合せ','出荷','請求','入金']
   lines[] は明細。lead=回答納期、slip=送り状番号、shipDate/arriveDate=出荷・到着（無ければ未出荷） */
/* 顧客が見る注文は、社内 ADMIN_ORDERS の「その顧客の受注」と番号・金額・状態を一致させる。
   A=1042-01（サンプル電子）／B=2055-03（東海精機）。step は orderStep(社内status) と同値。 */
window.CUST_ORDERS = [
  // ── A（サンプル電子）──
  { no:'WO-24076', acc:'A', date:'2026/07/18', amount:437580, step:2, pay:'未請求', route:'Web（ポータル）',
    lead:'', slip:'', shipDate:'', arriveDate:'',
    lines:[ {code:'AMC-2P-08',qty:20}, {code:'IPC-3050-i5',qty:2}, {code:'EDS-408A',qty:2} ] },
  { no:'WO-24075', acc:'A', date:'2026/07/15', amount:471900, step:2, pay:'未請求', route:'Web検索',
    lead:'', slip:'', shipDate:'', arriveDate:'',
    lines:[ {code:'AMC-2P-08',qty:20}, {code:'CBL-AMC-2M',qty:20}, {code:'EDS-408A',qty:3} ] },
  { no:'WO-24073', acc:'A', date:'2026/07/12', amount:214000, step:4, pay:'未請求', route:'見積 QT26060025',
    lead:'2026/07/17', slip:'4567-8901-2345', shipDate:'2026/07/16', arriveDate:'2026/07/17',
    lines:[ {code:'AMC-2P-08',qty:20}, {code:'CBL-AMC-2M',qty:20}, {code:'EDS-408A',qty:1} ] },
  { no:'WO-24069', acc:'A', date:'2026/06/25', amount:77000, step:6, pay:'入金済', route:'Web検索',
    lead:'2026/06/27', slip:'4567-8901-2401', shipDate:'2026/06/29', arriveDate:'2026/06/30',
    lines:[ {code:'EDS-408A',qty:2} ] },
  { no:'WO-24055', acc:'A', date:'2026/06/20', amount:281600, step:5, pay:'未入金', route:'見積 QT26060018',
    lead:'2026/06/18', slip:'4567-8901-2280', shipDate:'2026/06/22', arriveDate:'2026/06/23',
    lines:[ {code:'IPC-3050-i5',qty:2} ] },
  // ── B（東海精機）──
  { no:'WO-24072', acc:'B', date:'2026/07/08', amount:580800, step:5, pay:'未入金', route:'メール',
    lead:'2026/07/10', slip:'4567-8901-2312', shipDate:'2026/07/12', arriveDate:'2026/07/13',
    lines:[ {code:'EDS-518A',qty:4}, {code:'NPort-5150A',qty:10} ] },
  { no:'WO-24028', acc:'B', date:'2026/06/12', amount:212000, step:6, pay:'入金済', route:'EDI',
    lead:'2026/06/14', slip:'4567-8901-2101', shipDate:'2026/06/16', arriveDate:'2026/06/17',
    lines:[ {code:'EDS-408A',qty:4} ] },
];
window.getAdminOrder = (no) => window.ADMIN_ORDERS.filter(o => o.no === no)[0] || window.ADMIN_ORDERS[0];
/* 社内status → 完了工程数（0..6）。顧客側 order-detail と社内側 admin-order-detail で共通に使い、現在工程を一致させる */
window.orderStep = (status) => ({ arranging:2, shipped:4, billed:5, unpaid:5, paid:6 }[status] !== undefined ? { arranging:2, shipped:4, billed:5, unpaid:5, paid:6 }[status] : 2);
window.getCustOrder = (no) => window.CUST_ORDERS.filter(o => o.no === no)[0] || window.CUST_ORDERS[0];
window.CUST_STEPS = ['見積','受発注','問合せ','出荷','請求','入金'];

/* ===== 買い物カゴ（cart / checkout / order-complete で共通・デモは固定構成） ===== */
window.CART = [ { code:'AMC-2P-08', qty:20 }, { code:'IPC-3050-i5', qty:2 }, { code:'EDS-408A', qty:2 } ];
window.NEW_ORDER_NO = 'WO-24076'; // 注文確定時に採番される新規受付番号（既存WO-24075の次）
/* メーカー見積が全明細そろっているか（②取得済み判定） */
window.reqMakerReady = (r) => r.lines.every(l => l.mkCost != null && l.mkCost !== '' && l.mkLead);
window.reqLineName = (l) => l.custom ? l.custom : getProduct(l.code).name;
window.reqLineCode = (l) => l.custom ? '（取扱外/特注）' : l.code;

/* 前回仕入れ実績（メーカー原価）— 過去に仕入れた実績がある型番は自動入力に使う。
   実績がある型番は COST_HISTORY を優先、無ければ標準価格×概算原価率で推定（要確認）。 */
window.COST_HISTORY = {
  'AMC-2P-08': 5400, 'CBL-AMC-2M': 1900, 'IPC-3050-i5': 185000, 'NPort-5150A': 9800,
  'OCD-DPB1B': 28000, 'EDS-408A': 21500, 'EDS-518A': 41000, 'AWK-3131A': 32000,
};
window.lastCost = function(code){
  if(!code) return null;
  if(window.COST_HISTORY[code] != null) return { val: window.COST_HISTORY[code], actual: true };
  var p = getProduct(code);
  if(!p || p.price == null) return null;
  return { val: Math.round(p.price * 0.62 / 10) * 10, actual: false }; // 推定原価（要確認）
};
