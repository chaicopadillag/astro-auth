import { firebaseAuth } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const googleSignInAction = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials) => {
    try {
      const crendential = GoogleAuthProvider.credentialFromResult(credentials);

      if (!crendential) {
        return {
          statusCode: 400,
          message: 'Invalid credentials'
        };
      }

      await signInWithCredential(firebaseAuth, crendential);

      return {
        statusCode: 200,
        message: 'Login successful'
      };
    } catch (error) {
      console.log('Error logging in with Google', error);

      return {
        statusCode: 500,
        message: 'Error logging in with Google'
      };
    }
  }
});
