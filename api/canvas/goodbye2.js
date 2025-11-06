// goodbye3.js
const { createCanvas, loadImage: loadImageOrig } = require('@napi-rs/canvas');

function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

class Goodbye3 {
  constructor() {
    this.bg = "https://raw.githubusercontent.com/Zaxerion/databased/refs/heads/main/asset/20210811-203941.jpg";
    this.avatar = "https://raw.githubusercontent.com/Zaxerion/databased/refs/heads/main/asset/rin.jpg";
    this.username = "lingz._m";
  }

  setAvatar(value) {
    this.avatar = value;
    return this;
  }

  setUsername(value) {
    this.username = value;
    return this;
  }

  setBg(value) {
    this.bg = value;
    return this;
  }

  async toAttachment() {
    const canvas = createCanvas(650, 300);
    const ctx = canvas.getContext("2d");

    let background = await loadImageOrig(this.bg);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    let usrname = this.username;
    let name = usrname.length > 10 ? usrname.substring(0, 10) + "..." : usrname;
    ctx.globalAlpha = 1;
    ctx.font = "bold 45px monospace";
    ctx.textAlign = 'left';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, 290, 338);

    ctx.globalAlpha = 1;
    ctx.font = "bold 30px monospace";
    ctx.textAlign = 'center';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, 325, 273);

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "white";
    ctx.arc(325, 150, 75, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    let avatar = await loadImageOrig(this.avatar);
    ctx.drawImage(avatar, 250, 75, 150, 150);
    ctx.restore();

    return canvas.toBuffer('image/png');
  }
}

const meta = {
  name: 'goodbye 2',
  desc: 'Generate a goodbye image',
  method: ['get', 'post'],
  category: 'canvas',
  params: [
    {
      name: 'avatar',
      description: 'URL to the avatar image',
      example: 'https://raw.githubusercontent.com/lanceajiro/Storage/refs/heads/main/1756728735205.jpg',
      required: true
    },
    {
      name: 'username',
      description: 'The username to display',
      example: 'AjiroDesu',
      required: true
    },
    {
      name: 'bg',
      description: 'URL to the background image',
      example: 'https://raw.githubusercontent.com/lanceajiro/Storage/refs/heads/main/backiee-265579-landscape.jpg',
      required: true
    }
  ]
};

async function onStart({ req, res }) {
  let avatar, username, bg;
  if (req.method === 'POST') {
    ({ avatar, username, bg } = req.body);
  } else {
    ({ avatar, username, bg } = req.query);
  }

  if (!avatar || !username || !bg) {
    return res.status(400).json({ error: 'Missing required parameters: avatar, username, bg' });
  }

  if (!isValidURL(avatar)) {
    return res.status(400).json({ error: 'Invalid avatar URL' });
  }

  if (!isValidURL(bg)) {
    return res.status(400).json({ error: 'Invalid bg URL' });
  }

  try {
    const goodbye = new Goodbye3();
    goodbye.setAvatar(avatar);
    goodbye.setUsername(username);
    goodbye.setBg(bg);

    const buffer = await goodbye.toAttachment();
    res.type('image/png').send(buffer);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

module.exports = { meta, onStart };