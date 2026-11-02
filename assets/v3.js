/* A.S. Pool & Snooker — Version 3 layer: English / Gujarati switch, live facts, "Nearest to me".
   Gujarati strings are a first draft and need review by a native speaker before launch. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const GU = {
    'Locations':'ક્લબ સ્થળો','Skip intro':'છોડો','How to play':'કેવી રીતે રમવું','How to play.':'કેવી રીતે રમવું.','New to the table? Here are the basics of five popular games. Rules vary a little from club to club, and which games each club offers is best confirmed with the club.':'ટેબલ પર નવા છો? પાંચ લોકપ્રિય રમતોની મૂળભૂત બાબતો અહીં છે. નિયમો ક્લબ પ્રમાણે થોડા બદલાય છે, અને કઈ ક્લબમાં કઈ રમત છે તે ક્લબ પાસેથી ખાતરી કરો.','Snooker':'સ્નૂકર','Rummy':'રમી','Shuffle':'શફલ','8-ball pool':'8-બૉલ પૂલ','9-ball pool':'9-બૉલ પૂલ','Gallery':'ફોટા','The break':'બ્રેક','Contact':'સંપર્ક','Find a club':'ક્લબ શોધો',
    'One break.':'એક બ્રેક.','13 clubs.':'૧૩ ક્લબ.','your frame':'તમારી ફ્રેમ',
    'Snooker and pool in Ahmedabad, Gandhinagar, Anand and Nadiad. Find your nearest club and get directions in one tap.':'અમદાવાદ, ગાંધીનગર, આણંદ અને નડિયાદમાં સ્નૂકર અને પૂલ. તમારી નજીકની ક્લબ શોધો અને એક ટેપમાં દિશા મેળવો.',
    'Nearest to me':'મારી નજીક',
    'clubs':'ક્લબ','cities':'શહેરો','Directions on every listing':'દરેક ક્લબ માટે દિશા',
    'Your next game starts here.':'તમારી આગામી રમત અહીંથી શરૂ થાય છે.',
    'Find your club.':'તમારી ક્લબ શોધો.','Search by area or city, then open directions in one tap.':'વિસ્તાર અથવા શહેર પ્રમાણે શોધો, પછી એક ટેપમાં દિશા ખોલો.',
    'club listings':'ક્લબ યાદી','across Gujarat':'ગુજરાતભરમાં','Search clubs by area or city':'વિસ્તાર અથવા શહેર પ્રમાણે ક્લબ શોધો',
    'All':'બધી','Ahmedabad':'અમદાવાદ','Gandhinagar':'ગાંધીનગર','Anand':'આણંદ','Nadiad':'નડિયાદ',
    'Directions':'દિશા','Find on Maps':'નકશામાં શોધો','Enquire':'પૂછપરછ','Call club':'ક્લબને કૉલ કરો','Explore club':'ક્લબ જુઓ','See on map':'નકશામાં જુઓ',
    'No matching locations':'કોઈ મેળ ખાતી ક્લબ નથી','Try another neighborhood or select all locations.':'બીજો વિસ્તાર અજમાવો અથવા બધી ક્લબ પસંદ કરો.','Clear filters':'ફિલ્ટર સાફ કરો',
    'The way to your table.':'તમારા ટેબલ સુધીનો રસ્તો.',
    'Pick a location from the list or a pin on the map. Then open Google Maps for turn-by-turn directions.':'યાદીમાંથી અથવા નકશા પરના પિનથી ક્લબ પસંદ કરો. પછી દિશા માટે Google Maps ખોલો.',
    'SELECTED CLUB':'પસંદ કરેલી ક્લબ','Choose a location':'ક્લબ પસંદ કરો','Open Google Maps ↗':'Google Maps ખોલો ↗','Browse all clubs':'બધી ક્લબ જુઓ','View all locations':'બધી ક્લબ જુઓ',
    'Map pins are approximate; new branches without confirmed coordinates use directions links.':'નકશાના પિન અંદાજિત છે; જેમાં ચોક્કસ સ્થાન નથી તેમાં દિશાની લિંક વાપરો.',
    'Take the shot.':'શૉટ લગાવો.','A short 3D break, then pick a club. Optional, no sound.':'ટૂંકો 3D બ્રેક, પછી ક્લબ પસંદ કરો. વૈકલ્પિક, અવાજ વગર.',
    'Take your shot':'શૉટ લગાવો','Just show locations':'ફક્ત ક્લબ બતાવો','The club directory above works without it.':'ઉપરની ક્લબ યાદી તેના વગર પણ કામ કરે છે.',
    'A look inside.':'અંદરની એક ઝલક.','All photos':'બધા ફોટા','Pool':'પૂલ','Our spaces':'અમારી જગ્યા','SNOOKER':'સ્નૂકર','POOL':'પૂલ','THE CLUB':'ક્લબ',
    'Enhanced club photography. Images may not depict the selected branch.':'ગેલેરીમાં ક્લબના ફોટા પર આધારિત એન્હાન્સ્ડ અને AI-રીટચ કરેલી છબીઓ છે.',
    'Have a question?':'કોઈ પ્રશ્ન છે?',
    "Planning a group visit, an event, or a business collaboration? Tell us what you're thinking. Your message will open in your email app for you to review and send.":'ગ્રૂપ મુલાકાત, ઇવેન્ટ કે બિઝનેસ સહયોગ વિશે પૂછવું છે? તમારો સંદેશ તમારી ઇમેઇલ એપમાં ખુલશે, ત્યાં તપાસીને મોકલો.',
    'GENERAL ENQUIRIES':'સામાન્ય પૂછપરછ','CLUB DIRECTIONS':'ક્લબ દિશા','Browse locations & contact numbers ↗':'ક્લબ અને ફોન નંબર જુઓ ↗',
    'Your name':'તમારું નામ','Type of enquiry':'પૂછપરછનો પ્રકાર','Your email':'તમારું ઇમેઇલ','Your message':'તમારો સંદેશ','Prepare email':'ઇમેઇલ તૈયાર કરો',
    'Group visit':'ગ્રૂપ મુલાકાત','Tournament or event':'ટૂર્નામેન્ટ કે ઇવેન્ટ','Business or partnership':'બિઝનેસ કે ભાગીદારી','Other enquiry':'અન્ય પૂછપરછ',
    'Opens your email app. No information is submitted to this website.':'આ તમારી ઇમેઇલ એપ ખોલે છે. આ વેબસાઇટ પર કોઈ માહિતી મોકલાતી નથી.',
    'For the love of the game.':'રમતના પ્રેમ માટે.'
  };
  const PLACEHOLDER = { en: 'Search an area, city or club…', gu: 'વિસ્તાર, શહેર અથવા ક્લબ શોધો…' };
  const orig = new WeakMap();
  let lang = 'en';

  function summary(key) {
    const m = /^Showing (\d+) of (\d+) locations$/.exec(key);
    return m ? `${m[2]} માંથી ${m[1]} ક્લબ બતાવી રહ્યા છીએ` : /^Showing (\d+) locations$/.test(key) ? key.replace(/^Showing (\d+) locations$/, '$1 ક્લબ બતાવી રહ્યા છીએ') : undefined;
  }
  function node(n) {
    const raw = n.nodeValue; const key = raw.trim();
    if (!key) return;
    if (lang === 'gu') {
      const out = GU[key] !== undefined ? GU[key] : summary(key);
      if (out !== undefined) { orig.set(n, raw); n.nodeValue = raw.replace(key, out); }
    } else if (orig.has(n)) { n.nodeValue = orig.get(n); orig.delete(n); }
  }
  function walk(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: t => /^(SCRIPT|STYLE|CANVAS|NOSCRIPT)$/.test(t.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const list = []; while (w.nextNode()) list.push(w.currentNode); list.forEach(node);
  }
  const observer = new MutationObserver(muts => {
    if (lang !== 'gu') return;
    muts.forEach(m => m.addedNodes.forEach(a => { if (a.nodeType === 3) node(a); else if (a.nodeType === 1) walk(a); }));
  });

  let lastNear = null;
  const near = {
    status: o => lang === 'gu'
      ? `સૌથી નજીકનો પિન: ${o.name}, આશરે ${o.km} કિમી દૂર. પિન અંદાજિત છે.`
      : `Nearest pin: ${o.name}, about ${o.km} km away. Pins are approximate.`,
    denied: () => lang === 'gu' ? 'સ્થાન મળી શક્યું નહીં. વિસ્તાર અથવા શહેર પ્રમાણે શોધો.' : 'Could not get your location. Search by area or city instead.'
  };
  function showNear() {
    const el = $('#near-status'); if (!el || !lastNear) return;
    el.hidden = false; el.textContent = lastNear.error ? near.denied() : near.status(lastNear);
  }

  function setLang(l, persist = true) {
    lang = l === 'gu' ? 'gu' : 'en';
    document.documentElement.lang = lang;
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    walk(document.body);
    const s = $('#location-search'); if (s) s.placeholder = PLACEHOLDER[lang];
    showNear();
    if (persist) { try { localStorage.setItem('as-lang', lang); } catch (e) {} }
  }

  const rad = d => d * Math.PI / 180;
  const km = (a, b, c, d) => { const x = Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };
  function findNearest() {
    const all = Array.isArray(window.CLUB_LOCATIONS) ? window.CLUB_LOCATIONS : [];
    const status = $('#near-status');
    $('#locations').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (!navigator.geolocation) { lastNear = { error: true }; showNear(); return; }
    status.hidden = false; status.textContent = lang === 'gu' ? 'તમારું સ્થાન શોધી રહ્યા છીએ…' : 'Finding your location…';
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: la, longitude: lo } = pos.coords;
      const withGeo = all.filter(l => Number.isFinite(l.lat) && Number.isFinite(l.lng));
      const best = withGeo.map(l => ({ l, d: km(la, lo, l.lat, l.lng) })).sort((x, y) => x.d - y.d)[0];
      if (!best) { lastNear = { error: true }; showNear(); return; }
      const reset = $('[data-filter="all"]'); if (reset) reset.click();
      const box = $('#location-search'); if (box && box.value) { $('#clear-search').click(); }
      lastNear = { name: best.l.name, km: Math.round(best.d) };
      showNear();
      $$('.location-card.is-nearest').forEach(c => c.classList.remove('is-nearest'));
      const card = $('#location-' + best.l.id);
      if (card) { card.classList.add('is-nearest'); card.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }, () => { lastNear = { error: true }; showNear(); }, { timeout: 10000, maximumAge: 300000 });
  }


  /* Opening scene: the 3D break plays full-screen on load (about 3 seconds), then slides away.
     Skipped for reduced-motion, data-saver and no-WebGL visitors. ?intro=0 turns it off. */
  function intro() {
    const root = document.documentElement;
    if (!root.classList.contains('intro-pending')) return;
    const sec = $('#break-experience'), trig = $('#break-photo-trigger'), play = $('#break-play'), cv = $('#break-canvas');
    let gl = null; try { gl = cv && (cv.getContext('webgl') || cv.getContext('experimental-webgl')); } catch (e) {}
    if (!sec || !trig || !play || !gl) { root.classList.remove('intro-pending'); return; }
    const hi = (navigator.hardwareConcurrency || 4) >= 6;
    // Total length in seconds (default 4.5). Try ?len=3.5, ?len=5 or ?len=7 to compare. The break itself fills all but ~1 s
    // (0.4 s hold on the logo + 0.6 s slide-away); the simulation is time-scaled to fit.
    const qLen = parseFloat(new URLSearchParams(location.search).get('len'));
    const total = Math.min(12, Math.max(2.5, Number.isFinite(qLen) ? qLen : 4.5)), action = total - 1, SIM = 3.9;
    window.BREAK_TIMING = { speed: SIM / action, duration: SIM };
    window.BREAK_QUALITY = { dpr: hi ? 1.5 : 1.25, maxw: hi ? 1500 : 1200, dprPortrait: 1.25, maxwPortrait: hi ? 620 : 520 };
    const ui = document.createElement('div');
    ui.className = 'intro-ui';
    ui.innerHTML = '<i class="intro-vig"></i><i class="intro-scrim"></i><i class="intro-grain"></i><i class="intro-bar top"></i><i class="intro-bar bot"></i>' +
      '<div class="intro-tag"><img class="as-logo" src="assets/images/as-club-logo.svg" alt="" width="1124" height="1030"><b>A.S. Pool &amp; Snooker Club</b></div>' +
      '<button type="button" class="intro-skip">Skip intro</button>' +
      '<div class="intro-brand" aria-hidden="true"><img class="as-logo" src="assets/images/as-club-logo.svg" alt="" width="1124" height="1030"><span class="intro-word"><b>A.S.</b></span><i class="intro-rule"></i><span class="intro-sub">Pool &amp; Snooker Club</span></div>';
    ui.style.setProperty('--L', String(action));
    sec.appendChild(ui);
    sec.classList.add('is-intro');
    root.classList.remove('intro-pending'); root.classList.add('intro-active');
    let ending = false, gone = false, revealed = false;
    function cleanup() {
      if (!gone || !revealed) return;
      sec.classList.remove('is-intro', 'is-leaving'); ui.remove();
      delete window.BREAK_TIMING; delete window.BREAK_QUALITY;
      const r = $('#break-reset'); if (r) r.click();   // put the section back to its "take the shot" state
    }
    function end(wait) {
      if (ending) return; ending = true;
      setTimeout(() => {
        sec.classList.add('is-leaving');
        root.classList.remove('intro-active');
        setTimeout(() => { gone = true; cleanup(); }, 650);
      }, wait);
    }
    new MutationObserver(() => {
      if (play.classList.contains('is-revealed')) { revealed = true; end(400); cleanup(); }
    }).observe(play, { attributes: true, attributeFilter: ['class'] });
    ui.querySelector('.intro-skip').addEventListener('click', () => end(0));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') end(0); });
    setTimeout(() => end(0), (total + 3) * 1000);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      trig.click();
      // Slow device? If fewer than ~9 frames drew in the first 450 ms, drop to the original lighter resolution.
      let n = 0; const t0 = performance.now(); const stage = $('#break-stage');
      (function tick(now) {
        n++;
        if (now - t0 < 450) return requestAnimationFrame(tick);
        if (n < 9 && stage && !ending) {
          window.BREAK_QUALITY = { dpr: 1, maxw: 900, dprPortrait: 1, maxwPortrait: 400 };
          stage.style.width = 'calc(100% - 1px)';
          requestAnimationFrame(() => { stage.style.width = ''; });
        }
      })(t0);
    }));
  }

  function start() {
    const all = Array.isArray(window.CLUB_LOCATIONS) ? window.CLUB_LOCATIONS : [];
    if (all.length) {
      $('#fact-clubs').textContent = String(all.length);
      $('#fact-cities').textContent = String(new Set(all.map(l => l.city)).size);
    }
    $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    $$('[data-near-me]').forEach(b => b.addEventListener('click', findNearest));
    intro();
    observer.observe(document.body, { childList: true, subtree: true });
    let saved = 'en'; try { saved = localStorage.getItem('as-lang') || 'en'; } catch (e) {}
    if (saved === 'gu') setLang('gu', false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
