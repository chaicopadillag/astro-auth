import { firebaseAuth } from '@/firebase/config';
import { defineMiddleware } from 'astro:middleware';

const protectedPaths = ['/dashboard', '/settings'];

const authPaths = ['/auth/login', '/auth/register'];

export const onRequest = defineMiddleware(({ request, url, redirect }, next) => {
  console.log({ pathname: url.pathname });

  if (authPaths.includes(url.pathname)) {
    const authUser = firebaseAuth.currentUser;

    if (authUser) {
      return redirect('/dashboard');
    }
  }

  return next();
});
