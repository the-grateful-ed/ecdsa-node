const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0462ade16716c669850f4357bdb26b2e7bb301e16873ec7b0bb8ab32428f151c91c8b3ba20c703d2ad4a09396e9be9a7afdda008522fd0cbab0ce5e72f02f8bc2c": 100,
  "049dd0fc59bc880602454a261eab163aa10020bfedea7ab9fddd27c16b6ca79b16dba887324417307dac31b85a1db61dd0e6d7ef8532130ba0c01bfe9fa420b2d3": 50,
  "04b7ba47a901c284d1434791a955a118b4350a019338e256eda51f6f0d92ac6d057df5f5823dcc4002110e9fdd85b12a30f968d25303ba1ee312be7998e4d390a6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
