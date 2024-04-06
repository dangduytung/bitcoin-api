import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as BIP39 from 'bip39';
import * as BTC from 'bitcoinjs-lib';
import * as crypto from 'crypto';
import { ECPairFactory } from 'ecpair';
import { lastValueFrom } from 'rxjs';
import { SeedType } from '../enums/seed-type.enum';
import * as TINYSECP from 'tiny-secp256k1';

@Injectable()
export class BitcoinService {
  ECPair: any;
  MAIN_NET: boolean;
  NETWORK: any;

  constructor(private readonly httpService: HttpService) {
    this.ECPair = ECPairFactory(TINYSECP);
    this.MAIN_NET = true;
    this.NETWORK = this.MAIN_NET ? BTC.networks.bitcoin : BTC.networks.testnet;
  }

  async getBtcFromPrivateKey(privateKey: string): Promise<any> {
    const mnemonic = BIP39.entropyToMnemonic(privateKey);
    const buffer = Buffer.from(privateKey, 'hex');

    /* Compressed */
    const keyPairC = this.ECPair.fromPrivateKey(buffer, {
      network: this.NETWORK,
    });
    const wifC = keyPairC.toWIF();
    const publicKeyC = keyPairC.publicKey.toString('hex');
    const addressC = BTC.payments.p2pkh({
      pubkey: keyPairC.publicKey,
      network: this.NETWORK,
    }).address;

    /* Uncompressed */
    const keyPairU = this.ECPair.fromPrivateKey(buffer, {
      compressed: false,
      network: this.NETWORK,
    });
    const wifU = keyPairU.toWIF();
    const publicKeyU = keyPairU.publicKey.toString('hex');
    const addressU = BTC.payments.p2pkh({
      pubkey: keyPairU.publicKey,
      network: this.NETWORK,
    }).address;

    const btc = {
      mnemonic,
      privateKey,
      wifC,
      publicKeyC,
      addressC,
      wifU,
      publicKeyU,
      addressU,
    };
    console.log('btc', btc);
    return btc;
  }

  async getBtcBalance(address: string): Promise<number> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`https://blockchain.info/rawaddr/${address}`),
      );
      const data = response.data;
      console.log('data', data, 'final_balance', data.final_balance);
      return data.final_balance / 100000000; // Convert satoshis to BTC
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  getAddress(node: any) {
    return BTC.payments.p2wpkh({
      pubkey: node.publicKey,
      network: this.NETWORK,
    }).address;
  }

  async generateRandomWallet(): Promise<any> {
    const hash = crypto.randomBytes(32);
    return this.getBtcFromPrivateKey(hash.toString('hex'));
  }

  async generateBtcFromSeed(seed: string, seedType: SeedType): Promise<any> {
    let privateKey;
    switch (seedType) {
      case SeedType.PrivateKey:
        privateKey = seed;
        break;
      case SeedType.Mnemonic:
        privateKey = BIP39.mnemonicToEntropy(seed);
        break;
      case SeedType.Passphrase:
        privateKey = BTC.crypto.sha256(Buffer.from(seed)).toString('hex');
        break;
      default:
        throw new Error('Invalid seed type');
    }
    return await this.getBtcFromPrivateKey(privateKey);
  }

  async generateBtcFromPassphrase(passphrase: string): Promise<any> {
    const hash = BTC.crypto.sha256(Buffer.from(passphrase));
    const privateKey = hash.toString('hex');
    console.log('privateKey', privateKey);

    const btcObject = await this.getBtcFromPrivateKey(privateKey);
    return btcObject;
  }

  async generateBtcFromMnemonic(mnemonic: string): Promise<any> {
    const privateKey: string = BIP39.mnemonicToEntropy(mnemonic);
    const btcObject = await this.getBtcFromPrivateKey(privateKey);
    return btcObject;
  }

  generateRandomMnemonic(): string {
    // Generate 24 random bytes
    // const mnemonic = BIP39.generateMnemonic(256);
    // console.log('mnemonic=', mnemonic);
    // return mnemonic;

    const wordList: string[] = BIP39.wordlists.english; // Use the English word list
    const mnemonics: string[] = [];

    for (let i = 0; i < 24; i++) {
      const randomIndex: number = Math.floor(Math.random() * wordList.length);
      mnemonics.push(wordList[randomIndex]);
    }

    const mnemonic = mnemonics.join(' ');
    console.log('mnemonic=', mnemonic);
    return mnemonic;
  }
}
