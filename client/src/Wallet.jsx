import { useEffect, useState } from 'react';
import server from './server';

function Wallet({ owner }) {
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <h4>Your wallet address is: {owner?.address}</h4>

      <div className="balance">Balance: {owner?.balance}</div>
    </div>
  );
}

export default Wallet;
