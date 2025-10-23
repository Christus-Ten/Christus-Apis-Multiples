const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  meta: {
    name: "Pinterest Downloader",
    version: "1.0.0",
    description: "Download Pinterest videos",
    author: "rapido",
    path: "/pindl?url=",
    method: "get",
    category: "downloader"
  },
  onStart: async function({ req, res }) {
    const pinUrl = req.query.url;
    
    if (!pinUrl) {
      return res.status(400).json({ error: "Pinterest URL is required" });
    }
    
    try {
      const form = new FormData();
      form.append('action', 'pinterest_action');
      form.append('pinterest', `pinterest_video_url=${encodeURIComponent(pinUrl)}`);
      
      const response = await axios.post('https://pintodown.com/wp-admin/admin-ajax.php', form, {
        headers: {
          ...form.getHeaders(),
          'authority': 'pintodown.com',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'origin': 'https://pintodown.com',
          'referer': 'https://pintodown.com/',
          'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
          'x-requested-with': 'XMLHttpRequest'
        }
      });
      
      const data = response.data.data;
      
      res.json({
        success: true,
        mediaType: data.media_type,
        url: data.pin_url,
        poster: data.poster,
        video: data.video,
        title: data.title
      });
      
    } catch (error) {
      res.status(500).json({
        error: "Server error",
        message: error.message
      });
    }
  }
};