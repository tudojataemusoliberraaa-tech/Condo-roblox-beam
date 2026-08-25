export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const username = String(req.body?.username || '').trim();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'invalid_username' });
    }

    const lookupResponse = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });
    if (!lookupResponse.ok) return res.status(502).json({ error: 'roblox_unavailable' });
    const lookup = await lookupResponse.json();
    const account = lookup.data?.[0];
    if (!account) return res.status(404).json({ error: 'not_found' });

    const detailsResponse = await fetch('https://users.roblox.com/v1/users/' + encodeURIComponent(account.id));
    if (!detailsResponse.ok) return res.status(502).json({ error: 'roblox_unavailable' });
    const details = await detailsResponse.json();
    const createdAt = new Date(details.created);
    const accountAgeDays = Math.floor((Date.now() - createdAt.getTime()) / 86400000);
    const daysRemaining = Math.max(0, 80 - accountAgeDays);
    if (daysRemaining > 0) return res.status(422).json({ error: 'too_young', daysRemaining });

    return res.status(200).json({ username: account.name, accountAgeDays });
  } catch (error) {
    console.error('Roblox verification error:', error);
    return res.status(502).json({ error: 'roblox_unavailable' });
  }
}
