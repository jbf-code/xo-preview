/* XO Studio Monitor — client-side data layer
 * Fetches all data via API. No full page reloads — only DOM updates.
 */
'use strict';

var REFRESH_INTERVAL = 30000; // ms
var _refreshTimer = null;
var _lastRefresh = null;
var _updatedTimer = null;

/* ── Utilities ───────────────────────────────────────────────────────────── */

function escH(s) {
  var d = document.createElement('div');
  d.textContent = String(s || '');
  return d.innerHTML;
}

function toast(msg, ok) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.borderColor = ok === false ? '#e74c3c44' : 'var(--border2)';
  t.style.opacity = 1;
  setTimeout(function () { t.style.opacity = 0; }, 3000);
}

function lastSeenStr(checkedAt) {
  if (!checkedAt) return 'Never';
  var diff = Math.floor((Date.now() - new Date(checkedAt + 'Z').getTime()) / 1000);
  if (diff < 60)   return diff + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  return Math.floor(diff / 3600) + 'h ago';
}

function uptimeStr(v)  { return v === null ? '—' : v + '%'; }
function msStr(v)      { return v === null ? '—' : v + 'ms'; }

/* ── Render monitor card ─────────────────────────────────────────────────── */

/* ── Inline edit ─────────────────────────────────────────────────────────── */

function editMonitor(id) {
  var card = document.querySelector('.mon-card[data-id="' + id + '"]');
  if (!card) return;

  var nameEl   = card.querySelector('.mon-name');
  var targetEl = card.querySelector('.mon-target');
  if (!nameEl || !targetEl) return;

  var origName   = nameEl.dataset.val;
  var origTarget = targetEl.dataset.val;

  // Get current secondary values from data attributes
  var secTargetEl = card.querySelector('.mon-sec-target');
  var origSecType   = card.dataset.secType || '';
  var origSecTarget = card.dataset.secTarget || '';

  // Replace with inputs
  nameEl.innerHTML   = '<input class="input" style="padding:4px 8px;font-size:14px;font-weight:700;" value="' + escH(origName)   + '" id="edit-name-'   + id + '">';
  targetEl.innerHTML = '<input class="input" style="padding:4px 8px;font-size:11px;font-family:var(--mono);" value="' + escH(origTarget) + '" id="edit-target-' + id + '">';

  // Swap edit button to save+cancel
  var editBtn = card.querySelector('.mon-edit-btn');
  if (editBtn) editBtn.style.display = 'none';
  var actions = card.querySelector('.mon-actions');
  if (actions) {
    var bar = document.createElement('div');
    bar.id = 'edit-bar-' + id;
    bar.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);';
    bar.innerHTML = '<div style="grid-column:1/-1;font-size:11px;color:var(--text-3);font-weight:600;text-transform:uppercase;letter-spacing:.05em;">Secondary check (optional)</div>'
      + '<div><select class="input" id="edit-sec-type-' + id + '" style="padding:4px 8px;font-size:12px;">'
      + '<option value=""' + (!origSecType ? ' selected' : '') + '>None</option>'
      + '<option value="http"' + (origSecType === 'http' ? ' selected' : '') + '>HTTP</option>'
      + '<option value="tcp"'  + (origSecType === 'tcp'  ? ' selected' : '') + '>TCP</option>'
      + '</select></div>'
      + '<div><input class="input" id="edit-sec-target-' + id + '" style="padding:4px 8px;font-size:12px;font-family:var(--mono);" value="' + escH(origSecTarget) + '" placeholder="https://... or host:port"></div>'
      + '<div style="grid-column:1/-1;display:flex;gap:8px;">'
      + '<button class="btn btn-primary btn-sm" onclick="saveMonitor(' + id + ')">Save</button>'
      + '<button class="btn btn-secondary btn-sm" onclick="cancelEdit(' + id + ')">Cancel</button>'
      + '</div>';
    actions.parentNode.insertBefore(bar, actions.nextSibling);
  }

  document.getElementById('edit-name-' + id).focus();

  // Save on Enter
  ['edit-name-' + id, 'edit-target-' + id].forEach(function(elId) {
    var el = document.getElementById(elId);
    if (el) el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') saveMonitor(id);
      if (e.key === 'Escape') cancelEdit(id, origName, origTarget);
    });
  });
}

