export async function getFile({owner, repo, path, branch, token}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`;
  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    }
  });
  if (!r.ok) throw new Error('getFile failed: ' + r.status);
  const j = await r.json();
  const content = Buffer.from(j.content, 'base64').toString('utf8');
  return { sha: j.sha, content };
}

export async function putFile({owner, repo, path, branch, token, sha, content, message}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const body = {
    message: message || `update ${path}`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    sha,
    branch
  };
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('putFile failed: ' + r.status);
  return r.json();
}
