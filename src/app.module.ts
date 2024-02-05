import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { RedisClientOptions } from 'redis';
import { TokenizationController } from './controllers/tokenization.controller';
import { RedisRepository } from './repository/redis-repository';
import { CardService } from './services/card-service';
import { TokenService } from './services/token-service';
import configuration from './settings/settings-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
        tls: configService.get('redis.tls'),
        ttl: configService.get('redis.ttl'),
      }),
    }),
  ],
  controllers: [TokenizationController],
  providers: [TokenService, CardService, RedisRepository],
})
export class AppModule {}