function saveMonitor(id) {
  var nameInput      = document.getElementById('edit-name-' + id);
  var targetInput    = document.getElementById('edit-target-' + id);
  var secTypeInput   = document.getElementById('edit-sec-type-' + id);
  var secTargetInput = document.getElementById('edit-sec-target-' + id);
  if (!nameInput || !targetInput) return;

  var name      = nameInput.value.trim();
  var target    = targetInput.value.trim();
  var secType   = secTypeInput   ? secTypeInput.value   : null;
  var secTarget = secTargetInput ? secTargetInput.value.trim() : null;
  if (!name || !target) { toast('Name and target required', false); return; }
  if (secType && !secTarget) { toast('Secondary target required when type is set', false); return; }

  fetch('/monitor/api/monitors/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      target: target,
      secondary_type:   secType   || null,
      secondary_target: secTarget || null,
    }),
  }).then(function(r) {
    if (r.ok) { toast('Saved'); setTimeout(refreshMonitors, 300); }
    else { toast('Save failed', false); }
  });
}

function cancelEdit(id) {
  refreshMonitors();
}

function renderCard(m) {
  var isUp      = m.last && m.last.status === 'up';
  var isDown    = m.last && m.last.status === 'down';
  var dotClr    = !m.last ? 'var(--text-3)' : isUp ? '#2ecc71' : '#e74c3c';
  var borderClr = !m.last ? 'var(--border)'  : isUp ? '#2ecc7133' : '#e74c3c44';
  var badgeSt   = !m.last
    ? 'color:var(--text-3);background:var(--surface2);border:1px solid var(--border2);'
    : isUp
      ? 'color:#2ecc71;background:#2ecc7118;border:1px solid #2ecc7133;'
      : 'color:#e74c3c;background:#e74c3c18;border:1px solid #e74c3c44;';
  var badgeTxt  = !m.last ? 'No data' : isUp ? 'UP' : 'DOWN';
  var pulse     = isDown ? 'animation:pulse-red 1.5s infinite;' : '';
  var errHtml   = m.last && m.last.error
    ? '<div style="font-size:11px;color:#e74c3c;background:#e74c3c18;border:1px solid #e74c3c33;border-radius:4px;padding:4px 8px;margin-bottom:8px;">' + escH(m.last.error) + '</div>'
    : '';
  var codeHtml  = m.last && m.last.status_code && !m.last.error
    ? '<div style="font-size:11px;color:var(--text-3);margin-bottom:8px;">HTTP ' + m.last.status_code + '</div>'
    : '';

  // Secondary check row
  var secHtml = '';
  if (m.secondary_target) {
    var secUp  = m.last && m.last.sec_status === 'up';
    var secDot = !m.last || !m.last.sec_status ? 'var(--text-3)' : secUp ? '#2ecc71' : '#e74c3c';
    var secLabel = (m.secondary_type === 'tcp' ? 'TCP' : 'HTTP') + ' → ' + m.secondary_target;
    var secMs  = m.last && m.last.sec_response_ms ? m.last.sec_response_ms + 'ms' : '';
    var secErr = m.last && m.last.sec_error ? ' — ' + m.last.sec_error : '';
    secHtml = '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-3);margin-bottom:8px;border-top:1px solid var(--border);padding-top:8px;">'
      + '<span style="width:6px;height:6px;border-radius:50%;background:' + secDot + ';flex-shrink:0;"></span>'
      + '<span style="font-family:var(--mono);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escH(secLabel) + '</span>'
      + '<span style="color:var(--text-3);flex-shrink:0;">' + secMs + escH(secErr) + '</span>'
      + '</div>';
  }

  return '<div class="card mon-card" data-id="' + m.id + '"'
    + ' data-sec-type="'   + escH(m.secondary_type   || '') + '"'
    + ' data-sec-target="' + escH(m.secondary_target || '') + '"'
    + ' style="padding:16px 20px;border-left:3px solid ' + borderClr + ';transition:border-color .4s;">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">'
    + '<span style="width:8px;height:8px;border-radius:50%;background:' + dotClr + ';flex-shrink:0;' + pulse + ';transition:background .4s;"></span>'
    + '<span class="mon-name" data-val="' + escH(m.name) + '" style="font-size:14px;font-weight:700;color:var(--text);flex:1;">' + escH(m.name) + '</span>'
    + '<span style="font-size:11px;font-weight:700;border-radius:20px;padding:2px 10px;' + badgeSt + '">' + badgeTxt + '</span>'
    + '</div>'
    + '<div class="mon-target" data-val="' + escH(m.target) + '" style="font-size:11px;color:var(--text-3);margin-bottom:10px;font-family:var(--mono);">' + escH(m.target) + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px;">'
    + stat('Uptime 24h', uptimeStr(m.uptime24h))
    + stat('Uptime 7d',  uptimeStr(m.uptime7d))
    + stat('Avg resp.',  msStr(m.avgMs))
    + stat('Checked',   lastSeenStr(m.last && m.last.checked_at))
    + '</div>'
    + codeHtml + errHtml
    + secHtml
    + '<div class="mon-actions" style="display:flex;gap:8px;">'
    + '<button class="btn btn-secondary btn-sm" onclick="checkNow(' + m.id + ')">Check now</button>'
    + '<button class="btn btn-secondary btn-sm mon-edit-btn" onclick="editMonitor(' + m.id + ')" title="Edit">✏️</button>'
    + '<button class="btn btn-danger btn-sm" onclick="delMonitor(' + m.id + ',\'' + escH(m.name).replace(/'/g, '') + '\')">Remove</button>'
    + '</div></div>';
}

function stat(label, val) {
  return '<div style="background:var(--surface2);border-radius:6px;padding:6px 8px;">'
    + '<div style="font-size:10px;color:var(--text-3);margin-bottom:2px;">' + label + '</div>'
    + '<div style="font-size:13px;font-weight:700;color:var(--text);">' + val + '</div>'
    + '</div>';
}

/* ── Refresh monitors (data only — no page reload) ───────────────────────── */

function refreshMonitors() {
  fetch('/monitor/api/monitors')
    .then(function (r) { return r.json(); })
    .then(function (monitors) {
      _lastRefresh = Date.now();
      updateUpdatedLabel();

      var grid = document.getElementById('monGrid');
      if (!grid) return;

      // Remove initial loading spinner (only present on first render)
      var loadingEl = document.getElementById('monLoading');
      if (loadingEl) loadingEl.remove();

      // Update status header
      var anyDown = monitors.some(function (m) { return m.last && m.last.status === 'down'; });
      var statusEl = document.getElementById('monStatus');
      if (statusEl) {
        var icon = monitors.length === 0 ? '⚪' : anyDown ? '🔴' : '🟢';
        var clr  = monitors.length === 0 ? 'var(--text-3)' : anyDown ? '#e74c3c' : '#2ecc71';
        var txt  = monitors.length === 0 ? 'No monitors' : anyDown ? 'Some services are down' : 'All systems operational';
        statusEl.innerHTML = icon + ' <span style="color:' + clr + ';">' + txt + '</span>'
          + ' &nbsp;&bull;&nbsp; ' + monitors.length + ' monitors';
      }

      if (monitors.length === 0) {
        grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-3);">No monitors yet — add one below</div>';
        return;
      }

      // Smart diff: update existing cards, add new, remove deleted
      var existingIds = {};
      var cards = grid.querySelectorAll('.mon-card[data-id]');
      cards.forEach(function (el) { existingIds[el.dataset.id] = el; });

      var newIds = {};
      monitors.forEach(function (m) { newIds[m.id] = m; });

      // Remove cards no longer in data
      Object.keys(existingIds).forEach(function (id) {
        if (!newIds[id]) existingIds[id].remove();
      });

      // Update or insert cards in order
      monitors.forEach(function (m, i) {
        var newHtml = renderCard(m);
        var existing = existingIds[m.id];
        if (existing) {
          // Only update inner HTML if something changed (avoid flicker)
          var tmp = document.createElement('div');
          tmp.innerHTML = newHtml;
          var newCard = tmp.firstChild;
          if (existing.innerHTML !== newCard.innerHTML) {
            existing.innerHTML = newCard.innerHTML;
            existing.style.borderLeft = newCard.style.borderLeft;
          }
        } else {
          // New card — insert at correct position
          var tmp2 = document.createElement('div');
          tmp2.innerHTML = newHtml;
          var card = tmp2.firstChild;
          var ref = grid.querySelectorAll('.mon-card')[i];
          if (ref) { grid.insertBefore(card, ref); }
          else { grid.appendChild(card); }
        }
      });
    })
    .catch(function (e) {
      console.error('[monitor] refresh failed:', e);
    });
}

