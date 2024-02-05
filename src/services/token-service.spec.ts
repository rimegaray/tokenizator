import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisRepository } from '../repository/redis-repository';
import { TokenService } from './token-service';

export const buildConfigServiceMock = () => {
  const config = jest.mocked<ConfigService>(ConfigService as any, {
    shallow: true,
  });
  config.get = jest.fn();
  return config;
};

describe('TokenService', () => {
  let service: TokenService;
  const redisRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
  };

  const configServiceMock = buildConfigServiceMock();

  beforeEach(async () => {
    configServiceMock.get.mockReturnValue('expectedSecretKey');
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenService],
      providers: [
        {
          provide: RedisRepository,
          useValue: redisRepositoryMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken - Happy path', () => {
    it('should return successful when repository return successful', async () => {
      redisRepositoryMock.save.mockResolvedValue(undefined);

      const result = await service.generateToken({
        email: 'test@example.com',
        cardNumber: '4148202114488312',
        cvv: '123',
        expirationYear: '2028',
        expirationMonth: '12',
      });

      expect(result).toBeDefined();
    });
  });

  describe('generateToken - Unhappy path', () => {
    it('should return Error when repository return Error', () => {
      redisRepositoryMock.save.mockRejectedValue(new Error());

      expect(
        service.generateToken({
          email: 'test@example.com',
          cardNumber: '4148202114488312',
          cvv: '123',
          expirationYear: '2028',
          expirationMonth: '12',
        }),
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
