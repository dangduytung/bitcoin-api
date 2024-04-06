import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinController } from './bitcoin.controller';
import { BitcoinService } from './bitcoin.service';

describe('BitcoinController', () => {
  let controller: BitcoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BitcoinService],
      controllers: [BitcoinController],
    }).compile();

    controller = module.get<BitcoinController>(BitcoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
