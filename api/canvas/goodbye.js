// goodbye.js
const { createCanvas, loadImage: loadImageOrig } = require('@napi-rs/canvas');

function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

class Goodbye2 {
  constructor() {
    this.fm = "https://raw.githubusercontent.com/Zaxerion/databased/refs/heads/main/asset/Goodbye2.png";
    this.bg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRAJUlAjJvRP_n-rV7mmb6Xf3-Zutfy8agig&usqp=CAU";
    this.avatar = "https://raw.githubusercontent.com/Zaxerion/databased/refs/heads/main/asset/rin.jpg";
    this.username = "Lenz-cmd";
    this.member = "404";
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

  setMember(value) {
    this.member = value;
    return this;
  }

  async toAttachment() {
    const canvas = createCanvas(600, 300);
    const ctx = canvas.getContext("2d");

    let background = await loadImageOrig(this.bg);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    let fram = await loadImageOrig(this.fm);
    ctx.drawImage(fram, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.rotate(-17 * Math.PI / 180);
    let avatar = await loadImageOrig(this.avatar);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.drawImage(avatar, -4, 130, 113, 113);
    ctx.strokeRect(-4, 130, 113, 113);
    ctx.restore();

    ctx.font = "bold 20px monospace";
    ctx.textAlign = 'left';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${this.member}th member`, 250, 290);

    let username = this.username;
    let namalu = username.length > 12 ? username.substring(0, 15) + "..." : username;
    ctx.globalAlpha = 1;
    ctx.font = "bold 27px monospace";
    ctx.textAlign = 'left';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(namalu, 242, 248);

    return canvas.toBuffer('image/png');
  }
}

const meta = {
  name: 'goodbye',
  desc: 'Generate a goodbye image for a group',
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
    },
    {
      name: 'member',
      description: 'The member count to display',
      example: '57',
      required: true
    }
  ]
};

async function onStart({ req, res }) {
  let avatar, username, bg, member;
  if (req.method === 'POST') {
    ({ avatar, username, bg, member } = req.body);
  } else {
    ({ avatar, username, bg, member } = req.query);
  }

  if (!avatar || !username || !bg || !member) {
    return res.status(400).json({ error: 'Missing required parameters: avatar, username, bg, member' });
  }

  if (!isValidURL(avatar)) {
    return res.status(400).json({ error: 'Invalid avatar URL' });
  }

  if (!isValidURL(bg)) {
    return res.status(400).json({ error: 'Invalid bg URL' });
  }

  try {
    const goodbye = new Goodbye2();
    goodbye.setAvatar(avatar);
    goodbye.setUsername(username);
    goodbye.setBg(bg);
    goodbye.setMember(member);

    const buffer = await goodbye.toAttachment();
    res.type('image/png').send(buffer);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

module.exports = { meta, onStart };