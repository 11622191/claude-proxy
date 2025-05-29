// File: api/claude-message.js aggiornato

// Buffer globale per accumulare caratteri
let messageBuffer = '';

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

    const terminatorChar = 'CCCC';
    
    if (content === terminatorChar) {
      // Completa il messaggio - invia il buffer completo
      if (messageBuffer.length > 0) {
        const targetUrl = 'http://saspace.ddns.net:8088/api/Communication/send-smart';
        const params = new URLSearchParams({ 
          sender, 
          content: messageBuffer  // Invia il messaggio completo!
        });
        if (replyTo) params.append('replyTo', replyTo);

        const response = await fetch(`${targetUrl}?${params.toString()}`);
        const data = await response.json();

        // Svuota il buffer
        const completeMessage = messageBuffer;
        messageBuffer = '';

        return res.status(200).json({
          success: true,
          message: `Complete message sent: '${completeMessage}'`,
          messageId: data.messageId
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'No message to complete',
          messageId: null
        });
      }
    } else {
      // Aggiungi carattere al buffer (non inviare ancora)
      messageBuffer += content;
      
      return res.status(200).json({
        success: true,
        message: `Character '${content}' added to buffer`,
        messageId: null
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
