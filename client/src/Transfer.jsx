import { useEffect, useState } from 'react';
import server from './server';

function Transfer({ address, setBalance, balance }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    async function getRecipientsAddress() {
      const {
        data: { recipientsData },
      } = await server.get(`recipients`);

      setRecipient(recipientsData[0].address);

      setRecipients(recipientsData);
      console.log(recipientsData);
    }

    getRecipientsAddress();
  }, [balance]);

  function handleSelect(e) {
    const recipients = e.target.value;
    console.log({ recipients });

    if (recipients) {
      setRecipient(recipients);
    }
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
      setSendAmount('');
    } catch (ex) {
      console.log(ex);
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipients addresses
        <select value={recipient} onChange={handleSelect}>
          {recipients.map(({ address, balance }) => {
            return (
              <option key={address} value={address}>
                {address} - balance {balance}
              </option>
            );
          })}
        </select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
