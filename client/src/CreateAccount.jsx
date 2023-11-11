import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';

import server from './server';

function CreateAccount({ setIsAccountCreated, setAddress, setBalance }) {
  async function handleClick(e) {
    e.preventDefault();
    // generate a private key and get the publicKey
    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey);
    // Start the conversion to an address
    // Now we need to remove the formate indicator byte ie the first byte
    const publicKeyWithoutFirstByte = publicKey.slice(1);
    const keccakHash = keccak256(publicKeyWithoutFirstByte);
    // remove first 20 elements from hash
    const addressHash = keccakHash.slice(-20);

    // Convert addressHash bytes to padded hexadecimal string
    const ethAddressStr = Array.from(addressHash)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    const address = `0x${ethAddressStr}`;

    const {
      data: { accountCreated, balance, error },
    } = await server.get(`create/${address}`);

    if (accountCreated) {
      localStorage.setItem('address', address);
      localStorage.setItem('isAccountCreated', accountCreated);
      setAddress(address);
      setIsAccountCreated(accountCreated);
      setBalance(balance);
    } else {
      alert(error);
    }
  }

  return (
    <div className="create-account">
      <h1 className="center">Welcome to your personal crypto wallet!</h1>
      <h3 className="center">
        Click the create account button to generate a wallet id.
      </h3>
      <button className="create-account-button" onClick={handleClick}>
        Create an account
      </button>
      ;
    </div>
  );
}

export default CreateAccount;
