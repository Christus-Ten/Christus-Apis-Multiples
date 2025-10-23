const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI({
  api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
  api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
});

const meta = {
  name: 'pastebin',
  path: '/pastebin?c=',
  category: 'tools'
};

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function onStart({ req, res }) {
  const { c } = req.query;
  
  if (!c) {
    return res.status(400).json({ error: 'Parameter "c" is required' });
  }
  
  try {
    const paste = await pastebin.createPaste({
      text: c,
      title: generateRandomString(10),
      format: null,
      privacy: 1
    });
    const raw = paste.replace("pastebin.com", "pastebin.com/raw");
    res.json({ url: raw });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };