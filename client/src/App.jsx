import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';
import { useState } from 'react';
import CreateAccount from './CreateAccount';
import server from './server';

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState(() => {
    const storedAddress = localStorage.getItem('address') || '';
    return storedAddress;
  });
  const [isAccountCreated, setIsAccountCreated] = useState(() => {
    const storedAccountStatus =
      JSON.parse(localStorage.getItem('isAccountCreated')) || false;
    return storedAccountStatus;
  });

  async function handleBalanceChange() {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <>
      {!isAccountCreated && (
        <CreateAccount
          setIsAccountCreated={setIsAccountCreated}
          setAddress={setAddress}
        />
      )}
      {isAccountCreated && address && (
        <div className="app">
          <Wallet balance={balance} setBalance={setBalance} address={address} />
          <Transfer setBalance={setBalance} address={address} />
        </div>
      )}
    </>
  );
}

export default App;
