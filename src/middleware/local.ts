import type { MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';

const protectedPaths = ['/dashboard', '/settings'];

export const onRequest = defineMiddleware(({ request, url }, next) => {
  if (protectedPaths.includes(url.pathname)) {
    const authorization = request.headers.get('authorization') ?? '';

    return checkAuth(authorization, next);
  }

  return next();
});

const checkAuth = (authorization: string, next: MiddlewareNext) => {
  if (authorization) {
    const token = authorization.split(' ').at(-1) || 'user:password';
    const decoded = atob(token).split(':');
    console.log({ decoded });
    const [username, password] = decoded;

    if (username === 'admin' && password === 'admin') {
      return next();
    }
  }

  return new Response('Unauthorized', { status: 401, statusText: 'Unauthorized', headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' } });
};
