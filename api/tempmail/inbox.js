const axios = require('axios');

const meta = {
    name: "Inbox",
    version: "1.0.0",
    author: "jm",
    category: "tempmail",
    method: "GET",
    path: "/tempmail/inbox?email="
};

async function onStart({ res, req }) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter required" });

    try {
        const response = await axios.get(`https://api.internal.temp-mail.io/api/v3/email/${email}/messages`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch inbox",
            details: error.response?.data || error.message
        });
    }
}

module.exports = { meta, onStart };
