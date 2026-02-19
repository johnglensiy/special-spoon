console.log("Olympics content script loaded!");const l={games:"Winter Olympics 2026 · Milan–Cortina",lastUpdated:"Live · Feb 17, 2026",medalTable:[{rank:1,country:"Norway",flag:"🇳🇴",gold:14,silver:10,bronze:9},{rank:2,country:"United States",flag:"🇺🇸",gold:11,silver:8,bronze:12},{rank:3,country:"Germany",flag:"🇩🇪",gold:9,silver:7,bronze:6},{rank:4,country:"Canada",flag:"🇨🇦",gold:8,silver:10,bronze:7},{rank:5,country:"Austria",flag:"🇦🇹",gold:7,silver:5,bronze:8},{rank:6,country:"Sweden",flag:"🇸🇪",gold:6,silver:8,bronze:5},{rank:7,country:"Switzerland",flag:"🇨🇭",gold:5,silver:4,bronze:7},{rank:8,country:"Netherlands",flag:"🇳🇱",gold:4,silver:6,bronze:3}],recentEvents:[{sport:"⛷️",event:"Alpine Skiing — Downhill (M)",winner:"M. Odermatt (SUI)",medal:"gold"},{sport:"🏒",event:"Ice Hockey — Semifinal",winner:"Canada 3–1 USA",medal:"none"},{sport:"🎿",event:"Cross-Country 50km (M)",winner:"J. Klæbo (NOR)",medal:"gold"},{sport:"⛸️",event:"Figure Skating — Pairs",winner:"Sui/Han (CHN)",medal:"gold"},{sport:"🏂",event:"Snowboard Halfpipe (W)",winner:"C. Kim (USA)",medal:"gold"},{sport:"🎯",event:"Biathlon 10km Sprint (W)",winner:"L. Hauser (AUT)",medal:"gold"}]};let o=!1,s=!1,d="medals";function t(){o||(i(),n())}function c(){return l.medalTable.map(e=>`
    <tr class="oly-medal-row">
      <td class="oly-rank">${e.rank}</td>
      <td class="oly-country">${e.flag} ${e.country}</td>
      <td class="oly-gold">${e.gold}</td>
      <td class="oly-silver">${e.silver}</td>
      <td class="oly-bronze">${e.bronze}</td>
      <td class="oly-total">${e.gold+e.silver+e.bronze}</td>
    </tr>`).join("")}function y(){return l.recentEvents.map(e=>`
    <div class="oly-event-item oly-medal-${e.medal}">
      <span class="oly-event-sport">${e.sport}</span>
      <div class="oly-event-info">
        <div class="oly-event-name">${e.event}</div>
        <div class="oly-event-winner">${e.winner}</div>
      </div>
      ${e.medal!=="none"?`<span class="oly-medal-badge oly-badge-${e.medal}">🥇</span>`:""}
    </div>`).join("")}function v(){return`
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
          <div class="oly-games-name">${l.games}</div>
          <div class="oly-live-badge">
            <span class="oly-pulse"></span>
            ${l.lastUpdated}
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
          ${c()}
        </tbody>
      </table>
    </div>

    <!-- Recent Events -->
    <div id="oly-panel-events" class="oly-panel oly-panel-hidden">
      <div class="oly-events-list" id="oly-events-list">
        ${y()}
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
  </button>`}function i(){console.log("Injecting sidebar...");const e=document.createElement("div");e.id="oly-root",e.innerHTML=v(),document.body.appendChild(e),o=!0,b(),console.log("Sidebar element:",document.getElementById("olympic-sidebar"))}function b(){document.getElementById("oly-close")?.addEventListener("click",r),document.getElementById("oly-toggle-btn")?.addEventListener("click",u),document.querySelectorAll(".oly-tab").forEach(e=>{e.addEventListener("click",()=>{d=e.dataset.tab??"",document.querySelectorAll(".oly-tab").forEach(a=>a.classList.remove("oly-tab-active")),e.classList.add("oly-tab-active"),document.querySelectorAll(".oly-panel").forEach(a=>a.classList.add("oly-panel-hidden")),document.getElementById(`oly-panel-${d}`)?.classList.remove("oly-panel-hidden")})})}function n(){const e=document.getElementById("oly-sidebar");e&&(e.classList.remove("oly-hidden"),document.body.classList.add("oly-body-shifted"),s=!0)}function r(){const e=document.getElementById("oly-sidebar");e&&(e.classList.add("oly-hidden"),document.body.classList.remove("oly-body-shifted"),s=!1)}function u(){o?s?r():n():(i(),n())}t();const g=history.pushState.bind(history);history.pushState=(...e)=>{g(...e),t()};window.addEventListener("popstate",t);window.addEventListener("hashchange",t);
