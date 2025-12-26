// geminiProxy.js
const axios = require('axios');

const meta = {
  name: 'gemini-Proxy2',
  desc: 'Send a prompt to Gemini-2 AI via UniAPIs and get a response',
  method: ['get', 'post'],
  category: 'AI',
  params: [
    {
      name: 'prompt',
      desc: 'Message to send to the AI',
      example: 'Hello',
      required: true
    }
  ]
};

async function onStart({ req, res }) {
  try {
    const body = req.method === 'POST' ? req.body : req.query;
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({
        status: false,
        error: 'Missing required parameter: prompt'
      });
    }

    const { data } = await axios.get('https://uniapis.onrender.com/api/gemini-proxy2', {
      params: { prompt }
    });

    if (!data.status) {
      return res.status(500).json({ status: false, error: 'API returned an error' });
    }

    // Retour formaté simple + option raw
    res.json({
      status: true,
      operator: data.operator,
      model: data.model,
      result: data.result,
      raw: data.raw
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = { meta, onStart };
