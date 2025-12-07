const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const username = "YOUR_GITHUB_USERNAME";
const repo = "esp32-servo";
const filePath = "command.json";

app.post("/update", async (req, res) => {
  const { servo_angle, chaos_mode } = req.body;
  const token = process.env.GITHUB_TOKEN;

  const getResp = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`);
  const getData = await getResp.json();
  const sha = getData.sha;

  const content = Buffer.from(JSON.stringify({ servo_angle, chaos_mode }, null, 2)).toString("base64");

  const updateResp = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update servo command",
      content: content,
      sha: sha
    })
  });

  const updateData = await updateResp.json();
  res.send(updateData);
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
