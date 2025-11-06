// gfx1.js
const { createCanvas, loadImage: loadImageOrig } = require('@napi-rs/canvas');

function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

class Gfx1 {
  constructor() {
    this.bg = "https://ia903208.us.archive.org/28/items/bg-gfx-1/Bg-gfx1.jpg";
    this.fm = "https://archive.org/download/20210820-161743/20210820-161743.png";
    this.nama = "lingz";
  }

  setName(value) {
    this.nama = value;
    return this;
  }

  setBg(value) {
    this.bg = value;
    return this;
  }

  setFm(value) {
    this.fm = value;
    return this;
  }

  async toAttachment() {
    const canvas = createCanvas(600, 600);
    const ctx = canvas.getContext("2d");
    let usr = this.nama;
    let name = usr.length > 8 ? usr.substring(0, 8) + " " : usr;
    let nama = usr.length > 6 ? usr.substring(0, 6) + " " : usr;

    let background = await loadImageOrig(this.bg);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "120px Built";
    ctx.textAlign = 'left';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(nama, 20, 190);
    ctx.fillStyle = "#e2e2e2";
    ctx.fillText(nama, 20, 290);
    ctx.fillStyle = "#d7d7d7";
    ctx.fillText(nama, 20, 390);
    ctx.fillStyle = "#c0c2c1";
    ctx.fillText(nama, 20, 490);
    ctx.fillStyle = "#a4a4a6";
    ctx.fillText(nama, 20, 590);

    let frame = await loadImageOrig(this.fm);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 30;
    ctx.shadowColor = '#000000';
    ctx.textAlign = 'center';
    ctx.fillStyle = "#4f5669";
    ctx.fillText(name, 260, 590);

    return canvas.toBuffer('image/png');
  }
}

const meta = {
  name: 'gfx1',
  desc: 'Generate a GFX image',
  method: ['get', 'post'],
  category: 'canvas',
  params: [
    {
      name: 'name',
      description: 'The name to display',
      example: 'AjiroDesu',
      required: true
    },
    {
      name: 'bg',
      description: 'URL to the background image',
      example: 'https://ia903208.us.archive.org/28/items/bg-gfx-1/Bg-gfx1.jpg',
      required: true
    },
    {
      name: 'fm',
      description: 'URL to the frame image',
      example: 'https://archive.org/download/20210820-161743/20210820-161743.png',
      required: true
    }
  ]
};

async function onStart({ req, res }) {
  let name, bg, fm;
  if (req.method === 'POST') {
    ({ name, bg, fm } = req.body);
  } else {
    ({ name, bg, fm } = req.query);
  }

  if (!name || !bg || !fm) {
    return res.status(400).json({ error: 'Missing required parameters: name, bg, fm' });
  }

  if (!isValidURL(bg)) {
    return res.status(400).json({ error: 'Invalid bg URL' });
  }

  if (!isValidURL(fm)) {
    return res.status(400).json({ error: 'Invalid fm URL' });
  }

  try {
    const gfx = new Gfx1();
    gfx.setName(name);
    gfx.setBg(bg);
    gfx.setFm(fm);

    const buffer = await gfx.toAttachment();
    res.type('image/png').send(buffer);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

module.exports = { meta, onStart };