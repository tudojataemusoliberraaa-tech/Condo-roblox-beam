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

    let avatarUrl: string | undefined;
    try {
      const thumbnailResponse = await fetch('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=' + encodeURIComponent(account.id) + '&size=150x150&format=Png&isCircular=false');
      if (thumbnailResponse.ok) {
        const thumbnail = await thumbnailResponse.json();
        avatarUrl = thumbnail.data?.[0]?.imageUrl;
      }
    } catch (error) {
      console.error('Roblox avatar lookup error:', error);
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const embed: any = {
        title: 'Conta Roblox verificada',
        color: 0x57f287,
        fields: [
          { name: 'Usuário', value: account.name, inline: true },
          { name: 'Nickname', value: details.displayName || account.name, inline: true },
          { name: 'ID da conta', value: String(account.id), inline: true },
          { name: 'Idade da conta', value: accountAgeDays + ' dias', inline: true },
        ],
        timestamp: new Date().toISOString(),
      };
      if (avatarUrl) embed.thumbnail = { url: avatarUrl };

      try {
        const discordResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ username: 'Logs do site', embeds: [embed] }),
        });
        if (!discordResponse.ok) console.error('Discord verification log failed:', discordResponse.status);
      } catch (error) {
        console.error('Discord verification log error:', error);
      }
    }

    return res.status(200).json({ username: account.name, displayName: details.displayName || account.name, accountAgeDays, avatarUrl });
  } catch (error) {
    console.error('Roblox verification error:', error);
    return res.status(502).json({ error: 'roblox_unavailable' });
  }
}
