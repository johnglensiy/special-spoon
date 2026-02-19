// ─────────────────────────────────────────────
//  Olympic Results Sidebar — content script entry
//  Injects a React app into the page
// ─────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './sidebar.css';

console.log("Olympics content script loaded!");

// ── Stub data ──────────────────────────────────────────────────────────────
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
    { sport: '⛸️', event: 'Figure Skating - Free Skate (W)', winner: 'A. Liu (USA)',   medal: 'gold'   },
  ],
};
// ──────────────────────────────────────────────────────────────────────────

// ── React App ──────────────────────────────────────────────────────────────
function OlympicsSidebar() {
  const [visible, setVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'medals' | 'events'>('medals');

  const hideSidebar = useCallback(() => {
    setVisible(false);
    document.body.classList.remove('oly-body-shifted');
  }, []);

  const showSidebar = useCallback(() => {
    setVisible(true);
    document.body.classList.add('oly-body-shifted');
  }, []);

  const toggleSidebar = useCallback(() => {
    visible ? hideSidebar() : showSidebar();
  }, [visible, hideSidebar, showSidebar]);

  // Sync body class on mount
  // React.useEffect(() => {
  //   document.body.classList.add('oly-body-shifted');
  //   return () => document.body.classList.remove('oly-body-shifted');
  // }, []);

  return (
    <>
      {/* Sidebar */}
      <div id="oly-sidebar" className={`oly-sidebar${visible ? '' : ' oly-hidden'}`}>

        {/* Header */}
        <div className="oly-header">
          <div className="oly-header-left">
            <div className="oly-rings">
              <span className="oly-ring r1"></span>
              <span className="oly-ring r2"></span>
              <span className="oly-ring r3"></span>
              <span className="oly-ring r4"></span>
              <span className="oly-ring r5"></span>
            </div>
            <div className="oly-header-text">
              <div className="oly-games-name">{STUB_DATA.games}</div>
              <div className="oly-live-badge">
                <span className="oly-pulse"></span>
                {STUB_DATA.lastUpdated}
              </div>
            </div>
          </div>
          <button id="oly-close" className="oly-close-btn" title="Close" onClick={hideSidebar}>✕</button>
        </div>

        {/* Tabs */}
        <div className="oly-tabs">
          <button
            className={`oly-tab${activeTab === 'medals' ? ' oly-tab-active' : ''}`}
            onClick={() => setActiveTab('medals')}
          >
            🏅 Medal Table
          </button>
          <button
            className={`oly-tab${activeTab === 'events' ? ' oly-tab-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📋 Results
          </button>
        </div>

        {/* Medal Table */}
        <div id="oly-panel-medals" className={`oly-panel${activeTab !== 'medals' ? ' oly-panel-hidden' : ''}`}>
          <table className="oly-table">
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
              {STUB_DATA.medalTable.map(r => (
                <tr key={r.rank} className="oly-medal-row">
                  <td className="oly-rank">{r.rank}</td>
                  <td className="oly-country">{r.flag} {r.country}</td>
                  <td className="oly-gold">{r.gold}</td>
                  <td className="oly-silver">{r.silver}</td>
                  <td className="oly-bronze">{r.bronze}</td>
                  <td className="oly-total">{r.gold + r.silver + r.bronze}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Events */}
        <div id="oly-panel-events" className={`oly-panel${activeTab !== 'events' ? ' oly-panel-hidden' : ''}`}>
          <div className="oly-events-list" id="oly-events-list">
            {STUB_DATA.recentEvents.map((e, i) => (
              <div key={i} className={`oly-event-item oly-medal-${e.medal}`}>
                <span className="oly-event-sport">{e.sport}</span>
                <div className="oly-event-info">
                  <div className="oly-event-name">{e.event}</div>
                  <div className="oly-event-winner">{e.winner}</div>
                </div>
                {e.medal !== 'none' && (
                  <span className={`oly-medal-badge oly-badge-${e.medal}`}>🥇</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="oly-footer">
          Data is stubbed · Connect an API to go live
        </div>
      </div>

      {/* Toggle Pill */}
      <button id="oly-toggle-btn" className="oly-toggle-pill" title="Toggle Olympic Results" onClick={toggleSidebar}>
        🏅
      </button>
    </>
  );
}

// ── Mount React app into the page ──────────────────────────────────────────
function mount() {
  if (document.getElementById('oly-root')) return; // already mounted

  const wrapper = document.createElement('div');
  wrapper.id = 'oly-root';
  document.body.appendChild(wrapper);

  const root = createRoot(wrapper);
  root.render(<OlympicsSidebar />);
}

// ── Auto-activate ──────────────────────────────────────────────────────────
mount();

// Re-check on SPA navigation
const _pushState = history.pushState.bind(history);
history.pushState = (...args) => { _pushState(...args); mount(); };
window.addEventListener('popstate', mount);
window.addEventListener('hashchange', mount);
