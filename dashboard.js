/* IAM progress dashboard — renders from window.IAM_LOG (see data/activity.js). */
(function () {
  const LOG = (window.IAM_LOG || []).filter((e) => e && e.date && e.minutes > 0);
  const CATS = window.IAM_CATEGORIES || {};
  const GOALS = window.IAM_GOALS || [];

  const DAY = 86400000;
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const hours = (min) => Math.round((min / 60) * 10) / 10;

  /* ---- aggregate by day ---- */
  const byDay = new Map();
  for (const e of LOG) {
    const bucket = byDay.get(e.date) || { minutes: 0, entries: [] };
    bucket.minutes += e.minutes;
    bucket.entries.push(e);
    byDay.set(e.date, bucket);
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);

  /* ---- heatmap: 53 weeks ending this week ---- */
  const end = new Date(today.getTime() + (6 - today.getDay()) * DAY);   // Saturday of this week
  const start = new Date(end.getTime() - (53 * 7 - 1) * DAY);           // Sunday, 53 weeks back

  const CELL = 11, GAP = 3, STEP = CELL + GAP, TOP = 18, LEFT = 26;
  const weeks = 53;
  const levelFor = (min) => (min === 0 ? 0 : min < 30 ? 1 : min < 60 ? 2 : min < 120 ? 3 : 4);

  const svgNS = "http://www.w3.org/2000/svg";
  const el = (name, attrs) => {
    const n = document.createElementNS(svgNS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  const svg = document.getElementById("heatmap");
  if (svg) {
    const width = LEFT + weeks * STEP;
    const height = TOP + 7 * STEP;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    ["Mon", "Wed", "Fri"].forEach((label, i) => {
      const t = el("text", { x: 0, y: TOP + (i * 2 + 1) * STEP + CELL - 2, class: "hm-label" });
      t.textContent = label;
      svg.appendChild(t);
    });

    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY);
        if (date > today) continue;

        const k = key(date);
        const bucket = byDay.get(k);
        const min = bucket ? bucket.minutes : 0;

        if (d === 0 && date.getMonth() !== lastMonth) {
          lastMonth = date.getMonth();
          const t = el("text", { x: LEFT + w * STEP, y: 10, class: "hm-label" });
          t.textContent = date.toLocaleString("en-US", { month: "short" });
          svg.appendChild(t);
        }

        const rect = el("rect", {
          x: LEFT + w * STEP, y: TOP + d * STEP,
          width: CELL, height: CELL, rx: 2,
          class: `hm-cell hm-l${levelFor(min)}`,
        });
        const tip = el("title");
        const pretty = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        tip.textContent = min ? `${hours(min)}h on ${pretty}` : `No activity on ${pretty}`;
        rect.appendChild(tip);
        svg.appendChild(rect);
      }
    }
  }

  /* ---- streaks ---- */
  const hasDay = (d) => byDay.has(key(d));
  let current = 0;
  let cursor = new Date(today);
  if (!hasDay(cursor)) cursor = new Date(cursor.getTime() - DAY);   // today still counts as "not broken"
  while (hasDay(cursor)) { current++; cursor = new Date(cursor.getTime() - DAY); }

  let longest = 0, run = 0, prev = null;
  for (const k of [...byDay.keys()].sort()) {
    const d = parse(k);
    run = prev && (d - prev) === DAY ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  const yearAgo = new Date(today.getTime() - 364 * DAY);
  let yearMinutes = 0, weekMinutes = 0;
  const weekStart = new Date(today.getTime() - today.getDay() * DAY);
  for (const [k, v] of byDay) {
    const d = parse(k);
    if (d >= yearAgo) yearMinutes += v.minutes;
    if (d >= weekStart) weekMinutes += v.minutes;
  }

  const setText = (id, value) => { const n = document.getElementById(id); if (n) n.textContent = value; };
  setText("stat-streak", current);
  setText("stat-longest", longest);
  setText("stat-hours", hours(yearMinutes));
  setText("stat-days", byDay.size);
  setText("stat-week", `${hours(weekMinutes)}h`);
  setText("heatmap-total", `${byDay.size} active ${byDay.size === 1 ? "day" : "days"} · ${hours(yearMinutes)}h logged in the last year`);

  /* ---- category breakdown ---- */
  const catTotals = new Map();
  for (const e of LOG) catTotals.set(e.category, (catTotals.get(e.category) || 0) + e.minutes);
  const ranked = [...catTotals.entries()].sort((a, b) => b[1] - a[1]);
  const max = ranked.length ? ranked[0][1] : 0;

  const catList = document.getElementById("category-list");
  if (catList) {
    if (!ranked.length) {
      catList.innerHTML = '<li class="empty">No sessions logged yet.</li>';
    } else {
      catList.innerHTML = ranked.map(([id, min]) => {
        const meta = CATS[id] || { label: id, color: "var(--clay)" };
        const pct = Math.round((min / max) * 100);
        return `<li>
          <div class="cat-row"><span>${meta.label}</span><span class="cat-hours">${hours(min)}h</span></div>
          <div class="bar"><i style="width:${pct}%;background:${meta.color}"></i></div>
        </li>`;
      }).join("");
    }
  }

  /* ---- goals ---- */
  const goalList = document.getElementById("goal-list");
  if (goalList) {
    goalList.innerHTML = GOALS.map((g) => {
      const current = g.auto === "hours" ? hours(yearMinutes) : g.current;
      const pct = Math.min(100, Math.round((current / g.target) * 100));
      return `<li>
        <div class="cat-row"><span>${g.label}</span><span class="cat-hours">${current} / ${g.target}${g.unit || ""}</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
      </li>`;
    }).join("");
  }

  /* ---- recent activity feed ---- */
  const feed = document.getElementById("activity-feed");
  if (feed) {
    const recent = [...LOG].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);
    if (!recent.length) {
      feed.innerHTML = `<li class="empty">
        Nothing logged yet. Add your first session in <code>data/activity.js</code> —
        or run <code>./log.sh</code> from the repo.
      </li>`;
    } else {
      feed.innerHTML = recent.map((e) => {
        const meta = CATS[e.category] || { label: e.category, color: "var(--clay)" };
        const when = parse(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const title = e.link
          ? `<a href="${e.link}" target="_blank" rel="noopener">${e.title}</a>`
          : e.title;
        return `<li>
          <span class="dot" style="background:${meta.color}"></span>
          <div>
            <p class="feed-title">${title}</p>
            <p class="feed-meta">${when} · ${meta.label} · ${hours(e.minutes)}h</p>
          </div>
        </li>`;
      }).join("");
    }
  }
})();
