import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SeedType } from '../enums/seed-type.enum';
import { BitcoinService } from './bitcoin.service';

@Controller('bitcoin')
export class BitcoinController {
  constructor(private readonly bitcoinService: BitcoinService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string): Promise<number> {
    return await this.bitcoinService.getBtcBalance(address);
  }

  @Post('generate-wallet')
  async generateWallet() {
    return await this.bitcoinService.generateRandomWallet();
  }

  @Post('generate-from-seed')
  async generateFromSeed(@Body() body: { seed: string; type: SeedType }) {
    const { seed, type } = body;
    return await this.bitcoinService.generateBtcFromSeed(seed, type);
  }

  @Post('generate-random-mnemonic')
  async generateRandomMnemonic() {
    return this.bitcoinService.generateRandomMnemonic();
  }
}
