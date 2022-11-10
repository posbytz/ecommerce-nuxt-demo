import { createClient, createCluster } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);
const redisConnection =
  process.env.REDIS_CONNECTION_TYPE === 'cluster'
    ? createCluster({
        rootNodes: [
          {
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          },
        ],
      })
    : createClient({
        legacyMode: true,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
        database: process.env.REDIS_DB,
      });

redisConnection.connect().catch(console.error);

export default fromNodeMiddleware((req, res, next) => {
  if (!req.url.startsWith('/__nuxt_error')) {
    return session({
      store: new RedisStore({ client: redisConnection }),
      secret: process.env.SESSION_SECRET,
      proxy: process.env.NODE_ENV !== 'development',
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV !== 'development',
      },
    })(req, res, next);
  }

  next();
});
