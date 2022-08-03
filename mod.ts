import { Application, send } from 'https://deno.land/x/oak@v10.6.0/mod.ts';
import * as log from 'https://deno.land/std@0.149.0/log/mod.ts';
import api from './api.ts';

const app = new Application();

const PORT = 8000;

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('INFO'),
  },

  loggers: {
    // configure default logger available via short-hand methods above.
    default: {
      level: 'INFO',
      handlers: ['console'],
    },
  },
});

//error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    log.error(err);
    ctx.response.body = 'Internal server error';
    throw err;
  }
});

app.addEventListener('error', (event) => {
  log.error(event.error);
});

//logger middleware
app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get('X-Response-Time');

  log.info(`${ctx.request.method} ${ctx.request.url}- ${time}`);
});
//Timing middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${delta} ms`);
});
//routes middleware
app.use(api.routes());
app.use(api.allowedMethods());

//static file middleware
app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    '/index.html',
    '/javascripts/script.js',
    '/stylesheets/style.css',
    '/images/favicon.png',
  ];
  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/public`,
    });
  }
});

if (import.meta.main) {
  log.info(`Starting server on port ${PORT}...`);
  await app.listen({ port: PORT });
}
