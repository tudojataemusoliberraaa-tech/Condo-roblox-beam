
function getHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getDevice(userAgent: string) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iPhone/iPad (iOS)';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'MacBook/Mac';
  if (/Windows/i.test(userAgent)) return 'Windows PC';
  if (/Linux/i.test(userAgent)) return 'Linux PC';
  return 'Dispositivo desconhecido';
}

function getCity(value: string | string[] | undefined) {
  const city = getHeader(value);
  if (!city) return 'Localização indisponível';
  try { return decodeURIComponent(city); } catch { return city; }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Discord webhook is not configured' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim();
  const ip = rawIp ? rawIp.replace(/\d+$/, '0') : 'indisponível';
  const userAgent = String(req.headers['user-agent'] || 'indisponível').slice(0, 300);
  const referer = String(req.headers.referer || 'acesso direto').slice(0, 300);
  const country = String(req.headers['x-vercel-ip-country'] || 'desconhecido');
  const city = getCity(req.headers['x-vercel-ip-city']);
  const device = getDevice(userAgent);

  const payload = {
    username: 'Logs do site',
    embeds: [{
      title: 'Nova entrada no site',
      color: 0x5865f2,
      fields: [
        { name: 'Página', value: String(req.headers['referer'] || '/').slice(0, 300), inline: true },
        { name: 'Localização', value: city + ' (' + country + ')', inline: true },
        { name: 'IP anonimizado', value: ip, inline: true },
        { name: 'Dispositivo', value: device, inline: true },
        { name: 'Navegador', value: userAgent, inline: false },
        { name: 'Origem', value: referer, inline: false },
      ],
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', discordResponse.status);
      return res.status(502).json({ error: 'Notification failed' });
    }
  } catch (error) {
    console.error('Discord webhook error:', error);
    return res.status(502).json({ error: 'Notification failed' });
  }

  return res.status(204).end();
}
