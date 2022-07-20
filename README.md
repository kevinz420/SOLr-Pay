# SOLr Pay
<img src="https://cdn.discordapp.com/attachments/947631586818527252/995794901415505960/solrpay.png" width="600">

> "Connecting payments across the Solr System."

SOLr Pay is a decentralized P2P payment protocol on the [Solana](https://solana.com/) blockchain that aims to improve the user experience of crypto payments. Anyone can create a customized Solr profile, quickly access other Solana wallets in their friend network, and send casual payments with a note, all on-chain.

## Local Development
Codebase is a monorepo with the frontend interface in the **app** folder and smart contracts in the **programs/solrpay** folder. To run it locally, run the following commands:
```
// clone the repository
git clone https://github.com/kevinz420/SOLr-Pay.git

// go into the app's directory
cd SOLr-Pay/app

// install dependencies
npm install

// run locally
npm run start
```

## Project Overview
### Motivation
Current wallet intefaces put little effort into replicating the ease and convenience of the widely popular Web2 mobile payment applications (PayPal, Venmo, Zelle, etc). Even amongst "Web3 believers", it is very rare for someone to offer a payment in crypto. While [Bonfida](https://naming.bonfida.org/) may turn those longwinded 32-byte wallet addresses into something more human-readable, sending tokens simply doesn't have the same level of personal connection as using Venmo. Solr Pay attempts to not only encourage P2P crypto payments, but also an overall acceptance of crypto as a valid medium of exchange. Solr profiles can also be seen as a form of decentralized identity and can be further developed to better represent one's crypto persona, all on-chain.
### Primary Features
- Solr Pay Profile
  - Customize with a unique username and profile picture that can be used to identify a user for payments
  - Easily edit both these properties anytime
- On-Chain Friending
  - Add and remove friends for quick access to frequent payees
  - See both you and your friends' transaction activity and usage of the protocol
- Transaction Notes
 - Leave whoever you are paying a note, stored on the blockchain for all to view
 ### Design
 ![](https://cdn.discordapp.com/attachments/947631586818527252/995916132764635136/Untitled-2022-07-10-2124.png)
