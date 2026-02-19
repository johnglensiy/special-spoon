// ─────────────────────────────────────────────
//  Olympic Results Sidebar — content.js
//  Injected into every page; activates when
//  the URL or page title matches olympic keywords
// ─────────────────────────────────────────────
import './sidebar.css'

console.log("Olympics content script loaded!");

// const OLYMPIC_KEYWORDS = [
//   'olympics', 'olympic games', 'winter olympics', 'summer olympics',
//   'olympic results', 'olympic medals', 'olympic 2024', 'olympic 2026',
//   'paris 2024', 'milan cortina', 'los angeles 2028'
// ];

// ── Stub data (replace with real API calls later) ──────────────────────────
const STUB_DATA = {
  games: 'Winter Olympics 2026 · Milan–Cortina',
  lastUpdated: 'Live · Feb 17, 2026',
  medalTable: [
    { rank: 1, country: 'Norway',        flag: '🇳🇴', gold: 14, silver: 10, bronze: 9  },
    { rank: 2, country: 'United States', flag: '🇺🇸', gold: 11, silver: 8,  bronze: 12 },
    { rank: 3, country: 'Germany',       flag: '🇩🇪', gold: 9,  silver: 7,  bronze: 6  },
    { rank: 4, country: 'Canada',        flag: '🇨🇦', gold: 8,  silver: 10, bronze: 7  },
    { rank: 5, country: 'Austria',       flag: '🇦🇹', gold: 7,  silver: 5,  bronze: 8  },
    { rank: 6, country: 'Sweden',        flag: '🇸🇪', gold: 6,  silver: 8,  bronze: 5  },
    { rank: 7, country: 'Switzerland',   flag: '🇨🇭', gold: 5,  silver: 4,  bronze: 7  },
    { rank: 8, country: 'Netherlands',   flag: '🇳🇱', gold: 4,  silver: 6,  bronze: 3  },
  ],
  recentEvents: [
    { sport: '⛷️', event: 'Alpine Skiing — Downhill (M)', winner: 'M. Odermatt (SUI)', medal: 'gold'   },
    { sport: '🏒', event: 'Ice Hockey — Semifinal',       winner: 'Canada 3–1 USA',    medal: 'none'   },
    { sport: '🎿', event: 'Cross-Country 50km (M)',       winner: 'J. Klæbo (NOR)',     medal: 'gold'   },
    { sport: '⛸️', event: 'Figure Skating — Pairs',       winner: 'Sui/Han (CHN)',      medal: 'gold'   },
    { sport: '🏂', event: 'Snowboard Halfpipe (W)',       winner: 'C. Kim (USA)',        medal: 'gold'   },
    { sport: '🎯', event: 'Biathlon 10km Sprint (W)',     winner: 'L. Hauser (AUT)',    medal: 'gold'   },
  ]
};
// ──────────────────────────────────────────────────────────────────────────

let sidebarInjected = false;
let sidebarVisible  = false;
let activeTab       = 'medals'; // 'medals' | 'events'

// ── Detection ──────────────────────────────────────────────────────────────
// function isOlympicPage() {
//   const text = (document.title + ' ' + window.location.href).toLowerCase();
//   return OLYMPIC_KEYWORDS.some(kw => text.includes(kw));
// }

function checkAndActivate() {
  if (!sidebarInjected) {
    injectSidebar();
    showSidebar();
  }
}

// ── Build sidebar HTML ─────────────────────────────────────────────────────
function buildMedalRows() {
  return STUB_DATA.medalTable.map(r => `
    <tr class="oly-medal-row">
      <td class="oly-rank">${r.rank}</td>
      <td class="oly-country">${r.flag} ${r.country}</td>
      <td class="oly-gold">${r.gold}</td>
      <td class="oly-silver">${r.silver}</td>
      <td class="oly-bronze">${r.bronze}</td>
      <td class="oly-total">${r.gold + r.silver + r.bronze}</td>
    </tr>`).join('');
}

function buildEventRows() {
  return STUB_DATA.recentEvents.map(e => `
    <div class="oly-event-item oly-medal-${e.medal}">
      <span class="oly-event-sport">${e.sport}</span>
      <div class="oly-event-info">
        <div class="oly-event-name">${e.event}</div>
        <div class="oly-event-winner">${e.winner}</div>
      </div>
      ${e.medal !== 'none' ? `<span class="oly-medal-badge oly-badge-${e.medal}">🥇</span>` : ''}
    </div>`).join('');
}

