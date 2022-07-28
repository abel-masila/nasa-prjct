import { Application, send } from 'https://deno.land/x/oak@v10.6.0/mod.ts';
import api from './api.ts';

const app = new Application();

const PORT = 8000;

//logger middleware
app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get('X-Response-Time');

  console.log(`${ctx.request.method} ${ctx.request.url}- ${time}`);
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
  await app.listen({ port: PORT });
}
