import { firebaseAuth } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const loginAction = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string(),
    remember_me: z.boolean().default(false)
  }),
  handler: async ({ email, password, remember_me }, { cookies }) => {
    if (remember_me) {
      cookies.set('email', email, {
        httpOnly: true,
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 año
      });
    } else {
      cookies.delete('email', { path: '/' });
    }

    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);

      return {
        statusCode: 200,
        message: 'Login successful'
      };
    } catch (error) {
      console.log('Error logging in', error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            return {
              statusCode: 404,
              message: 'Invalid credential'
            };
          case 'auth/user-not-found':
            return {
              statusCode: 404,
              message: 'User not found'
            };
          case 'auth/wrong-password':
            return {
              statusCode: 401,
              message: 'Invalid password'
            };
          default:
            return {
              statusCode: 500,
              message: 'Error logging in'
            };
        }
      }

      return {
        statusCode: 500,
        message: 'Error logging in'
      };
    }
  }
});
