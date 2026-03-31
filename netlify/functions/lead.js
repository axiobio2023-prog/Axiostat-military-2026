// netlify/functions/lead.js
exports.handler = async (event) => {
  const headersOut = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: headersOut, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: headersOut, body: JSON.stringify({ ok:false, error:'method_not_allowed' }) };

  let data = {};
  try { data = JSON.parse(event.body || '{}'); } catch(e) {
    try { data = Object.fromEntries(new URLSearchParams(event.body || '')); } catch(e2) { data = {}; }
  }

  if (data.hp_field) return { statusCode: 400, headers: headersOut, body: JSON.stringify({ ok:false, error:'honeypot' }) };

  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const country = (data.country || '').trim();
  const address = (data.address || '').trim();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !email || !emailValid) return { statusCode: 400, headers: headersOut, body: JSON.stringify({ ok:false, error:'missing_or_invalid_name_email' }) };

  const ip = (event.headers['x-forwarded-for'] || '').split(',')[0].trim() || event.headers['x-nf-client-connection-ip'] || 'unknown';
  const windowSec = parseInt(process.env.RATE_WINDOW || '60', 10);
  const maxPerWindow = parseInt(process.env.RATE_MAX || '30', 10);
  global._axi_rl = global._axi_rl || {};
  const now = Date.now();
  const rec = global._axi_rl[ip] || { ts: now, count: 0 };
  if (now - rec.ts < windowSec * 1000) {
    if (rec.count >= maxPerWindow) return { statusCode: 429, headers: headersOut, body: JSON.stringify({ ok:false, error:'rate_limited' }) };
    rec.count++;
  } else {
    rec.ts = now; rec.count = 1;
  }
  global._axi_rl[ip] = rec;

  const params = new URLSearchParams();
  params.append('xnQsjsdp', process.env.ZOHO_XNQSJSDP || '');
  params.append('xmIwtLD', process.env.ZOHO_XMIWTLD || '');
  params.append('actionType', process.env.ZOHO_ACTIONTYPE || '');
  const origin = event.headers.origin || `https://${event.headers.host || ''}`;
  const returnUrl = origin + (process.env.AXIO_ZOHO_RETURN_URL || '/?zoho_return=1');
  params.append('returnURL', returnUrl);
  params.append('ldeskuid', '');
  params.append('LDTuvid', '');
  params.append('Last Name', name);
  params.append('First Name', data.firstName || '');
  params.append('Email', email);
  params.append('Phone', phone);
  params.append('LEADCF4', country);
  params.append('Description', address);
  params.append('Secondary Lead Source', process.env.SECONDARY_LEAD_SOURCE_VALUE || 'Trainer Pack Modal');

  const zohoHost = process.env.ZOHO_API_BASE || 'https://crm.zoho.in';
  try {
    const zohoRes = await fetch(zohoHost + '/crm/WebToLeadForm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const text = await zohoRes.text();
    const status = zohoRes.status;
    if (status >= 400) return { statusCode: 502, headers: headersOut, body: JSON.stringify({ ok:false, error:'zoho_error', code: status, response: text.slice(0,500) }) };
    return { statusCode: 200, headers: headersOut, body: JSON.stringify({ ok:true, zoho_code: status, zoho_response: text.slice(0,500) }) };
  } catch (err) {
    return { statusCode: 502, headers: headersOut, body: JSON.stringify({ ok:false, error:'proxy_error', message: err.message }) };
  }
};
