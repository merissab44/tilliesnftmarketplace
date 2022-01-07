// imports
import './App.css';
import Collection from './Collection.js';
import * as fcl from '@onflow/fcl';
import { useState, useEffect } from 'react';
import { setupUserTx } from './cadence/transactions/setup_user.js';

fcl
  .config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');

function LoginSetup() {
  const [user, setUser] = useState();
  const [address, setAddress] = useState();
  const [officialAddress, setOfficialAddress] = useState('');

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser);
  }, []);

  const logIn = () => {
    // log in through Blocto
    fcl.authenticate();
  };

  // This sets up a user. This is creating their account address where they will create and store
  //their blockchain items
  const setupUser = async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(setupUserTx),
        fcl.args([]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  };

  console.log(<Collection address={officialAddress}></Collection>);
  return (
    <div className='login'>
      <h1>Account address: {user && user.addr ? user.addr : ''}</h1>
      <button onClick={() => logIn()}>Log In</button>
      <button onClick={() => fcl.unauthenticate()}>Log Out</button>
      <button onClick={() => setupUser()}>Setup User</button>

      <div>
        <input type='text' onChange={(e) => setAddress(e.target.value)} />
        <button onClick={() => setOfficialAddress(address)}>Search</button>
      </div>
    </div>
  );
}

export default LoginSetup;