const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = [];
const INITIAL_BALANCE = 100;

const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;

app.get('/create/:address', (req, res) => {
  const { address } = req.params;

  // verify that the address is a valid format
  const isValidAddress = ethAddressRegex.test(address);

  if (isValidAddress) {
    const balancePayload = {
      [address]: INITIAL_BALANCE,
    };

    balances.push(balancePayload);

    res.json({ accountCreated: true });
    return;
  }

  // still send a 200 message to be able to display error message in frontend
  res.json({
    accountCreated: false,
    error: 'Unable to sign you in at the moment. Please try again later.',
  });
});

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the wallet address and that will be the sender
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
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
