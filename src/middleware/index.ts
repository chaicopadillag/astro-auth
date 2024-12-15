import { firebaseAuth } from '@/firebase/config';
import { defineMiddleware } from 'astro:middleware';

const protectedPaths = ['/dashboard', '/settings'];

const authPaths = ['/auth/login', '/auth/register'];

export const onRequest = defineMiddleware(async ({ request, url, redirect, locals }, next) => {
  console.log({ pathname: url.pathname });

  const isLogged = !!firebaseAuth.currentUser;
  const authUser = await firebaseAuth.currentUser?.reload().then(() => firebaseAuth.currentUser);

  locals.isLogged = isLogged;
  if (authUser) {
    locals.authUser = {
      name: authUser.displayName || '',
      avatar: authUser.photoURL || '',
      email: authUser.email || '',
      id: authUser.uid,
      emailVerified: authUser.emailVerified,
      provider: authUser.providerId
    };
  }

  if (isLogged && authPaths.includes(url.pathname)) {
    return redirect('/dashboard');
  }

  if (!isLogged && protectedPaths.includes(url.pathname)) {
    return redirect('/auth/login');
  }

  return next();
});