function buildSidebarHTML() {
  return `
  <div id="oly-sidebar" class="oly-sidebar">

    <!-- Header -->
    <div class="oly-header">
      <div class="oly-header-left">
        <div class="oly-rings">
          <span class="oly-ring r1"></span>
          <span class="oly-ring r2"></span>
          <span class="oly-ring r3"></span>
          <span class="oly-ring r4"></span>
          <span class="oly-ring r5"></span>
        </div>
        <div class="oly-header-text">
          <div class="oly-games-name">${STUB_DATA.games}</div>
          <div class="oly-live-badge">
            <span class="oly-pulse"></span>
            ${STUB_DATA.lastUpdated}
          </div>
        </div>
      </div>
      <button id="oly-close" class="oly-close-btn" title="Close">✕</button>
    </div>

    <!-- Tabs -->
    <div class="oly-tabs">
      <button class="oly-tab oly-tab-active" data-tab="medals">🏅 Medal Table</button>
      <button class="oly-tab" data-tab="events">📋 Results</button>
    </div>

    <!-- Medal Table -->
    <div id="oly-panel-medals" class="oly-panel">
      <table class="oly-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Country</th>
            <th title="Gold">🥇</th>
            <th title="Silver">🥈</th>
            <th title="Bronze">🥉</th>
            <th>Tot</th>
          </tr>
        </thead>
        <tbody id="oly-medal-body">
          ${buildMedalRows()}
        </tbody>
      </table>
    </div>

    <!-- Recent Events -->
    <div id="oly-panel-events" class="oly-panel oly-panel-hidden">
      <div class="oly-events-list" id="oly-events-list">
        ${buildEventRows()}
      </div>
    </div>

    <!-- Footer -->
    <div class="oly-footer">
      Data is stubbed · Connect an API to go live
    </div>
  </div>

  <!-- Toggle Pill (always visible) -->
  <button id="oly-toggle-btn" class="oly-toggle-pill" title="Toggle Olympic Results">
    🏅
  </button>`;
}

// ── Inject & control ───────────────────────────────────────────────────────
function injectSidebar() {
  console.log("Injecting sidebar...");
  const wrapper = document.createElement('div');
  wrapper.id = 'oly-root';
  wrapper.innerHTML = buildSidebarHTML();
  document.body.appendChild(wrapper);
  sidebarInjected = true;
  bindEvents();
  console.log("Sidebar element:", document.getElementById("olympic-sidebar"));

}

function bindEvents() {
  document.getElementById('oly-close')?.addEventListener('click', hideSidebar);
  document.getElementById('oly-toggle-btn')?.addEventListener('click', toggleSidebar);

  document.querySelectorAll<HTMLElement>('.oly-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab ?? '';
      document.querySelectorAll('.oly-tab').forEach(t => t.classList.remove('oly-tab-active'));
      btn.classList.add('oly-tab-active');
      document.querySelectorAll('.oly-panel').forEach(p => p.classList.add('oly-panel-hidden'));
      document.getElementById(`oly-panel-${activeTab}`)?.classList.remove('oly-panel-hidden');
    });
  });
}

function showSidebar() {
  const sidebar = document.getElementById('oly-sidebar');
  if (!sidebar) return;
  sidebar.classList.remove('oly-hidden');
  document.body.classList.add('oly-body-shifted');
  sidebarVisible = true;
}

function hideSidebar() {
  const sidebar = document.getElementById('oly-sidebar');
  if (!sidebar) return;
  sidebar.classList.add('oly-hidden');
  document.body.classList.remove('oly-body-shifted');
  sidebarVisible = false;
}

function toggleSidebar() {
  if (!sidebarInjected) {
    injectSidebar();
    showSidebar();
  } else {
    sidebarVisible ? hideSidebar() : showSidebar();
  }
}

// ── Listen for messages from popup / background ────────────────────────────
// chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
//   if (msg.action === 'toggle') {
//     toggleSidebar();
//     sendResponse({ visible: sidebarVisible });
//   }
//   if (msg.action === 'updateData' && msg.data) {
//     // Future hook: populate sidebar with live data
//     // updateSidebarData(msg.data);
//     sendResponse({ ok: true });
//   }
// });

// ── Auto-activate on matching pages ───────────────────────────────────────
checkAndActivate();

// Also re-check on SPA navigation (pushState, hashchange)
const _pushState = history.pushState.bind(history);
history.pushState = (...args) => { _pushState(...args); checkAndActivate(); };
window.addEventListener('popstate', checkAndActivate);
window.addEventListener('hashchange', checkAndActivate);
