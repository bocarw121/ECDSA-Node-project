const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const owner = {};

const recipients = [
  {
    address: '0xed314062faefa15595460dfa7643fc136149468e',
    balance: 100,
  },
  {
    address: '0x57550dbd3c4d67ea6dca9ebc7fa4bdd76abeb78d',
    balance: 50,
  },
  {
    address: '0x3924c3d4e041724f32ab2eb0e63b28a198e603a3',
    balance: 25,
  },
];
const INITIAL_BALANCE = 100;

const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;

app.get('/recipients', (req, res) => {
  res.json({ recipientsData: recipients });
});

app.get('/owner', (req, res) => {
  if (!Object.keys(owner).length) {
    res.json({ ownerData: null });
    return;
  }

  res.json({ ownerData: owner });
});

app.get('/create/:address', (req, res) => {
  const { address } = req.params;

  // verify that the address is a valid format
  const isValidAddress = ethAddressRegex.test(address);

  if (isValidAddress) {
    owner.address = address;
    owner.balance = INITIAL_BALANCE;

    res.json({ accountCreated: true, balance: INITIAL_BALANCE });
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

  const balance = recipients.find(
    (recipient) => recipient.address === address
  ).balance;

  if (balance === undefined) {
    res.status(400).json({
      error: `No balance associated to address ${address}`,
    });
    return;
  }

  res.json({ balance });
});

app.post('/send', (req, res) => {
  // recover the wallet address and that will be the sender
  const { recipient, amount } = req.body;

  if (owner.balance < amount) {
    res.status(400).json({ message: 'Not enough funds!' });
  } else {
    const recipientInfo = recipients.find((rec) => rec.address === recipient);
    owner.balance -= amount;
    recipientInfo.balance += amount;
    res.json({ balance: owner.balance });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
