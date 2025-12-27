// cmdNano.js
const axios = require('axios');

const meta = {
  name: 'nano',
  desc: 'Generate AI images via ZetBot Nano API',
  category: 'Image',
  params: [
    {
      name: 'prompt',
      desc: 'Text prompt to generate images',
      required: true
    },
    {
      name: 'seed',
      desc: 'Optional seed for generation',
      required: false
    },
    {
      name: 'ref',
      desc: 'Optional reference string',
      required: false
    },
    {
      name: 'ref1',
      desc: 'Optional second reference string',
      required: false
    }
  ]
};

async function onStart({ req, res }) {
  try {
    const prompt = req.method === 'POST' ? req.body.prompt : req.query.prompt;
    const seed = req.method === 'POST' ? req.body.seed : req.query.seed;
    const ref = req.method === 'POST' ? req.body.ref : req.query.ref;
    const ref1 = req.method === 'POST' ? req.body.ref1 : req.query.ref1;

    if (!prompt) {
      return res.status(400).json({ status: false, error: 'Prompt is required' });
    }

    const url = `https://zetbot-page.onrender.com/api/nano?prompt=${encodeURIComponent(prompt)}${seed ? `&seed=${seed}` : ''}${ref ? `&ref=${ref}` : ''}${ref1 ? `&ref1=${ref1}` : ''}`;

    const { data } = await axios.get(url);

    if (!data || !data.image_link) {
      return res.status(500).json({
        status: false,
        error: 'API returned no image'
      });
    }

    res.json({
      status: true,
      operator: 'Christus',
      count: 1,
      images: [
        {
          image_link: data.image_link,
          status: 'success'
        }
      ]
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = { meta, onStart };
