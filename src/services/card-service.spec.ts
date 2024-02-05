import { Test, TestingModule } from '@nestjs/testing';
import { RedisRepository } from '../repository/redis-repository';
import { CardService } from './card-service';
import { TokenService } from './token-service';
import { Code, ValidationException } from '../errors/validation-exception';

const redisRepositoryMock = {
  save: jest.fn(),
  find: jest.fn(),
};

const tokenServiceMock = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardService],
      providers: [
        {
          provide: RedisRepository,
          useValue: redisRepositoryMock,
        },
        {
          provide: TokenService,
          useValue: tokenServiceMock,
        },
      ],
    }).compile();

    service = module.get(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCardByToken - Happy path', () => {
    it('should be return Partial Token Data when jwt is valid and not expired', async () => {
      tokenServiceMock.verifyToken.mockResolvedValue(undefined);

      redisRepositoryMock.find.mockResolvedValue({
        email: 'test@example.com',
        cardNumber: '4148202114488312',
        cvv: '123',
        expirationYear: '2028',
        expirationMonth: '12',
      });

      const result = await service.getCardByToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDcwOTIyODMsImlhdCI6MTcwNzA5MjIyM30.d8mgjY4NzZdPmCWKF4N66_XgMfeW6W69rtWWE5hpXJ4',
      );
      expect(result.cardNumber).toEqual('4148202114488312');
      expect(result.expirationYear).toEqual('2028');
      expect(result.expirationMonth).toEqual('12');
      expect(result.email).toEqual(undefined);
      expect(result.cvv).toEqual(undefined);
    });
  });

  describe('getCardByToken - Unhappy path', () => {
    it('should be return Error when repository return void because jwt is expired', () => {
      tokenServiceMock.verifyToken.mockResolvedValue(undefined);

      redisRepositoryMock.find.mockResolvedValue(undefined);

      expect(
        service.getCardByToken(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDcwOTIyODMsImlhdCI6MTcwNzA5MjIyM30.d8mgjY4NzZdPmCWKF4N66_XgMfeW6W69rtWWE5hpXJ4',
        ),
      ).rejects.toBeInstanceOf(Error);
    });

    it('should be return Error when tokenService return Error because jwt is invalid', () => {
      tokenServiceMock.verifyToken.mockRejectedValue(
        new ValidationException(Code.INVALID_TOKEN),
      );

      expect(service.getCardByToken('invalid-jwt')).rejects.toBeInstanceOf(
        ValidationException,
      );
    });
  });
});
