import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Code, ValidationException } from '../errors/validation-exception';

@Injectable()
export class RedisRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
  ) {}

  async save(key: string, data: any): Promise<void> {
    await this.cacheManager.set(key, data);
  }

  async find(key: string): Promise<any> {
    const tokenData = this.cacheManager.get(key);

    if (!tokenData) {
      throw new ValidationException(Code.EXPIRED_TOKEN);
    }
    return tokenData;
  }
}
