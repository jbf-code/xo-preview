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
    bar.style.cssText = 'display:flex;gap:8px;margin-top:8px;';
    bar.innerHTML = '<button class="btn btn-primary btn-sm" onclick="saveMonitor(' + id + ')">Save</button>'
      + '<button class="btn btn-secondary btn-sm" onclick="cancelEdit(' + id + ', \'' + escH(origName).replace(/'/g,'') + '\', \'' + escH(origTarget).replace(/'/g,'') + '\')">Cancel</button>';
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
  var nameInput   = document.getElementById('edit-name-' + id);
  var targetInput = document.getElementById('edit-target-' + id);
  if (!nameInput || !targetInput) return;

  var name   = nameInput.value.trim();
  var target = targetInput.value.trim();
  if (!name || !target) { toast('Name and target required', false); return; }

  fetch('/monitor/api/monitors/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, target: target }),
  }).then(function(r) {
    if (r.ok) { toast('Saved'); setTimeout(refreshMonitors, 300); }
    else { toast('Save failed', false); }
  });
}

function cancelEdit(id, origName, origTarget) {
  // Just refresh to restore original state
  refreshMonitors();
  var bar = document.getElementById('edit-bar-' + id);
  if (bar) bar.remove();
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

  return '<div class="card mon-card" data-id="' + m.id + '" style="padding:16px 20px;border-left:3px solid ' + borderClr + ';transition:border-color .4s;">'
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
    + '<div class="mon-actions" style="display:flex;gap:8px;">'
    + '<button class="btn btn-secondary btn-sm" onclick="checkNow(' + m.id + ')">Check now</button>'
    + '<button class="btn btn-secondary btn-sm mon-edit-btn" onclick="editMonitor(' + m.id + ')" title="Edit name/target">✏️</button>'
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
  var n  = document.getElementById('monName').value.trim();
  var tp = document.getElementById('monType').value;
  var tg = document.getElementById('monTarget').value.trim();
  var iv = parseInt(document.getElementById('monInterval').value) || 60;
  if (!n || !tg) { toast('Name and target required', false); return; }
  fetch('/monitor/api/monitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: n, type: tp, target: tg, interval_sec: iv }),
  }).then(function (r) {
    if (r.ok) {
      toast('Monitor added');
      document.getElementById('monName').value = '';
      document.getElementById('monTarget').value = '';
      setTimeout(refreshMonitors, 500);
    } else { toast('Failed', false); }
  });
}

/* ── Notification actions ────────────────────────────────────────────────── */

function addRecipient() {
  var name  = document.getElementById('rName').value.trim();
  var tg    = document.getElementById('rTelegram').value.trim();
  var email = document.getElementById('rEmail').value.trim();
  if (!name) { toast('Name required', false); return; }
  if (!tg && !email) { toast('Telegram or email required', false); return; }
  fetch('/monitor/api/recipients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, telegram_chat_id: tg || null, email: email || null }),
  }).then(function (r) {
    if (r.ok) { toast('Recipient added'); loadNotifData(); }
    else { toast('Failed', false); }
  });
}

function delRecipient(id) {
  if (!confirm('Remove recipient?')) return;
  fetch('/monitor/api/recipients/' + id, { method: 'DELETE' })
    .then(function () { toast('Removed'); loadNotifData(); });
}

function testRecipient(id) {
  toast('Sending test...');
  fetch('/monitor/api/recipients/' + id + '/test', { method: 'POST' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var ok = d.results && d.results.every(function (x) { return x.ok; });
      toast(ok ? '✅ Test sent!' : '⚠️ Some failed — check log', ok);
      setTimeout(loadNotifData, 1500);
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
  if (!rid) { toast('Select a recipient', false); return; }
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
    fetch('/monitor/api/recipients').then(function (r) { return r.json(); }),
    fetch('/monitor/api/rules').then(function (r) { return r.json(); }),
    fetch('/monitor/api/log').then(function (r) { return r.json(); }),
    fetch('/monitor/api/monitors').then(function (r) { return r.json(); }),
  ]).then(function (res) {
    var recipRes = res[0], ruleRes = res[1], logRes = res[2], monRes = res[3];

    var rSel = document.getElementById('rulRecipient');
    if (rSel) {
      rSel.innerHTML = '<option value="">Select...</option>' +
        recipRes.map(function (r) { return '<option value="' + r.id + '">' + escH(r.name) + '</option>'; }).join('');
    }

    var rList = document.getElementById('recipientList');
    if (rList) {
      rList.innerHTML = recipRes.length
        ? recipRes.map(function (r) {
          var tg = r.telegram_chat_id ? ' <span style="color:var(--text-3);font-size:11px;">· TG: ' + r.telegram_chat_id + '</span>' : '';
          var em = r.email ? ' <span style="color:var(--text-3);font-size:11px;">· ' + escH(r.email) + '</span>' : '';
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">'
            + '<div><span style="font-size:13px;font-weight:600;color:var(--text);">' + escH(r.name) + '</span>' + tg + em + '</div>'
            + '<div style="display:flex;gap:6px;">'
            + '<button class="btn btn-secondary btn-sm" onclick="testRecipient(' + r.id + ')">Test</button>'
            + '<button class="btn btn-danger btn-sm" onclick="delRecipient(' + r.id + ')">Remove</button>'
            + '</div></div>';
        }).join('')
        : '<span style="color:var(--text-3);font-size:13px;">No recipients yet</span>';
    }

    var mSel = document.getElementById('rulMonitor');
    if (mSel) {
      mSel.innerHTML = '<option value="">All monitors</option>' +
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
