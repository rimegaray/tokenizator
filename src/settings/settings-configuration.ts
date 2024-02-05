import * as process from 'process';

export type RedisConfiguration = {
  host: string;
  port: number;
  password: string;
  tls: boolean;
  ttl: number;
};

export type GlobalSettings = {
  appName: string;
  redis: RedisConfiguration;
};

export default (): GlobalSettings => ({
  appName: process.env.APP_NAME || 'ms-token-culqi',
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PWD,
    tls: process.env.REDIS_USE_TLS === 'true',
    ttl: Number(process.env.REDIS_TTL),
  },
});
