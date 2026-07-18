/* KMECS ONE 受発注ポータル — 共通シェル
   renderUserShell : 顧客向け（コーポレート調・横型グローバルナビ）
   renderAdminShell: 社内向け（業務コンソール調・左サイドナビ） */
(function () {
  const LS = window.localStorage;
  const ACC = window.ACCOUNTS || {};

  const KMECS = {
    account: () => ACC[LS.getItem('kmecs_account')] || null,
    isLoggedIn: () => !!ACC[LS.getItem('kmecs_account')],
    login: (key) => { if (ACC[key]) LS.setItem('kmecs_account', key); },
    logout: () => LS.removeItem('kmecs_account'),
    cartCount: () => parseInt(LS.getItem('kmecs_cart_count') || '0', 10),
    addToCart: (n) => { const c = KMECS.cartCount() + (n || 1); LS.setItem('kmecs_cart_count', String(c)); return c; },
    setCart: (n) => LS.setItem('kmecs_cart_count', String(n)),
    // 保存した商品（お気に入り）。未初期化時はデモ用のサンプルを返す（永続化はしない）
    savedProducts: () => {
      const raw = LS.getItem('kmecs_saved');
      if (raw === null) return ['EDS-518A', 'OCD-DPB1B', 'AWK-3131A'];
      try { return JSON.parse(raw) || []; } catch (e) { return []; }
    },
    isSaved: (code) => KMECS.savedProducts().indexOf(code) >= 0,
    toggleSaved: (code) => {
      const list = KMECS.savedProducts().slice();
      const i = list.indexOf(code);
      if (i >= 0) list.splice(i, 1); else list.unshift(code);
      LS.setItem('kmecs_saved', JSON.stringify(list));
      return i < 0; // true = 保存した / false = 解除した
    },
  };
  window.KMECS = KMECS;

  /* プレースホルダ（コーポレートサイト側の未実装ページ）クリックの受け皿。
     href="#" のリンクは本モックに実ページが無いコンテンツのため、
     デモ中に「壊れている」と見えないよう準備中を通知する。document 委譲なので
     シェルの innerHTML 再構築後も有効。 */
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a[href="#"]') : null;
    if (!el) return;
    e.preventDefault();
    var label = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    alert((label ? '「' + label + '」は' : 'このページは') + '準備中です（デモ版のため未実装）。');
  });

  const yen = (n) => '¥' + Number(n).toLocaleString('ja-JP');
  window.yen = yen;
  window.qs = (k) => new URLSearchParams(location.search).get(k);

  /* 得値 = 標準価格 × 顧客掛率（顧客ごとの粗利率・取引条件ベース） */
  window.netPrice = function (list) {
    const a = KMECS.account();
    if (!a) return null;
    return Math.round(list * a.rate / 10) * 10;
  };
  window.priceOrMask = function (list) {
    const n = window.netPrice(list);
    if (n === null) {
      // 商品カード（<a>）内で使われるため、入れ子<a>を避け<span>で返す（クリックはカードの詳細リンクに委譲）
      return '<span class="inline-flex items-center gap-1 text-[15px] text-neutral-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>ログインで表示</span>';
    }
    return '<span class="font-bold text-ink font-display">' + yen(n) + '</span>';
  };
  window.subtotalOrMask = function (list, qty) {
    const n = window.netPrice(list);
    return n === null ? '<span class="text-neutral-300">—</span>' : '<span class="font-display font-bold">' + yen(n * qty) + '</span>';
  };

  const logoImg = (h) => `<img src="assets/img/logo.png" alt="K.MECS ONE" style="height:${h}px;width:auto;display:block">`;
  // ダーク背景用：ロゴの黒文字を白へ反転（赤アイコンは維持）
  const logoImgW = (h) => `<img src="assets/img/logo.png" alt="K.MECS ONE" style="height:${h}px;width:auto;display:block;filter:invert(1) hue-rotate(180deg) saturate(2.4) brightness(1.1)">`;

  /* ================= 顧客向けシェル ================= */
  const GNAV = [
    { key: 'products',      en: 'PRODUCTS',  ja: '製品を探す',     href: 'products.html' },
    { key: 'makers',        en: 'MAKERS',    ja: '取扱メーカー',   href: 'makers.html' },
    { key: 'quotes',        en: 'QUOTE',     ja: '見積から発注',   href: 'quotes.html' },
    { key: 'orders',        en: 'ORDERS',    ja: '注文・進捗',     href: 'orders.html' },
    { key: 'notifications', en: 'PCN / EOL', ja: '製品変更情報',   href: 'notifications.html' },
    { key: 'mypage',        en: 'MYPAGE',    ja: 'マイページ',     href: 'mypage.html' },
  ];

  function mockBar() {
    return `<div class="bg-black text-white text-[14px] text-center py-1.5 px-3 flex items-center justify-center gap-2">
      <span class="inline-block w-1.5 h-1.5 rounded-full" style="background:#e60012"></span>
      <span class="font-display font-bold tracking-widest">MOCK-UP</span>
      <span class="text-neutral-400">画面イメージ共有用 — ダミーデータです。実データ・実処理は含みません。</span>
    </div>`;
  }

  /* ===== メガメニュー（写真付き・ホバーで展開） ===== */
  function megaCol(title, inner) {
    return `<div><div class="text-[11px] font-bold tracking-widest text-neutral-400 mb-3">${title}</div>${inner}</div>`;
  }
  function megaLink(href, ja, desc) {
    return `<a href="${href}" class="block py-1.5 hover:text-[color:var(--brand)] group/l">
      <span class="text-[14px] font-bold text-ink group-hover/l:text-[color:var(--brand)]">${ja}</span>
      ${desc ? `<span class="block text-[12px] text-neutral-400 leading-snug">${desc}</span>` : ''}</a>`;
  }
  function megaFeature(href, img, cap) {
    return `<a href="${href}" class="block overflow-hidden group/f">
      <div class="h-24 overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover group-hover/f:scale-105 transition-transform duration-500"></div>
      <div class="text-[13px] font-bold text-ink mt-1.5 group-hover/f:text-[color:var(--brand)]">${cap} ›</div></a>`;
  }
  function megaFor(key, a) {
    const CATS = window.CATEGORIES || [];
    const MK = window.MAKERS || {};
    const INDS = window.INDUSTRIES || [];
    if (key === 'products') {
      const cats = CATS.slice(0, 10).map(c =>
        `<a href="products.html?cat=${c.key}" class="flex items-center gap-2 py-1 hover:text-[color:var(--brand)]">
          <span class="w-9 h-9 bg-white border border-[color:var(--line)] overflow-hidden shrink-0"><img src="${c.img}" alt="" class="w-full h-full object-cover"></span>
          <span class="text-[14px] text-ink">${c.ja}</span></a>`).join('');
      const mkKeys = ['moxa', 'odu', 'fraba', 'ipc'].filter(k => MK[k]);
      const makers = mkKeys.map(k =>
        `<a href="maker.html?m=${k}" class="flex items-center gap-2.5 py-1.5 hover:text-[color:var(--brand)]">
          <span class="w-14 h-9 bg-white border border-[color:var(--line)] flex items-center justify-center p-1 shrink-0"><img src="${MK[k].logo}" alt="${MK[k].name}" class="max-w-full max-h-full object-contain"></span>
          <span><span class="block text-[14px] font-bold text-ink">${MK[k].name}</span><span class="block text-[12px] text-neutral-400 leading-none">${MK[k].country}</span></span></a>`).join('');
      const inds = INDS.slice(0, 6).map(s => `<a href="leading.html?ind=${s.key}" class="text-[13px] text-ink hover:text-[color:var(--brand)] py-1 block">${s.ja} ›</a>`).join('');
      return `<div class="grid grid-cols-12 gap-8">
        <div class="col-span-5">${megaCol('CATEGORY ／ カテゴリから', `<div class="grid grid-cols-2 gap-x-6 gap-y-0.5">${cats}</div>`)}</div>
        <div class="col-span-3">${megaCol('MAKER ／ メーカーから', makers + `<a href="makers.html" class="text-[13px] font-bold mt-1 inline-block" style="color:#e60012">取扱メーカー一覧 ›</a>`)}</div>
        <div class="col-span-4">${megaCol('SOLUTIONS ／ 業界事例から', megaFeature('leading.html', 'assets/img/case-factory.jpg', '業界・用途から探す') + `<div class="grid grid-cols-2 gap-x-4 mt-2">${inds}</div>`)}</div>
      </div>
      <div class="border-t border-[color:var(--line)] mt-5 pt-3 flex items-center justify-between">
        <span class="text-[13px] text-neutral-400">型番・キーワードでも検索できます</span>
        <a href="products.html" class="text-[14px] font-bold" style="color:#e60012">すべての製品を見る →</a></div>`;
    }
    if (key === 'makers') {
      const mkKeys = ['moxa', 'odu', 'fraba', 'ipc'].filter(k => MK[k]);
      const cards = mkKeys.map(k =>
        `<a href="maker.html?m=${k}" class="card card-h overflow-hidden flex flex-col">
          <div class="h-20 bg-white flex items-center justify-center p-3 border-b border-[color:var(--line)]"><img src="${MK[k].logo}" alt="${MK[k].name}" class="max-h-full max-w-full object-contain"></div>
          <div class="p-3"><div class="font-display font-black text-[16px] text-ink">${MK[k].name}</div>
          <div class="text-[12px] leading-snug mt-1" style="color:#e60012">${MK[k].tagline}</div></div></a>`).join('');
      return `<div class="grid grid-cols-4 gap-4">${cards}</div>
        <div class="border-t border-[color:var(--line)] mt-5 pt-3 flex items-center justify-between">
          <span class="text-[13px] text-neutral-400">取扱メーカーは16社。掲載外メーカー・特注もご相談ください。</span>
          <a href="makers.html" class="text-[14px] font-bold" style="color:#e60012">取扱メーカー一覧へ →</a></div>`;
    }
    if (key === 'quotes') {
      return `<div class="grid grid-cols-12 gap-8">
        <div class="col-span-4">${megaFeature('quotes.html', 'assets/img/support1.jpg', '見積一覧を見る')}</div>
        <div class="col-span-4">${megaCol('QUOTE ／ 見積', megaLink('quotes.html', '見積一覧', '送付済みの見積・有効期限を確認') + megaLink('quotes.html', 'この見積で発注', '見積内容そのままカートへ'))}</div>
        <div class="col-span-4">${megaCol('REQUEST ／ 依頼', megaLink('contact.html', 'お見積り依頼', '型番・数量から見積を依頼') + megaLink('contact.html', 'カスタムAssy・特注相談', '取扱外・特注もご相談ください'))}</div>
      </div>`;
    }
    if (key === 'orders') {
      return `<div class="grid grid-cols-12 gap-8">
        <div class="col-span-4">${megaFeature('orders.html', 'assets/img/support2.jpg', '注文・進捗一覧')}</div>
        <div class="col-span-4">${megaCol('ORDERS ／ 注文', megaLink('orders.html', '注文履歴・進捗', '見積→受発注→出荷→請求→入金を追跡') + megaLink('orders.html', '出荷・送り状番号', 'ヤマト追跡番号を確認'))}</div>
        <div class="col-span-4">${megaCol('SUPPORT ／ サポート', megaLink('mypage.html', 'マイページ', 'お取引条件・支払条件・未入金') + megaLink('contact.html', '注文について相談', '担当営業へ直接連絡'))}</div>
      </div>`;
    }
    if (key === 'notifications') {
      return `<div class="grid grid-cols-12 gap-8">
        <div class="col-span-4">${megaFeature('notifications.html', 'assets/img/support1.jpg', 'PCN / EOL 情報')}</div>
        <div class="col-span-8">${megaCol('PCN / EOL ／ 製品変更情報', `<div class="grid grid-cols-2 gap-x-8">${megaLink('notifications.html', 'PCN（製品変更通知）', '仕様・FW変更のお知らせ') + megaLink('notifications.html', 'EOL（生産終了予定）', '後継品・最終受注のご案内')}${megaLink('notifications.html', '購入品の該当確認', 'ご購入履歴から影響を確認') + megaLink('contact.html', '後継品への移行相談', '移行チェックリストをご提供')}</div>`)}</div>
      </div>`;
    }
    if (key === 'mypage') {
      const acc = a
        ? megaLink('mypage.html', 'マイページ', `${a.company}`) + megaLink('orders.html', '注文・進捗', '進行中の注文を確認') + megaLink('quotes.html', '保存した見積', '一時保存・有効な見積')
        : megaLink('login.html', 'ログイン', 'ログインで得値・注文履歴を表示') + megaLink('contact.html', 'アカウント発行の相談', '担当営業までお問い合わせください');
      return `<div class="grid grid-cols-12 gap-8">
        <div class="col-span-4">${megaFeature('mypage.html', 'assets/img/support2.jpg', 'マイページ')}</div>
        <div class="col-span-4">${megaCol('MYPAGE ／ マイページ', acc)}</div>
        <div class="col-span-4">${megaCol('ACCOUNT ／ お取引', megaLink('mypage.html', 'お取引条件', '支払条件・請求・ご登録情報') + megaLink('cart.html', 'カート', 'カート内容を確認'))}</div>
      </div>`;
    }
    return '';
  }

  KMECS.renderUserShell = function (cfg) {
    cfg = cfg || {};
    const active = cfg.active || '';
    const a = KMECS.account();
    const content = document.getElementById('content');
    const contentHTML = content ? content.innerHTML : '';
    const cart = KMECS.cartCount();

    const accountArea = a
      ? `<div class="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
           <div class="text-right leading-tight hidden xl:block">
             <div class="text-[13px] text-neutral-400 hidden 2xl:block">${a.company}</div>
             <div class="text-[14px] text-white font-medium justify-end">${a.user} 様</div>
           </div>
           <button id="logoutBtn" class="text-[13px] text-neutral-400 hover:text-white border border-white/25 px-2.5 py-1 shrink-0">ログアウト</button>
         </div>`
      : `<a href="login.html" class="text-[14px] text-white font-bold border border-white/40 hover:bg-white/10 px-4 py-2 shrink-0">ログイン</a>`;

    document.body.innerHTML = `
      ${mockBar()}
      <header class="sticky top-0 z-40 text-white" style="background:#0d1024">
        <div class="flex items-center gap-3 px-4 xl:px-8 h-[68px]">
          <a href="index.html" class="flex items-center gap-3 shrink-0">
            ${logoImgW(32)}
            <span class="hidden 2xl:block text-[13px] text-neutral-400 border-l border-white/20 pl-3 leading-tight">受発注<br>ポータル</span>
          </a>

          <nav class="hidden xl:flex items-stretch mx-auto shrink-0">
            ${GNAV.map(n => {
              const on = n.key === active;
              const mega = megaFor(n.key, a);
              return `<div class="group flex items-stretch">
                <a href="${n.href}" class="relative px-2.5 py-2 text-center whitespace-nowrap flex flex-col justify-center">
                  <span class="block font-display text-[14px] font-bold tracking-wide ${on ? 'text-white' : 'text-neutral-300 group-hover:text-white'}">${n.en}</span>
                  <span class="block text-[12px] mt-0.5 ${on ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-300'}">${n.ja}</span>
                  <span class="absolute left-2.5 right-2.5 bottom-0 h-[2px] ${on ? '' : 'scale-x-0 group-hover:scale-x-100'} transition-transform" style="background:#e60012"></span>
                </a>
                ${mega ? `<div class="hidden group-hover:block absolute left-0 right-0 top-full z-50 text-ink" style="background:#fff;border-top:3px solid #e60012;box-shadow:0 24px 40px -14px rgba(0,0,0,.28)">
                  <div class="max-w-[1200px] mx-auto px-8 py-7">${mega}</div>
                </div>` : ''}
              </div>`;
            }).join('')}
          </nav>

          <div class="flex items-center gap-2.5 ml-auto xl:ml-0 shrink-0 whitespace-nowrap">
            <div class="hidden 2xl:block text-[13px] text-neutral-400 font-display">JP<span class="text-neutral-600"> | </span><a href="#" class="hover:text-white">EN</a></div>
            ${accountArea}
            <a href="cart.html" class="relative p-1.5 hover:bg-white/10 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3h2l2 12h11l2-8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>
              ${cart > 0 ? `<span class="absolute -top-0.5 -right-0.5 text-white text-[12px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center" style="background:#e60012">${cart}</span>` : ''}
            </a>
            <a href="contact.html" class="hidden 2xl:inline-flex items-center gap-1.5 text-white text-[14px] font-bold px-4 py-2.5 shrink-0" style="background:#e60012">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>CONTACT
            </a>
            <button id="navToggle" class="xl:hidden p-1.5 shrink-0"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          </div>
        </div>
        <!-- モバイル/タブレットナビ -->
        <nav id="mnav" class="hidden xl:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-1" style="background:#0d1024">
          ${GNAV.map(n => `<a href="${n.href}" class="px-3 py-2.5 text-[15px] text-neutral-200 hover:bg-white/10"><span class="font-display font-bold">${n.en}</span> <span class="text-[13px] text-neutral-500">${n.ja}</span></a>`).join('')}
          <a href="admin-orders.html" class="px-3 py-2.5 text-[15px] text-neutral-400 hover:bg-white/10">管理画面（社内）</a>
        </nav>
      </header>

      ${cfg.crumbs ? `<div class="border-b border-[color:var(--line)] bg-white">
        <div class="max-w-[1200px] mx-auto px-4 xl:px-8 py-2.5 text-[15px] text-neutral-400 flex items-center gap-1.5 flex-wrap">
          ${cfg.crumbs.map((c, i) => (c.href ? `<a href="${c.href}" class="hover:text-[color:var(--brand)]">${c.label}</a>` : `<span class="text-neutral-700">${c.label}</span>`) + (i < cfg.crumbs.length - 1 ? '<span class="text-neutral-300">›</span>' : '')).join('')}
        </div></div>` : ''}

      <main id="page">${contentHTML}</main>

      <!-- CONTACT -->
      <section class="grid md:grid-cols-2">
        <div class="min-h-[180px] hidden md:block" style="background:url(assets/img/bg2.jpg) center/cover no-repeat"></div>
        <div class="p-10 text-white flex flex-col justify-center" style="background:#e60012">
          <div class="text-[15px] font-display font-bold tracking-widest opacity-80">お問い合わせ</div>
          <h2 class="font-display text-3xl font-extrabold mt-1">CONTACT US</h2>
          <p class="text-sm mt-3 opacity-90 leading-relaxed">製品・お取引条件・アカウント発行のご相談はこちらから。担当営業がご対応します。</p>
          <a href="contact.html" class="mt-5 inline-flex items-center justify-center gap-2 bg-white text-[17px] font-bold px-8 py-3.5 w-fit" style="color:#e60012">
            お問い合わせはこちら <span style="border-left:5px solid #e60012;border-top:4px solid transparent;border-bottom:4px solid transparent"></span>
          </a>
        </div>
      </section>

      <!-- フッター -->
      <footer class="bg-white border-t border-[color:var(--line)]">
        <div class="max-w-[1200px] mx-auto px-4 xl:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-[15px]">
          <div>
            <a href="index.html" class="block font-bold text-ink mb-3 font-display">TOP</a>
            <a href="#" class="block text-neutral-500 hover:text-[color:var(--brand)]">ケーメックスONEについて</a>
          </div>
          <div>
            <div class="font-bold text-ink mb-3 font-display">取扱い製品</div>
            <ul class="space-y-1.5 text-neutral-500">
              <li><a href="products.html" class="hover:text-[color:var(--brand)]">キーワードから探す</a></li>
              <li><a href="products.html" class="hover:text-[color:var(--brand)]">カテゴリから探す</a></li>
              <li><a href="makers.html" class="hover:text-[color:var(--brand)]">取扱メーカー</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-ink mb-3 font-display">受発注</div>
            <ul class="space-y-1.5 text-neutral-500">
              <li><a href="quotes.html" class="hover:text-[color:var(--brand)]">見積一覧・発注</a></li>
              <li><a href="orders.html" class="hover:text-[color:var(--brand)]">注文履歴・進捗</a></li>
              <li><a href="notifications.html" class="hover:text-[color:var(--brand)]">PCN / EOL 情報</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-ink mb-3 font-display">サポート</div>
            <ul class="space-y-1.5 text-neutral-500">
              <li><a href="#" class="hover:text-[color:var(--brand)]">ダウンロード</a></li>
              <li><a href="#" class="hover:text-[color:var(--brand)]">よくあるご質問</a></li>
              <li><a href="admin-dashboard.html" class="hover:text-[color:var(--brand)]">管理画面（社内）</a></li>
            </ul>
          </div>
        </div>
        <div class="text-white py-5" style="background:#0d1024">
          <div class="max-w-[1200px] mx-auto px-4 xl:px-8 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">${logoImgW(26)}</div>
            <div class="text-[14px] text-neutral-500">Copyright© K.MECS ONE Corp. All Rights Reserved. — モックアップ制作: 株式会社ティーツーシー</div>
          </div>
        </div>
      </footer>
    `;

    const tg = document.getElementById('navToggle');
    if (tg) tg.addEventListener('click', () => document.getElementById('mnav').classList.toggle('hidden'));
    const lo = document.getElementById('logoutBtn');
    if (lo) lo.addEventListener('click', () => { KMECS.logout(); location.href = 'index.html'; });
    if (typeof cfg.onReady === 'function') cfg.onReady();
  };

  /* ================= 管理（業務コンソール）シェル ================= */
  const ANAV = [
    { sec: 'ホーム', items: [
      { key: 'admin-dashboard', label: '管理ダッシュボード', href: 'admin-dashboard.html' },
      { key: 'admin-search', label: '横断検索', href: 'admin-search.html' },
    ]},
    { sec: '受注業務', items: [
      { key: 'admin-orders', label: '受注管理・IBM連携', href: 'admin-orders.html', badge: '3' },
      { key: 'admin-quotes', label: '見積管理・作成', href: 'admin-quotes.html' },
      { key: 'admin-inquiries', label: '問合せ管理', href: 'admin-inquiries.html', badge: '2' },
    ]},
    { sec: '商品管理', items: [
      { key: 'admin-products', label: '商品管理・登録', href: 'admin-products.html' },
    ]},
    { sec: '顧客・分析', items: [
      { key: 'admin-customers', label: '顧客管理・価格設定', href: 'admin-customers.html' },
      { key: 'admin-analytics', label: '売上分析', href: 'admin-analytics.html' },
      { key: 'admin-report', label: 'RFM分析レポート', href: 'admin-report.html' },
      { key: 'admin-reps', label: '営業担当者・ランキング', href: 'admin-reps.html' },
      { key: 'admin-ranking', label: 'ランキング / マーケ', href: 'admin-ranking.html' },
    ]},
    { sec: 'システム', items: [
      { key: 'admin-audit', label: '操作履歴（監査ログ）', href: 'admin-audit.html' },
    ]},
    { sec: '出荷', items: [
      { key: 'admin-shipping', label: '出荷・送り状発行', href: 'admin-shipping.html', badge: '5' },
    ]},
    { sec: '経理', items: [
      { key: 'admin-invoice', label: '請求書発行', href: 'admin-invoice.html' },
      { key: 'admin-payment', label: '入金消込', href: 'admin-payment.html', badge: '4' },
    ]},
    { sec: '貿易', items: [
      { key: 'admin-trade', label: '発注・納期・仕入IP', href: 'admin-trade.html' },
    ]},
  ];

  KMECS.renderAdminShell = function (cfg) {
    cfg = cfg || {};
    const active = cfg.active || '';
    const content = document.getElementById('content');
    const contentHTML = content ? content.innerHTML : '';

    document.body.innerHTML = `
      ${mockBar()}
      <div class="flex min-h-[calc(100vh-26px)]">
        <!-- サイドナビ（管理専用） -->
        <aside id="sidebar" class="w-60 shrink-0 text-white fixed lg:sticky lg:self-start inset-y-0 lg:inset-y-auto lg:top-0 left-0 lg:h-screen z-40 -translate-x-full lg:translate-x-0 transition-transform overflow-y-auto" style="background:#22243a">
          <div class="px-4 py-4 border-b border-white/10">
            <div>${logoImgW(34)}<div class="text-[13px] text-neutral-400 mt-2">業務コンソール</div></div>
          </div>
          ${ANAV.map(g => `
            <div class="px-4 pt-4 pb-1 mt-1 text-[11px] font-bold text-neutral-500 border-t border-white/5">${g.sec}</div>
            <nav>${g.items.map(it => {
              const on = it.key === active;
              return `<a href="${it.href}" class="flex items-center justify-between gap-2 pl-4 pr-3 py-2 text-[13px] relative ${on ? 'text-white font-bold' : 'text-neutral-300 hover:text-white hover:bg-white/5'}" ${on ? 'style="background:rgba(230,0,18,.16)"' : ''}>
                ${on ? '<span class="absolute left-0 top-0 bottom-0 w-[3px]" style="background:#e60012"></span>' : ''}
                <span>${it.label}</span>
                ${it.badge ? `<span class="text-[11px] font-bold text-white rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center" style="background:#e60012">${it.badge}</span>` : ''}
              </a>`;
            }).join('')}</nav>`).join('')}
          <div class="px-4 mt-5 pt-4 border-t border-white/10 text-[14px] text-neutral-500 leading-relaxed">
            <div class="flex items-center gap-1.5 mb-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span class="text-neutral-300">IBM基幹：VPN接続中</span></div>
            <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span class="text-neutral-300">ヤマトB2：API接続中</span></div>
            <a href="index.html" class="block mt-3 text-neutral-400 hover:text-white">← 顧客ポータルを見る</a>
          </div>
        </aside>
        <div id="backdrop" class="hidden fixed inset-0 bg-black/40 z-30 lg:hidden"></div>

        <div class="flex-1 min-w-0" style="background:#eef0f3">
          <!-- 管理ヘッダー（顧客画面と別デザイン） -->
          <header class="bg-white border-b border-[#dcdce6] sticky top-0 z-30">
            <div class="flex items-center gap-3 px-5 h-14">
              <button id="navToggle" class="lg:hidden p-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
              <div class="min-w-0">
                <div class="text-[15px] font-bold text-ink truncate">${cfg.title || ''}</div>
                <div class="text-[12px] text-neutral-400 truncate hidden sm:block">${cfg.sub || ''}</div>
              </div>
              <div class="flex-1"></div>
              <span class="badge text-white" style="background:#393b56">管理者</span>
              <div class="text-right leading-tight hidden sm:block">
                <div class="text-[11px] text-neutral-400">カスタマーサービス</div>
                <div class="text-[13px] font-medium text-ink">山田 業務 さん</div>
              </div>
            </div>
          </header>
          <div class="p-4 sm:p-5" id="page">${contentHTML}</div>
          <div class="text-center text-[12px] text-neutral-400 py-6">KMECS ONE 業務コンソール モックアップ — Produced by T2C（株式会社ティーツーシー）</div>
        </div>
      </div>
    `;
    document.body.className = 'adm-scope';

    const tg = document.getElementById('navToggle');
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('backdrop');
    if (tg) tg.addEventListener('click', () => { sb.classList.remove('-translate-x-full'); bd.classList.remove('hidden'); });
    if (bd) bd.addEventListener('click', () => { sb.classList.add('-translate-x-full'); bd.classList.add('hidden'); });
    if (typeof cfg.onReady === 'function') cfg.onReady();
  };
})();
