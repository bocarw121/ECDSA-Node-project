import server from './server';

function Wallet({ address, balance }) {
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <h4>Your wallet address is: {address}</h4>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
