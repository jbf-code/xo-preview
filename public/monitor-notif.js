/* XO Studio Monitor — notification panel JS */
'use strict';

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

/* ── Monitor actions ─────────────────────────────────────────────────────── */

function checkNow(id) {
  toast('Checking...');
  fetch('/monitor/api/monitors/' + id + '/check', { method: 'POST' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      toast(d.status === 'up' ? '✅ Up (' + d.response_ms + 'ms)' : '🔴 Down: ' + (d.error || d.status_code));
      setTimeout(function () { location.reload(); }, 1200);
    })
    .catch(function () { toast('Check failed', false); });
}

function delMonitor(id, name) {
  if (!confirm('Remove monitor: ' + name + '?')) return;
  fetch('/monitor/api/monitors/' + id, { method: 'DELETE' })
    .then(function () { toast('Removed'); setTimeout(function () { location.reload(); }, 600); });
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
    if (r.ok) { toast('Monitor added'); setTimeout(function () { location.reload(); }, 800); }
    else { toast('Failed', false); }
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

/* ── Load notification data ──────────────────────────────────────────────── */

function loadNotifData() {
  Promise.all([
    fetch('/monitor/api/recipients').then(function (r) { return r.json(); }),
    fetch('/monitor/api/rules').then(function (r) { return r.json(); }),
    fetch('/monitor/api/log').then(function (r) { return r.json(); }),
    fetch('/monitor/api/monitors').then(function (r) { return r.json(); }),
  ]).then(function (res) {
    var recipRes = res[0], ruleRes = res[1], logRes = res[2], monRes = res[3];

    /* Recipients select */
    var rSel = document.getElementById('rulRecipient');
    if (rSel) {
      rSel.innerHTML = '<option value="">Select...</option>' +
        recipRes.map(function (r) { return '<option value="' + r.id + '">' + escH(r.name) + '</option>'; }).join('');
    }

    /* Recipients list */
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

    /* Monitor select for rules */
    var mSel = document.getElementById('rulMonitor');
    if (mSel) {
      var monMap = {};
      monRes.forEach(function (m) { monMap[m.id] = m.name; });
      mSel.innerHTML = '<option value="">All monitors</option>' +
        monRes.map(function (m) { return '<option value="' + m.id + '">' + escH(m.name) + '</option>'; }).join('');
    }

    /* Rules list */
    var ruleList = document.getElementById('ruleList');
    if (ruleList) {
      var monMap2 = {};
      monRes.forEach(function (m) { monMap2[m.id] = m.name; });
      ruleList.innerHTML = ruleRes.length
        ? ruleRes.map(function (r) {
          var mn = r.monitor_id ? escH(monMap2[r.monitor_id] || '?') : 'All';
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

    /* Notification log */
    var logEl = document.getElementById('notifLog');
    if (logEl) {
      logEl.innerHTML = logRes.length
        ? logRes.map(function (l) {
          var t  = new Date(l.sent_at + 'Z').toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });
          var ev = l.event === 'down' ? '<span style="color:#e74c3c;font-weight:700;">🔴 DOWN</span>' : '<span style="color:#2ecc71;font-weight:700;">🟢 UP</span>';
          var ch = l.channel === 'telegram' ? '📱' : '📧';
          var err = l.error ? ' <span style="color:#e74c3c;font-size:11px;">' + escH(l.error) + '</span>' : '';
          return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px;">'
            + ev + ' ' + ch + ' <strong style="color:var(--text);">' + escH(l.monitor_name || '?') + '</strong>'
            + ' <span style="color:var(--text-3);flex:1;overflow:hidden;text-overflow:ellipsis;">→ ' + escH(l.message || '') + '</span>'
            + err + ' <span style="color:var(--text-3);white-space:nowrap;flex-shrink:0;">' + t + '</span></div>';
        }).join('')
        : '<span style="color:var(--text-3);font-size:13px;">No notifications sent yet</span>';
    }
  }).catch(function (e) {
    console.error('loadNotifData error:', e);
  });
}

/* ── Init ────────────────────────────────────────────────────────────────── */
loadNotifData();
setTimeout(function () { location.reload(); }, 30000);
