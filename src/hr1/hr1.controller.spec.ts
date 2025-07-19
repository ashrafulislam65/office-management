import { Test, TestingModule } from '@nestjs/testing';
import { Hr1Controller } from './hr1.controller';

describe('Hr1Controller', () => {
  let controller: Hr1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Hr1Controller],
    }).compile();

    controller = module.get<Hr1Controller>(Hr1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