function updateUpdatedLabel() {
  var el = document.getElementById('monUpdated');
  if (!el || !_lastRefresh) return;
  var secs = Math.round((Date.now() - _lastRefresh) / 1000);
  el.textContent = secs < 5 ? 'Updated just now' : 'Updated ' + secs + 's ago';
}

function startRefreshLoop() {
  refreshMonitors();
  loadNotifData();

  // Refresh monitors every 30s (data only)
  _refreshTimer = setInterval(refreshMonitors, REFRESH_INTERVAL);

  // Update "Updated Xs ago" label every 5s
  _updatedTimer = setInterval(updateUpdatedLabel, 5000);
}

/* ── Monitor actions ─────────────────────────────────────────────────────── */

function checkNow(id) {
  // Optimistic spinner on the card
  var card = document.querySelector('.mon-card[data-id="' + id + '"]');
  if (card) {
    var badge = card.querySelector('span[style*="border-radius:20px"]');
    if (badge) badge.textContent = '...';
  }
  toast('Checking...');

  fetch('/monitor/api/monitors/' + id + '/check', { method: 'POST' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      toast(d.status === 'up'
        ? '✅ Up (' + d.response_ms + 'ms)'
        : '🔴 Down: ' + (d.error || d.status_code));
      // Refresh just the data, not the page
      setTimeout(refreshMonitors, 300);
    })
    .catch(function () { toast('Check failed', false); });
}

