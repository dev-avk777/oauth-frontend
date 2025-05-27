import { Wallet } from 'ethers';

const randomWallet = Wallet.createRandom();
console.log('privateKey:', randomWallet.privateKey);
console.log('address   :', randomWallet.address);
