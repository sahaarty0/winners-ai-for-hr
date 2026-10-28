/**
 * Winners AI for HR — Premium Use Cases API
 * Standalone Google Apps Script project (NOT the existing registration deployment).
 * Deploy: Execute as Me / Anyone.
 * Never grant the public edit access to the source spreadsheet.
 * Premium content must stay in the PRIVATE PremiumCases tab, not GitHub Pages.
 */
const PREMIUM_CFG = Object.freeze({
  spreadsheetId: '16M4wVXw6G-TwLqIYPLcN7hTVOAJx8BVcgbD-Bkg-2jU',
  registrationsTab: 'Registrations',
  casesTab: 'PremiumCases',
  otpSeconds: 600,
  sessionSeconds: 21600,
  cooldownSeconds: 60,
  maxAttempts: 5
});
function premiumReply_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  try {
    const input = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!input || typeof input !== 'object') return premiumReply_({ok:false,error:'bad_request'});
    switch (input.action) {
      case 'request_code': return premiumReply_(premiumRequestCode_(input));
      case 'verify_code': return premiumReply_(premiumVerifyCode_(input));
      case 'get_cases': return premiumReply_(premiumGetCases_(input));
      default: return premiumReply_({ok:false,error:'unknown_action'});
    }
  } catch (_) {
    return premiumReply_({ok:false,error:'request_failed'});
  }
}
function premiumEmail_(value) {
  const s = String(value || '').trim().toLowerCase();
  return s.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) ? s : '';
}
function premiumHash_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value));
  return bytes.map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}
function premiumSheet_(name) {
  const sheet = SpreadsheetApp.openById(PREMIUM_CFG.spreadsheetId).getSheetByName(name);
  if (!sheet) throw new Error('Required spreadsheet tab not found');
  return sheet;
}
// Blank, Pending and Rejected all DENY. Latest explicit admin decision wins.
function premiumStatus_(email) {
  if (!email) return 'Pending';
  const sh = premiumSheet_(PREMIUM_CFG.registrationsTab);
  const last = sh.getLastRow();
  if (last < 2) return 'Pending';
  const rows = sh.getRange(2, 4, last - 1, 6).getDisplayValues(); // D=Email ... I=Premium Access
  for (let i = rows.length - 1; i >= 0; i--) {
    if (premiumEmail_(rows[i][0]) === email) {
      const status = String(rows[i][5] || '').trim();
      if (status === 'Approved' || status === 'Rejected' || status === 'Pending') return status;
    }
  }
  return 'Pending';
}
function premiumRequestCode_(input) {
  const email = premiumEmail_(input.email);
  const generic = {ok:true,message:'If your email has Approved access, a verification code will be sent.'};
  if (!email || premiumStatus_(email) !== 'Approved') return generic;
  const cache = CacheService.getScriptCache(), key = premiumHash_(email);
  if (cache.get('cool:' + key)) return generic;
  const uuidHex = Utilities.getUuid().replace(/-/g,'');
  const code = String(100000 + (parseInt(uuidHex.slice(0, 8), 16) % 900000));
  cache.put('otp:' + key, premiumHash_(email + '|' + code), PREMIUM_CFG.otpSeconds);
  cache.put('tries:' + key, '0', PREMIUM_CFG.otpSeconds);
  cache.put('cool:' + key, '1', PREMIUM_CFG.cooldownSeconds);
  MailApp.sendEmail({
    to:email,
    subject:'Winners AI for HR — Premium Access Code',
    body:'Your Winners AI for HR Premium verification code is: ' + code +
       '\n\nIt expires in 10 minutes. Do not share it.\nIf you did not request it, ignore this message.',
    name:'Winners AI for HR'
  });
  return generic;
}
function premiumVerifyCode_(input) {
  const email = premiumEmail_(input.email), code = String(input.code || '').trim();
  if (!email || !/^\d{6}$/.test(code) || premiumStatus_(email) !== 'Approved')
    return {ok:false,error:'not_verified'};
  const cache = CacheService.getScriptCache(), key = premiumHash_(email);
  const attempts = Number(cache.get('tries:' + key) || 0);
  if (attempts >= PREMIUM_CFG.maxAttempts) return {ok:false,error:'too_many_attempts'};
  const expected = cache.get('otp:' + key);
  if (!expected || expected !== premiumHash_(email + '|' + code)) {
    cache.put('tries:' + key, String(attempts + 1), PREMIUM_CFG.otpSeconds);
    return {ok:false,error:'not_verified'};
  }
  cache.remove('otp:' + key);
  cache.remove('tries:' + key);
  const token = Utilities.getUuid().replace(/-/g,'') + Utilities.getUuid().replace(/-/g,'');
  cache.put('session:' + premiumHash_(token), email, PREMIUM_CFG.sessionSeconds);
  return {ok:true,token:token,expiresIn:PREMIUM_CFG.sessionSeconds};
}
function premiumGetCases_(input) {
  const token = String(input.token || '');
  if (!/^[a-f0-9]{64}$/i.test(token)) return {ok:false,error:'access_denied'};
  const email = CacheService.getScriptCache().get('session:' + premiumHash_(token));
  if (!email || premiumStatus_(email) !== 'Approved') return {ok:false,error:'access_denied'};
  const sh = premiumSheet_(PREMIUM_CFG.casesTab), last = sh.getLastRow();
  const rows = last >= 2 ? sh.getRange(2, 2, last - 1, 1).getValues() : [];
  const cases = rows.filter(r => r[0]).map(r => JSON.parse(r[0]));
  if (cases.length !== 23 || new Set(cases.map(c=>c.id)).size !== 23)
    return {ok:false,error:'cases_not_ready'};
  return {ok:true,cases:cases};
}
