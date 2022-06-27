import getProvider from './get-provider'
import { Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../interfaces/idl.json'
import { WalletContextState } from '@solana/wallet-adapter-react';

const programID = new PublicKey(idl.metadata.address);

export default async function getProgram( wallet: WalletContextState, connection: Connection) {
    const provider = await getProvider(wallet, connection);
    
    return new Program(idl as Idl, programID, provider);
  }