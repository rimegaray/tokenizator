import { Injectable } from '@nestjs/common';
import { RedisRepository } from '../repository/redis-repository';
import { TokenData } from './dto/token-data';
import { TokenService } from './token-service';

@Injectable()
export class CardService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly tokenService: TokenService,
  ) {}

  public async getCardByToken(token: string): Promise<TokenData> {
    await this.tokenService.verifyToken(token);

    const { cardNumber, expirationYear, expirationMonth } =
      await this.redisRepository.find(token);

    return {
      cardNumber,
      expirationYear,
      expirationMonth,
    };
  }
}