function delMonitor(id, name) {
  if (!confirm('Remove monitor: ' + name + '?')) return;
  fetch('/monitor/api/monitors/' + id, { method: 'DELETE' })
    .then(function () {
      toast('Removed');
      // Remove card from DOM immediately
      var card = document.querySelector('.mon-card[data-id="' + id + '"]');
      if (card) card.remove();
      refreshMonitors();
    });
}

function addMonitor() {
  var n         = document.getElementById('monName').value.trim();
  var tp        = document.getElementById('monType').value;
  var tg        = document.getElementById('monTarget').value.trim();
  var iv        = parseInt(document.getElementById('monInterval').value) || 60;
  var secType   = document.getElementById('monSecType')   ? document.getElementById('monSecType').value   : null;
  var secTarget = document.getElementById('monSecTarget') ? document.getElementById('monSecTarget').value.trim() : null;
  if (!n || !tg) { toast('Name and target required', false); return; }
  if (secType && !secTarget) { toast('Secondary target required', false); return; }
  fetch('/monitor/api/monitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: n, type: tp, target: tg, interval_sec: iv, secondary_type: secType || null, secondary_target: secTarget || null }),
  }).then(function (r) {
    if (r.ok) {
      toast('Monitor added');
      document.getElementById('monName').value = '';
      document.getElementById('monTarget').value = '';
      if (document.getElementById('monSecTarget')) document.getElementById('monSecTarget').value = '';
      setTimeout(refreshMonitors, 500);
    } else { toast('Failed', false); }
  });
}

/* ── Notification actions ────────────────────────────────────────────────── */

function testUser(id) {
  toast('Sender test...');
  fetch('/monitor/api/recipients/' + id + '/test', { method: 'POST' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var ok = d.results && d.results.every(function (x) { return x.ok; });
      toast(ok ? '✅ Test sendt!' : '⚠️ Fejl — tjek log', ok);
    });
}

function addRule() {
  var rid = parseInt(document.getElementById('rulRecipient').value);
  var mid = document.getElementById('rulMonitor').value || null;
  var cd  = parseInt(document.getElementById('rulCooldown').value) || 15;
  var qs  = document.getElementById('rulQS').value;
  var qe  = document.getElementById('rulQE').value;
  var od  = document.getElementById('rulDown').checked ? 1 : 0;
  var orv = document.getElementById('rulRecov').checked ? 1 : 0;
  if (!rid) { toast('Vælg en bruger', false); return; }
  fetch('/monitor/api/rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient_id: rid, monitor_id: mid, cooldown_min: cd, quiet_start: qs, quiet_end: qe, on_down: od, on_recovery: orv }),
  }).then(function (r) {
    if (r.ok) { toast('Rule added'); loadNotifData(); }
    else { toast('Failed', false); }
  });
}

function delRule(id) {
  if (!confirm('Remove rule?')) return;
  fetch('/monitor/api/rules/' + id, { method: 'DELETE' })
    .then(function () { toast('Removed'); loadNotifData(); });
}

/* ── Load notification panel data ────────────────────────────────────────── */

