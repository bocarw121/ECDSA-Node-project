import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';
import { useEffect, useState } from 'react';
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
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if (isAccountCreated) {
      async function getOwnerInfo() {
        const {
          data: { ownerData },
        } = await server.get('owner');

        setOwner(ownerData);

        // if there is no owner so server then server was restarted
        // so we make the user create a new address
        if (!ownerData) {
          localStorage.removeItem('address');
          localStorage.removeItem('isAccountCreated');
          setIsAccountCreated(null);
        }
      }
      getOwnerInfo();
      setBalance(owner?.balance);
    }
  }, [isAccountCreated, balance]);

  return (
    <>
      {!isAccountCreated && (
        <CreateAccount
          setIsAccountCreated={setIsAccountCreated}
          setAddress={setAddress}
          setBalance={setBalance}
        />
      )}
      {isAccountCreated && address && (
        <div className="app">
          <Wallet owner={owner} />
          <Transfer
            setBalance={setBalance}
            address={address}
            balance={balance}
          />
        </div>
      )}
    </>
  );
}

export default App;
