import { getFile, putFile } from './_github.js';

function sendCORS(res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  sendCORS(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({error:'use POST'}); return; }

  try {
    const { GH_TOKEN, GH_OWNER, GH_REPO, GH_BRANCH, STATS_PATH } = process.env;

    // read raw body
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const parsed = raw ? JSON.parse(raw) : {};
    const slug = parsed.slug || 'detroit';
    const key = parsed.key || 'total';
    const allowed = new Set(['total','A','B','C','D','E']);
    if (!allowed.has(key)) { res.status(400).json({ok:false, error:'bad key'}); return; }

    const { sha, content } = await getFile({
      owner: GH_OWNER, repo: GH_REPO, path: STATS_PATH, branch: GH_BRANCH, token: GH_TOKEN
    });

    const json = JSON.parse(content || '{}');
    if (!json[slug]) json[slug] = { total:0, A:0, B:0, C:0, D:0, E:0 };
    json[slug][key] = Number(json[slug][key] || 0) + 1;

    await putFile({
      owner: GH_OWNER, repo: GH_REPO, path: STATS_PATH, branch: GH_BRANCH, token: GH_TOKEN,
      sha, content: JSON.stringify(json, null, 2), message: `stats: ${slug}.${key} +1`
    });

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ ok:true, value: json[slug][key] });
  } catch (e) {
    res.status(200).json({ ok:false });
  }
}