function loadNotifData() {
  Promise.all([
    fetch('/monitor/api/users').then(function (r) { return r.json(); }),
    fetch('/monitor/api/rules').then(function (r) { return r.json(); }),
    fetch('/monitor/api/log').then(function (r) { return r.json(); }),
    fetch('/monitor/api/monitors').then(function (r) { return r.json(); }),
  ]).then(function (res) {
    var userRes = res[0], ruleRes = res[1], logRes = res[2], monRes = res[3];

    // Recipient dropdown for alert rules (only users with telegram)
    var rSel = document.getElementById('rulRecipient');
    if (rSel) {
      var usersWithTg = userRes.filter(function (u) { return u.id && u.telegram_chat_id; });
      rSel.innerHTML = '<option value="">Vælg...</option>' +
        usersWithTg.map(function (u) { return '<option value="' + u.id + '">' + escH(u.name) + '</option>'; }).join('');
    }

    // Users panel (read-only)
    var uList = document.getElementById('userList');
    if (uList) {
      uList.innerHTML = userRes.length
        ? userRes.map(function (u) {
          var tgBadge = u.telegram_chat_id
            ? '<span style="font-size:11px;color:#2ecc71;background:#2ecc7118;border:1px solid #2ecc7133;border-radius:12px;padding:2px 8px;">TG: ' + escH(u.telegram_chat_id) + '</span>'
            : '<span style="font-size:11px;color:var(--text-3);">Intet Telegram</span>';
          var testBtn = u.id && u.telegram_chat_id
            ? '<button class="btn btn-secondary btn-sm" onclick="testUser(' + u.id + ')">Test</button>'
            : '';
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">'
            + '<div><span style="font-size:13px;font-weight:600;color:var(--text);">' + escH(u.name) + '</span>'
            + ' <span style="color:var(--text-3);font-size:12px;">' + escH(u.email) + '</span><br>'
            + '<span style="margin-top:4px;display:inline-block;">' + tgBadge + '</span></div>'
            + testBtn
            + '</div>';
        }).join('')
        : '<span style="color:var(--text-3);font-size:13px;">Ingen brugere</span>';
    }

    var mSel = document.getElementById('rulMonitor');
    if (mSel) {
      mSel.innerHTML = '<option value="">Alle monitors</option>' +
        monRes.map(function (m) { return '<option value="' + m.id + '">' + escH(m.name) + '</option>'; }).join('');
    }

    var monMap = {};
    monRes.forEach(function (m) { monMap[m.id] = m.name; });

    var ruleList = document.getElementById('ruleList');
    if (ruleList) {
      ruleList.innerHTML = ruleRes.length
        ? ruleRes.map(function (r) {
          var mn = r.monitor_id ? escH(monMap[r.monitor_id] || '?') : 'All';
          var fl = (r.on_down ? ' · DOWN' : '') + (r.on_recovery ? ' · Recovery' : '');
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">'
            + '<div><span style="font-size:13px;font-weight:600;color:var(--text);">' + escH(r.recipient_name) + '</span>'
            + ' <span style="color:var(--text-3);font-size:12px;">→ ' + mn + '</span><br>'
            + '<span style="color:var(--text-3);font-size:11px;">Cooldown ' + r.cooldown_min + 'min · Quiet ' + r.quiet_start + '–' + r.quiet_end + fl + '</span></div>'
            + '<button class="btn btn-danger btn-sm" onclick="delRule(' + r.id + ')">Remove</button>'
            + '</div>';
        }).join('')
        : '<span style="color:var(--text-3);font-size:13px;">No rules yet</span>';
    }

    var logEl = document.getElementById('notifLog');
    if (logEl) {
      logEl.innerHTML = logRes.length
        ? logRes.map(function (l) {
          var t   = new Date(l.sent_at + 'Z').toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });
          var ev  = l.event === 'down'
            ? '<span style="color:#e74c3c;font-weight:700;">🔴 DOWN</span>'
            : '<span style="color:#2ecc71;font-weight:700;">🟢 UP</span>';
          var ch  = l.channel === 'telegram' ? '📱' : '📧';
          var err = l.error ? ' <span style="color:#e74c3c;font-size:11px;">' + escH(l.error) + '</span>' : '';
          return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px;">'
            + ev + ' ' + ch
            + ' <strong style="color:var(--text);">' + escH(l.monitor_name || '?') + '</strong>'
            + ' <span style="color:var(--text-3);flex:1;overflow:hidden;text-overflow:ellipsis;">→ ' + escH(l.message || '') + '</span>'
            + err
            + ' <span style="color:var(--text-3);white-space:nowrap;flex-shrink:0;">' + t + '</span></div>';
        }).join('')
        : '<span style="color:var(--text-3);font-size:13px;">No notifications sent yet</span>';
    }
  }).catch(function (e) {
    console.error('[monitor] loadNotifData error:', e);
  });
}

/* ── Boot ────────────────────────────────────────────────────────────────── */
startRefreshLoop();
