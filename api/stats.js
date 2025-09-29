import { getFile } from './_github.js';

export default async function handler(req, res) {
  try {
    const { GH_TOKEN, GH_OWNER, GH_REPO, GH_BRANCH, STATS_PATH } = process.env;
    const { slug = 'detroit' } = req.query || {};

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');

    const { content } = await getFile({
      owner: GH_OWNER, repo: GH_REPO, path: STATS_PATH, branch: GH_BRANCH, token: GH_TOKEN
    });

    const json = JSON.parse(content || '{}');
    const data = json[slug] || { total:0, A:0, B:0, C:0, D:0, E:0 };
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ total:0, A:0, B:0, C:0, D:0, E:0 });
  }
}
