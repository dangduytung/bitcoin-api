import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitcoinModule } from './bitcoin/bitcoin.module';

@Module({
  imports: [ConfigModule.forRoot(), BitcoinModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
