import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinService } from './bitcoin.service';
import { HttpModule } from '@nestjs/axios';

describe('BitcoinService', () => {
  let service: BitcoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BitcoinService],
    }).compile();

    service = module.get<BitcoinService>(BitcoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
