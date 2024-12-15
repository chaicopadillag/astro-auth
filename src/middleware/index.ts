import { defineMiddleware } from 'astro:middleware';

const protectedPaths = ['/dashboard', '/settings'];

export const onRequest = defineMiddleware(({ request, url }, next) => {
  return next();
});
