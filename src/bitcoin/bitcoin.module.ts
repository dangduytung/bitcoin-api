import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BitcoinController } from './bitcoin.controller';
import { BitcoinService } from './bitcoin.service';

@Module({
  imports: [HttpModule],
  providers: [BitcoinService],
  controllers: [BitcoinController],
})
export class BitcoinModule {}
