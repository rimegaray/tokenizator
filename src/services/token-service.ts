import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Code, ValidationException } from '../errors/validation-exception';
import { RedisRepository } from '../repository/redis-repository';
import { TokenData } from './dto/token-data';

@Injectable()
export class TokenService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly configService: ConfigService,
  ) {}

  private secretKey = this.configService.get('SECRET_KEY');

  public async generateToken(tokenData: TokenData): Promise<string> {
    const expirationTime = Math.floor(Date.now() / 1000) + 60;
    const token = jwt.sign({ exp: expirationTime }, this.secretKey);

    const payload = {
      ...tokenData,
      token,
    };
    await this.redisRepository.save(token, payload);

    return token;
  }

  public verifyToken(token: string): Promise<void> {
    try {
      jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new ValidationException(Code.INVALID_TOKEN);
    }
    return;
  }
}
