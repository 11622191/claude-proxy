export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  try {
    const { sender, content, replyTo } = req.query;

    if (!sender || !content) {
      return res.status(400).json({ error: 'Missing sender or content' });
    }

    // URL del tuo server
    const targetUrl = 'http://saspace.ddns.net:8088/api/Communication/send-message';
    const params = new URLSearchParams({ sender, content });
    if (replyTo) params.append('replyTo', replyTo);

    // Chiamata al tuo server
    const response = await fetch(`${targetUrl}?${params.toString()}`);
    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: `Proxy: ${data.message}`,
      messageId: data.messageId
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
