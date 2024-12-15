import { firebaseAuth } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

export const registerAction = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    remember_me: z.boolean().default(false)
  }),
  handler: async ({ name, email, password, remember_me }, { cookies }) => {
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
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      await updateProfile(firebaseAuth.currentUser!, {
        displayName: name
      });

      await sendEmailVerification(firebaseAuth.currentUser!, {
        url: `${import.meta.env.APP_HOST}/dashboard?verify_email=true`
      });

      return {
        statusCode: 201
      };
    } catch (error) {
      console.log(error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            return {
              statusCode: 400,
              message: 'El correo electrónico ya está en uso.'
            };
          case 'auth/weak-password':
            return {
              statusCode: 400,
              message: 'La contraseña es muy débil.'
            };
          default:
            return {
              statusCode: 400,
              message: error.message
            };
        }
      }

      return {
        statusCode: 500,
        message: 'Ocurrió un error inesperado.'
      };
    }
  }
});
