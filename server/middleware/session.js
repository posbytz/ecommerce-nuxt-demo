import { createClient, createCluster } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const config = useRuntimeConfig();

const RedisStore = connectRedis(session);
const redisConnection =
  config.redisConnectionType === 'cluster'
    ? createCluster({
        rootNodes: [
          {
            url: `redis://${config.redisHost}:${config.redisPort}`,
          },
        ],
      })
    : createClient({
        legacyMode: true,
        socket: {
          host: config.redisHost,
          port: config.redisPort,
        },
        database: config.redisDb,
      });

redisConnection.connect().catch(console.error);

export default fromNodeMiddleware((req, res, next) => {
  if (!req.url.startsWith('/__nuxt_error')) {
    return session({
      store: new RedisStore({ client: redisConnection }),
      secret: config.sessionSecret,
      proxy: config.nodeEnv !== 'development',
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: config.nodeEnv !== 'development' ? 'none' : false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: config.nodeEnv !== 'development',
      },
    })(req, res, next);
  }

  next();
});
